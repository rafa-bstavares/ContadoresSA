/*
  Warnings:

  - The values [comprasProduto] on the enum `LinhasTotalCompras` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LinhasTotalCompras_new" AS ENUM ('comprasProdutos', 'servicosTomados', 'locacaoMoveis', 'locacaoImoveis', 'total');
ALTER TABLE "compras_linhas" ALTER COLUMN "linha_compras" TYPE "LinhasTotalCompras_new" USING ("linha_compras"::text::"LinhasTotalCompras_new");
ALTER TYPE "LinhasTotalCompras" RENAME TO "LinhasTotalCompras_old";
ALTER TYPE "LinhasTotalCompras_new" RENAME TO "LinhasTotalCompras";
DROP TYPE "LinhasTotalCompras_old";
COMMIT;
