import { DataSeries } from "@/core/domain/DataSeries";
import { Dataset } from "@/core/domain/Dataset";
import { Year } from "@/core/domain/Year";
import { DataRepository } from "@/core/repositories/DataRepository";
import { PrismaClient } from "@/database/client";
import { Decimal } from "@/database/generated/prisma/runtime/library";
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

  async insertSeries(series: Omit<DataSeries, "id">): Promise<DataSeries> {
    const dataSeries = await this.client.data_series.create({
      data: {
        sourceName: series.source.name,
        sourceUrl: series.source.url,
        unit: series.valuesUnit,
        locationId: series.locationId,
        datasetId: series.datasetId,
        topicId: series.topicId,
      },
    });

    await this.client.value.createMany({
      data: series.values.map((v) => ({
        yearId: v[0],
        value: new Decimal(v[1]),
        seriesId: dataSeries.id,
      })),
      skipDuplicates: true,
    });

    return {
      ...series,
      id: dataSeries.id,
    };
  }

  async createDataset(dataset: Omit<Dataset, "id">): Promise<Dataset> {
    const result = await this.client.dataset.create({
      data: dataset,
    });

    return {
      ...dataset,
      ...result,
    };
  }
}
