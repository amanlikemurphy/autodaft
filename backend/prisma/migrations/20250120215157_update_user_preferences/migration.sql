/*
  Warnings:

  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PropertyApplication" DROP CONSTRAINT "PropertyApplication_preferenceId_fkey";

-- DropTable
DROP TABLE "UserPreference";

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "priceRange" INTEGER NOT NULL,
    "minBedrooms" INTEGER,
    "maxBedrooms" INTEGER,
    "rentDetails" JSONB,
    "sharedDetails" JSONB,
    "message" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PropertyApplication" ADD CONSTRAINT "PropertyApplication_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "user_preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
