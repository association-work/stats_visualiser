import { DataReader } from "./DataReader";

export interface DataAdapter<T, TOptions> {
  open(options: TOptions): Promise<DataReader<T>>;
  close(): Promise<void>;
}
