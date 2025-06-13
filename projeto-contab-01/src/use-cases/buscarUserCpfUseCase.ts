import { UsersRepository } from "../repositories/users-repository" 

interface BuscarUserCpfInput {
    cpf: string
}

export class BuscarUserCpfUseCase{

    constructor(private userRepo: UsersRepository){}

    async execute(data: BuscarUserCpfInput){
        const user = await this.userRepo.findByCpf(data.cpf)
        if(user){
            return user
        }else{
            // não achou usuario com esse cpf
            

        }

        return user
    }

}