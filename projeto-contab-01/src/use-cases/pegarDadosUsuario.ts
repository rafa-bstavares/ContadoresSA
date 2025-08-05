import { compare } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { CredencialInvalidaErro } from "./errors/credencial-invalida-erro";
import { User } from "@prisma/client";
import { RecursoNaoEncontradoErro } from "./errors/recurso-nao-encontrado-erro";

interface AutenticacaoUsuarioRequest {
    userId: string,
}

interface AutenticacaoUsuarioResponse {
    user: User
}


export class pegarDadosUsuarioUseCase{

    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({
        userId
    }: AutenticacaoUsuarioRequest): Promise<AutenticacaoUsuarioResponse>{

        const user = await this.usersRepository.findById(userId)

        if(!user){
            throw new RecursoNaoEncontradoErro()
        }

        return {
            user
        }

    } 

}