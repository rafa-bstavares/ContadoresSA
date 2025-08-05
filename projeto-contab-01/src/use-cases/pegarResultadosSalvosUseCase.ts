import { compare } from "bcryptjs";
import { UsersRepository } from "../repositories/users-repository";
import { CredencialInvalidaErro } from "./errors/credencial-invalida-erro";
import { User } from "@prisma/client";
import { RespostaGeralRepository } from "../repositories/resposta-geral-repository";
import { ErroConexaoBanco } from "./errors/erro-conexao-banco";



export class PegarResultadosSalvosUseCase{

    constructor(
        private RespGeralRepository: RespostaGeralRepository
    ){}

    async execute({
        usuarioId
    }: {usuarioId: string}){

        const respGeralRepo = this.RespGeralRepository
        let resultadosSalvosUsuario = []

        try {
            resultadosSalvosUsuario = await respGeralRepo.pegarResultadosSalvosUsuario(usuarioId)
        }catch(err){
            throw new ErroConexaoBanco()
        }

        return resultadosSalvosUsuario

    } 

}