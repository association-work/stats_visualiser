import { RawData } from "@/core/domain/RawData";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { DataSynchronizationBaseJob } from "./DataSynchronizationJob";
import * as path from "path";
import { GesLineReader } from "../lineReaders/GesLineReader";

export class GesDataJob extends DataSynchronizationBaseJob {
  async run() {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      skipRows: 2,
      lineReaderProvider: () => new GesLineReader(),
    });

    for await (const data of dataReader.toIterable(Infinity)) {
      await this.addData(data);
    }

    await adapter.close();
  }
}
