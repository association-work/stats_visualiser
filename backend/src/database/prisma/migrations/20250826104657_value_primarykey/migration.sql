-- DropIndex
DROP INDEX "public"."value_topicId_key";

-- AlterTable
ALTER TABLE "public"."value" ADD CONSTRAINT "value_pkey" PRIMARY KEY ("topicId", "yearId");
