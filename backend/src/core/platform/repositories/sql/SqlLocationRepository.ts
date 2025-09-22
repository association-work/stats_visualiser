import { Location, LocationId } from "@/core/domain/Location";
import { TopicId } from "@/core/domain/Topic";
import { Year } from "@/core/domain/Year";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { PrismaClient } from "@/database/client";
import { injectable } from "inversify";

@injectable()
export class SqlLocationRepository extends LocationRepository {
  constructor(private readonly client: PrismaClient) {
    super();
  }

  async save(location: {
    name: string;
    externalId: string;
    parentId?: LocationId;
  }): Promise<Location> {
    const result = await this.client.location.upsert({
      where: {
        externalId: location.externalId,
      },
      create: {
        externalId: location.externalId,
        name: location.name,
        parentId: location.parentId,
      },
      update: {
        parentId: location.parentId,
        name: location.name,
      },
    });

    return {
      ...result,
      parentId: result.parentId ?? undefined,
    };
  }

  async findByExternalId(externalId: string): Promise<Location | null> {
    const location = await this.client.location.findUnique({
      where: {
        externalId,
      },
    });

    if (!location) {
      return null;
    }

    return {
      ...location,
      parentId: location.parentId ?? undefined,
    };
  }

  async findAllByTopic(
    topicId: TopicId
  ): Promise<{ name: string; id: number }[]> {
    const result = await this.client.$queryRaw<{ name: string; id: number }[]>`
    select id, name from "location" l where exists (select * from "value" v where l.id = v."locationId" and v."topicId" = ${topicId}::uuid);
    `;

    return result;
  }
}
