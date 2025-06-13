import { Empresa, Prisma } from "@prisma/client"

export interface EmpresasRepository {

    criarEmpresa(data: Prisma.EmpresaUncheckedCreateInput): Promise<Empresa>

    buscarEmpresa(cnpj: string): Promise<Empresa | null>

    buscarEmpresaPorUsuarioId(usuario_id: string, cnpj: string): Promise<Empresa | null>

    buscarTodasEmpresasUsuario(usuario_id: string): Promise<Empresa[] | null>

    editarEmpresa(usuario_id: string, data: Prisma.EmpresaUpdateInput): Promise<Empresa[] | null>

}