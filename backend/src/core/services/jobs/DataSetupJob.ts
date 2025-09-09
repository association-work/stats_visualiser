import { DataRepository } from "@/core/repositories/DataRepository";

export class DataSetupJob {
  constructor(private readonly dataRepo: DataRepository) {}

  async run() {
    let years = await this.dataRepo.findAllYears();

    if (years.length === 0) {
      const max = 2099;
      const min = 1960;
      const yearNumbers = new Array(max - min).fill(0);

      await this.dataRepo.createMany(
        yearNumbers.map((y, i) => {
          return min + i;
        })
      );

      years = await this.dataRepo.findAllYears();
    }
  }
}
