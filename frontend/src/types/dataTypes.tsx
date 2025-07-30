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
