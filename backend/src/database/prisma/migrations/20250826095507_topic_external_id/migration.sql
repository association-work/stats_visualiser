/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `topic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."topic" ADD COLUMN     "externalId" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "topic_externalId_key" ON "public"."topic"("externalId");
