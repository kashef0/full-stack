/*
  Warnings:

  - The primary key for the `Items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Items` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `BeforeQty` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `SalerName` on the `transactions` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `beforeQty` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salerName` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_categoryId_fkey";

-- AlterTable
ALTER TABLE "Items" DROP CONSTRAINT "Items_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "Items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_pkey",
DROP COLUMN "BeforeQty",
DROP COLUMN "Id",
DROP COLUMN "SalerName",
ADD COLUMN     "beforeQty" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "salerName" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
