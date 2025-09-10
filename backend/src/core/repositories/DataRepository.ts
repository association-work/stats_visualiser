import { injectable } from "inversify";
import { Year } from "../domain/Year";
import { DataSeries } from "../domain/DataSeries";
import { Dataset } from "../domain/Dataset";

@injectable()
export abstract class DataRepository {
  abstract findAllYears(): Promise<Year[]>;
  abstract createMany(years: number[]): Promise<void>;
  abstract insertSeries(series: Omit<DataSeries, "id">): Promise<DataSeries>;
  abstract createDataset(dataset: Omit<Dataset, "id">): Promise<Dataset>;
}
