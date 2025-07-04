import * as path from "path";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { RawData } from "@/core/domain/RawData";

describe("CsvDataAdapter Tests", () => {
  test("Should return all CSV file lines", async () => {
    const adapter = new CsvDataAdapter();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
    });

    const data = await dataReader.read();
    expect(data.value.length).toStrictEqual(157);
    expect(data.value[0].topicName).toStrictEqual("Emissions GES");
  });

  test("Should return the 15 first lines", async () => {
    const adapter = new CsvDataAdapter();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
    });

    const data = await dataReader.read(15);

    expect(data.value.length).toStrictEqual(15);
    expect(data.value[0].topicName).toStrictEqual("Emissions GES");
    expect(data.value[14].topicName).toStrictEqual(
      "Usage des bâtiments et activités résidentiels/tertiaires"
    );
  });

  test("Should should all the lines two by two", async () => {
    const adapter = new CsvDataAdapter();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
    });

    let data = await dataReader.read(2);
    const result: RawData[] = [];

    while (!data.done) {
      result.push(...data.value);
      data = await dataReader.read(2);
    }

    expect(result.length).toStrictEqual(157);
    expect(result[0].topicName).toStrictEqual("Emissions GES");
    expect(result[156].topicName).toStrictEqual(
      "Autres produits de la biomasse"
    );
  });
});
