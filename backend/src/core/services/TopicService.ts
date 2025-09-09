import { randomUUID } from "crypto";
import { RawData } from "../domain/RawData";
import { Topic } from "../domain/Topic";
import { TopicRepository } from "../repositories/TopicRepository";
import { DataRepository } from "../repositories/DataRepository";
import { Year } from "../domain/Year";
import { LocatedTimedTopicData } from "../domain/TopicData";
import { Location } from "../domain/Location";
import { LocationRepository } from "../repositories/LocationRepository";

export class TopicService {
  private yearsMap!: Map<number, Year>;

  constructor(
    private readonly topicRepo: TopicRepository,
    private readonly locationRepo: LocationRepository,
    private readonly dataRepo: DataRepository
  ) {}

  private async findTopic(
    cache: Map<string, Topic>,
    name: string,
    exId: string
  ): Promise<Topic | null> {
    let topic: Topic | null = null;

    if (cache.has(name)) {
      topic = cache.get(name)!;
    }

    // look up in storage
    topic = await this.topicRepo.findByExternalId(exId);
    return topic;
  }

  private async findLocation(
    cache: Map<string, Location>,
    name: string,
    exId: string
  ) {
    let location: Location | null = null;

    if (cache.has(name)) {
      location = cache.get(name)!;
    }

    // look up in storage
    location = await this.locationRepo.findByExternalId(exId);
    return location;
  }

  async addData(rawData: RawData[]) {
    const topics: Map<string, Topic> = new Map();
    const locations: Map<string, Location> = new Map();

    if (!this.yearsMap) {
      let years = await this.dataRepo.findAllYears();
      if (years.length === 0) {
        const max = 2099;
        const min = 1960;
        const yearNumbers = new Array(max - min).fill(0);

        await this.dataRepo.createMany(
          yearNumbers.map((y, i) => {
            return min + i;
          })
        );

        years = await this.dataRepo.findAllYears();
      }

      this.yearsMap = new Map<number, Year>(years.map((y) => [y.year, y]));
    }

    for (const data of rawData) {
      let topic = await this.findTopic(topics, data.topicName, data.externalId);

      if (!topic) {
        // create
        topic = {
          id: randomUUID().toString(),
          name: data.topicName,
          source: data.source,
          unit: data.valuesUnit,
          externalId: data.externalId,
        };

        topics.set(data.topicName, topic);

        if (data.parent) {
          const parentTopic = await this.findTopic(
            topics,
            data.parent.topicName,
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

      let location = await this.findLocation(
        locations,
        data.location.name,
        data.location.externalId
      );

      if (!location) {
        location = await this.locationRepo.create(data.location);
        locations.set(location.name, location);
      }

      const values = data.values
        .map((v) => [this.yearsMap.get(v[0])?.id!, location.id, v[1]])
        .filter((v) => !isNaN(v[2]));

      await this.topicRepo.saveData(
        topic.id,

        values as LocatedTimedTopicData
      );
    }
  }
}
