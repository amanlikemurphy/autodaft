-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "location" TEXT[],
    "minPrice" DOUBLE PRECISION NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "propertyType" TEXT NOT NULL,
    "minLease" INTEGER NOT NULL,
    "maxLease" INTEGER NOT NULL,
    "facilities" TEXT[],
    "minBedrooms" INTEGER,
    "maxBedrooms" INTEGER,
    "roomType" TEXT,
    "suitability" TEXT,
    "minHousemates" INTEGER,
    "maxHousemates" INTEGER,
    "ownerOccupied" BOOLEAN,
    "keywords" TEXT,
    "customMessage" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyApplication" (
    "id" TEXT NOT NULL,
    "propertyReference" TEXT NOT NULL,
    "preferenceId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyApplication_propertyReference_preferenceId_key" ON "PropertyApplication"("propertyReference", "preferenceId");

-- AddForeignKey
ALTER TABLE "PropertyApplication" ADD CONSTRAINT "PropertyApplication_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "UserPreference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
