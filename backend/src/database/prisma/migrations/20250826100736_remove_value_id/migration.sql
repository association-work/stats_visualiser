/*
  Warnings:

  - The primary key for the `value` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `value` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."value" DROP CONSTRAINT "value_pkey",
DROP COLUMN "id";
