import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { SqlLocationRepository } from "@/core/platform/repositories/sql/SqlLocationRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { PrismaClient } from "@/database/client";

const client = new PrismaClient();
const topicRepo: TopicRepository = new SqlTopicRepository(client);
const dataRepo: DataRepository = new SqlDataRepository(client);
const locationRepo: LocationRepository = new SqlLocationRepository(client);

export const serviceMap = {
  client,
  topicRepo,
  dataRepo,
  locationRepo,
};
