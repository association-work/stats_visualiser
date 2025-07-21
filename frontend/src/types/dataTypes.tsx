export type branch = {
  id: number;
  name: string;
  parentId: number | null;
  externalId: string;
  isSection: boolean;
  source: string;
  link: string;
  geography: string;
  geographyId: string;
  unit: string;
  isSummable: boolean;
  values: { year: number; value: number }[];
  children: branch[];
};
