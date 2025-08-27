import * as path from "path";
import { CsvDataAdapter } from "./CsvDataAdapter";
import { TopicService } from "./TopicService";

export class DataSynchronizationService {
  constructor(private readonly topicService: TopicService) {}

  async start() {
    const adapter = new CsvDataAdapter();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      skipRows: 2,
    });

    for await (const data of dataReader.toIterable(100)) {
      await this.topicService.addData(data);
    }

    await adapter.close();
  }
}
