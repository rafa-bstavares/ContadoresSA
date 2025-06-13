import { FastifyRequest, FastifyReply } from "fastify"
import { pegarDadosUsuarioUseCase } from "../../use-cases/pegarDadosUsuario"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository"


export async function pegarDadosUsuarioController(request: FastifyRequest, reply: FastifyReply){

    const userRepo = new PrismaUserRepository

    const pegarDadosUsuario = new pegarDadosUsuarioUseCase(userRepo)

    const {user} = await pegarDadosUsuario.execute({
        userId: request.user.sub
    })


    return reply.status(200).send({success: true, data: {
        ...user,
        password_hash: undefined
    }, error: null})
}