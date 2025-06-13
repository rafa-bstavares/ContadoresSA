import { compare } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { CredencialInvalidaErro } from "./errors/credencial-invalida-erro";
import { User } from "@prisma/client";

interface AutenticacaoUsuarioRequest {
    email: string,
    senha: string
}

interface AutenticacaoUsuarioResponse {
    user: User
}


export class AutenticacaoUsuarioUseCase{

    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({
        email, senha
    }: AutenticacaoUsuarioRequest): Promise<AutenticacaoUsuarioResponse>{

        const user = await this.usersRepository.findSameEmail(email)

        if(!user){
            throw new CredencialInvalidaErro()
        }

        // O método compare espera como 1º parametro uma senha que não está como hash ainda para comparar com um 2º que já é hash
        const senhasBatem = await compare(senha, user.hash)

        if(!senhasBatem){
            throw new CredencialInvalidaErro()
        }

        return {
            user
        }

    } 

}