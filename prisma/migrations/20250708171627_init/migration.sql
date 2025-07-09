/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Application` table. All the data in the column will be lost.
  - Made the column `status` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "updatedAt",
ALTER COLUMN "status" SET NOT NULL;
