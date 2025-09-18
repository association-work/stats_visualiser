-- CreateIndex
CREATE INDEX "data_series_topicId_idx" ON "public"."data_series"("topicId");

-- CreateIndex
CREATE INDEX "data_series_locationId_idx" ON "public"."data_series"("locationId");

-- CreateIndex
CREATE INDEX "data_series_datasetId_idx" ON "public"."data_series"("datasetId");
