/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_userId_fkey";

-- AlterTable
ALTER TABLE "todos" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE INDEX "todos_userId_idx" ON "todos"("userId");

-- CreateIndex
CREATE INDEX "todos_status_idx" ON "todos"("status");

-- CreateIndex
CREATE INDEX "todos_userId_status_idx" ON "todos"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
