/*
  Warnings:

  - Added the required column `creationDate` to the `dataset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."dataset" ADD COLUMN     "creationDate" TIMESTAMP NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
