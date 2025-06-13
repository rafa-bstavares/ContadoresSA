import { Cnae } from "@prisma/client";
import { CnaesRepository } from "../cnaes-repository";
import { prisma } from "../../lib/prisma";


export class PrismaCnaesRepository implements CnaesRepository {

    async criarCnaesEmpresa(id_empresa: string, cnaes: string[]): Promise<{count: number}> {

        console.log(cnaes)

        const data = cnaes.map((item) => ({
            empresa_id: id_empresa,
            cnae: item
        }))
        
        const objCount = await prisma.cnae.createMany({
            data
        })

        return objCount

    }

    async buscarCnaesEmpresa(id_empresa: string): Promise<string[]> {
        
        const linhasCnaes = await prisma.cnae.findMany({
            where: {
                empresa_id: id_empresa
            }
        })

        const cnaes = linhasCnaes.map(item => item.cnae)

        return cnaes

    }

    async apagarCnaesEmpresa(id_empresa: string): Promise<{ count: number; }> {
        
        const countObj = await prisma.cnae.deleteMany({
            where: {
                empresa_id: id_empresa
            }
        })

        return countObj

    }

}