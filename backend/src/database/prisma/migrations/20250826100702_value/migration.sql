/*
  Warnings:

  - You are about to drop the column `name` on the `value` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[topicId]` on the table `value` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `topicId` to the `value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearId` to the `value` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."value" DROP COLUMN "name",
ADD COLUMN     "topicId" UUID NOT NULL,
ADD COLUMN     "value" DECIMAL NOT NULL,
ADD COLUMN     "yearId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "value_topicId_key" ON "public"."value"("topicId");

-- AddForeignKey
ALTER TABLE "public"."value" ADD CONSTRAINT "value_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "public"."year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."value" ADD CONSTRAINT "value_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
