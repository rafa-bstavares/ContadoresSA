import { prisma } from "../../lib/prisma"
import { Prisma, User } from "@prisma/client"
import { UsersRepository } from "../users-repository"

export class PrismaUserRepository implements UsersRepository {

    async create(data: Prisma.UserCreateInput){
        const user = await prisma.user.create({
            data
        })

        return user
    }

    async findSameEmail(email: string){ 
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        }) 

        return user
    }

    async findByCpf(cpf: string){
        const user = await prisma.user.findUnique({
            where: {
                cpf
            }
        }) 

        return user
    }


    async findById(userId: string){
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return user

    }


    

}