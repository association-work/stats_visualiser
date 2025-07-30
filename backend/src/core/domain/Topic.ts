export type TopicId = string;

export interface Topic {
  id: TopicId;
  name: string;
  parentId?: TopicId;
}
