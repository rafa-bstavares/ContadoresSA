import { useContext, useEffect, useState } from "react"
import { baseUrl } from "../../App"
import { ContextoUsuario } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal"
import { CardEmpresa } from "../CardEmpresa/CardEmpresa"
import { ModalAcoesEmpresa } from "../ModalAcoesEmpresa/ModalAcoesEmpresa"
import { empresasType } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import lapisIcone from "../../assets/images/iconeLapis.svg"
import { ufTypes } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import { validarCnpj, verificarDigVerif } from "../PrimeiroPasso/PrimeiroPasso"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { buscarCnaesApi } from "../PrimeiroPasso/PrimeiroPasso"



export function MinhasEmpresas(){


    const [modalAberto, setModalAberto] = useState<boolean>(false)
    const [modo, setModo] = useState<"Adicionar" | "Editar">("Adicionar")
    const [valoresIniciais, setValoresIniciais] = useState<null | empresasType>(null)
    const [fnModalAtual, setFnModalAtual] = useState<() => ((cnpj: string, nome: string, uf: ufTypes, regime: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO", folha: number, faturamento_mensal_medio: number, idEmpresa: string) => void)>(() => cadastrarEmpresa)

    const {minhasEmpresas, setMinhasEmpresas} = useContext(ContextoUsuario)
    const {setTextoErro, setTemErro} = useContext(ContextoErro)


    useEffect(() => {
        
        async function buscarDadosMinhasEmpresas(){
            try{
                const resp = await fetch(baseUrl + "/minhasEmpresas", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}})
                const data = await resp.json()

                console.log("resposta minhas empresas meus dados")
                console.log(data)

                if(data.success){
                    const {id, id_usuario, minhasEmpresasResposta} = data.data

                    setMinhasEmpresas(minhasEmpresasResposta)
                    

                }


            }catch(err){

            }
        }

        buscarDadosMinhasEmpresas


    }, [])


    function abrirCadastrarEmpresa(){
        setModalAberto(true)
        setModo("Adicionar")
        setValoresIniciais(null)
        setFnModalAtual(() => cadastrarEmpresa)
    }

    function abrirEditarEmpresa(item: empresasType){
        setModalAberto(true)
        setModo("Editar")
        setValoresIniciais(item)
        setFnModalAtual(() => editarEmpresa)
    }


    async function cadastrarEmpresa(cnpj: string, nome: string, uf: ufTypes, regime: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO", folha: number, faturamento_mensal_medio: number){

        console.log("ta executando o cadastrar empresa modal")

        const objCnpjVerificado = validarCnpj(cnpj)

        if(objCnpjVerificado.valido){

            if(nome && uf && regime && folha && faturamento_mensal_medio){

                const arrCnaes = await buscarCnaesApi(cnpj)

                const body = {
                    cnpj: cnpj,
                    regime_tributario: regime,
                    nome_fantasia: nome,
                    cnae_principal: arrCnaes[0],
                    folha: folha.toString(),
                    faturamento_mensal_medio: faturamento_mensal_medio.toString(),
                    cnaes: arrCnaes,
                    uf

                }
                
                const resp = await fetch(baseUrl + "/criarEmpresa", {
                    method: "POST",
                    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })

                const data = await resp.json()

                console.log("RESPOSTA CRIAR EMPRESA MODAL")
                console.log(data)

                

            }else{
                setTemErro(true)
                setTextoErro("Nome, UF, Regime e Folha não podem estar vazios e devem conter valores válidos")
            }

        }else{
            setTemErro(true)
            setTextoErro("Cnpj inválido")
        }



    }

    async function editarEmpresa(cnpj: string, nome: string, uf: ufTypes, regime: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO", folha: number, faturamento_mensal_medio: number, idEmpresa: string ){
        // Verificar se o cnpj mudou, 
        // Se for válido, verificar se tem alguma empresa desse usuário com esse cnpj
        // Verificar se todos os inputs estão preenchidos
        // Verificar se alguma empresa desse usuário tem esse nome

        console.log(idEmpresa)


        console.log("ta executando o editar empresa modal")

        const objCnpjVerificado = validarCnpj(cnpj)

        console.log("resposta cnpj")
        console.log(objCnpjVerificado)

        if(objCnpjVerificado.valido){

            console.log("////////")
            console.log(uf)
            if(nome && uf && regime && folha && faturamento_mensal_medio){

                const arrCnaes = await buscarCnaesApi(cnpj)

                const body = {
                    cnpj: cnpj,
                    regime_tributario: regime,
                    nome_fantasia: nome,
                    cnae_principal: arrCnaes[0],
                    folha: folha.toString(),
                    faturamento_mensal_medio: faturamento_mensal_medio.toString(),
                    cnaes: arrCnaes,
                    id: idEmpresa

                }
                
                const resp = await fetch(baseUrl + "/editarEmpresa", {
                    method: "POST",
                    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })

                const data = await resp.json()

                console.log("RESPOSTA EDITAR EMPRESA MODAL")
                console.log(data)

                

            }else{
                setTemErro(true)
                setTextoErro("Nome, UF, Regime e Folha não podem estar vazios e devem conter valores válidos")
            }

        }else{
            setTemErro(true)
            setTextoErro("Cnpj inválido")
        }

    }



    return (
        <div className="w-full min-h-screen p-12">

            <div className="flex flex-col gap-16">
                <TitulosPagPrincipal alinhamento="start" texto="Empresas Cadastradas"/>
                <div>
                    <BotaoGeral onClickFn={abrirCadastrarEmpresa} principalBranco={true} text="Adicionar Empresa +" />
                </div>

                <div className="flex flex-col flex-wrapborder-solid border-white border-2 rounded-2xl overflow-hidden">
                    {
                        minhasEmpresas.map((item, index) => (
                            <>
                                {
                                    index == 0 &&
                                    <div className="grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center mb-2 p-8 font-bold bg-fundoPreto ">
                                        <div>Nome</div>
                                        <div>CNPJ</div>
                                        <div>Regime Tributário</div>
                                        <div>CNAEs</div>
                                        <div>Folha</div>
                                        <div>Razão Social</div>
                                        <div>Regularidade</div>
                                        <div>UF</div>
                                        <div onClick={() => {}} className="bg-white opacity-0 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                            <img className="w-3 h-3" src={lapisIcone} alt="editar" />
                                        </div>
                                    </div>
                                }
            
                                <div className={`grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center rounded-2xl p-6 ${index % 2 == 0? "" : "bg-fundoPreto"}`}>
                                    <div>{item.nome_fantasia}</div>
                                    <div>{item.cnpj}</div>
                                    <div>{item.regime_tributario}</div>
                                    <div>{item.cnaes[0]}</div>
                                    <div>{"R$ " + Number(item.folha).toLocaleString("pt-br")}</div>
                                    <div>{item.razao_social}</div>
                                    <div>{item.regularidade}</div>
                                    <div>{item.uf}</div>
                                    <div onClick={() => {abrirEditarEmpresa(item)}} className="bg-white p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                        <img className="w-3 h-3" src={lapisIcone} alt="editar" />
                                    </div>
                                </div>
                            </>
                        ))
                    }  
                </div>
            </div>

            
            {
                modalAberto &&
                <ModalAcoesEmpresa setModalAberto={setModalAberto} modo={modo} textoBotao={`${modo == "Adicionar" ? "Adicionar" : "Salvar"}`} valoresIniciais={valoresIniciais} fnFinal={fnModalAtual} />
            }   


        </div>
    )
}