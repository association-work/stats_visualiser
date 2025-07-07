import { randomUUID } from "crypto";
import { RawData } from "../domain/RawData";
import { TopicData } from "../domain/TopicData";
import { TopicRepository } from "../repositories/TopicRepository";

export class InMemoryTopicRepository extends TopicRepository {
  topics: Map<string, TopicData> = new Map();
  topicsTree: Map<string, TopicData> = new Map();

  async addMany(rawData: RawData[]): Promise<void> {
    for (const data of rawData) {
      const topic: TopicData = {
        topicId: randomUUID().toString(),
        topicName: data.topicName,
        children: [],
        values: data.values,
      };

      this.topics.set(data.topicName, topic);

      if (data.parentTopicName) {
        const parentTopic = this.topics.get(data.parentTopicName);
        if (parentTopic) {
          topic.topicParentId = parentTopic.topicId;
          parentTopic.children.push(topic);
        }
      } else {
        this.topicsTree.set(data.topicName, topic);
      }
    }
  }

  async getAll(): Promise<TopicData[]> {
    return [...this.topicsTree.values()];
  }
}
