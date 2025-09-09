import { injectable } from "inversify";
import { Location, LocationId } from "../domain/Location";

@injectable()
export abstract class LocationRepository {
  abstract save(location: {
    name: string;
    externalId: string;
    parentId?: LocationId;
  }): Promise<Location>;

  abstract save(
    locations: {
      name: string;
      externalId: string;
      parentId?: LocationId;
    }
  ): Promise<Location>;

  abstract findByExternalId(externalId: string): Promise<Location | null>;
}
