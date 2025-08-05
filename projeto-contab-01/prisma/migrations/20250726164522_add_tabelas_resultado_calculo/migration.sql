-- CreateEnum
CREATE TYPE "AnosType" AS ENUM ('A2026', 'A2027', 'A2028', 'A2029', 'A2030', 'A2031', 'A2032', 'A2033');

-- CreateEnum
CREATE TYPE "TipoUsuarioType" AS ENUM ('Empresa', 'Pessoa_Física');

-- CreateEnum
CREATE TYPE "RegimesType" AS ENUM ('simplesNacional', 'lucroPresumido', 'lucroReal');

-- CreateEnum
CREATE TYPE "CategoriaType" AS ENUM ('servicosPrestados', 'servicosTomados', 'locacaoBensMoveis', 'produtosVendidos', 'produtosAdquiridos', 'locacaoBensImoveis', 'compraVendaBensImoveis');

-- CreateEnum
CREATE TYPE "LinhasCaixaType" AS ENUM ('fornecedores', 'tributosCredito', 'clientes', 'tributosDebito', 'tributosRecolhidos', 'saldoCredor', 'resultado', 'irCs', 'resultadoPosIrCs', 'resultadoSobreClientes');

-- CreateEnum
CREATE TYPE "LinhasDreType" AS ENUM ('receitaBruta', 'deducoesTributos', 'custoGeral', 'lucroBruto', 'despesas', 'lucrosAntesIrCs', 'irCs', 'lucroLiquido');

-- CreateEnum
CREATE TYPE "LinhasTotalCompras" AS ENUM ('comprasProduto', 'servicosTomados', 'locacaoMoveis', 'locacaoImoveis', 'total');

-- CreateEnum
CREATE TYPE "LinhasTotalVendas" AS ENUM ('comprasProdutos', 'servicosTomados', 'locacaoMoveis', 'locacaoImoveis', 'total');

-- CreateTable
CREATE TABLE "calculos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo_usuario" "TipoUsuarioType" NOT NULL,

    CONSTRAINT "calculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculos_por_empresa" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,

    CONSTRAINT "calculos_por_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculos_por_cpf" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "calculos_por_cpf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regimes" (
    "id" TEXT NOT NULL,
    "regime" "RegimesType" NOT NULL,

    CONSTRAINT "regimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "categoria" "CategoriaType" NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antes_reforma_categorias" (
    "id" TEXT NOT NULL,
    "regime_id" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "valor_impostos" DECIMAL(18,2) NOT NULL,
    "valor_desonerado" DECIMAL(18,2) NOT NULL,
    "porcentagem_carga_tributaria" DECIMAL(5,4) NOT NULL,
    "custo" DECIMAL(18,2),

    CONSTRAINT "antes_reforma_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depois_reforma_categorias" (
    "id" TEXT NOT NULL,
    "antes_reforma_categoria_id" TEXT NOT NULL,
    "ano" "AnosType" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "valorSemIva" DECIMAL(18,2) NOT NULL,
    "valorImpostos" DECIMAL(18,2) NOT NULL,
    "porcentagemCargaTributaria" DECIMAL(5,4) NOT NULL,
    "custo" DECIMAL(18,2),

    CONSTRAINT "depois_reforma_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caixa_linhas" (
    "id" TEXT NOT NULL,
    "linha_caixa" "LinhasCaixaType" NOT NULL,

    CONSTRAINT "caixa_linhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antes_reforma_caixa" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "regime_id" TEXT NOT NULL,
    "linha_caixa_id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "antes_reforma_caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depois_reforma_caixa" (
    "id" TEXT NOT NULL,
    "antes_reforma_caixa_id" TEXT NOT NULL,
    "ano" "AnosType" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "depois_reforma_caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dre_linhas" (
    "id" TEXT NOT NULL,
    "linha_dre" "LinhasDreType" NOT NULL,

    CONSTRAINT "dre_linhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antes_reforma_dre" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "regime_id" TEXT NOT NULL,
    "linha_dre_id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "antes_reforma_dre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depois_reforma_dre" (
    "id" TEXT NOT NULL,
    "antes_reforma_dre_id" TEXT NOT NULL,
    "ano" "AnosType" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "depois_reforma_dre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras_linhas" (
    "id" TEXT NOT NULL,
    "linha_compras" "LinhasTotalCompras" NOT NULL,

    CONSTRAINT "compras_linhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antes_reforma_compras" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "regime_id" TEXT NOT NULL,
    "linha_compras_id" TEXT NOT NULL,
    "valor_ar" DECIMAL(18,2) NOT NULL,
    "impostos_ar" DECIMAL(18,2) NOT NULL,
    "valor_desonerado" DECIMAL(18,2) NOT NULL,
    "credito_ar" DECIMAL(18,2) NOT NULL,
    "custo_ar" DECIMAL(18,2) NOT NULL,
    "porcentagem_custo_efetivo_ar" DECIMAL(5,4) NOT NULL,
    "porcentagem_carga_tributaria_ar" DECIMAL(5,4) NOT NULL,

    CONSTRAINT "antes_reforma_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depois_reforma_compras" (
    "id" TEXT NOT NULL,
    "antes_reforma_compras_id" TEXT NOT NULL,
    "ano" "AnosType" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "valor_sem_iva" DECIMAL(18,2) NOT NULL,
    "impostos" DECIMAL(18,2) NOT NULL,
    "credito" DECIMAL(18,2) NOT NULL,
    "custo" DECIMAL(18,2) NOT NULL,
    "porcentagem_custo_efetivo" DECIMAL(5,4) NOT NULL,
    "porcentagem_carga_tributaria" DECIMAL(5,4) NOT NULL,

    CONSTRAINT "depois_reforma_compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendas_linhas" (
    "id" TEXT NOT NULL,
    "linha_vendas" "LinhasTotalVendas" NOT NULL,

    CONSTRAINT "vendas_linhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antes_reforma_vendas" (
    "id" TEXT NOT NULL,
    "calculo_id" TEXT NOT NULL,
    "regime_id" TEXT NOT NULL,
    "linha_vendas_id" TEXT NOT NULL,
    "valor_ar" DECIMAL(18,2) NOT NULL,
    "impostos_ar" DECIMAL(18,2) NOT NULL,
    "valor_desonerado" DECIMAL(18,2) NOT NULL,
    "porcentagem_carga_tributaria_ar" DECIMAL(5,4) NOT NULL,

    CONSTRAINT "antes_reforma_vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depois_reforma_vendas" (
    "id" TEXT NOT NULL,
    "antes_reforma_vendas_id" TEXT NOT NULL,
    "ano" "AnosType" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "valorSemIva" DECIMAL(18,2) NOT NULL,
    "impostos" DECIMAL(18,2) NOT NULL,
    "porcentagemCargaTributaria" DECIMAL(5,4) NOT NULL,

    CONSTRAINT "depois_reforma_vendas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calculos" ADD CONSTRAINT "calculos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculos_por_empresa" ADD CONSTRAINT "calculos_por_empresa_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculos_por_empresa" ADD CONSTRAINT "calculos_por_empresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculos_por_cpf" ADD CONSTRAINT "calculos_por_cpf_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_categorias" ADD CONSTRAINT "antes_reforma_categorias_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_categorias" ADD CONSTRAINT "antes_reforma_categorias_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_categorias" ADD CONSTRAINT "antes_reforma_categorias_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depois_reforma_categorias" ADD CONSTRAINT "depois_reforma_categorias_antes_reforma_categoria_id_fkey" FOREIGN KEY ("antes_reforma_categoria_id") REFERENCES "antes_reforma_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_caixa" ADD CONSTRAINT "antes_reforma_caixa_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_caixa" ADD CONSTRAINT "antes_reforma_caixa_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_caixa" ADD CONSTRAINT "antes_reforma_caixa_linha_caixa_id_fkey" FOREIGN KEY ("linha_caixa_id") REFERENCES "caixa_linhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depois_reforma_caixa" ADD CONSTRAINT "depois_reforma_caixa_antes_reforma_caixa_id_fkey" FOREIGN KEY ("antes_reforma_caixa_id") REFERENCES "antes_reforma_caixa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_dre" ADD CONSTRAINT "antes_reforma_dre_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_dre" ADD CONSTRAINT "antes_reforma_dre_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_dre" ADD CONSTRAINT "antes_reforma_dre_linha_dre_id_fkey" FOREIGN KEY ("linha_dre_id") REFERENCES "dre_linhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depois_reforma_dre" ADD CONSTRAINT "depois_reforma_dre_antes_reforma_dre_id_fkey" FOREIGN KEY ("antes_reforma_dre_id") REFERENCES "antes_reforma_dre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_compras" ADD CONSTRAINT "antes_reforma_compras_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_compras" ADD CONSTRAINT "antes_reforma_compras_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_compras" ADD CONSTRAINT "antes_reforma_compras_linha_compras_id_fkey" FOREIGN KEY ("linha_compras_id") REFERENCES "compras_linhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depois_reforma_compras" ADD CONSTRAINT "depois_reforma_compras_antes_reforma_compras_id_fkey" FOREIGN KEY ("antes_reforma_compras_id") REFERENCES "antes_reforma_compras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_vendas" ADD CONSTRAINT "antes_reforma_vendas_calculo_id_fkey" FOREIGN KEY ("calculo_id") REFERENCES "calculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_vendas" ADD CONSTRAINT "antes_reforma_vendas_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "regimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antes_reforma_vendas" ADD CONSTRAINT "antes_reforma_vendas_linha_vendas_id_fkey" FOREIGN KEY ("linha_vendas_id") REFERENCES "vendas_linhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depois_reforma_vendas" ADD CONSTRAINT "depois_reforma_vendas_antes_reforma_vendas_id_fkey" FOREIGN KEY ("antes_reforma_vendas_id") REFERENCES "antes_reforma_vendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
