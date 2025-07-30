import { TopicData } from "../domain/TopicData";

export abstract class DataQueryService {
  abstract getAll(): Promise<TopicData[]>;
}
