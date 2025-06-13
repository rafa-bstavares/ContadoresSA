import { prisma } from "../lib/prisma"
import { Prisma } from "@prisma/client"
import { xmlExampleFunction } from "../xmlExampleFunction"
import { UsersRepository } from "../repositories/users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"


interface CreateUserBodyType {
    email: string,
    tipo_usuario: string,
    name: string,
    hash: string
}


export class CreateUserUseCase{
    constructor(private usersRepository: UsersRepository){}

    async execute(data: CreateUserBodyType){

        const temEmail = await this.usersRepository.findSameEmail(data.email)
    
        if(temEmail){
            throw new UserAlreadyExistsError()
        }
    
        //const prismaUserRepositorie = new PrismaUserRepositorie
        
        const usuarioCriado = await this.usersRepository.create(data)
        return usuarioCriado
    } 
}
