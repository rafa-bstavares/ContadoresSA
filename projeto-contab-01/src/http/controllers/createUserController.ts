import {z} from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { CreateUserUseCase } from "../../use-cases/createUserUseCase"
import { hash } from "bcryptjs"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository"
import { UserAlreadyExistsError } from "../../use-cases/errors/user-already-exists-error"


export async function createUserController(request: FastifyRequest, reply: FastifyReply){

    type UsuarioCriadoType = {
        name: string;
        id: string;
        hash: string;
        email: string;
        tipo_usuario: string;
        data_cadastro: Date;
    } | null

    const bodySchema = z.object({   
        email: z.string().email(),
        password: z.string(),
        tipo_usuario: z.enum(["empresário", "contador"]),
        name: z.string()
    })

    let usuarioCriado: UsuarioCriadoType = null

    const {email, password, tipo_usuario, name} = bodySchema.parse(request.body)

    const password_hash = await hash(password, 6)

    try{

        const userRepo = new PrismaUserRepository

        const createUser = new CreateUserUseCase(userRepo)

        usuarioCriado = await createUser.execute({email, hash: password_hash, name, tipo_usuario})
    }catch(err){
        if (err instanceof UserAlreadyExistsError){
            return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }

        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})

    }


    return reply.status(201).send({success: true, data: usuarioCriado, error: null})
}