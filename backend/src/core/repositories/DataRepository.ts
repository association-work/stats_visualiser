import { injectable } from "inversify";
import { Year } from "../domain/Year";

@injectable()
export abstract class DataRepository {
  abstract findAllYears(): Promise<Year[]>;
  abstract createMany(years: number[]): Promise<void>;
}
