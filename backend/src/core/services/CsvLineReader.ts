import { RawData } from "../domain/RawData";

export interface CsvLineReader {
  readLine(line: string, separator: string): RawData | null;
}
