/*
  Warnings:

  - Made the column `userId` on table `Dish` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Dish" DROP CONSTRAINT "Dish_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Dish" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Dish" ADD CONSTRAINT "Dish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
