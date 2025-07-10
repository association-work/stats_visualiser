import { InMemoryTopicRepository } from "@/core/platform/InMemoryTopicRepository";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { DataSynchronizationService } from "../DataSynchronizationService";

describe("DataSynchronizerService Tests", () => {
  test("Should synchronize all CSV data", async () => {
    const repository = new InMemoryTopicRepository();
    const synchronizer = new DataSynchronizationService(repository);
    const emptyData = await repository.findAll();

    expect(emptyData.length).toStrictEqual(0);

    await synchronizer.start();

    const data = await repository.findAll();
    expect(data.length).toBeGreaterThan(1);
  });
});
