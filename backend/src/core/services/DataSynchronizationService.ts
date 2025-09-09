import * as path from "path";
import { CsvDataAdapter, CsvDataAdapterOptions } from "./CsvDataAdapter";
import { TopicService } from "./TopicService";
import { PopulationLineReader } from "./lineReaders/PopulationLineReader";

export class DataSynchronizationService {
  configs: CsvDataAdapterOptions[];
  constructor(private readonly topicService: TopicService) {
    this.configs = [
      // {
      //   filePath: path.resolve(
      //     __dirname,
      //     "../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      //   ),
      //   separator: ";",
      //   skipRows: 2,
      //   lineReaderProvider: () => new GesLineReader(),
      // },
      {
        filePath: path.resolve(
          __dirname,
          "../../../data/Z_Banque_mond_Population_v1.csv"
        ),
        separator: ";",
        skipRows: 2,
        lineReaderProvider: () => new PopulationLineReader(),
      },
    ];
  }
  async start() {
    const adapter = new CsvDataAdapter();
    for (const option of this.configs) {
      const dataReader = await adapter.open(option);

      for await (const data of dataReader.toIterable(Infinity)) {
        await this.topicService.addData(data);
      }

      await adapter.close();
    }
  }
}
