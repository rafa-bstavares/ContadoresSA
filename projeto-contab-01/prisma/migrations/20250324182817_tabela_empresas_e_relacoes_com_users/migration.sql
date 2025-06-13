-- CreateEnum
CREATE TYPE "RegimeTributario" AS ENUM ('Simples Nacional', 'Lucro Real', 'Lucro Presumido');

-- CreateTable
CREATE TABLE "Empresa" (
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

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
