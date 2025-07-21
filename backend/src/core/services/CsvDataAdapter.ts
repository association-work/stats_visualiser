import * as fs from "fs/promises";
import { DataReader } from "./DataReader";
import { DataAdapter } from "./DataAdapter";
import { RawData } from "../domain/RawData";

export interface CsvDataAdapterOptions {
  filePath: string;
  separator: string;
  keepFirstRow?: boolean;
}

export class CsvDataAdapter implements DataAdapter<CsvDataAdapterOptions> {
  private file?: fs.FileHandle;

  async open(options: CsvDataAdapterOptions): Promise<DataReader> {
    this.file = await fs.open(options.filePath);

    return new CsvDataReader(
      this.file,
      options.separator,
      options.keepFirstRow
    );
  }

  async close() {
    if (this.file) {
      this.file.close();

      this.file = undefined;
    }
  }
}

class CsvDataReader extends DataReader {
  lines: AsyncIterable<string>;
  firstRowSkipped = false;
  topics: Map<string, string> = new Map();
  constructor(
    file: fs.FileHandle,
    private separator: string,
    private keepFirstRow: boolean = false
  ) {
    super((count) => this.next(count));
    this.lines = file.readLines();
  }

  async next(count: number = Infinity): Promise<RawData[] | null> {
    if (count < 1) {
      throw new Error("");
    }

    let i = 0;
    const result: RawData[] = [];

    for await (const line of this.lines) {
      if (!this.keepFirstRow && !this.firstRowSkipped) {
        this.firstRowSkipped = true;
        continue;
      }

      const data = this.readLine(line, this.separator!);
      if (!data) {
        continue;
      }

      result.push(data);
      i++;

      if (i === count) {
        return result;
      }
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  }

  readLine(line: string, separator: string): RawData | null {
    if (!line || line === ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;") {
      return null;
    }

    const columns = line.split(separator);
    this.topics.set(columns[1], columns[0]);

    const externalId = columns[1];
    const lastDotIdx = externalId.lastIndexOf(".");
    let parentTopicName: undefined | string = undefined;

    if (lastDotIdx > -1) {
      const parentTopicId = externalId.substring(0, lastDotIdx);
      parentTopicName = this.topics.get(parentTopicId);
    }

    return {
      externalId,
      topicName: columns[0],
      parentTopicName,
      source: {
        name: columns[3],
        url: columns[4],
      },
      location: columns[5],
      valuesUnit: columns[7],
      values: columns
        .filter((_, i) => i > 8)
        .filter((v) => !!v || v.trim() === "-")
        .map((v, i) => [1990 + i, Number.parseFloat(v.replace(",", "."))]),
    };
  }
}
