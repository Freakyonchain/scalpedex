/*
  Warnings:

  - A unique constraint covering the columns `[barcode,userId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_barcode_key";

-- CreateTable
CREATE TABLE "ClerkUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClerkUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_userId_key" ON "Item"("barcode", "userId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ClerkUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
