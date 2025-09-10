import { RawData } from "@/core/domain/RawData";
import { Topic, TopicId } from "@/core/domain/Topic";
import { LocatedTimedTopicData, TimedTopicData } from "@/core/domain/TopicData";
import { TopicDataTree } from "@/core/domain/TopicDataTree";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { PrismaClient } from "@/database/client";
import { Decimal } from "@/database/generated/prisma/runtime/library";
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
        unit: topic.unit,
        sourceName: topic.source.name,
        sourceUrl: topic.source.url,
      },
      update: {
        name: topic.name,
        unit: topic.unit,
        parentId: topic.parentId,
        sourceName: topic.source.name,
        sourceUrl: topic.source.url,
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
      source: {
        name: topic.name,
        url: topic.sourceUrl,
      },
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

  async saveData(id: TopicId, data: LocatedTimedTopicData): Promise<void> {
    await this.client.$transaction(
      data.map((d) => {
        return this.client.value.upsert({
          where: {
            topicId_yearId_locationId: {
              topicId: id,
              yearId: d[0],
              locationId: d[1],
            },
          },
          create: {
            topicId: id,
            yearId: d[0],
            locationId: d[1],
            value: new Decimal(d[2]),
          },
          update: {
            value: new Decimal(d[2]),
          },
        });
      })
    );
  }
}
