import { SqlDataRepository } from "@/core/platform/repositories/sql/SqlDataRepository";
import { SqlLocationRepository } from "@/core/platform/repositories/sql/SqlLocationRepository";
import { SqlTopicRepository } from "@/core/platform/repositories/sql/SqlTopicRepository";
import { DataRepository } from "@/core/repositories/DataRepository";
import { LocationRepository } from "@/core/repositories/LocationRepository";
import { TopicRepository } from "@/core/repositories/TopicRepository";
import { DataSetupJob } from "@/core/services/jobs/DataSetupJob";
import { GeoDataJob } from "@/core/services/jobs/GeoDataJob";
import { GesDataJob } from "@/core/services/jobs/GesDataJob";
import { PopulationDataJob } from "@/core/services/jobs/PopulationDataJob";
import { PrismaClient } from "@/database/client";

const client = new PrismaClient();
const topicRepo: TopicRepository = new SqlTopicRepository(client);
const dataRepo: DataRepository = new SqlDataRepository(client);
const locationRepo: LocationRepository = new SqlLocationRepository(client);
const gesDataJob = new GesDataJob(dataRepo, topicRepo, locationRepo);
const populationDataJob = new PopulationDataJob(
  dataRepo,
  topicRepo,
  locationRepo
);
const geoJob = new GeoDataJob(locationRepo);
const setupJob = new DataSetupJob(dataRepo);

export const serviceMap = {
  client,
  topicRepo,
  dataRepo,
  gesDataJob,
  populationDataJob,
  geoJob,
  setupJob,
};
