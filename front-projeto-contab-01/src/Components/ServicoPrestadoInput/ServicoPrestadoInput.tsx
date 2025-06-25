import { Dispatch, SetStateAction, useEffect, useState } from "react"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { objAtividadeFinal } from "../SegundoPasso/SegundoPasso"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import xis from "../../assets/images/xisContab.svg"

type ObjInfosType = {
    cnae: string,
    descricao: string,
    anexo: string,
    aliquota: string | number
}

type Props = {
    arrInfosEmpresa: ObjInfosType[],
    totalAtividadesPrestadas: objAtividadeFinal[],
    setTotalAtividadesPrestadas: Dispatch<SetStateAction<objAtividadeFinal[]>>
}



export default function ServicoPrestadoInput({arrInfosEmpresa, totalAtividadesPrestadas, setTotalAtividadesPrestadas}: Props){


    const [atividadeSelecionada, setAtividadeSelecionada] = useState<ObjInfosType>()
    const [faturamentoSelecionado, setFaturamentoSelecionado] = useState<number>(0)
    const [aberto, setAberto] = useState<boolean>(false)
    const [modalServicosPrestadosAberto, setModalServicosPrestadosAberto] = useState<boolean>(false)

    function trocarMenuAtividades(){
        setAberto(!aberto)
    }

    function escolherAtividade(item: ObjInfosType){
        setAtividadeSelecionada(item)
    }

    function addAtividade(){
        if(atividadeSelecionada && faturamentoSelecionado){
            const jaTem = totalAtividadesPrestadas.some(item => item.atividade == atividadeSelecionada.descricao)
            if(jaTem){
                console.log("Atividade Já está adicionada")
            }else{
                let maxId = 0
                let idAtual  
                totalAtividadesPrestadas.forEach(item => {
                    if(item.id > maxId){
                        maxId = item.id
                    }
                })
    
                idAtual = maxId + 1
    
                const novoArr = [...totalAtividadesPrestadas]
                novoArr.push({atividade: atividadeSelecionada.descricao, faturamentoMensal: faturamentoSelecionado, id: idAtual, cnaePrincipal: atividadeSelecionada.cnae.toString(), beneficio: 0,anexo: atividadeSelecionada.anexo, prestacao: true})
                setTotalAtividadesPrestadas(novoArr)
                setModalServicosPrestadosAberto(false)
                setAtividadeSelecionada(undefined)
                setFaturamentoSelecionado(0)
            }
        }else{
            console.log("tanto a atividade quanto o faturamento precisam estar preenchidos e o faturamento não pode ser 0")
        }
    }

    function apagarAtividade(id: number){
        const novoArr = [...totalAtividadesPrestadas]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalAtividadesPrestadas(arrFinal)
    }

    function escolherAtividadeFn(item: ObjInfosType){
        escolherAtividade(item)
        setAberto(!aberto)
    }


    function abrirModalServicosPrestadosFn(){
        setModalServicosPrestadosAberto(true)
    }


    useEffect(() => {
        console.log(atividadeSelecionada)
    }, [atividadeSelecionada])

    useEffect(() => {
        console.log(totalAtividadesPrestadas)
    }, [totalAtividadesPrestadas])

    return (
        <div className="flex flex-col gap-2">

            {
                modalServicosPrestadosAberto && (
                    <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center z-50 bg-black/90`}>
                        


                        <div className="flex flex-col gap-12 bg-premiumBg px-24 py-12 rounded-2xl w-[95vw]">
                            <div className="flex self-end cursor-pointer" onClick={() => setModalServicosPrestadosAberto(false)}>
                                <img
                                className="w-12 h-12"
                                src={xis}
                                alt="fechar modal locação"
                                />
                            </div>
                            <div className="flex items-start justify-center gap-6">
                                {/*Drop down com as atividades*/}
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-400">Escolha um CNAE:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div onClick={trocarMenuAtividades} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                            <div className="text-sm opacity-50">
                                                {
                                                    atividadeSelecionada && atividadeSelecionada.descricao ?
                                                        atividadeSelecionada.descricao
                                                            :
                                                        "Escolha a atividade desse faturamento"
                                                }
                                            </div>
                                            <div className={`${aberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                            </div>
                                        </div>
                                        <div className={` ${aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                            <div className={`overflow-hidden`}>
                                                {arrInfosEmpresa.filter(item => item.anexo == "III" || item.anexo == "IV" || item.anexo == "V").map((item) => <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300" onClick={() => escolherAtividadeFn(item)}>{item.descricao}</div>)}
                                            </div>
                                        </div>
                                
                                    </div>
                                </div>
                                {/*Input faturamento*/}
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-400">Faturamento da atividade:</label>
                                    <div className="flex gap-2 items-center border-2 border-solid rounded-md border-gray-300 p-1">
                                        <div className="">R$</div>
                                        <input className="outline-none" type="number" onChange={(e) => setFaturamentoSelecionado(Number(e.target.value))}/>
                                    </div>
                                </div>
                                {/*Botao adicionar*/}
                                <div className="flex flex-col">
                                    <label className="text-gray-400 opacity-0">Faturamento da atividade:</label>
                                    <BotaoGeral onClickFn={addAtividade} text="Adicionar" principalBranco={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


            <div className="font-bold text-3xl mb-2">
                Serviços Prestados
            </div>
            <div className="text-sm">Selecione uma atividade e adicione o faturamento mensal</div>
            <div>
                <BotaoGeral onClickFn={abrirModalServicosPrestadosFn} principalBranco={true} text="Adicionar Serviço Prestado"/>
            </div>


            <div className=" flex flex-col gap-4">
                {totalAtividadesPrestadas.map(item => {
                    return (
                    <div className="flex gap-6 items-center mt-8">
                        <div>{item.atividade}</div>
                        <div>{"R$ " + item.faturamentoMensal.toLocaleString("pt-br")}</div>
                        <div onClick={() => {apagarAtividade(item.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}