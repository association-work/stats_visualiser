export interface TopicDataTree {
  name: string;
  id: string;
  parentId?: string;
  source: {
    name: string;
    url: string;
  };
  unit: string;
  values: [number, number][];
  hasChildren: boolean;
  children?: TopicDataTree[];
}
  