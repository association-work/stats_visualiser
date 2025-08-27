export interface RawData {
  externalId: string;
  topicName: string;
  parent?: {
    topicName: string;
    externalId: string;
  };
  location: {
    name: string;
    externalId: string;
  };
  source: {
    url: string;
    name: string;
  };
  valuesUnit: string;
  values: [number, number][];
}
  