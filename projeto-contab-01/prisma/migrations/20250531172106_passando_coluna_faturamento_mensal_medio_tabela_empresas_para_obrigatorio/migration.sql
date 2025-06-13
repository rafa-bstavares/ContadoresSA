/*
  Warnings:

  - Made the column `faturamento_mensal_medio` on table `empresas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "empresas" ALTER COLUMN "faturamento_mensal_medio" SET NOT NULL;
