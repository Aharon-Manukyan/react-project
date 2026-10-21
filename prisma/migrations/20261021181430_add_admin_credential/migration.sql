-- CreateTable
CREATE TABLE "AdminCredential" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "passwordHash" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminCredential_pkey" PRIMARY KEY ("id")
);
