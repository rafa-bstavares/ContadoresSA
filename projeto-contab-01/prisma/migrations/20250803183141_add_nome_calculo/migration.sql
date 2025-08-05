/*
  Warnings:

  - Added the required column `nome_calculo` to the `calculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calculos" ADD COLUMN     "nome_calculo" TEXT NOT NULL;
