import { RawData } from "../domain/RawData";

export interface DataValue {
  value: RawData[];
  done: boolean;
}

export class DataReader {
  constructor(
    private readonly onNext: (count?: number) => Promise<RawData[] | null>
  ) {}

  async read(count?: number): Promise<DataValue> {
    if (typeof count === "number" && count < 1) {
      throw new Error("Invalid count value: must be greater of 0 if specified");
    }

    const data = await this.onNext(count);

    if (!data) {
      return {
        done: true,
        value: [],
      };
    }

    return {
      done: false,
      value: data,
    };
  }

  toIterable(count: number = 1): AsyncIterable<RawData[]> {
    if (typeof count === "number" && count < 1) {
      throw new Error("Invalid count value: must be greater of 0 if specified");
    }

    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => {
          const result = await this.onNext(count);
          if (result === null) {
            return {
              value: [],
              done: true,
            };
          }

          return {
            value: result,
            done: false,
          };
        },
      }),
    };
  }
}
