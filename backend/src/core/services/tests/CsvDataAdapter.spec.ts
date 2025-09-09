import * as path from "path";
import { CsvDataAdapter } from "../CsvDataAdapter";
import { RawData } from "@/core/domain/RawData";
import { GesLineReader } from "../lineReaders/GesLineReader";

describe("CsvDataAdapter Tests", () => {
  test("Should return all CSV file lines", async () => {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      lineReaderProvider: () => new GesLineReader(),
      skipRows: 2,
    });

    const data = await dataReader.read();
    expect(data.value.length).toStrictEqual(157);
    expect(data.value[0].topicName).toStrictEqual("Emissions GES");
  });

  test("Should return the 15 first lines", async () => {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      lineReaderProvider: () => new GesLineReader(),
      skipRows: 2,
    });

    const data = await dataReader.read(15);

    expect(data.value.length).toStrictEqual(15);
    expect(data.value[0].topicName).toStrictEqual("Emissions GES");
    expect(data.value[14].topicName).toStrictEqual(
      "Usage des bâtiments et activités résidentiels/tertiaires"
    );
  });

  test("Should should all the lines two by two", async () => {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      lineReaderProvider: () => new GesLineReader(),
      skipRows: 2,
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

  test("toIterable method should return an async iterable", async () => {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_CITEPA_emissions_GES_structure_1.4_v4.csv"
      ),
      separator: ";",
      lineReaderProvider: () => new GesLineReader(),
      skipRows: 2,
    });

    let result: RawData[] = [];
    for await (const data of dataReader.toIterable(Infinity)) {
      result = data;
    }

    expect(result.length).toStrictEqual(157);
    expect(result[0].topicName).toStrictEqual("Emissions GES");
  });

   test("toIterable method should return an async iterable", async () => {
    const adapter = new CsvDataAdapter<RawData>();
    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_Banque_mond_Population_v1.csv"
      ),
      separator: ";",
      lineReaderProvider: () => new GesLineReader(),
      skipRows: 2,
    });

    let result: RawData[] = [];
    for await (const data of dataReader.toIterable(Infinity)) {
      result = data;
    }
  });
});
