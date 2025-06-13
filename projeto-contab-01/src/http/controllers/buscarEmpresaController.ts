import { FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod"
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";
import { BuscarEmpresaUseCase } from "../../use-cases/buscarEmpresaUseCase";
import { PrismaCnaesRepository } from "../../repositories/prisma/prisma-cnaes-repository";

export async function buscarEmpresaController(request: FastifyRequest, reply: FastifyReply){

    // retorna obj empresas com cnaes

    // validar body
    const bodySchema = z.object({
        cnpj: z.string().length(14)
    })

    const {cnpj} = bodySchema.parse(request.body)

        try{
            const empresaRepo = new PrismaEmpresaRepository
            const cnaeRepo = new PrismaCnaesRepository

            const buscarEmpresa = new BuscarEmpresaUseCase(empresaRepo, cnaeRepo)

            const empresa = await buscarEmpresa.execute({cnpj})

            console.log("resposta do use case para o controller: ")
            console.log(empresa)

            if(empresa){
                reply.status(200).send({success: true, data: empresa, error: null})
            }else{
                reply.status(404).send({success: false, data: null, error: {code: 404, message: "CNPJ não encontrado"}})
            }

        }catch(err){
            console.log(err)
            reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
        }





}