-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'INSTITUTIONAL');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SORTEIO', 'ARRECADACAO', 'VIAGEM', 'MISSAO', 'SAUDE', 'ESPORTE', 'OUTRO');

-- CreateEnum
CREATE TYPE "RifaStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'DRAWN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NumberStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'PAID');

-- CreateEnum
CREATE TYPE "DrawMethod" AS ENUM ('MANUAL', 'AUTOMATIC', 'DATE', 'PERCENTAGE', 'LOTERIA_FEDERAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BalloonShape" AS ENUM ('CIRCLE', 'HEART', 'STAR', 'HEXAGON', 'DIAMOND', 'SHIELD', 'FLOWER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "whatsapp" TEXT,
    "pixKey" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rifa" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "Category" NOT NULL DEFAULT 'SORTEIO',
    "status" "RifaStatus" NOT NULL DEFAULT 'DRAFT',
    "totalNumbers" INTEGER NOT NULL,
    "numberPrice" DECIMAL(10,2) NOT NULL,
    "minPercentToRaffle" INTEGER NOT NULL DEFAULT 100,
    "maxPerBuyer" INTEGER,
    "drawDate" TIMESTAMP(3),
    "drawMethod" "DrawMethod" NOT NULL DEFAULT 'MANUAL',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "coverImage" TEXT,
    "images" TEXT[],
    "balloonShape" "BalloonShape" NOT NULL DEFAULT 'CIRCLE',
    "primaryColor" TEXT,
    "winnerId" TEXT,
    "winnerNumber" INTEGER,
    "drawnAt" TIMESTAMP(3),
    "totalRaised" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RifaNumber" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" "NumberStatus" NOT NULL DEFAULT 'AVAILABLE',
    "rifaId" TEXT NOT NULL,
    "buyerId" TEXT,
    "reservedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "RifaNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "rifaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "externalId" TEXT,
    "pixQrCode" TEXT,
    "pixQrCodeText" TEXT,
    "boletoUrl" TEXT,
    "rifaId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "numbers" INTEGER[],
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Rifa_slug_key" ON "Rifa"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RifaNumber_rifaId_number_key" ON "RifaNumber"("rifaId", "number");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rifa" ADD CONSTRAINT "Rifa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RifaNumber" ADD CONSTRAINT "RifaNumber_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RifaNumber" ADD CONSTRAINT "RifaNumber_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_rifaId_fkey" FOREIGN KEY ("rifaId") REFERENCES "Rifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

