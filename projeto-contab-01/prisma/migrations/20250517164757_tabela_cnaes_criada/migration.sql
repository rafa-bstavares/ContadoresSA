-- CreateTable
CREATE TABLE "cnaes" (
    "id" TEXT NOT NULL,
    "cnae" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,

    CONSTRAINT "cnaes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cnaes" ADD CONSTRAINT "cnaes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
