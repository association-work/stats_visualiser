import { LocationId } from "./Location";
import { YearId } from "./Year";

export type TimedTopicData = [YearId, number][];
export type LocatedTimedTopicData = [YearId, LocationId, number][];
