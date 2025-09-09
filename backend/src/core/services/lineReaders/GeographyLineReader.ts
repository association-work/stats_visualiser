import { LocationData, RawData } from "@/core/domain/RawData";
import { CsvLineReader } from "../CsvLineReader";
import { findParent } from "./utils";

export class GeographyLineReader implements CsvLineReader<LocationData> {
  locations: Map<string, string> = new Map();

  readLine(line: string, separator: string): LocationData | null {
    const columns = line.split(separator);
    const externalId = columns[1];
    const name = columns[0];
    this.locations.set(externalId, name);

    const parentLocation = findParent(externalId, this.locations);

    return {
      name,
      externalId,
      parent: parentLocation ?? undefined,
    };
  }
}
