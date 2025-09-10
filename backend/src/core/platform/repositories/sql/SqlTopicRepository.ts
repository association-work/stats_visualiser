import { Topic, TopicId } from "@/core/domain/Topic";
import { TopicDataTree } from "@/core/domain/TopicDataTree";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { PrismaClient } from "@/database/client";
import { injectable } from "inversify";
import { topicTreeRequest } from "./scripts/topicTree";

@injectable()
export class SqlTopicRepository extends TopicRepository {
  constructor(private readonly client: PrismaClient) {
    super();
  }

  async create(topic: Topic): Promise<void> {
    await this.client.topic.upsert({
      where: {
        externalId: topic.externalId,
      },
      create: {
        id: topic.id,
        externalId: topic.externalId,
        parentId: topic.parentId,
        name: topic.name,
      },
      update: {
        name: topic.name,
        parentId: topic.parentId,
      },
    });
  }

  async findByExternalId(id: string): Promise<Topic | null> {
    const topic = await this.client.topic.findUnique({
      where: {
        externalId: id,
      },
    });

    if (!topic) {
      return null;
    }

    return {
      ...topic,
      parentId: topic.parentId ?? undefined,
    };
  }

  findAll(): Promise<TopicDataTree[]> {
    return this.client.$queryRawUnsafe(
      `${topicTreeRequest} WHERE _topic."parentId" is null`
    );
  }

  async findById(id: TopicId): Promise<TopicDataTree | null> {
    const data: TopicDataTree[] = await this.client.$queryRawUnsafe(
      `${topicTreeRequest} WHERE _topic.id = '${id}'`
    );

    return data[0] ?? null;
  }
}
