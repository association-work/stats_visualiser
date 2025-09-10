import { Year } from "@/core/domain/Year";
import { DataRepository } from "@/core/repositories/DataRepository";
import { PrismaClient } from "@/database/client";
import { injectable } from "inversify";

@injectable()
export class SqlDataRepository extends DataRepository {
  constructor(private readonly client: PrismaClient) {
    super();
  }

  findAllYears(): Promise<Year[]> {
    return this.client.year.findMany();
  }

  async createMany(years: number[]): Promise<void> {
    await this.client.year.createMany({
      data: years.map((y) => ({
        year: y,
      })),
    });
  }
}
