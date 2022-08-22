/*
  Warnings:

  - You are about to drop the column `sharedToIds` on the `DataTable` table. All the data in the column will be lost.
  - Changed the type of `header` on the `DataTable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `body` on the `DataTable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DataTable" DROP COLUMN "sharedToIds",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "header",
ADD COLUMN     "header" JSONB NOT NULL,
DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "DataTablesToUsers" (
    "sharedToId" TEXT NOT NULL,
    "dataTableId" TEXT NOT NULL,

    CONSTRAINT "DataTablesToUsers_pkey" PRIMARY KEY ("sharedToId","dataTableId")
);

-- AddForeignKey
ALTER TABLE "DataTablesToUsers" ADD CONSTRAINT "DataTablesToUsers_sharedToId_fkey" FOREIGN KEY ("sharedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataTablesToUsers" ADD CONSTRAINT "DataTablesToUsers_dataTableId_fkey" FOREIGN KEY ("dataTableId") REFERENCES "DataTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
