import { Empresa, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { EmpresasRepository } from "../empresas-repository";



export class PrismaEmpresaRepository implements EmpresasRepository {

    async criarEmpresa(data: Prisma.EmpresaUncheckedCreateInput){
        console.log("empresa criada")
        console.log(data)

        const empresa = await prisma.empresa.create({
            data
        })

        return empresa
    }

    // Verifica se a empresa está cadastrada no nosso banco de dados
    async buscarEmpresa(cnpj: string){
        const empresa = await prisma.empresa.findFirst({
            where: {
                cnpj
            }
        })

        return empresa
    }

    async buscarEmpresaPorEmpresaId(empresaId: string): Promise<Empresa | null> {
        const empresa = await prisma.empresa.findUnique({
            where:{
                id: empresaId
            }
        })
        return empresa
    }



    // Verifica se aquela empresa está cadastrada no nome do usuário que está mandando a requisição através do seu id
    async buscarEmpresaPorUsuarioId(usuario_id: string, cnpj: string){
        const empresa = prisma.empresa.findFirst({
            where: {
                cnpj,
                usuario_id
            }
        })

        return empresa
    }

    async buscarTodasEmpresasUsuario(usuario_id: string){
        const empresa = prisma.empresa.findMany({
            where: {
                usuario_id
            }
        })

        return empresa
    }

    async editarEmpresa(id_empresa: string, data: Prisma.EmpresaUpdateInput){

        try{
            const empresaEditada = await prisma.empresa.update({
                where: {
                    id: id_empresa
                },
                data
            })
            
            return [empresaEditada]
        }catch(err){
            console.log(err)

            return null
        }

    }

}