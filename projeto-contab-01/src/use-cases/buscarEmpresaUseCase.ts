import { Empresa } from "@prisma/client";
import { CnaesRepository } from "../repositories/cnaes-repository";
import { EmpresasRepository } from "../repositories/empresas-repository";
import { RecursoNaoEncontradoErro } from "./errors/recurso-nao-encontrado-erro";

interface BuscarEmpresaInput {
    cnpj: string
}

type EmpresaComCnaes = Empresa & {
    cnaes: string[]
}

export class BuscarEmpresaUseCase{

    constructor(private empresaRepo: EmpresasRepository, private cnaeRepo: CnaesRepository){}

    async execute(data: BuscarEmpresaInput){
        console.log("cnpj utilizado:" + data.cnpj)

        const empresa = await this.empresaRepo.buscarEmpresa(data.cnpj)

        console.log("resposta da busca pela empresa pelo cnpj")
        console.log(empresa)

        let cnaesEmpresaAtual = null

        if(empresa){
            cnaesEmpresaAtual = await this.cnaeRepo.buscarCnaesEmpresa(empresa.id);
            return {...empresa, cnaes: cnaesEmpresaAtual}
        }else{
            return null
        }


    }

}