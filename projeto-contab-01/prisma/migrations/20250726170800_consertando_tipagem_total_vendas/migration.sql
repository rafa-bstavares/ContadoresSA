/*
  Warnings:

  - The values [comprasProdutos,servicosTomados] on the enum `LinhasTotalVendas` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LinhasTotalVendas_new" AS ENUM ('vendasProdutos', 'servicosPrestados', 'locacaoMoveis', 'locacaoImoveis', 'total');
ALTER TABLE "vendas_linhas" ALTER COLUMN "linha_vendas" TYPE "LinhasTotalVendas_new" USING ("linha_vendas"::text::"LinhasTotalVendas_new");
ALTER TYPE "LinhasTotalVendas" RENAME TO "LinhasTotalVendas_old";
ALTER TYPE "LinhasTotalVendas_new" RENAME TO "LinhasTotalVendas";
DROP TYPE "LinhasTotalVendas_old";
COMMIT;
