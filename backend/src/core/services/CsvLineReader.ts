export interface CsvLineReader<T> {
  readLine(line: string, separator: string): T | null;
}
