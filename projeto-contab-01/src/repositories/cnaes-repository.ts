import { Cnae, Prisma } from "@prisma/client"

export interface CnaesRepository {

    criarCnaesEmpresa(id_empresa: string, cnaes: string[]): Promise<{count: number}>

    buscarCnaesEmpresa(id_empresa: string): Promise<string[]>

    apagarCnaesEmpresa(id_empresa: string): Promise<{count: number}>

}