import { RawDataSeries } from "@/core/domain/RawDataSeries";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { DataSynchronizationBaseJob } from "./DataSynchronizationJob";
import { PopulationLineReader } from "../lineReaders/PopulationLineReader";
import { DataRepository } from "@/core/repositories/DataRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import * as path from "path";

export class PopulationDataJob extends DataSynchronizationBaseJob {
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
        "../../../../data/Z_Banque_mond_Population_v1.csv"
      ),
      separator: ";",
      skipRows: 2,
      lineReaderProvider: () => new PopulationLineReader(),
    });

    const dataset = await this.dateRepo.createDataset({
      name: "Z_Banque_mond_Population_v1.4_v4",
      creationDate: new Date(),
    });

    for await (const data of dataReader.toIterable(Infinity)) {
      await this.addData(dataset, data);
    }

    await adapter.close();
  }
}
