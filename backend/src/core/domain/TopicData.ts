export interface TopicData {
  topicName: string;
  topicId: string;
  topicParentId?: string;
  values: [number, number][];
  children: TopicData[];
}
