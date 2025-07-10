import { randomUUID } from "crypto";
import { RawData } from "../domain/RawData";
import { TopicData } from "../domain/TopicData";
import { TopicRepository } from "../repositories/TopicRepository";
import { TopicId } from "../domain/Topic";

export class InMemoryTopicRepository extends TopicRepository {
  topics: Map<string, TopicData> = new Map();
  topicsTree: Map<string, TopicData> = new Map();
  topicIds: Map<string, string> = new Map();

  async addMany(rawData: RawData[]): Promise<void> {
    for (const data of rawData) {
      const topic: TopicData = {
        id: randomUUID().toString(),
        name: data.topicName,
        source: data.source,
        unit: data.valuesUnit,
        children: [],
        values: data.values,
        hasChildren: false,
      };

      this.topics.set(data.topicName, topic);
      this.topicIds.set(topic.id, topic.name);

      if (data.parentTopicName) {
        const parentTopic = this.topics.get(data.parentTopicName);
        if (parentTopic) {
          topic.parentId = parentTopic.id;
          parentTopic.children?.push(topic);

          if (!parentTopic.hasChildren) {
            parentTopic.hasChildren = true;
          }
        }
      } else {
        this.topicsTree.set(data.topicName, topic);
      }
    }
  }

  async findAll(): Promise<TopicData[]> {
    return [...this.topicsTree.values()];
  }

  async findById(id: TopicId): Promise<TopicData | null> {
    const topicName = this.topicIds.get(id);
    if (!topicName) {
      return null;
    }

    const topic = this.topics.get(topicName);
    if (!topic) {
      return null;
    }

    return {
      ...topic,
      children: topic.children?.map((c) => ({
        ...c,
        children: undefined,
      })),
    };
  }
}
