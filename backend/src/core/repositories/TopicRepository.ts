import { RawData } from "../domain/RawData";
import { TopicData } from "../domain/TopicData";

export abstract class TopicRepository {
  abstract addMany(rawData: RawData[]): Promise<void>;
  abstract getAll(): Promise<TopicData[]>;
}
