import { RawDataSeries } from "@/core/domain/RawDataSeries";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { Topic } from "@/core/domain/Topic";
import { Location } from "@/core/domain/Location";
import { Year } from "@/core/domain/Year";
import { randomUUID } from "crypto";
import { Dataset } from "@/core/domain/Dataset";
import { DataSeries } from "@/core/domain/DataSeries";

export abstract class DataSynchronizationBaseJob {
  private yearsMap!: Map<number, Year>;

  constructor(
    private readonly topicRepo: TopicRepository,
    private readonly locationRepo: LocationRepository,
    private readonly dataRepo: DataRepository
  ) {}

  protected async addData(dataset: Dataset, rawData: RawDataSeries[]) {
    const topics: Map<string, Topic> = new Map();
    const locations: Map<string, Location> = new Map();

    if (!this.yearsMap) {
      let years = await this.dataRepo.findAllYears();
      this.yearsMap = new Map<number, Year>(years.map((y) => [y.year, y]));
    }

    for (const data of rawData) {
      let topic = await this.findTopic(topics, data.topicExternalId);

      if (!topic) {
        // create
        topic = {
          id: randomUUID().toString(),
          name: data.topicName,
          externalId: data.topicExternalId,
        };

        topics.set(data.topicExternalId, topic);

        if (data.parent) {
          const parentTopic = await this.findTopic(
            topics,
            data.parent.externalId
          );

          if (parentTopic) {
            topic.parentId = parentTopic.id;
          } else {
            console.warn(`Parent topic not found: ${data.parent.topicName}`);
          }
        }

        await this.topicRepo.create(topic);
      }

      let location = await this.getLocation(locations, data.locationExternalId);

      const values = data.values
        .map((v) => [this.yearsMap.get(v[0])?.id!, location.id, v[1]])
        .filter((v) => !isNaN(v[2])) as [number, number][];

      const series: Omit<DataSeries, "id"> = {
        datasetId: dataset.id,
        locationId: location.id,
        topicId: topic.id,
        source: data.source,
        valuesUnit: data.valuesUnit,
        values,
      };

      await this.dataRepo.insertSeries(series);
    }
  }

  private async findTopic(
    cache: Map<string, Topic>,
    exId: string
  ): Promise<Topic | null> {
    let topic: Topic | null = null;

    if (cache.has(exId)) {
      topic = cache.get(exId)!;
    }

    // look up in storage
    topic = await this.topicRepo.findByExternalId(exId);
    return topic;
  }

  private async getLocation(cache: Map<string, Location>, exId: string) {
    let location: Location | null = null;

    if (cache.has(exId)) {
      location = cache.get(exId)!;
    }

    // look up in storage
    location = await this.locationRepo.findByExternalId(exId);
    if (!location) {
      throw new Error(`Location not with ID ${exId} not found`);
    }

    return location;
  }
}
