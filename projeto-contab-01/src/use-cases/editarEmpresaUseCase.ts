import { CnaesRepository } from "../repositories/cnaes-repository";
import { EmpresasRepository } from "../repositories/empresas-repository";
import { UsersRepository } from "../repositories/users-repository";
import { EdicaoImpossibilitadaErro } from "./errors/edicao-impossibilitada-recurso-existe";
import { UsuarioJaCadastrouEmpresa } from "./errors/usuario-ja-cadastrou-empresa";


interface editarEmpresaTipo {
        cnpj: string,
        folha: string,
        faturamento_mensal_medio: string,
        cnaes: string[],
        nome_fantasia?: string, 
        uf?: string,              
        regime_tributario: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO",
        id: string
}


export class EditarEmpresasUseCase {
    constructor(private UsersRepository: UsersRepository, private EmpresaRepository: EmpresasRepository, private CnaesRepository: CnaesRepository){}



    async execute(data: editarEmpresaTipo, usuario_id: string){
        console.log("Ta chegando no useCase de criar empresa")

        // Conferir se tem essa empresa nesse usuario_id
        const empresasUsuario = await this.EmpresaRepository.buscarTodasEmpresasUsuario(usuario_id)

        if(empresasUsuario){
            if(empresasUsuario.length > 0){
                const empresaAtualBd = empresasUsuario.filter(empresa => empresa.id == data.id)
                const outrasEmpresas = empresasUsuario.filter(empresa => empresa.id !== data.id)

                const nomeNovoJaExiste = outrasEmpresas.some(empresa => empresa.nome_fantasia == data.nome_fantasia)
                const cnpjNovoJaExiste = outrasEmpresas.some(empresa => empresa.cnpj == data.cnpj)

                if(nomeNovoJaExiste || cnpjNovoJaExiste){
                    throw new EdicaoImpossibilitadaErro()
                }else{
                    // pode editar
                    // se o cnpj mudar do antigo, tem que atualizar os cnaes
                    
                    const {cnaes, ...objSemCnaes} = data

                    const empresaCriada = await this.EmpresaRepository.editarEmpresa(data.id, objSemCnaes)

                    console.log("EDITAR EMPRESA RESPOSTA")
                    console.log(empresaCriada)
                    

                    // conferir se mudou o cnpj
                    if(data.cnpj !== empresaAtualBd[0].cnpj){
                        //apagar todos os cnaes da empresa antiga
                        const countApagarCnaes = await this.CnaesRepository.apagarCnaesEmpresa(data.id)

                        async function buscarCnaesApi(cnpj: string): Promise<string[]>{
                            //buscar CNAES na api e caso de certo habilitar os toggles
                            const novoArrCnaes: string[] = []
                            const res = await fetch(`https://open.cnpja.com/office/${cnpj}`)
                            const data = await res.json()

                            console.log("retorno api cnaes")
                            console.log(data)


                            //VERIFICANDO SE OS CNAES PRECISAM DE ZEROS À ESQUERDA
                            // CNAE principal
                            let cnaePrincipalStr = data.mainActivity.id.toString()

                            // conferir se tem 7 dígitos
                            if(cnaePrincipalStr.length < 7){
                                do{
                                    cnaePrincipalStr = "0" + cnaePrincipalStr
                                }while(cnaePrincipalStr.length < 7)
                            }
                            

                            novoArrCnaes.push(cnaePrincipalStr)

                            // CNAEs secundários
                            const arrCnaesSec = data.sideActivities
                            if(arrCnaesSec.length > 0){
                                arrCnaesSec.forEach((item: {id: number}) => {
                                    let cnaeAtualStr = item.id.toString()
                                    if(cnaeAtualStr.length < 7){
                                        do{
                                            cnaeAtualStr = "0" + cnaeAtualStr
                                        }while(cnaeAtualStr.length < 7)
                                    }

                                    novoArrCnaes.push(cnaeAtualStr)
                                })
                            }



                            return novoArrCnaes
                        }

                        const arrCnaesNovos = await buscarCnaesApi(data.cnpj)

                        const objCount = await this.CnaesRepository.criarCnaesEmpresa(data.id, arrCnaesNovos)


                    }
                }

                console.log("empresa antes de editar (dados antigos)")
                console.log(empresaAtualBd)

                return {success: true}

            }
        }

        //O throw vai parar o código, logo, caso siga pra cá é pq o usuário ainda não cadastrou a empresa

        return null
        
    }

}