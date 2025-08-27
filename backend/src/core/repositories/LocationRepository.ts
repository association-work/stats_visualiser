import { injectable } from "inversify";
import { Location } from "../domain/Location";

@injectable()
export abstract class LocationRepository {
  abstract create(location: {
    name: string;
    externalId: string;
  }): Promise<Location>;

  abstract findByExternalId(externalId: string): Promise<Location | null>;
}
