import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { SqlLocationRepository } from "@/core/platform/repositories/sql/SqlLocationRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { DataSynchronizationService } from "@/core/services/DataSynchronizationService";
import { TopicService } from "@/core/services/TopicService";
import { PrismaClient } from "@/database/client";

const client = new PrismaClient();
const topicRepo: TopicRepository = new SqlTopicRepository(client);
const dataRepo: DataRepository = new SqlDataRepository(client);
const locationRepo: LocationRepository = new SqlLocationRepository(client);
const topicService = new TopicService(topicRepo, locationRepo, dataRepo);
const synchronizationService = new DataSynchronizationService(topicService);

export const serviceMap = {
  client,
  topicRepo,
  dataRepo,
  synchronizationService,
};
