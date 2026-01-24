export type topicBranch = {
  id: string;
  name: string;
  source: {
    name: string;
    url: string;
  };
  unit: string;
  children?: topicBranch[];
  values: [number, number][];
  hasChildren: boolean;
  parentId: string;
};

export type geoTopicBranch = {
  id: string;
  name: string;
  source: {
    name: string;
    url: string;
  };
  unit: string;
  children?: geoTopicBranch[];
  values: [number, number][];
  hasChildren: boolean;
  parentId: string;
  externalId?: string;
  topicId?: string;
};
