import { RawData } from "@/core/domain/RawData";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { DataSynchronizationBaseJob } from "./DataSynchronizationJob";
import * as path from "path";
import { GesLineReader } from "../lineReaders/GesLineReader";
import { PopulationLineReader } from "../lineReaders/PopulationLineReader";

export class PopulationDataJob extends DataSynchronizationBaseJob {
  async run() {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_Banque_mond_Population_v1.csv"
      ),
      separator: ";",
      skipRows: 2,
      lineReaderProvider: () => new PopulationLineReader(),
    });

    for await (const data of dataReader.toIterable(Infinity)) {
      await this.addData(data);
    }

    await adapter.close();
  }
}
