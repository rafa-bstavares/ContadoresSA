import {DropDownInput} from '../DropDownInput/DropDownInput'
import {Comp2} from '../Comp2.tsx/Comp2'
import ServicoInput from '../ServicoPrestadoInput/ServicoPrestadoInput'
import Locacao from "../Locacao/Locacao"
import CompraEVendaImoveis from "../CompraEVendaImoveis/CompraEVendaImoveis"
import Servicos from '../Servicos/Servicos'
import { useState, useContext, useEffect } from 'react'
import { BotaoGeral } from '../BotaoGeral/BotaoGeral'
import { baseUrl } from '../../App'
import { ContextoParametrosOpcionais } from '../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais'
import { ContextoErro } from '../../Contextos/ContextoErro/ContextoErro'
import Imoveis from '../Imoveis/Imoveis'
import { ContextoImoveis } from '../../Contextos/ContextoImoveis/ContextoImoveis'
import { ContextoGeral } from '../../Contextos/ContextoGeral/ContextoGeral'
import ServicoPrestadoInput from "../ServicoPrestadoInput/ServicoPrestadoInput";
import { ServicoAdquiridoInput } from "../ServicoAdquiridoInput/ServicoAdquiridoInput";
import Locacao2 from '../Locacao2/Locacao2'
import Locacao3 from '../Locacao3/Locacao3'
import SetaNao from "../../Components/SetaNao/SetaNao"
import { Incorporacao } from '../Incorporacao/Incorporacao';
import BensMoveisBotao from '../BensMoveisBotao/BensMoveisBotao';
import LocacaoMoveis from '../LocacaoMoveis/LocacaoMoveis';
import { ContextoMoveis } from '../../Contextos/ContextoMoveis/ContextoMoveis';
import ProdutosBotao from '../ProdutosBotao/ProdutosBotao'
import { ProdutosVendidosInput } from '../ProdutosVendidosInput/ProdutosVendidosInput'
import { ProdutosAdquiridosInput } from '../ProdutosAdquiridosInput/ProdutosAdquiridosInput'
import { ContextoProduto, ProdutoAdquiridoObj, ProdutoVendidoObj } from '../../Contextos/ContextoProduto/ContextoProduto'
import { ModalPerguntaBeneficios } from '../ModalPerguntaBeneficios/ModalPerguntaBeneficios'
import { ModalConferirBeneficios } from '../ModalConferirBeneficios/ModalConferirBeneficios'


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
    operacao: string
}

export type objIsCheckedType = {
    isCheckedServicos: boolean,
    isCheckedImoveis: boolean,
    isCheckedMoveis: boolean,
    isCheckedProdutos: boolean
}


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

    const {setTemErro, setTextoErro} = useContext(ContextoErro)
    const {
        aliquotaCbs, 
        aliquotaIbs, 
        ipiSimplesServAdquiridos, 
        icmsSimplesServAdquiridos, 
        pisCoSimplesServAdquiridos, 
        issSimplesServAdquiridos, 
        icmsSimplesComercial, 
        icmsSimplesIndustrial, 
        ipiSimplesIndustria, 
        pisCoSimplesComercio, 
        pisCoSimplesIndustria,
        pisCoLucroRealIndustrial,
        pisCoLucroRealServAdquiridos,
        pisCoLucroRealComercial,
        issLucroRealIndustrial,
        issLucroRealServAdquiridos,
        issLucroRealComercial,
        issLucroPresumidoComercial,
        issLucroPresumidoIndustrial,
        issLucroPresumidoServAdquiridos,
        pisCoLucroPresumidoComercial,
        pisCoLucroPresumidoIndustrial,
        pisCoLucroPresumidoServAdquiridos,
        pisCoLucroPresumidoLocacao,
        pisCoSimplesLocacao,
        pisCoLucroRealLocacao
    } = useContext(ContextoParametrosOpcionais)

    const {totalImoveisLocacao, totalImoveisCompraVenda} = useContext(ContextoImoveis)
    const {totalMoveisLocacao} = useContext(ContextoMoveis)
    const {totalProdutosAdquiridos, totalProdutosVendidos, setTotalProdutosAdquiridos, setTotalProdutosVendidos} = useContext(ContextoProduto)
    const {objMinhaEmpresaOuPessoaAtual, passo2} = useContext(ContextoGeral)





    async function conferirBeneficios(){
        if(objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf && objMinhaEmpresaOuPessoaAtual.folha ){ // && (arrInfosEmpresa.length > 0)


            const ibs = Number(aliquotaIbs.replace(",", "*").replace(".", ",").replace("*", "."))
            const cbs = Number(aliquotaCbs.replace(",", "*").replace(".", ",").replace("*", "."))
            


            if(ibs && cbs){

                const parametrosEntrada = {
                    aliquotaIbs: ibs,
                    aliquotaCbs: cbs,
                    aliquotaIva: ibs + cbs,
                    ipiSimplesServAdquiridos: Number(ipiSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issSimplesServAdquiridos: Number(issSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")), 
                    pisCoSimplesServAdquiridos: Number(pisCoSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesServAdquiridos: Number(icmsSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesComercial: Number(icmsSimplesComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesIndustrial: Number(icmsSimplesIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    ipiSimplesIndustria: Number(ipiSimplesIndustria.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesComercio: Number(pisCoSimplesComercio.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesIndustria: Number(pisCoSimplesIndustria.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealIndustrial: Number(pisCoLucroRealIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealServAdquiridos: Number(pisCoLucroRealServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealComercial: Number(pisCoLucroRealComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealIndustrial: Number(issLucroRealIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealServAdquiridos: Number(issLucroRealServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealComercial: Number(issLucroRealComercial.replace(",", "*").replace(".", ",").replace("*", ".")),

                    pisCoLucroPresumidoIndustrial: Number(pisCoLucroPresumidoIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroPresumidoServAdquiridos: Number(pisCoLucroPresumidoServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroPresumidoComercial: Number(pisCoLucroPresumidoComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoIndustrial: Number(issLucroPresumidoIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoServAdquiridos: Number(issLucroPresumidoServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoComercial: Number(issLucroPresumidoComercial.replace(",", "*").replace(".", ",").replace("*", ".")),

                    pisCoLucroPresumidoLocacao: Number(pisCoLucroPresumidoLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealLocacao: Number(pisCoLucroRealLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesLocacao: Number(pisCoSimplesLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                }

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
    }


    async function enviarInfosAtividades(){
        if(objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf && objMinhaEmpresaOuPessoaAtual.folha ){ // && (arrInfosEmpresa.length > 0)


            const ibs = Number(aliquotaIbs.replace(",", "*").replace(".", ",").replace("*", "."))
            const cbs = Number(aliquotaCbs.replace(",", "*").replace(".", ",").replace("*", "."))
            


            if(ibs && cbs){

                const parametrosEntrada = {
                    aliquotaIbs: ibs,
                    aliquotaCbs: cbs,
                    aliquotaIva: ibs + cbs,
                    ipiSimplesServAdquiridos: Number(ipiSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issSimplesServAdquiridos: Number(issSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")), 
                    pisCoSimplesServAdquiridos: Number(pisCoSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesServAdquiridos: Number(icmsSimplesServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesComercial: Number(icmsSimplesComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    icmsSimplesIndustrial: Number(icmsSimplesIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    ipiSimplesIndustria: Number(ipiSimplesIndustria.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesComercio: Number(pisCoSimplesComercio.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesIndustria: Number(pisCoSimplesIndustria.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealIndustrial: Number(pisCoLucroRealIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealServAdquiridos: Number(pisCoLucroRealServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealComercial: Number(pisCoLucroRealComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealIndustrial: Number(issLucroRealIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealServAdquiridos: Number(issLucroRealServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroRealComercial: Number(issLucroRealComercial.replace(",", "*").replace(".", ",").replace("*", ".")),

                    pisCoLucroPresumidoIndustrial: Number(pisCoLucroPresumidoIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroPresumidoServAdquiridos: Number(pisCoLucroPresumidoServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroPresumidoComercial: Number(pisCoLucroPresumidoComercial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoIndustrial: Number(issLucroPresumidoIndustrial.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoServAdquiridos: Number(issLucroPresumidoServAdquiridos.replace(",", "*").replace(".", ",").replace("*", ".")),
                    issLucroPresumidoComercial: Number(issLucroPresumidoComercial.replace(",", "*").replace(".", ",").replace("*", ".")),

                    pisCoLucroPresumidoLocacao: Number(pisCoLucroPresumidoLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoLucroRealLocacao: Number(pisCoLucroRealLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                    pisCoSimplesLocacao: Number(pisCoSimplesLocacao.replace(",", "*").replace(".", ",").replace("*", ".")),
                }

            
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
                

            }else{
                console.log("mande um numero valido")
                setTemErro(true)
                setTextoErro("Parâmetros de entrada inválidos (Configurações -> Parâmetros de entrada)")
            }


        }else{
            console.log("Para enviar, todos os campos precisam estar preenchidos e você deve ter inserido pelo menos uma atividade com seu valor de faturamento mensal")
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
        if(passo2){
            console.log("OBJ MINHA EMPRESAAAAAAAAAA")
            console.log(objMinhaEmpresaOuPessoaAtual)
        }
    }, [passo2])



    return (
        <div className='w-full'>
            <div className='flex gap-14 my-12 flex-wrap'>
                <ProdutosBotao objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked} />
                <Servicos objIsChecked={objIsChecked} setObjIsChecked={setObjIsChecked} totalAtividadesAdquiridas={totalAtividadesAdquiridas} setTotalAtividadesAdquiridas={setTotalAtividadesAdquiridas} setTotalAtividadesPrestadas={setTotalAtividadesPrestadas} totalAtividadesPrestadas={totalAtividadesPrestadas} arrInfosEmpresa={arrInfosEmpresa} setArrInfosEmpresa={setArrInfosEmpresa} cnaes={objMinhaEmpresaOuPessoaAtual.cnaes}/>
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