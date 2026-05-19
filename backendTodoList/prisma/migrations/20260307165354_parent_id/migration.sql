-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateIndex
CREATE INDEX "Todo_todoListId_parentId_runk_idx" ON "Todo"("todoListId", "parentId", "runk");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
