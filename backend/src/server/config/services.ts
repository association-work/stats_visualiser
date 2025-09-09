import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { PrismaClient } from "@/database/client";

const client = new PrismaClient();
const topicRepo: TopicRepository = new SqlTopicRepository(client);
const dataRepo: DataRepository = new SqlDataRepository(client);

export const serviceMap = {
  client,
  topicRepo,
  dataRepo,
};
