import { FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository";
import { BuscarUserCpfUseCase } from "../../use-cases/buscarUserCpfUseCase";

export async function buscarUserCpfController(request: FastifyRequest, reply: FastifyReply){

    // validar body
    const bodySchema = z.object({
        cpf: z.string().length(11)
    })

    const {cpf} = bodySchema.parse(request.body)

        try{
            const userRepo = new PrismaUserRepository

            const buscarEmpresa = new BuscarUserCpfUseCase(userRepo)

            const empresa = await buscarEmpresa.execute({cpf})

            if(empresa){
                reply.status(200).send({success: true, data: empresa, error: null})
            }else{
                reply.status(404).send({success: false, data: null, error: {code: 404, message: "CPF não encontrado"}})
            }

        }catch(err){
            reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
        }





}