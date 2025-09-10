-- CreateTable
CREATE TABLE "public"."topic" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "externalId" VARCHAR NOT NULL,
    "parentId" UUID,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."year" (
    "id" SERIAL NOT NULL,
    "year" SMALLINT NOT NULL,

    CONSTRAINT "year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "externalId" VARCHAR NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."value" (
    "seriesId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,
    "value" DECIMAL NOT NULL,

    CONSTRAINT "value_pkey" PRIMARY KEY ("seriesId","yearId")
);

-- CreateTable
CREATE TABLE "public"."data_series" (
    "id" SERIAL NOT NULL,
    "topicId" UUID NOT NULL,
    "locationId" INTEGER NOT NULL,
    "datasetId" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "data_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dataset" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "dataset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "topic_externalId_key" ON "public"."topic"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "location_externalId_key" ON "public"."location"("externalId");

-- AddForeignKey
ALTER TABLE "public"."topic" ADD CONSTRAINT "topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."value" ADD CONSTRAINT "value_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "public"."year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."value" ADD CONSTRAINT "value_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."data_series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."data_series" ADD CONSTRAINT "data_series_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."data_series" ADD CONSTRAINT "data_series_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."data_series" ADD CONSTRAINT "data_series_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "public"."dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
