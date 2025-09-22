export interface DataValue<T> {
  value: T[];
  done: boolean;
}

export class DataReader<T> {
  private cursor = 0;

  constructor(
    private readonly onNext: (
      cursor: number,
      count?: number
    ) => Promise<T[] | null>
  ) {}

  async read(count?: number): Promise<DataValue<T>> {
    if (typeof count === "number" && count < 1) {
      throw new Error("Invalid count value: must be greater of 0 if specified");
    }

    const data = await this.onNext(++this.cursor, count);

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

  toIterable(count: number = 1): AsyncIterable<T[]> {
    if (typeof count === "number" && count < 1) {
      throw new Error("Invalid count value: must be greater of 0 if specified");
    }

    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => {
          const result = await this.onNext(++this.cursor, count);
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
