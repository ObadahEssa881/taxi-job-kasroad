-- CreateEnum
CREATE TYPE "isBanned" AS ENUM ('Yes', 'No');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('client', 'driver', 'partner');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('completed', 'cancelled_by_driver', 'cancelled_by_client');

-- CreateTable
CREATE TABLE "User" (
    "users_id" SERIAL NOT NULL,
    "banned" "isBanned" NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("users_id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "request_at" TEXT NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("users_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("users_id") ON DELETE RESTRICT ON UPDATE CASCADE;
