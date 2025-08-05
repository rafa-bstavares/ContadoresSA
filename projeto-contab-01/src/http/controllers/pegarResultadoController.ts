import { FastifyRequest, FastifyReply } from "fastify";
import {z} from "zod"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository";
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";
import { CriarEmpresasUseCase } from "../../use-cases/criarEmpresasUseCase";
import { UsuarioJaCadastrouEmpresa } from "../../use-cases/errors/usuario-ja-cadastrou-empresa";
import { PrismaCnaesRepository } from "../../repositories/prisma/prisma-cnaes-repository";
import { PegarResultadoUseCase } from "../../use-cases/pegarResultadoUseCase";
import { PrismaRespostaGeralRepository } from "../../repositories/prisma/prisma-resposta-geral-repository";
import { PrismaRespostaCategoriasRepository } from "../../repositories/prisma/prisma-resposta-categorias-repository";
import { PrismaRespostaTabelasRepository } from "../../repositories/prisma/prisma-resposta-tabelas-repository";
import { AcessoNegadoErro } from "../../use-cases/errors/acesso-negado";

export async function pegarResultadoController(request: FastifyRequest, reply: FastifyReply) {

    const bodySchema = z.object({
        calculoId: z.string()
    })
    console.log("body do pegar resultado controller")
    console.log(request.body)

    const body = bodySchema.parse(request.body)

    console.log("BODY RECEBIDO PEGAR RESULTADO: ")
    console.log(body)

    let resultado

    try{
            
        
        const empresaRepo = new PrismaEmpresaRepository
        const respGeralRepo = new PrismaRespostaGeralRepository
        const respCategoriasRepo = new PrismaRespostaCategoriasRepository
        const respTabelasRepo = new PrismaRespostaTabelasRepository

        const usuarioId = request.user.sub

        const pegarResultado = new PegarResultadoUseCase(empresaRepo, respGeralRepo, respCategoriasRepo, respTabelasRepo)
        resultado = await pegarResultado.execute(body.calculoId, usuarioId)



    }catch(err){

        if(err instanceof UsuarioJaCadastrouEmpresa){
            return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }
        if(err instanceof AcessoNegadoErro){
             return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }
        console.log("ERRO")
        console.log(err)
        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }


    return reply.status(200).send({success: true, data: resultado, error: null})



} 