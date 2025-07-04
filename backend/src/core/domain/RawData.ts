export interface RawData {
  externalId: string;
  topicName: string;
  parentTopicName?: string;
  location: string;
  source: {
    url: string;
    name: string;
  };
  valuesUnit: string;
  values: [number, number][];
}
