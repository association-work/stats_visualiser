import { LocationId } from "./Location";
import { TopicId } from "./Topic";

export interface DataSeries {
  id: number;
  datasetId: number;
  topicId: TopicId;
  locationId: LocationId;
  source: {
    url: string;
    name: string;
  };
  valuesUnit: string;
  values: [number, number][];
}
