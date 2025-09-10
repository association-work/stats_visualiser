import { LocationData } from "@/core/domain/RawData";
import { CsvDataAdapter } from "../CsvDataAdapter";
import * as path from "path";
import { GeographyLineReader } from "../lineReaders/GeographyLineReader";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { Location } from "@/core/domain/Location";

export class GeoDataJob {
  constructor(private readonly repo: LocationRepository) {}
  async run() {
    const adapter = new CsvDataAdapter<LocationData>();
    const locations: Map<string, Location> = new Map();

    const dataReader = await adapter.open({
      filePath: path.resolve(
        __dirname,
        "../../../../data/Z_structure_geo_v1.csv"
      ),
      separator: ";",
      skipRows: 1,
      lineReaderProvider: () => new GeographyLineReader(),
    });

    for await (const data of dataReader.toIterable(Infinity)) {
      for (const location of data) {
        const parent = location.parent
          ? await this.findLocation(locations, location.parent.externalId)
          : null;

        await this.repo.save({
          name: location.name,
          externalId: location.externalId,
          parentId: parent?.id,
        });
      }
    }

    await adapter.close();
  }

  private async findLocation(cache: Map<string, Location>, exId: string) {
    let location: Location | null = null;

    if (cache.has(exId)) {
      location = cache.get(exId)!;
    }

    // look up in storage
    location = await this.repo.findByExternalId(exId);
    if (location) {
      cache.set(location.externalId, location);
    }

    return location;
  }
}
