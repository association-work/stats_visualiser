import { RawData } from "@/core/domain/RawData";
import { CsvLineReader } from "../CsvLineReader";

export class GesLineReader implements CsvLineReader<RawData> {
  topics: Map<string, string> = new Map();

  readLine(line: string, separator: string): RawData | null {
    if (!line || line === ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;") {
      return null;
    }

    const columns = line.split(separator);
    this.topics.set(columns[1], columns[0]);

    const externalId = columns[1];
    const lastDotIdx = externalId.lastIndexOf(".");
    let parentTopicName: undefined | string = undefined;

    let parentTopicId: undefined | string = undefined;
    if (lastDotIdx > -1) {
      parentTopicId = externalId.substring(0, lastDotIdx);
      parentTopicName = this.topics.get(parentTopicId);
    }

    const parent =
      parentTopicId && parentTopicName
        ? {
            externalId: parentTopicId,
            topicName: parentTopicName,
          }
        : undefined;

    return {
      externalId,
      topicName: columns[0],
      parent,
      source: {
        name: columns[3],
        url: columns[4],
      },
      locationExternalId: columns[6],
      valuesUnit: columns[7],
      values: columns
        .filter((_, i) => i > 8)
        .filter((v) => !!v || v.trim() === "-")
        .map((v, i) => [1990 + i, Number.parseFloat(v.replace(",", "."))]),
    };
  }
}
