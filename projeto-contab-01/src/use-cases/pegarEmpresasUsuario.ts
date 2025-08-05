import { Empresa, User } from "@prisma/client";
import { RecursoNaoEncontradoErro } from "./errors/recurso-nao-encontrado-erro";
import { EmpresasRepository } from "../repositories/empresas-repository";
import { CnaesRepository } from "../repositories/cnaes-repository";

interface AutenticacaoUsuarioRequest {
    userId: string,
}

type EmpresaComCnaes = Empresa & {
    cnaes: string[]
}

type AutenticacaoUsuarioResponse = EmpresaComCnaes[] 


export class pegarEmpresasUsuarioUseCase{

    constructor(
        private empresasRepository: EmpresasRepository,
        private cnaesRepository: CnaesRepository
    ){}

async execute({ userId }: AutenticacaoUsuarioRequest): Promise<AutenticacaoUsuarioResponse> {
  const empresas = await this.empresasRepository.buscarTodasEmpresasUsuario(userId);
  if (!empresas) throw new RecursoNaoEncontradoErro();

  const arrFinal: EmpresaComCnaes[] = await Promise.all(
    empresas.map(async (item) => {
      const cnaesEmpresaAtual = await this.cnaesRepository.buscarCnaesEmpresa(item.id);
      return { ...item, cnaes: cnaesEmpresaAtual };
    })
  );

  return arrFinal;
}

}