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
  id: number;
  name: string;
  source: {
    name: string;
    url: string;
  };
  unit: string;
  children?: topicBranch[];
  values: [number, number][];
  hasChildren: boolean;
  parentId?: number;
  externalId: string;
  topicId?: string;
};
