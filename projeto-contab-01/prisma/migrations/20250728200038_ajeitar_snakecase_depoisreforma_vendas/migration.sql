/*
  Warnings:

  - You are about to drop the column `porcentagemCargaTributaria` on the `depois_reforma_vendas` table. All the data in the column will be lost.
  - You are about to drop the column `valorSemIva` on the `depois_reforma_vendas` table. All the data in the column will be lost.
  - Added the required column `porcentagem_carga_tributaria` to the `depois_reforma_vendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_sem_iva` to the `depois_reforma_vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "depois_reforma_vendas" DROP COLUMN "porcentagemCargaTributaria",
DROP COLUMN "valorSemIva",
ADD COLUMN     "porcentagem_carga_tributaria" DECIMAL(5,4) NOT NULL,
ADD COLUMN     "valor_sem_iva" DECIMAL(18,2) NOT NULL;
