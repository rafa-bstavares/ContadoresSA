import { ChangeEvent, useContext, useEffect, useState } from "react"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { tipoOperacaoCompraVendaType, tipoImovelCompraVendaType, ImoveisCompraVendaObj, ContextoImoveis } from "../../Contextos/ContextoImoveis/ContextoImoveis"
import xis from "../../assets/images/xisContab.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { DatePicker } from "../DatePicker/DatePicker"
import BrDatePicker from "../BrDatePicker/BrDatePicker"



export default function CompraEVendaImoveis(){

    type simNaoType = "Sim" | "Não"

    const [residencialAberto, setResidencialAberto] = useState<boolean>(false)
    const [tipoOperacaoAberto, setTipoOperacaoAberto] = useState<boolean>(false)
    const [tipoImovelAberto, setTipoImovelAberto] = useState<boolean>(false)
    const [tipoOperacaoAdd, setTipoOperacaoAdd] = useState<tipoOperacaoCompraVendaType>()
    const [residencialAdd, setResidencialAdd] = useState<boolean>(true)
    const [valorVendaImovelAdd, setValorVendaImovelAdd] = useState<string>("")
    const [valorAquisicaoAdd, setValorAquisicaoAdd] = useState<string>("")
    const [diaAquisicaoAdd, setDiaAquisicaoAdd] = useState<string>("")
    const [mesAquisicaoAdd, setMesAquisicaoAdd] = useState<string>("")
    const [anoAquisicaoAdd, setAnoAquisicaoAdd] = useState<string>("")
    const [diaVendaAdd, setDiaVendaAdd] = useState<string>("")
    const [mesVendaAdd, setMesVendaAdd] = useState<string>("")
    const [anoVendaAdd, setAnoVendaAdd] = useState<string>("")
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [tipoImovelAdd, setTipoImovelAdd] = useState<tipoImovelCompraVendaType>()
    const [modalCompraVendaAberto, setModalCompraVendaAberto] = useState<boolean>(false)
    const [totalImoveisCompraModal, setTotalImoveisCompraModal] = useState<ImoveisCompraVendaObj[]>([])

    const [dataAquisicaoAdd, setDataAquisicaoAdd] = useState<Date>()
    const [dataVendaAdd, setDataVendaAdd] = useState<Date>()


    const {setTotalImoveisCompraVenda, totalImoveisCompraVenda} = useContext(ContextoImoveis)
    const {setTemErro,setTextoErro} = useContext(ContextoErro)


    const arrSimNao: simNaoType[] = [
        "Sim", 
        "Não"
    ]

    const arrTipoOperacao: tipoOperacaoCompraVendaType[] = [
        "Novo",
        "Usado"
    ]

    const arrTipoImovel: tipoImovelCompraVendaType[] = [
        "Imóvel",
        "Lote"
    ]


    function escolherResidencial(item: simNaoType){
        setResidencialAdd(item == "Sim")
        trocarDropResidencial()
    }

    function escolherTipoOperacao(item: tipoOperacaoCompraVendaType){
        setTipoOperacaoAdd(item)
        trocarDropTipoOperacao()
    }

    function escolherTipoImovel(item: tipoImovelCompraVendaType){
        setTipoImovelAdd(item)
        trocarDropTipoImovel()
    }
    
    function trocarDropResidencial(){
        setResidencialAberto(!residencialAberto)
    }

    function trocarDropTipoOperacao(){
        setTipoOperacaoAberto(!tipoOperacaoAberto)
    }

    function trocarDropTipoImovel(){
        setTipoImovelAberto(!tipoImovelAberto)
    }


    function mudarValorVendaImovelAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorVendaImovelAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorVendaImovelAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarValorAquisicaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }
    
    function mudarDiaAquisicaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setDiaAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setDiaAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarMesAquisicaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setMesAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setMesAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarAnoAquisicaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setAnoAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setAnoAquisicaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarDiaVendaAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setDiaVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setDiaVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarMesVendaAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setMesVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setMesVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarAnoVendaAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setAnoVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setAnoVendaAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function addImovelCompraEVenda(){
        const novoArrFinal = [...totalImoveisCompraVenda, ...totalImoveisCompraModal]
        setTotalImoveisCompraVenda(novoArrFinal)

        setModalCompraVendaAberto(false)
        setInfo1Aberto(true)
        setInfo2Aberto(false)
        // Resetando valores input
        setResidencialAdd(true)
        setValorVendaImovelAdd("")
        setValorAquisicaoAdd("")
        setDiaAquisicaoAdd("")
        setMesAquisicaoAdd("")
        setAnoAquisicaoAdd("")
        setDiaVendaAdd("")
        setMesVendaAdd("")
        setAnoVendaAdd("")
        setTipoOperacaoAdd(undefined)
        setTipoImovelAdd(undefined)
        setTotalImoveisCompraModal([])

    }

    function addItemImovelCompraEVenda(){
        if(valorVendaImovelAdd && valorAquisicaoAdd && tipoOperacaoAdd && tipoImovelAdd){
            
            let maxId = 0
            let idAtual  
            totalImoveisCompraVenda.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            const indexItemAtual = totalImoveisCompraModal.length

            idAtual = maxId + 1 + indexItemAtual        
            
            const novoArr = [...totalImoveisCompraModal]
            const novoObjAtual: ImoveisCompraVendaObj = {
                residencial: residencialAdd,
                valorVendaImovel: Number(valorVendaImovelAdd),
                valorAquisicao: Number(valorAquisicaoAdd),
                diaAquisicao: diaAquisicaoAdd,
                mesAquisicao: mesAquisicaoAdd,
                anoAquisicao: anoAquisicaoAdd,
                diaVenda: diaVendaAdd,
                mesVenda: mesVendaAdd,
                anoVenda: anoVendaAdd,
                tipoOperacao: tipoOperacaoAdd,
                tipoImovel: tipoImovelAdd,
                id: idAtual
                
             }
            novoArr.push(novoObjAtual)

            setTotalImoveisCompraModal(novoArr)
            setInfo1Aberto(true)
            setInfo2Aberto(false)
            // Resetando valores input
            setResidencialAdd(true)
            setValorVendaImovelAdd("")
            setValorAquisicaoAdd("")
            setDiaAquisicaoAdd("")
            setMesAquisicaoAdd("")
            setAnoAquisicaoAdd("")
            setDiaVendaAdd("")
            setMesVendaAdd("")
            setAnoVendaAdd("")
            setTipoOperacaoAdd(undefined)
            setTipoImovelAdd(undefined)


        }else{
            setTemErro(true)
            setTextoErro("Para adicionar uma nova locação preencha todos os campos com dados válidos.")
        }
    }
    
    function abrirModalCompraVendaFn(){
        setModalCompraVendaAberto(true)
    }

    function avancarParaInfo2(){
        if(residencialAdd !== undefined && tipoOperacaoAdd && tipoImovelAdd){
            setInfo1Aberto(false)
            setInfo2Aberto(true)
        }else{
            setTemErro(true)
            setTextoErro("Preencha todos os campos de 'Informações gerais'")
        }
    }

    function voltarParaInfo1(){
        setInfo1Aberto(true)
        setInfo2Aberto(false)
    }
    
    function apagarImovelCompraVendaModal(id: number){
        const novoArr = [...totalImoveisCompraModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalImoveisCompraModal(arrFinal)
    }

    function apagarImovelCompraVenda(id: number){
        const novoArr = [...totalImoveisCompraVenda]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalImoveisCompraVenda(arrFinal)
    }


    useEffect(()=> {
        console.log(totalImoveisCompraVenda)
    }, [totalImoveisCompraVenda])


    return (
        <div className="flex flex-col gap-2">

            {
                modalCompraVendaAberto && (
                    <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center z-50 bg-black/90`}>
                        <div className={`flex flex-col overflow-y-scroll h-[90vh] gap-6 bg-premiumBg px-24 py-12 rounded-md`}>
                            <div
                                className="flex self-end cursor-pointer"
                                onClick={() => setModalCompraVendaAberto(false)}
                            >
                                <img
                                className="w-12 h-12"
                                src={xis}
                                alt="fechar modal locação"
                                />
                            </div>
                            <div className={`flex flex-col bg-[#222222]  rounded-xl `}>
                                <div className="text-lg flex items-center gap-2 px-8 py-2 bg-[#1d1d1d] border-[#9b9a9a] border-2 border-solid rounded-xl">
                                    <div className="rounded-full h-full aspect-square flex justify-center items-center p-4">
                                        1
                                    </div>
                                    <div>Informações Gerais</div>
                                </div>
                                <div
                                    className={`
                                    gap-6
                                    ${info1Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                    [transition:grid-template-rows_500ms]
                                    `}
                                >
                                    <div className={`overflow-hidden flex flex-col gap-8`}> {/* ESSE OVERFLOW-HIDDEN QUE ESTÁ FAZENDO O TOOLTIP NÃO APARECER TODO */}
                                        <div className="flex gap-8 p-6">
                                            <div className="flex flex-col flex-1 ">
                                                <label className="text-gray-400">É residencial?</label>
                                                <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                    <div onClick={trocarDropResidencial} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                        <div className="opacity-50">
                                                            {
                                                                residencialAdd ?
                                                                    "Sim"
                                                                        :
                                                                    "Não"
                                                            }
                                                        </div>
                                                        <div className={`${residencialAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                            <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                        </div>
                                                    </div>
                                                    <div className={` ${residencialAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                        <div className={`overflow-hidden`}>
                                                            {
                                                                arrSimNao.map(item => {
                                                                    return (
                                                                        <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherResidencial(item)} >{item}</div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <label className="text-gray-400">Tipo operação</label>
                                                <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                    <div onClick={trocarDropTipoOperacao} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                        <div className="opacity-50">
                                                            {
                                                                tipoOperacaoAdd ?
                                                                    tipoOperacaoAdd
                                                                        :
                                                                    "Escolha"
                                                            }
                                                        </div>
                                                        <div className={`${tipoOperacaoAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                            <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                        </div>
                                                    </div>
                                                    <div className={` ${tipoOperacaoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                        <div className={`overflow-hidden`}>
                                                            {
                                                                arrTipoOperacao.map(item => {
                                                                    return (
                                                                        <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherTipoOperacao(item)} >{item}</div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <label className="text-gray-400">Tipo imóvel</label>
                                                <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                    <div onClick={trocarDropTipoImovel} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                        <div className="opacity-50">
                                                            {
                                                                tipoImovelAdd ?
                                                                    tipoImovelAdd
                                                                        :
                                                                    "Escolha"
                                                            }
                                                        </div>
                                                        <div className={`${tipoImovelAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                            <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                        </div>
                                                    </div>
                                                    <div className={` ${tipoImovelAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                        <div className={`overflow-hidden`}>
                                                            {
                                                                arrTipoImovel.map(item => {
                                                                    return (
                                                                        <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherTipoImovel(item)} >{item}</div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 pb-6">
                                            <BotaoGeral
                                            onClickFn={avancarParaInfo2}
                                            principalBranco={true}
                                            text="Próximo"
                                            />
                                        </div>
                                    </div>
                            
                                </div>
                            </div>


                            <div className={`flex flex-col bg-[#222222]  rounded-xl `}>
                                <div className="text-lg flex items-center gap-2 px-8 py-2 bg-[#1d1d1d] border-[#9b9a9a] border-2 border-solid rounded-xl">
                                    <div className="rounded-full h-full aspect-square flex justify-center items-center p-4">
                                        2
                                    </div>
                                    <div>Valores</div>
                                </div>
                                <div
                                    className={`
                                    gap-6
                                    ${info2Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                    [transition:grid-template-rows_500ms]
                                    `}
                                >

                                    <div className={`overflow-hidden flex flex-col gap-8`}> {/* ESSE OVERFLOW-HIDDEN QUE ESTÁ FAZENDO O TOOLTIP NÃO APARECER TODO */}
                                        <div className="flex gap-8 p-6">
                                            {/* Cada novo input entra aqui */}
                                            <div className="flex flex-col ">
                                                <label className="text-gray-400" htmlFor="valorImovel">Valor venda:</label>
                                                <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1" type="number" id="valorImovel" onChange={(e) => mudarValorVendaImovelAdd(e)}/>
                                            </div>

                                            <div className="flex flex-col ">
                                                <label className="text-gray-400" htmlFor="valorAquisicao">Valor aquisição:</label>
                                                <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1" type="number" id="valorAquisicao" onChange={(e) => mudarValorAquisicaoAdd(e)}/>
                                            </div>

                                            <DatePicker label="Data de Venda" id="Data de Venda" value={dataVendaAdd} onChange={(novaData) => setDataVendaAdd(novaData)}/>
                                            <DatePicker label="Data de Aquisição" id="Data de Aquisição" value={dataAquisicaoAdd} onChange={(novaData) => setDataAquisicaoAdd(novaData)}/>

                                            <BrDatePicker/>

                                        </div>

                                        <div className="flex gap-4 px-6 pb-6">
                                            <BotaoGeral
                                            onClickFn={voltarParaInfo1}
                                            principalBranco={false}
                                            text="Voltar"
                                            />
                                            <BotaoGeral
                                            onClickFn={addItemImovelCompraEVenda}
                                            principalBranco={true}
                                            text="Próximo"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {
                                totalImoveisCompraModal.length > 0 && 
                                    <div className="mt-8 flex flex-col gap-2 w-full border-solid border-white border-2 rounded-2xl">
                                        {totalImoveisCompraModal.map((imovel, index) => {
                                            return (
                                                <>
                                                    {
                                                        index == 0 && 
                                                        <div className="grid grid-cols-[repeat(5,_1fr)_auto] gap-10 items-center p-4">
                                                            <div>É residencial</div>
                                                            <div>Tipo operação</div>
                                                            <div>Tipo imóvel</div>
                                                            <div>Valor venda</div>
                                                            <div>Valor aquisição</div>
                                                            <div onClick={() => {}} className="bg-red-600 opacity-0 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                            </div> 
                                                        </div>
                                                    }
                                                    
                                                    <div className={`grid grid-cols-[repeat(5,_1fr)_auto] ${index % 2 == 0? "bg-fundoPreto" : ""} rounded-2xl gap-10 items-center p-4`}>
                                                        <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                                        <div>{imovel.tipoOperacao}</div>
                                                        <div>{imovel.tipoImovel}</div>
                                                        <div>{"R$ " + imovel.valorVendaImovel.toLocaleString("pt-br")}</div>
                                                        <div>{"R$ " + imovel.valorAquisicao.toLocaleString("pt-br")}</div>
                                                        <div onClick={() => {apagarImovelCompraVendaModal(imovel.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                        </div>        
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div>
                            }

                            {
                                totalImoveisCompraModal.length > 0 &&
                                <div className="mt-6">
                                    <BotaoGeral onClickFn={addImovelCompraEVenda} principalBranco={true} text="Salvar" />
                                </div>
                            }
                                                            


                        </div>




                        <div className="flex gap-6 items-start">
                            




                        </div>    

    
                    </div>
                )
            }

            <div className="flex flex-col gap-2">
                <div className="font-semibold text-3xl mb-2">
                    Compra e venda
                </div>
                <div>
                    <BotaoGeral onClickFn={abrirModalCompraVendaFn} principalBranco={true} text="Adicionar Novo Imóvel (Compra e Venda)"/>
                </div>


                
                {
                    totalImoveisCompraVenda.length > 0 && 
                        <div className="mt-8 flex flex-col gap-2 w-full border-solid border-white border-2 rounded-2xl">
                            {totalImoveisCompraVenda.map((imovel, index) => {
                                return (
                                    <>
                                        {
                                            index == 0 && 
                                            <div className="grid grid-cols-[repeat(5,_1fr)_auto] gap-10 items-center p-4">
                                                <div>É residencial</div>
                                                <div>Tipo operação</div>
                                                <div>Tipo imóvel</div>
                                                <div>Valor venda</div>
                                                <div>Valor aquisição</div>
                                                <div onClick={() => {apagarImovelCompraVenda(imovel.id)}} className="bg-red-600 opacity-0 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                    <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                </div> 
                                            </div>
                                        }
                                        
                                        <div className={`grid grid-cols-[repeat(5,_1fr)_auto] ${index % 2 == 0? "bg-fundoPreto" : ""} rounded-2xl gap-10 items-center p-4`}>
                                            <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                            <div>{imovel.tipoOperacao}</div>
                                            <div>{imovel.tipoImovel}</div>
                                            <div>{"R$ " + imovel.valorVendaImovel.toLocaleString("pt-br")}</div>
                                            <div>{"R$ " + imovel.valorAquisicao.toLocaleString("pt-br")}</div>
                                            <div onClick={() => {apagarImovelCompraVenda(imovel.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                            </div>        
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                }




            </div>
        </div>
    )
}