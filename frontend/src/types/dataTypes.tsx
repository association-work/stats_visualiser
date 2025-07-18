// export type branch = {
//   id: number;
//   name: string;
//   parentId: number | null;
//   externalId: string;
//   isSection: boolean;
//   source: string;
//   link: string;
//   geography: string;
//   geographyId: string;
//   unit: string;
//   isSummable: boolean;
//   values: { year: number; value: number }[];
//   children: branch[];
// };

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
