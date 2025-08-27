/*
  Warnings:

  - The primary key for the `value` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `locationId` to the `value` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."value" DROP CONSTRAINT "value_pkey",
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD CONSTRAINT "value_pkey" PRIMARY KEY ("topicId", "yearId", "locationId");

-- AddForeignKey
ALTER TABLE "public"."value" ADD CONSTRAINT "value_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
