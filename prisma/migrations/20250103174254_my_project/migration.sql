-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "Id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "itemDescription" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Category" (
    "Id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "Id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" INTEGER NOT NULL,
    "itemTitle" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "BeforeQty" INTEGER NOT NULL,
    "soldQty" INTEGER NOT NULL,
    "SalerName" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "_CategoryToItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Items_categoryId_key" ON "Items"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_itemId_key" ON "Transaction"("itemId");

-- CreateIndex
CREATE INDEX "_CategoryToItems_B_index" ON "_CategoryToItems"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToItems" ADD CONSTRAINT "_CategoryToItems_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItems" ADD CONSTRAINT "_CategoryToItems_B_fkey" FOREIGN KEY ("B") REFERENCES "Items"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
