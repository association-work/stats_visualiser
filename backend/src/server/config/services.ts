import { InMemoryTopicRepository } from "@/core/platform/InMemoryTopicRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { DataSynchronizationService } from "@/core/services/DataSynchronizationService";

const repository: TopicRepository = new InMemoryTopicRepository();
const synchronizationService = new DataSynchronizationService(repository);

export const serviceMap = {
  repository,
  synchronizationService,
};
