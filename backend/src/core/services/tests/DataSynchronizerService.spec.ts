import { config } from "dotenv";
import * as path from "path";
config({
  path: path.resolve(__dirname, "../../../../.env.test"),
});
import { PrismaClient } from "@/database/client";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { SqlLocationRepository } from "@/core/platform/repositories/sql/SqlLocationRepository";
import { GesDataJob } from "../jobs/GesDataJob";

describe("DataSynchronizerService Tests", () => {
  test("Should synchronize all CSV data", async () => {
    const client = new PrismaClient();
    const topicRepo: TopicRepository = new SqlTopicRepository(client);
    const dataRepo: DataRepository = new SqlDataRepository(client);
    const locationRepo: LocationRepository = new SqlLocationRepository(client);

    const synchronizer = new GesDataJob(topicRepo, locationRepo, dataRepo);

    await synchronizer.run();

    const data = await topicRepo.findAll();
    expect(data.length).toBeGreaterThan(1);
  });
});
