import { CnaesRepository } from "../repositories/cnaes-repository";
import { EmpresasRepository } from "../repositories/empresas-repository";
import { UsersRepository } from "../repositories/users-repository";
import { UsuarioJaCadastrouEmpresa } from "./errors/usuario-ja-cadastrou-empresa";


interface criarEmpresaTipo {
    cnpj: string,
    nome_fantasia?: string,
    razao_social?: string,
    folha: string,
    faturamento_mensal_medio: string,
    uf?: string,    
    cnaes: string[],         
    cnae_principal?: string, 
    cnae_secundario?: string, 
    descricao_atividade_principal?: string, 
    regularidade?: boolean, 
    regime_tributario: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO" //Tenho esse "problema", no bd ele tá considerando dessa forma
}


export class CriarEmpresasUseCase {
    constructor(private UsersRepository: UsersRepository, private EmpresaRepository: EmpresasRepository, private CnaesRepository: CnaesRepository){}



    async execute(data: criarEmpresaTipo, usuario_id: string){
        console.log("Ta chegando no useCase de criar empresa")

        // Conferir se tem essa empresa nesse usuario_id
        const empresasUsuario = await this.EmpresaRepository.buscarTodasEmpresasUsuario(usuario_id)

        if(empresasUsuario){
            if(empresasUsuario.length > 0){
                const cnpjExiste = empresasUsuario.some(empresa => empresa.cnpj == data.cnpj)
                const nomeExiste = empresasUsuario.some(empresa => empresa.nome_fantasia == data.nome_fantasia)

                if(cnpjExiste || nomeExiste){
                    // Esse usuário já cadastrou essa empresa
                    console.log("Ta caindo no empresa ja cadastrada")
                    throw new UsuarioJaCadastrouEmpresa()
                }
            }
        }

        //O throw vai parar o código, logo, caso siga pra cá é pq o usuário ainda não cadastrou a empresa
        const {cnaes, ...objSemCnaes} = data

        const empresaCriada = await this.EmpresaRepository.criarEmpresa({usuario_id, ...objSemCnaes})

        const id_empresa = empresaCriada.id

        const objCount = await this.CnaesRepository.criarCnaesEmpresa(id_empresa, cnaes)


        if(empresaCriada){
            console.log("empresa criada")
            console.log(empresaCriada)
            return empresaCriada
        }else{
            console.log("empresa n foi criada")
            return null
        }
        
    }

}