/*
  Warnings:

  - A unique constraint covering the columns `[linha_caixa]` on the table `caixa_linhas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoria]` on the table `categorias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linha_compras]` on the table `compras_linhas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linha_dre]` on the table `dre_linhas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regime]` on the table `regimes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linha_vendas]` on the table `vendas_linhas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "caixa_linhas_linha_caixa_key" ON "caixa_linhas"("linha_caixa");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_categoria_key" ON "categorias"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "compras_linhas_linha_compras_key" ON "compras_linhas"("linha_compras");

-- CreateIndex
CREATE UNIQUE INDEX "dre_linhas_linha_dre_key" ON "dre_linhas"("linha_dre");

-- CreateIndex
CREATE UNIQUE INDEX "regimes_regime_key" ON "regimes"("regime");

-- CreateIndex
CREATE UNIQUE INDEX "vendas_linhas_linha_vendas_key" ON "vendas_linhas"("linha_vendas");
