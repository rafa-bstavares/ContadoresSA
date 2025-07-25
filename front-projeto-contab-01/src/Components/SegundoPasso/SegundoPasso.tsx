import {DropDownInput} from '../DropDownInput/DropDownInput'
import {Comp2} from '../Comp2.tsx/Comp2'
import ServicoInput from '../ServicoPrestadoInput/ServicoPrestadoInput'
import Locacao from "../Locacao/Locacao"
import CompraEVendaImoveis from "../CompraEVendaImoveis/CompraEVendaImoveis"
import Servicos from '../Servicos/Servicos'
import { useState, useContext, useEffect } from 'react'
import { BotaoGeral } from '../BotaoGeral/BotaoGeral'
import { baseUrl } from '../../App'
import { ContextoParametrosOpcionais, objAreas } from '../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais'
import { ContextoErro } from '../../Contextos/ContextoErro/ContextoErro'
import Imoveis from '../Imoveis/Imoveis'
import { ContextoImoveis, ImoveisCompraVendaObj, ImoveisLocacaoObj } from '../../Contextos/ContextoImoveis/ContextoImoveis'
import { ContextoGeral } from '../../Contextos/ContextoGeral/ContextoGeral'
import ServicoPrestadoInput from "../ServicoPrestadoInput/ServicoPrestadoInput";
import { ServicoAdquiridoInput } from "../ServicoAdquiridoInput/ServicoAdquiridoInput";
import Locacao2 from '../Locacao2/Locacao2'
import Locacao3 from '../Locacao3/Locacao3'
import SetaNao from "../../Components/SetaNao/SetaNao"
import { Incorporacao } from '../Incorporacao/Incorporacao';
import BensMoveisBotao from '../BensMoveisBotao/BensMoveisBotao';
import LocacaoMoveis from '../LocacaoMoveis/LocacaoMoveis';
import { ContextoMoveis, MoveisLocacaoObj } from '../../Contextos/ContextoMoveis/ContextoMoveis';
import ProdutosBotao from '../ProdutosBotao/ProdutosBotao'
import { ProdutosVendidosInput } from '../ProdutosVendidosInput/ProdutosVendidosInput'
import { ProdutosAdquiridosInput } from '../ProdutosAdquiridosInput/ProdutosAdquiridosInput'
import { impostosParametrosFinalType, ContextoProduto, ProdutoAdquiridoObj, ProdutoVendidoObj } from '../../Contextos/ContextoProduto/ContextoProduto'
import { ModalPerguntaBeneficios } from '../ModalPerguntaBeneficios/ModalPerguntaBeneficios'
import { ModalConferirBeneficios } from '../ModalConferirBeneficios/ModalConferirBeneficios'
import { ContextoResultadoSimulador, objRespostaFinalType } from '../../Contextos/ContextoResultadoSimulador/ContextoResultadoSimulador'
import { useNavigate } from 'react-router-dom'


type ObjInfosType = {
    cnae: string,
    descricao: string,
    anexo: string,
    aliquota: string | number,
}

export type objAtividadeFinal = {
    atividade: string,
    faturamentoMensal: number,
    id: number,
    cnaePrincipal: string,
    beneficio: number,
    anexo: string,
    prestacao: boolean,
    manterBeneficio: boolean

}

export type metodosType = "Por Operação" | "Por CNPJ"

export type objAtividadesAdquitidasType = {
    cpfOuCnpj: string,
    faturamento: number,
    id: number,
    regimeTributario: "Simples Nacional" | "Lucro Real" | "Lucro Presumido",
    cnaePrincipal: string,
    temCreditoPisCofins: boolean,
    metodo: metodosType,
    beneficio: number,
    compoeCusto: boolean,
    operacao: string,
    manterBeneficio: boolean
}

export type objIsCheckedType = {
    isCheckedServicos: boolean,
    isCheckedImoveis: boolean,
    isCheckedMoveis: boolean,
    isCheckedProdutos: boolean
}

type tabelaParametrosEntradaFinalType = {
    industrial: impostosParametrosFinalType,
    servicos: impostosParametrosFinalType,
    comercial: impostosParametrosFinalType,
    locacao: impostosParametrosFinalType
}

export type parametrosBodyCalcularType = {
    aliquotaIbs: number,
    aliquotaCbs: number,
    aliquotaIva: number,
    tabelaSimplesNacional: tabelaParametrosEntradaFinalType,
    tabelaLucroReal: tabelaParametrosEntradaFinalType,
    tabelaLucroPresumido: tabelaParametrosEntradaFinalType,
}

type bodyEmpresa = {
    tipoInput: "Empresa",
    cnpj: string,
    folha: string,
    meuRegime: "Simples Nacional" | "Lucro Real" | "Lucro Presumido",
    totalAtividadesPrestadas: objAtividadeFinal[],
    parametrosEntrada: parametrosBodyCalcularType,
    totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
    totalImoveisLocacao: ImoveisLocacaoObj[],
    totalImoveisCompraVenda: ImoveisCompraVendaObj[],
    totalMoveisLocacao: MoveisLocacaoObj[],
    totalProdutosVendidos: ProdutoVendidoObj[],
    totalProdutosAdquiridos: ProdutoAdquiridoObj[],
}

type bodyPessoa = {
    tipoInput: "Pessoa Física",
    cpf: string,
    totalMoveisLocacao: MoveisLocacaoObj[],
    totalImoveisLocacao: ImoveisLocacaoObj[],
}

type bodyCalcular = bodyEmpresa | bodyPessoa

type beneficiosBodySchema = {
    beneficiosPorCnae: {
        totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
        totalAtividadesPrestadas: objAtividadeFinal[]
    },
    beneficiosPorNcm: {
        totalProdutosVendidos: ProdutoVendidoObj[],
        totalProdutosAdquiridos: ProdutoAdquiridoObj[]
    }
}

type Props = {
    modoBranco: boolean
}

type respostaApiType = { 
    success: true
    data: objRespostaFinalType
    error: any
} | {
    success: false
    data: null
    error: any
};
const arrVazio: string[] = []

export function SegundoPasso({modoBranco}: Props){
    const [arrInfosEmpresa, setArrInfosEmpresa] = useState<ObjInfosType[]>([])
    const [totalAtividadesPrestadas, setTotalAtividadesPrestadas] = useState<objAtividadeFinal[]>([])
    const [totalAtividadesAdquiridas, setTotalAtividadesAdquiridas] = useState<objAtividadesAdquitidasType[]>([])
    const [modalPerguntaBeneficiosAberto, setModalPerguntaBeneficiosAberto] = useState<boolean>(false)
    const [modalBeneficiosAberto, setModalBeneficiosAberto] = useState<boolean>(false)
    const [objIsChecked, setObjIsChecked] = useState<objIsCheckedType>({
        isCheckedImoveis: false,
        isCheckedServicos: false,
        isCheckedMoveis: false,
        isCheckedProdutos: false
    })

    const {setObjResultado} = useContext(ContextoResultadoSimulador)
    const {setTemErro, setTextoErro} = useContext(ContextoErro)
    const {
        aliquotasIva,
        tabelaSimplesNacional,
        tabelaLucroReal,
        tabelaLucroPresumido
    } = useContext(ContextoParametrosOpcionais)

    const {totalImoveisLocacao, totalImoveisCompraVenda} = useContext(ContextoImoveis)
    const {totalMoveisLocacao} = useContext(ContextoMoveis)
    const {totalProdutosAdquiridos, totalProdutosVendidos, setTotalProdutosAdquiridos, setTotalProdutosVendidos} = useContext(ContextoProduto)
    const {objMinhaEmpresaOuPessoaAtual, passo2} = useContext(ContextoGeral)

    const navigate = useNavigate()



    async function conferirBeneficios(){

        if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){

            if(objMinhaEmpresaOuPessoaAtual.cnpj && objMinhaEmpresaOuPessoaAtual.folha ){ // && (arrInfosEmpresa.length > 0)


                const ibs = Number(aliquotasIva.ibs.replace(",", "*").replace(".", ",").replace("*", "."))
                const cbs = Number(aliquotasIva.cbs.replace(",", "*").replace(".", ",").replace("*", "."))

                if(ibs && cbs){
                    const body: beneficiosBodySchema = {
                            beneficiosPorCnae: {
                                totalAtividadesAdquiridas,
                                totalAtividadesPrestadas
                            },
                            beneficiosPorNcm: {
                                totalProdutosAdquiridos,
                                totalProdutosVendidos
                            }
                        }

                        console.log("BODY encontrar benmeficios")
                        console.log(body)

                    fetch(baseUrl + "/encontrarBeneficios", {
                        method: "POST",
                        headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                        body: JSON.stringify(body)
                    }).then(res => res.json()).then(data => {
                        console.log("Retorno da rota encontrar benefícios")
                        console.log(data)

                        if(data.data){
                            // setando quem tem NCM
                            setTotalProdutosAdquiridos(data.data.beneficiosPorNcm.totalProdutosAdquiridos)
                            setTotalProdutosVendidos(data.data.beneficiosPorNcm.totalProdutosVendidos)

                            // setando quem tem CNAE
                            setTotalAtividadesAdquiridas(data.data.beneficiosPorCnae.totalAtividadesAdquiridas)
                            setTotalAtividadesPrestadas(data.data.beneficiosPorCnae.totalAtividadesPrestadas)

                            // Mostrar modal para conferir ou não benefícios
                            setModalPerguntaBeneficiosAberto(true)

                        }else{
                            setTemErro(true)
                            setTextoErro("Ocorreu um erro ao tentar buscar os benefícios, por favor, tente novamente.")
                        }

                    })

        
                    /*
                    fetch(baseUrl + "/calcularDiagnosticoSimplificado", {
                        method: "POST",
                        headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                        body: JSON.stringify({
                            cpfOuCnpj: objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf,
                            folha: objMinhaEmpresaOuPessoaAtual.folha.toString(),
                            meuRegime: objMinhaEmpresaOuPessoaAtual.meuRegime,
                            totalAtividadesPrestadas,
                            totalAtividadesAdquiridas,
                            parametrosEntrada,
                            totalImoveisLocacao,
                            totalImoveisCompraVenda,
                            totalMoveisLocacao,
                            totalProdutosVendidos,
                            totalProdutosAdquiridos
                        })
                    }).then(res => res.json()).then(data => {
                        console.log(data)
                    })
                    */

                }else{
                    console.log("mande um numero valido")
                    setTemErro(true)
                    setTextoErro("Parâmetros de entrada inválidos (Configurações -> Parâmetros de entrada)")
                }


            }else{
                console.log("Para enviar, todos os campos precisam estar preenchidos e você deve ter inserido pelo menos uma atividade com seu valor de faturamento mensal")
            }
        }else{
            enviarInfosAtividades()
        }

    }




    function converterParametrosOpcionais(obj: objAreas): tabelaParametrosEntradaFinalType{
        const novoObj: tabelaParametrosEntradaFinalType = {
            industrial: {icms: null, ipi: null, iss: null, pisCo: null},
            comercial: {icms: null, ipi: null, iss: null, pisCo: null},
            servicos: {icms: null, ipi: null, iss: null, pisCo: null},
            locacao: {icms: null, ipi: null, iss: null, pisCo: null}
        }

        for (const [area, aliquotas] of Object.entries(obj)) {

            for (const [imposto, valor] of Object.entries(aliquotas)) {
                if(valor !== null){
                    novoObj[area as keyof tabelaParametrosEntradaFinalType][imposto as keyof impostosParametrosFinalType] = parseFloat(valor.replace(",", "*").replace(".", ",").replace("*", "."))
                }
            }
        }

        return novoObj
    }


    async function enviarInfosAtividades(){


        const ibs = Number(aliquotasIva.ibs.replace(",", "*").replace(".", ",").replace("*", "."))
        const cbs = Number(aliquotasIva.cbs.replace(",", "*").replace(".", ",").replace("*", "."))
        
        // No front end é melhor tratarmos como string, mas no back ele espera receber number, por isso temos que fazer:
        const tabelaSimplesNacionalTradada = converterParametrosOpcionais(tabelaSimplesNacional)
        const tabelaLucroRealTradada = converterParametrosOpcionais(tabelaLucroReal)
        const tabelaLucroPresumidoTradada = converterParametrosOpcionais(tabelaLucroPresumido)
        
        const parametrosEntrada = {
            aliquotaIbs: ibs,
            aliquotaCbs: cbs,
            aliquotaIva: ibs + cbs,
            tabelaSimplesNacional: tabelaSimplesNacionalTradada,
            tabelaLucroReal: tabelaLucroRealTradada,
            tabelaLucroPresumido: tabelaLucroPresumidoTradada,
        }

        if(ibs && cbs){

            if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
                if(objMinhaEmpresaOuPessoaAtual.cnpj && objMinhaEmpresaOuPessoaAtual.folha ){ // && (arrInfosEmpresa.length > 0)       
                    
                    fetch(baseUrl + "/calcularDiagnosticoSimplificado", {
                        method: "POST",
                        headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                        body: JSON.stringify({
                            tipoUsuario: "Empresa",
                            cnpj: objMinhaEmpresaOuPessoaAtual.cnpj,
                            folha: objMinhaEmpresaOuPessoaAtual.folha.toString(),
                            meuRegime: objMinhaEmpresaOuPessoaAtual.meuRegime,
                            totalAtividadesPrestadas,
                            totalAtividadesAdquiridas,
                            parametrosEntrada,
                            totalImoveisLocacao,
                            totalImoveisCompraVenda,
                            totalMoveisLocacao,
                            totalProdutosVendidos,
                            totalProdutosAdquiridos
                        })
                    }).then(res => res.json()).then((data: respostaApiType) => {
                        console.log("retorno do calcular simplificado")
                        console.log(data)
                        if(data.success){
                            setObjResultado(data.data)
                            navigate("/Perfil/Resultado")
                        }
                    })
                        

                }else{
                    console.log("Para enviar, todos os campos precisam estar preenchidos e você deve ter inserido pelo menos uma atividade com seu valor de faturamento mensal")
                }
            }else{
                if(objMinhaEmpresaOuPessoaAtual.cpf ){ // && (arrInfosEmpresa.length > 0)       
                    
                    fetch(baseUrl + "/calcularDiagnosticoSimplificado", {
                        method: "POST",
                        headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                        body: JSON.stringify({
                            tipoUsuario: "Pessoa Física",
                            cpf: objMinhaEmpresaOuPessoaAtual.cpf,
                            parametrosEntrada,
                            totalImoveisLocacao,
                            totalMoveisLocacao,
                        })
                    }).then(res => res.json()).then((data: respostaApiType) => {
                        console.log("retorno do calcular simplificado")
                        console.log(data)
                        if(data.success){
                            setObjResultado(data.data)
                            navigate("/Perfil/Resultado")
                        }
                    })
                        

                }else{
                    console.log("Erro ao enviar, cpf não encontrado.")
                }  
            }

        }else{
            console.log("mande um numero valido")
            setTemErro(true)
            setTextoErro("Parâmetros de entrada inválidos (Configurações -> Parâmetros de entrada)")
        }


        setModalPerguntaBeneficiosAberto(false)
    }

    function abrirModalBeneficios(){
        setModalBeneficiosAberto(true)
        setModalPerguntaBeneficiosAberto(false)
    }


    useEffect(() => {
        console.log("Total Atividades Adquiridas Final:")
        console.log(totalAtividadesAdquiridas)
    }, [totalAtividadesAdquiridas])

    useEffect(() => {
        console.log("Total Atividades Prestadas Final:")
        console.log(totalAtividadesPrestadas)
    }, [totalAtividadesPrestadas])

    useEffect(() => {
        console.log("Total Produtos Adquiridos Final:")
        console.log(totalProdutosAdquiridos)
    }, [totalProdutosAdquiridos])

    useEffect(() => {
        console.log("Total Produtos Vendidos Final:")
        console.log(totalProdutosVendidos)
    }, [totalProdutosVendidos])

    useEffect(() => {
        console.log("Obj minha empresa ou pessoa atual mudado")
        console.log(objMinhaEmpresaOuPessoaAtual)
    }, [objMinhaEmpresaOuPessoaAtual])

    useEffect(() => {
        if(passo2){
            console.log("OBJ MINHA EMPRESAAAAAAAAAA")
            console.log(objMinhaEmpresaOuPessoaAtual)
        }
    }, [passo2])


    console.log("componente pai rerenderizou")

    return (
        <div className='w-full'>
            <div className='flex gap-14 my-12 flex-wrap'>
                <ProdutosBotao objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked} />
                <Servicos objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked} totalAtividadesAdquiridas={totalAtividadesAdquiridas} setTotalAtividadesAdquiridas={setTotalAtividadesAdquiridas} setTotalAtividadesPrestadas={setTotalAtividadesPrestadas} totalAtividadesPrestadas={totalAtividadesPrestadas} arrInfosEmpresa={arrInfosEmpresa} setArrInfosEmpresa={setArrInfosEmpresa} cnaes={objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa" ? objMinhaEmpresaOuPessoaAtual.cnaes : arrVazio}/>
                <Imoveis objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked}/>
                <BensMoveisBotao objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked} />
            </div>
            <BotaoGeral principalBranco={true} text='Enviar Informações de Atividades' onClickFn={conferirBeneficios}/>
            <div className='mt-14 w-full'>

                {/* INPUTS PRODUTOS */}
                <div className={`${objIsChecked.isCheckedProdutos ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}  [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro text-white rounded-md w-full`}>
                    <div className={`overflow-hidden`}>
                        <div className='flex flex-col p-12 gap-16'>
                            <ProdutosVendidosInput/>
                            <ProdutosAdquiridosInput/>
                        </div>
                    </div>
                </div>

                {/* INPUTS SERVIÇOS */}
                <div className={`${objIsChecked.isCheckedServicos ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}  [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro text-white rounded-md w-full`}>
                    <div className={`overflow-hidden`}>
                        <div className='flex flex-col p-12 gap-16'>
                            <ServicoPrestadoInput totalAtividadesPrestadas={totalAtividadesPrestadas} setTotalAtividadesPrestadas={setTotalAtividadesPrestadas} arrInfosEmpresa={arrInfosEmpresa}/>
                            <ServicoAdquiridoInput setTotalAtividadesAdquiridas={setTotalAtividadesAdquiridas} totalAtividadesAdquiridas={totalAtividadesAdquiridas}/>
                        </div>
                    </div>
                </div>

                {/* INPUTS IMÓVEIS */}
                <div className={`${objIsChecked.isCheckedImoveis ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro rounded-md`}>
                    <div className={`overflow-hidden`}>
                        <div className=' flex flex-col gap-16 p-12'>
                            <Locacao3 modoBranco={modoBranco}/>
                            <CompraEVendaImoveis/>
                            <Incorporacao/>
                        </div>
                    </div>
                </div>

                {/* INPUTS MÓVEIS */}
                <div className={`${objIsChecked.isCheckedMoveis ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro rounded-md`}>
                    <div className={`overflow-hidden`}>
                        <div className=' flex flex-col gap-16 p-12'>
                            <LocacaoMoveis modoBranco={false} />
                        </div>
                    </div>
                </div>
            </div>


            {
                modalPerguntaBeneficiosAberto &&
                <ModalPerguntaBeneficios setModalPerguntaBeneficiosAberto={setModalPerguntaBeneficiosAberto} fnNao={enviarInfosAtividades} fnSim={abrirModalBeneficios} />
            }

            {
                modalBeneficiosAberto && 
                <ModalConferirBeneficios enviarInfosFn={enviarInfosAtividades} setModalBeneficiosAberto={setModalBeneficiosAberto} arrInfosEmpresa={arrInfosEmpresa} setTotalAtividadesAdquiridas={setTotalAtividadesAdquiridas} setTotalAtividadesPrestadas={setTotalAtividadesPrestadas} totalAtividadesAdquiridas={totalAtividadesAdquiridas} totalAtividadesPrestadas={totalAtividadesPrestadas}/>
            }
        </div>
    )
}