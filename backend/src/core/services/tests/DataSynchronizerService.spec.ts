import { config } from "dotenv";
import * as path from "path";
config({
  path: path.resolve(__dirname, "../../../../.env.test"),
});
import { PrismaClient } from "@/database/client";
import { DataSynchronizationService } from "../DataSynchronizationService";
import { TopicService } from "../TopicService";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { SqlLocationRepository } from "@/core/platform/repositories/sql/SqlLocationRepository";

describe("DataSynchronizerService Tests", () => {
  test("Should synchronize all CSV data", async () => {
    const client = new PrismaClient();
    const topicRepo: TopicRepository = new SqlTopicRepository(client);
    const dataRepo: DataRepository = new SqlDataRepository(client);
    const locationRepo: LocationRepository = new SqlLocationRepository(client);
    const topicService = new TopicService(topicRepo, locationRepo, dataRepo);

    const synchronizer = new DataSynchronizationService(topicService);

    await synchronizer.start();

    const data = await topicRepo.findAll();
    expect(data.length).toBeGreaterThan(1);
  });
});
