import { RawDataSeries } from "@/core/domain/RawDataSeries";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { DataSynchronizationBaseJob } from "./DataSynchronizationJob";
import { GesLineReader } from "../lineReaders/GesLineReader";
import * as path from "path";
import { DataRepository } from "@/core/repositories/DataRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";

export class GesDataJob extends DataSynchronizationBaseJob {
  constructor(
    private readonly dateRepo: DataRepository,
    topicRepo: TopicRepository,
    locationRepo: LocationRepository
  ) {
    super(topicRepo, locationRepo, dateRepo);
  }

  async run() {
    const adapter = new CsvDataAdapter<RawDataSeries>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      skipRows: 2,
      lineReaderProvider: () => new GesLineReader(),
    });

    const dataset = await this.dateRepo.createDataset({
      name: "Z_CITEPA_emissions_GES_structure_1.4_v4",
      creationDate: new Date(),
    });

    for await (const data of dataReader.toIterable(Infinity)) {
      await this.addData(dataset, data);
    }

    await adapter.close();
  }
}
