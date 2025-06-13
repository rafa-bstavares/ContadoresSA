import {z} from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { CreateUserUseCase } from "../../use-cases/createUserUseCase"
import { hash } from "bcryptjs"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "../../use-cases/errors/user-already-exists-error"
import { AutenticacaoUsuarioUseCase } from "../../use-cases/AutenticacaoUsuarioUseCase"
import { CredencialInvalidaErro } from "../../use-cases/errors/credencial-invalida-erro"


export async function autenticarUsuarioController(request: FastifyRequest, reply: FastifyReply){

    type UsuarioCriadoType = {
        name: string;
        id: string;
        hash: string;
        email: string;
        tipo_usuario: string;
        data_cadastro: Date;
        cpf: string | null
    } | null

    const bodySchema = z.object({   
        email: z.string().email(),
        senha: z.string(),
    })

    let usuarioAutenticado: UsuarioCriadoType = null

    const {email, senha} = bodySchema.parse(request.body)

    try{

        const userRepo = new PrismaUserRepository

        const autenticarUsuario = new AutenticacaoUsuarioUseCase(userRepo)

        const {user} = (await autenticarUsuario.execute({email, senha}))

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }
        })

        usuarioAutenticado = user

        return reply.status(200).send({success: true, data: null, error: null, token})

    }catch(err){
        if (err instanceof CredencialInvalidaErro){
            return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }

        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})

    }



}