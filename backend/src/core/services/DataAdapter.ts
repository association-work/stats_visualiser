import { DataReader } from "./DataReader";

export interface DataAdapter<TOptions> {
  open(options: TOptions): Promise<DataReader>;
  close(): Promise<void>;
}
