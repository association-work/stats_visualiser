import { Topic, TopicId } from "../domain/Topic";
import { LocatedTimedTopicData, TimedTopicData } from "../domain/TopicData";
import { TopicDataTree } from "../domain/TopicDataTree";

export abstract class TopicRepository {
  abstract create(topic: Topic): Promise<void>;
  abstract findByExternalId(id: string): Promise<Topic | null>;
  abstract findAll(): Promise<TopicDataTree[]>;
  abstract findById(id: TopicId): Promise<TopicDataTree | null>;
  abstract saveData(id: TopicId, data: LocatedTimedTopicData): Promise<void>;
}
