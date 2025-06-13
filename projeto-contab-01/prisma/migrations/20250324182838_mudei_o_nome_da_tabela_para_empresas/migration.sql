/*
  Warnings:

  - You are about to drop the `Empresa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_usuario_id_fkey";

-- DropTable
DROP TABLE "Empresa";

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "razao_social" TEXT,
    "uf" TEXT,
    "cnae_principal" TEXT,
    "cnae_secundario" TEXT,
    "descricao_atividade_principal" TEXT,
    "regularidade" BOOLEAN,
    "regime_tributario" "RegimeTributario" NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
