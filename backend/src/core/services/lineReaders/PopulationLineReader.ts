import { RawData } from "@/core/domain/RawData";
import { CsvLineReader } from "../CsvLineReader";
import { findParent } from "./utils";

export class PopulationLineReader implements CsvLineReader<RawData> {
  topics: Map<string, string> = new Map();
  locations: Map<string, string> = new Map();

  readLine(line: string, separator: string): RawData | null {
    if (!line) {
      return null;
    }

    const columns = line.split(separator);
    this.topics.set(columns[1], columns[0]);
    this.locations.set(columns[6], columns[5]);

    const externalId = columns[1];
    const parentTopic = findParent(externalId, this.topics);

    return {
      externalId,
      topicName: columns[0],
      parent: parentTopic
        ? { topicName: parentTopic.name, externalId: parentTopic.externalId }
        : undefined,
      source: {
        name: columns[3],
        url: columns[4],
      },
      locationExternalId: columns[6],
      valuesUnit: columns[7],
      values: columns
        .filter((_, i) => i > 9)
        .filter((v) => !!v || v.trim() === "-")
        .map((v, i) => [1990 + i, Number.parseFloat(v.replace(",", "."))]),
    };
  }
}
