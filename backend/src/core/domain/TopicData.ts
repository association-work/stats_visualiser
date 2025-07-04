export interface TopicData {
  topicName: string;
  topicId: string;
  topicParentId: string;
  values: [string, string][];
  children: TopicData[];
}
