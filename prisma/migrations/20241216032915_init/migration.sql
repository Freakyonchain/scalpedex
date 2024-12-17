-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'JAPANESE', 'FRENCH', 'GERMAN', 'SPANISH', 'KOREAN', 'CHINESE');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('FACTORY_SEALED', 'CUSTOM_SEALED', 'MINT', 'NEAR_MINT', 'PLAYED');

-- CreateTable
CREATE TABLE "PokemonSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'FRENCH',
    "releaseDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PokemonSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "msrp" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemContent" (
    "id" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "setId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "condition" "Condition" NOT NULL DEFAULT 'FACTORY_SEALED',
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrice" (
    "id" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonSet_name_language_key" ON "PokemonSet"("name", "language");

-- CreateIndex
CREATE UNIQUE INDEX "ItemType_name_key" ON "ItemType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemContent_itemTypeId_setId_key" ON "ItemContent"("itemTypeId", "setId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");

-- CreateIndex
CREATE INDEX "Item_userId_idx" ON "Item"("userId");

-- CreateIndex
CREATE INDEX "Item_barcode_idx" ON "Item"("barcode");

-- AddForeignKey
ALTER TABLE "ItemContent" ADD CONSTRAINT "ItemContent_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemContent" ADD CONSTRAINT "ItemContent_setId_fkey" FOREIGN KEY ("setId") REFERENCES "PokemonSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPrice" ADD CONSTRAINT "MarketPrice_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
