-- DropIndex
DROP INDEX "transactions_itemId_key";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "salerName" DROP NOT NULL;
