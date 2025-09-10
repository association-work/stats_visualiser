import { TopicDataTree } from "../domain/TopicDataTree";

export abstract class DataQueryService {
  abstract getAll(): Promise<TopicDataTree[]>;
}
