/*
  Warnings:

  - Added the required column `sourceName` to the `topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceUrl` to the `topic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."topic" ADD COLUMN     "sourceName" TEXT NOT NULL,
ADD COLUMN     "sourceUrl" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL;
