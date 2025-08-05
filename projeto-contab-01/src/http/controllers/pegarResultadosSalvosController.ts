

import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaRespostaGeralRepository } from "../../repositories/prisma/prisma-resposta-geral-repository";
import { PegarResultadosSalvosUseCase } from "../../use-cases/pegarResultadosSalvosUseCase";

export async function pegarResultadosSalvosController(request: FastifyRequest, reply: FastifyReply){

    let resultadosSalvosUsuario

    try {
        const usuario_id = request.user.sub
        const respGeralRepo = new PrismaRespostaGeralRepository
        const pegarResultadosSalvos = new PegarResultadosSalvosUseCase(respGeralRepo)
        resultadosSalvosUsuario = await pegarResultadosSalvos.execute({usuarioId: usuario_id})

    }catch(err){
        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }

    return reply.status(201).send({success: true, data: resultadosSalvosUsuario, error: null})
}