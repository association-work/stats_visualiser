import * as fs from "fs/promises";
import { DataReader } from "./DataReader";
import { DataAdapter } from "./DataAdapter";
import { RawData } from "../domain/RawData";
import { CsvLineReader } from "./CsvLineReader";

export interface CsvDataAdapterOptions {
  filePath: string;
  separator: string;
  lineReaderProvider: () => CsvLineReader;
  keepFirstRow?: boolean;
  skipRows?: number;
}

export class CsvDataAdapter implements DataAdapter<CsvDataAdapterOptions> {
  private file?: fs.FileHandle;

  async open(options: CsvDataAdapterOptions): Promise<DataReader> {
    this.file = await fs.open(options.filePath);

    return new CsvDataReader(
      this.file,
      options.lineReaderProvider(),
      options.separator,
      options.keepFirstRow,
      options.skipRows ?? 1
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

  constructor(
    file: fs.FileHandle,
    private lineReader: CsvLineReader,
    private separator: string,
    private keepFirstRow: boolean = false,
    private rowsToSkip = 1
  ) {
    super((cursor, count) => this.next(cursor, count));

    // replace with something better
    this.lines = file.readLines({
      autoClose: false,
    });
  }

  async next(_: number, count: number = Infinity): Promise<RawData[] | null> {
    if (count < 1) {
      throw new Error("");
    }

    let i = 0;
    let rowNumber = 0;
    const result: RawData[] = [];

    for await (const line of this.lines) {
      rowNumber++;

      if (!this.keepFirstRow && !this.firstRowSkipped) {
        if (rowNumber >= this.rowsToSkip) {
          this.firstRowSkipped = true;
        }

        continue;
      }

      const data = this.lineReader.readLine(line, this.separator!);
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
}
