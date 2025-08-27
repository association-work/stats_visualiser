import { Location } from "@/core/domain/Location";
import { Year } from "@/core/domain/Year";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { PrismaClient } from "@/database/client";
import { injectable } from "inversify";

@injectable()
export class SqlLocationRepository extends LocationRepository {
  constructor(private readonly client: PrismaClient) {
    super();
  }

  create(location: { name: string; externalId: string }): Promise<Location> {
    return this.client.location.create({
      data: location,
    });
  }

  async findByExternalId(externalId: string): Promise<Location | null> {
    const location = this.client.location.findUnique({
      where: {
        externalId,
      },
    });

    return location;
  }
}
