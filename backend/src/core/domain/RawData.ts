export interface RawData {
  externalId: string;
  topicName: string;
  parent?: {
    topicName: string;
    externalId: string;
  };
  locationExternalId: string;
  source: {
    url: string;
    name: string;
  };
  valuesUnit: string;
  values: [number, number][];
}

export interface LocationData {
  name: string;
  externalId: string;

  parent?: {
    name: string;
    externalId: string;
  };
}
