import { RawData } from "@/core/domain/RawData";
import { CsvLineReader } from "../CsvLineReader";

export class PopulationLineReader implements CsvLineReader {
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
    const locationExternalId = columns[1];

    const parentTopic = findParent(externalId, this.topics);
    const parentLocation = findParent(locationExternalId, this.topics);

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
      location: {
        name: columns[5],
        externalId: columns[6],
        parent: parentLocation ?? undefined,
      },

      valuesUnit: columns[7],
      values: columns
        .filter((_, i) => i > 9)
        .filter((v) => !!v || v.trim() === "-")
        .map((v, i) => [1990 + i, Number.parseFloat(v.replace(",", "."))]),
    };
  }
}

function findParent(
  externalId: string,
  nameMap: Map<string, string>
): { name: string; externalId: string } | null {
  let parentName: undefined | string = undefined;
  const lastDotIdx = externalId.lastIndexOf(".");

  let parentId: undefined | string = undefined;
  if (lastDotIdx > -1) {
    parentId = externalId.substring(0, lastDotIdx);
    parentName = nameMap.get(parentId);

    if (!parentName) {
      throw new Error("Parent name not found");
    }

    return {
      externalId: parentId,
      name: parentName,
    };
  }

  return null;
}
