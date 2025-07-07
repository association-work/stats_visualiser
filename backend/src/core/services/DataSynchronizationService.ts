import * as path from "path";
import { CsvDataAdapter } from "./CsvDataAdapter";
import { TopicRepository } from "../repositories/TopicRepository";

export class DataSynchronizationService {
  constructor(private readonly topicRepo: TopicRepository) {}

  async start() {
    const adapter = new CsvDataAdapter();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
    });

    for await (const data of dataReader.toIterable(100)) {
      await this.topicRepo.addMany(data);
    }

    adapter.close();
  }
}
