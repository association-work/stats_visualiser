export type LocationId = number;
export interface Location {
  id: LocationId;
  name: string;
  externalId: string;
  parentId?: LocationId;
}
