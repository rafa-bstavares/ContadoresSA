import { Prisma, User } from "@prisma/client"

export interface UsersRepository {
    create(data: Prisma.UserCreateInput): Promise<User>

    findSameEmail(email: string): Promise<User | null>

    findByCpf(cpf: string): Promise<User | null>

    findById(userId: string): Promise<User | null>

}