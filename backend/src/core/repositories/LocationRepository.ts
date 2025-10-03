import { injectable } from "inversify";
import { Location, LocationId } from "../domain/Location";
import { TopicId } from "../domain/Topic";
import { TopicDataTree } from "../domain/TopicDataTree";

@injectable()
export abstract class LocationRepository {
  abstract save(location: {
    name: string;
    externalId: string;
    parentId?: LocationId;
  }): Promise<Location>;

  abstract save(locations: {
    name: string;
    externalId: string;
    parentId?: LocationId;
  }): Promise<Location>;

  abstract findAllByTopic(
    topicId: TopicId
  ): Promise<{ name: string; id: number }[]>;

  abstract findByExternalId(externalId: string): Promise<Location | null>;

  abstract getTreeByTopic(topic: TopicId): Promise<TopicDataTree[]>;
  abstract getTreeById(
    topic: TopicId,
    geoId: number
  ): Promise<TopicDataTree | null>;
}
