import * as fs from "fs/promises";
import { DataReader } from "./DataReader";
import { DataAdapter } from "./DataAdapter";
import { RawData } from "../domain/RawData";
import { CsvLineReader } from "./CsvLineReader";

export interface CsvDataAdapterOptions<T> {
  filePath: string;
  separator: string;
  lineReaderProvider: () => CsvLineReader<T>;
  keepFirstRow?: boolean;
  skipRows?: number;
}

export class CsvDataAdapter<T>
  implements DataAdapter<T, CsvDataAdapterOptions<T>>
{
  private file?: fs.FileHandle;

  async open(options: CsvDataAdapterOptions<T>): Promise<DataReader<T>> {
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

class CsvDataReader<T> extends DataReader<T> {
  lines: AsyncIterable<string>;
  firstRowSkipped = false;

  constructor(
    file: fs.FileHandle,
    private lineReader: CsvLineReader<T>,
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

  async next(_: number, count: number = Infinity): Promise<T[] | null> {
    if (count < 1) {
      throw new Error("");
    }

    let i = 0;
    let rowNumber = 0;
    const result: T[] = [];

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
