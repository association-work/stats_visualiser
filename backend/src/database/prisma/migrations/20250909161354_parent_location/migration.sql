-- AlterTable
ALTER TABLE "public"."location" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."location" ADD CONSTRAINT "location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
