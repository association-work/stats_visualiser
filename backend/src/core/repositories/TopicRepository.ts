import { RawData } from "../domain/RawData";
import { TopicId } from "../domain/Topic";
import { TopicData } from "../domain/TopicData";

export abstract class TopicRepository {
  abstract addMany(rawData: RawData[]): Promise<void>;
  abstract findAll(): Promise<TopicData[]>;
  abstract findById(id: TopicId): Promise<TopicData | null>;
}
