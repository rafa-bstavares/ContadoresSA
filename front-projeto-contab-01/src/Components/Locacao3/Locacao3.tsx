import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import interrogacaoImg from "../../assets/images/interrogaçãoImg.svg"
import InfoTooltip from "../InfoToolTip/InfoToolTip"
import { ContextoImoveis } from "../../Contextos/ContextoImoveis/ContextoImoveis"
import { ImoveisLocacaoObj } from "../../Contextos/ContextoImoveis/ContextoImoveis"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import xis from "../../assets/images/xisContab.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { Xis } from "../Xis/Xis"
import { ToggleButtonMapeado } from "../ToggleButtonMapeado/ToggleButtonMapeado"

type Props = {
    modoBranco: boolean
}

export default function Locacao3({modoBranco}: Props){
    const fileRef = useRef<HTMLInputElement>(null)

    function clicarInput(){
        fileRef.current?.click()
    }
    type TiposAluguelType = "Aluguel pago" | "Aluguel recebido"
    type TiposOutroType = "Pessoa física" | "Pessoa jurídica"
    type TiposCobrancaCondominio = "Embutido no aluguel" | "Separado do aluguel"
    type simNaoType = "Sim" | "Não"
    type regimeOutroType = "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica"

    const [valorAluguelAdd, setValorAluguelAdd] = useState<string>("")
    const [valorCondominioAdd, setValorCondominioAdd] = useState<string>("")
    const [jurosAdd, setJurosAdd] = useState<string>("")
    const [acrescimosAdd, setAcrescimosAdd] = useState<string>("")
    const [residencialAdd, setResidencialAdd] = useState<boolean>(true)
    const [tipoAluguelAberto, setTipoAluguelAberto] = useState<boolean>(false)
    const [tipoOutroAberto, setTipoOutroAberto] = useState<boolean>(false)
    const [regimeOutroAberto, setRegimeOutroAberto] = useState<boolean>(false)
    const [residencialAberto, setResidencialAberto] = useState<boolean>(false)
    const [condominioEmbutidoAberto, setCondominioEmbutidoAberto] = useState<boolean>(false)
    const [prazoDeterminadoAberto, setPrazoDeterminadoAberto] = useState<boolean>(false)
    const [tipoAluguelAdd, setTipoAluguelAdd] = useState<TiposAluguelType>()
    const [tipoOutroAdd, setTipoOutroAdd] = useState<TiposOutroType>()
    const [condominioEmbutidoAdd, setCondominioEmbutidoAdd] = useState<boolean>()
    const [prazoDeterminadoAdd, setPrazoDeterminadoAdd] = useState<boolean>(true)
    const [regimeOutroAdd, setRegimeOutroAdd] = useState<regimeOutroType>()
    const [quantidadeAdd, setQuantidadeAdd] = useState<number>(1)
    const [quantidadeTela, setQuantidadeTela] = useState<string>("1")
    const [tiposAlugueis, setTiposAlugueis] = useState<(TiposAluguelType)[]>(["Aluguel pago","Aluguel recebido"])
    const [regimesOutro, setRegimesOutro] = useState<regimeOutroType[]>(["Lucro Presumido","Lucro Real","Simples Nacional"])
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [info3Aberto, setInfo3Aberto] = useState<boolean>(false)
    const [info4Aberto, setInfo4Aberto] = useState<boolean>(false)
    const [modalLocacaoAberto, setModalLocacaoAberto] = useState<boolean>(false)
    const [totalImoveisModal, setTotalImoveisModal] = useState<ImoveisLocacaoObj[]>([])
    const [totalImoveisPagosModal, setTotalImoveisPagosModal] = useState<ImoveisLocacaoObj[]>([])
    const [totalImoveisRecebidosModal, setTotalImoveisRecebidosModal] = useState<ImoveisLocacaoObj[]>([])


    const arrRegimesImutavel: regimeOutroType[] = ["Lucro Presumido","Lucro Real","Simples Nacional"]
    

    const tiposOutro: (TiposOutroType)[] = [
        "Pessoa física",
        "Pessoa jurídica"
    ]

    const arrSimNao: simNaoType[] = [
        "Sim", 
        "Não"
    ]

    const {totalImoveisLocacao, setTotalImoveisLocacao, setTotalImoveisAlugueisPagos, setTotalImoveisAlugueisRecebidos, totalImoveisAlugueisPagos, totalImoveisAlugueisRecebidos} = useContext(ContextoImoveis)
    const {setTemErro,setTextoErro} = useContext(ContextoErro)
    const {objMinhaEmpresaOuPessoaAtual, passo1} = useContext(ContextoGeral)


    function mudarValorAluguelAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorAluguelAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorAluguelAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarValorCondominioAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorCondominioAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorCondominioAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarJurosAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setJurosAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            console.log("Valor input antes transformacao")
            setJurosAdd(valorInput)
            return 
        }
    }

    function mudarAcrescimosAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setAcrescimosAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setAcrescimosAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

function mudarQuantidade(e: ChangeEvent<HTMLInputElement>) {
  const raw = e.target.value
  // retira TUDO que não seja 0–9
  const digitsOnly = raw.replace(/\D/g, "")

  // mantém o campo mostrando apenas dígitos
  setQuantidadeTela(digitsOnly)

  // se quiser manter também um número no outro state:
  const num = digitsOnly === "" ? 0 : parseInt(digitsOnly, 10)
  setQuantidadeAdd(num)
}

    function mudarResidencial(e: React.ChangeEvent<HTMLInputElement>){
        switch(e.target.id){
            case "nao residencial":
                setResidencialAdd(false)
                break

            case "sim residencial":
                setResidencialAdd(true)
                break   
        }
    }

    function escolherResidencial(item: simNaoType){
        setResidencialAdd(item == "Sim")
        trocarDropResidencial()
    }


    function addImovelLocacao(){
        const novoArrFinal = [...totalImoveisLocacao, ...totalImoveisModal]
        setTotalImoveisLocacao(novoArrFinal)

        setValorAluguelAdd("")
        setValorCondominioAdd("")
        setJurosAdd("")
        setResidencialAdd(true)
        setTipoAluguelAdd(undefined)
        setTipoOutroAdd(undefined)
        setCondominioEmbutidoAdd(undefined)
        setPrazoDeterminadoAdd(true)
        setRegimeOutroAdd("Pessoa Fisica")
        setQuantidadeAdd(1)
        setQuantidadeTela("1")
        setTotalImoveisModal([])
        
        setInfo2Aberto(false)
        setInfo1Aberto(true)
        setModalLocacaoAberto(false)

    }
    
    function addItemImovelLocacao(){
        // como estou verificando a quantidadeAdd aqui no if, posso colocar ela como zero na parte de verificar se é inteiro, ai caso ele n preencha ou deixe zero n passa
        console.log("////////////")
        console.log(regimeOutroAdd)
        console.log()
        if(valorAluguelAdd && valorCondominioAdd && jurosAdd && tipoAluguelAdd && tipoOutroAdd && condominioEmbutidoAdd !== undefined && quantidadeAdd){

            let maxId = 0
            let idAtual  
            totalImoveisLocacao.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            const indexItemAtual = totalImoveisModal.length

            idAtual = maxId + 1 + indexItemAtual


            const novoArr = [...totalImoveisModal]
            const novoObjAtual: ImoveisLocacaoObj = {
                valorAluguel: Number(valorAluguelAdd),
                tipoAluguel: tipoAluguelAdd,
                acrescimos: Number(acrescimosAdd),
                juros: Number(jurosAdd),
                residencial: residencialAdd,
                valorCondominio: Number(valorCondominioAdd),
                condominioEmbutido: condominioEmbutidoAdd,
                tipoOutraParte: tipoOutroAdd,
                prazoDeterminado: prazoDeterminadoAdd,
                regimeOutro: tipoOutroAdd == "Pessoa física" ? "Pessoa Fisica" : regimeOutroAdd ? regimeOutroAdd : "Simples Nacional",
                compoeCusto: false,
                quantidade: quantidadeAdd,
                id: idAtual 
             }
            novoArr.push(novoObjAtual)

            setTotalImoveisModal(novoArr)

             setValorAluguelAdd("")
             setValorCondominioAdd("")
             setJurosAdd("")
             setResidencialAdd(true)
             setTipoAluguelAdd(undefined)
             setTipoOutroAdd(undefined)
             setCondominioEmbutidoAdd(undefined)
             setPrazoDeterminadoAdd(true)
             setRegimeOutroAdd("Pessoa Fisica")
             setQuantidadeAdd(1)
             setQuantidadeTela("1")
             
             setInfo2Aberto(false)
             setInfo1Aberto(true)

             

        }else{
            setTemErro(true)
            setTextoErro("Para adicionar uma nova locação preencha todos os campos com dados válidos. A quantidade deve ser maior que zero")
        }
    }

    function trocarDroptipoAluguel(){
        setTipoAluguelAberto(!tipoAluguelAberto)
    }

    function trocarDropCondominioEmbutido(){
        setCondominioEmbutidoAberto(!condominioEmbutidoAberto)
    }

    function trocarDropResidencial(){
        setResidencialAberto(!residencialAberto)
    }

    function trocarDropTipoOutro(){
        setTipoOutroAberto(!tipoOutroAberto)
    }

    function trocarDropRegimeOutro(){
        setRegimeOutroAberto(!regimeOutroAberto)
    }

    function trocarDropPrazoDeterminado(){
        setPrazoDeterminadoAberto(!prazoDeterminadoAberto)
    }

    function escolherTipoAluguel(item: TiposAluguelType){
        setTipoAluguelAdd(item)
        trocarDroptipoAluguel()
    }

    function escolherTipoOutro(item : TiposOutroType){
        setTipoOutroAdd(item)
        trocarDropTipoOutro()
    }

    function escolherRegimeOutro(item : regimeOutroType){
        setRegimeOutroAdd(item)
        trocarDropRegimeOutro()
    }
    
    function escolherCobrancaCondominio(item: simNaoType){

        // A pergunta é: está destacado? Se a resposta for Não é porque está embutido
        setCondominioEmbutidoAdd(item == "Não")


        trocarDropCondominioEmbutido()

    }


    function escolherPrazoDeterminado(item: simNaoType){
        switch(item){
            case "Sim":
                setPrazoDeterminadoAdd(true)
                break

            case "Não":
                setPrazoDeterminadoAdd(false)
                break
        }

        trocarDropPrazoDeterminado()

    }

    function avancarParaInfo2(){
        if(tipoOutroAdd){
            if(tipoOutroAdd == "Pessoa jurídica"){
                if(residencialAdd !== undefined && tipoAluguelAdd && condominioEmbutidoAdd !== undefined && tipoOutroAdd && regimeOutroAdd && prazoDeterminadoAdd !== undefined){
                    setInfo1Aberto(false)
                    setInfo2Aberto(true)
                }else{
                    setTemErro(true)
                    setTextoErro("Preencha todos os campos de 'Informações gerais'")
                }
            }else{
                if(residencialAdd !== undefined && tipoAluguelAdd && condominioEmbutidoAdd !== undefined && tipoOutroAdd && prazoDeterminadoAdd !== undefined){
                    setInfo1Aberto(false)
                    setInfo2Aberto(true)
                }else{
                    setTemErro(true)
                    setTextoErro("Preencha todos os campos de 'Informações gerais'")
                }
            }
        }else{
            setTemErro(true)
            setTextoErro("Preencha todos os campos da aba 'Informações gerais'")
        }



    }


    function alterarCompoeCusto(id: number){
        const objTotalImoveisClone = [...totalImoveisLocacao]
        const idEncontrado = objTotalImoveisClone.findIndex(item => item.id == id)
        if(idEncontrado > -1){
            objTotalImoveisClone[idEncontrado].compoeCusto = !objTotalImoveisClone[idEncontrado].compoeCusto

            setTotalImoveisLocacao(objTotalImoveisClone)
        }else{
            console.log("ID compoe custo não encontrado")
        }
    }


    function voltarParaInfo1(){
        setInfo2Aberto(false)
        setInfo1Aberto(true)
    }

    function avancarParaInfo3(){
        if(valorAluguelAdd && valorCondominioAdd && jurosAdd && quantidadeAdd){
            setInfo4Aberto(true)
            setInfo2Aberto(false)
        }else{
            setTemErro(true)
            setTextoErro("Preencha todos os campos da aba 'Valores'")
        }
    }

    function voltarParaInfo2(){
        setInfo3Aberto(false)
        setInfo2Aberto(true)
    }

    function avancarParaInfo4(){
        if(prazoDeterminadoAdd){
            setInfo4Aberto(true)
            setInfo3Aberto(false)
        }else{
            setTemErro(true)
            setTextoErro("Preencha todos os campos da aba 'Datas'")
        }
    }

    function voltarParaInfo3(){
        setInfo3Aberto(true)
        setInfo4Aberto(false)
    }

    function abrirModalLocacaoFn(){
        setModalLocacaoAberto(true)
    }

    function apagarImovelLocacaoModal(id: number){
        const novoArr = [...totalImoveisModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        console.log("arr Final")
        setTotalImoveisModal(arrFinal)
    }

    function apagarImovelLocacao(id: number){
        const novoArr = [...totalImoveisLocacao]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalImoveisLocacao(arrFinal)
    }

    useEffect(() => {
        console.log(quantidadeAdd)
    }, [quantidadeAdd])

    useEffect(() => {
        console.log("Total imoveis locação")
        console.log(totalImoveisLocacao)
    }, [totalImoveisLocacao])


    useEffect(() => {
        if(passo1 == false){
            // Ajeitando tipos Algueis
            // Se eu for do Simples Nacional não pode ter Aluguel Recebido pq simples não pode ser locador
            if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Simples Nacional"){
                setTiposAlugueis(tiposAlugueis.filter(item => item == "Aluguel pago"))
            }

        }
    }, [passo1])

    useEffect(() => {
        // Se mudou o tipo alugueis, com certeza o passo 1 já é false
        console.log("mudaou aluguel add: " + tipoAluguelAdd)
        console.log("está ativando o useEffect")
        console.log("meu Regime: " + objMinhaEmpresaOuPessoaAtual.meuRegime)
        console.log("tipo aluguel add: " + tipoAluguelAdd)
        if(tipoAluguelAdd){
            if(!((objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Presumido" || objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real") && tipoAluguelAdd == "Aluguel recebido")){
                // entra aqui se o meuRegime for Simples Nacional ou se o tipoAluguelAdd !== Aluguel recebido
                // Ou seja, aqui estamos tirando a possibilidade do LOCADOR ser Simples Nacional
                console.log("entrou no if do ")
                const arrCloneRegimes = [...arrRegimesImutavel]
                setRegimesOutro(arrCloneRegimes.filter(item => item !== "Simples Nacional"))
            }else{
                setRegimesOutro(arrRegimesImutavel)
            }
        }
    }, [tipoAluguelAdd])


    useEffect(() => {
        console.log("Regimes Outro locacao:")
        console.log(regimesOutro)
    }, [regimesOutro])


    useEffect(() => {

        const arrAlugueisPagos = totalImoveisLocacao.filter(imovel => imovel.tipoAluguel == "Aluguel pago")
        const arrAlugueisRecebidos = totalImoveisLocacao.filter(imovel => imovel.tipoAluguel == "Aluguel recebido")

        setTotalImoveisAlugueisPagos(arrAlugueisPagos)
        setTotalImoveisAlugueisRecebidos(arrAlugueisRecebidos)

    }, [totalImoveisLocacao])

    useEffect(() => {

        const arrAlugueisPagos = totalImoveisModal.filter(imovel => imovel.tipoAluguel == "Aluguel pago")
        const arrAlugueisRecebidos = totalImoveisModal.filter(imovel => imovel.tipoAluguel == "Aluguel recebido")

        setTotalImoveisPagosModal(arrAlugueisPagos)
        setTotalImoveisRecebidosModal(arrAlugueisRecebidos)

    }, [totalImoveisModal])

    return (
        <div className="flex flex-col gap-2">
            {
            modalLocacaoAberto && (
            <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center  ${modoBranco ? "bg-white/90 text-black" : "bg-black/90 text-white"} z-50`}>


                <div className={`flex flex-col overflow-y-scroll h-[90vh] gap-6 ${modoBranco ? "bg-white" : "bg-premiumBg"} px-24 py-12 rounded-md`}>
                    <div className="flex self-end mb-6 cursor-pointer" onClick={() => setModalLocacaoAberto(false)}>
                        <img
                        className="w-12 h-12"
                        src={xis}
                        alt="fechar modal locação"
                        />
                    </div>
                    {/* Infos Gerais */}
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
                        <div className="overflow-hidden flex flex-col gap-8"> {/* ESSE OVERFLOW-HIDDEN QUE ESTÁ FAZENDO O TOOLTIP NÃO APARECER TODO */}
                            <div className="flex gap-8 p-6">
                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">É Residencial?</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropResidencial}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className=" opacity-50">
                                            {residencialAdd ? "Sim" : "Não"}
                                        </div>
                                        <div
                                            className={`
                                            ${residencialAberto ? "rotate-180" : "rotate-0"}
                                            transition-all ease-linear duration-500
                                            `}
                                        >
                                            <img
                                            src={setaSeletor}
                                            alt="seta-seletor"
                                            className="w-4 h-4"
                                            />
                                        </div>
                                        </div>

                                        <div
                                        className={`
                                            ${residencialAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {arrSimNao.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherResidencial(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">Tipo de Aluguel:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDroptipoAluguel}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                            <div className=" opacity-50">
                                                {tipoAluguelAdd || "Escolha o tipo de Aluguel"}
                                            </div>
                                            <div
                                                className={`
                                                ${tipoAluguelAberto ? "rotate-180" : "rotate-0"}
                                                transition-all ease-linear duration-500
                                                `}
                                            >
                                                <img
                                                src={setaSeletor}
                                                alt="seta-seletor"
                                                className="w-4 h-4"
                                                />
                                            </div>
                                        </div>

                                        <div
                                        className={`
                                            ${tipoAluguelAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {tiposAlugueis.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherTipoAluguel(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                {tipoAluguelAdd && (
                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">
                                    {tipoAluguelAdd === "Aluguel recebido"
                                        ? "Tipo do Locatário:"
                                        : "Tipo do Locador"}
                                    </label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                    <div
                                        onClick={trocarDropTipoOutro}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                    >
                                        <div className="opacity-50">
                                        {tipoOutroAdd ||
                                            `Escolha o tipo ${
                                            tipoAluguelAdd === "Aluguel recebido"
                                                ? "locatário"
                                                : "locador"
                                            }`}
                                        </div>
                                        <div
                                        className={`
                                            ${tipoOutroAberto ? "rotate-180" : "rotate-0"}
                                            transition-all ease-linear duration-500
                                        `}
                                        >
                                        <img
                                            src={setaSeletor}
                                            alt="seta-seletor"
                                            className="w-4 h-4"
                                        />
                                        </div>
                                    </div>

                                    <div
                                        className={`
                                        ${tipoOutroAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                        [transition:grid-template-rows_500ms]
                                        `}
                                    >
                                        <div className="overflow-hidden">
                                        {tiposOutro.map(item => (
                                            <div
                                            key={item}
                                            className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                            onClick={() => escolherTipoOutro(item)}
                                            >
                                            {item}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )}

                                {tipoOutroAdd === "Pessoa jurídica" && (
                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">
                                    {tipoAluguelAdd === "Aluguel recebido"
                                        ? "Regime do locatário:"
                                        : "Regime do locador"}
                                    </label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                    <div
                                        onClick={trocarDropRegimeOutro}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                    >
                                        <div className="opacity-50">
                                        {regimeOutroAdd || `Regime do ${
                                            tipoAluguelAdd === "Aluguel recebido"
                                            ? "locatário"
                                            : "locador"
                                        }`}
                                        </div>
                                        <div
                                        className={`
                                            ${regimeOutroAberto ? "rotate-180" : "rotate-0"}
                                            transition-all ease-linear duration-500
                                        `}
                                        >
                                        <img
                                            src={setaSeletor}
                                            alt="seta-seletor"
                                            className="w-4 h-4"
                                        />
                                        </div>
                                    </div>

                                    <div
                                        className={`
                                        ${regimeOutroAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                        [transition:grid-template-rows_500ms]
                                        `}
                                    >
                                        <div className="overflow-hidden">
                                        {regimesOutro.map(item => (
                                            <div
                                            key={item}
                                            className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                            onClick={() => escolherRegimeOutro(item)}
                                            >
                                            {item}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                )}

                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">Condomínio Destacado:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropCondominioEmbutido}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className="opacity-50">
                                            {condominioEmbutidoAdd !== undefined
                                            ? condominioEmbutidoAdd
                                                ? "Não"
                                                : "Sim"
                                            : "Escolha"}
                                        </div>
                                        <div
                                            className={`
                                            ${condominioEmbutidoAberto ? "rotate-180" : "rotate-0"}
                                            transition-all ease-linear duration-500
                                            `}
                                        >
                                            <img
                                            src={setaSeletor}
                                            alt="seta-seletor"
                                            className="w-4 h-4"
                                            />
                                        </div>
                                        </div>

                                        <div
                                        className={`
                                            ${condominioEmbutidoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {arrSimNao.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherCobrancaCondominio(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col max-w-[400px]">
                                    <label className="text-gray-400 w-[10vw]">Prazo Determinado:</label>

                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropPrazoDeterminado}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className="opacity-50">
                                            {prazoDeterminadoAdd ? "Sim" : "Não"}
                                        </div>
                                        <div
                                            className={`
                                            ${prazoDeterminadoAberto ? "rotate-180" : "rotate-0"}
                                            transition-all ease-linear duration-500
                                            `}
                                        >
                                            <img
                                            src={setaSeletor}
                                            alt="seta-seletor"
                                            className="w-4 h-4"
                                            />
                                        </div>
                                        </div>

                                        <div
                                        className={`
                                            ${prazoDeterminadoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {arrSimNao.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherPrazoDeterminado(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
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

                    {/* Valores */}
                    <div className="flex flex-col bg-[#222222]  rounded-xl">
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
                        <div className="flex flex-col overflow-hidden gap-8">
                        <div className="flex gap-8 p-6">
                            <div className="flex flex-col flex-1">
                            <label
                                htmlFor="valorAluguel"
                                className="flex gap-2 items-center text-gray-400 "
                            >
                                Valor Aluguel
                                <div className="text-gray-400 text-sm">*sem condomínio</div>
                            </label>
                            <input
                                className="outline-none rounded-md border-2 border-solid border-gray-300 p-1"
                                type="number"
                                id="valorAluguel"
                                onChange={mudarValorAluguelAdd}
                            />
                            </div>

                            <div className="flex flex-col flex-1">
                            <label
                                htmlFor="valorCondominio"
                                className="text-gray-400"
                            >
                                Valor Condomínio:
                            </label>
                            <input
                                className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 "
                                type="number"
                                id="valorCondominio"
                                onChange={mudarValorCondominioAdd}
                            />
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="flex gap-2">
                                    <label
                                    htmlFor="juros"
                                    className="text-gray-400"
                                    >
                                    Juros:
                                    </label>
                                    <InfoTooltip
                                    alt="explicação campo"
                                    iconSrc={interrogacaoImg}
                                    tooltipText="Do valor dos juros e das variações monetárias, em função da taxa de câmbio ou de índice ou coeficiente aplicáveis por disposição legal ou contratual"
                                    />
                                </div>
                                <input 
                                    className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 "
                                    type="number"
                                    id="juros"
                                    onChange={mudarJurosAdd}
                                />
                            </div>
                        
                            <div>
                                <div className="flex gap-2 flex-1">
                                    <label
                                    htmlFor="quantidade"
                                    className="text-gray-400"
                                    >
                                    Quantidade:
                                    </label>
                                </div>                                
                                <input
                                value={quantidadeTela}
                                className="outline-none rounded-md border-2 border-solid border-gray-300 p-1"
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                id="quantidade"
                                onChange={mudarQuantidade}
                                />
                            </div>

                        </div>

                        <div className="flex gap-4 px-6 pb-6">
                            <BotaoGeral
                            onClickFn={voltarParaInfo1}
                            principalBranco={false}
                            text="Voltar"
                            />
                            <BotaoGeral
                            onClickFn={addItemImovelLocacao}
                            principalBranco={true}
                            text="Próximo"
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                        
                    {

                        totalImoveisPagosModal.length > 0 ?
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="text-2xl pl-4">
                                    Aluguéis Pagos
                                </div>
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                    {totalImoveisPagosModal.map((imovel, index) => {
                                        return (
                                            imovel.tipoAluguel == "Aluguel pago" ?
                                                <>
                                                    {
                                                        index == 0 &&
                                                        <div className="grid grid-cols-[repeat(10,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                            <div>É residencial</div>
                                                            <div>Tipo aluguel</div>
                                                            <div>Tipo da outra parte</div>
                                                            <div>Condomínio destacado</div>
                                                            <div>Prazo determinado</div>
                                                            <div>Valor aluguel</div>
                                                            <div>Valor condomínio</div>
                                                            <div>Juros</div>
                                                            <div>Acréscimos</div>
                                                            <div>Quantidade</div>
                                                            <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                            </div>
                                                        </div>
                                                    }
                                
                                                    <div className={`grid grid-cols-[repeat(10,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                        <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                                        <div>{imovel.tipoAluguel}</div>
                                                        <div>{imovel.tipoOutraParte}</div>
                                                        <div>{imovel.condominioEmbutido ? "Não" : "Sim"}</div>
                                                        <div>{imovel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                        <div>{"R$ " + Number(imovel.valorAluguel).toLocaleString("pt-br")}</div>
                                                        <div>{"R$ " + Number(imovel.valorCondominio).toLocaleString("pt-br")}</div>
                                                        <div>{"R$ " + Number(imovel.juros).toLocaleString("pt-br")}</div>
                                                        <div>{imovel.acrescimos}</div>
                                                        <div>{imovel.quantidade}</div>
                                                        <Xis onClickFn={apagarImovelLocacaoModal} id={imovel.id} />
                                                    </div>
                                                </>
                                                :
                                                <></>
                                        )
                                    })}
                                </div>
                            </div>
                            :
                            <></>
                    }

                    {
                        totalImoveisRecebidosModal.length > 0 ?
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="text-2xl pl-4">
                                    Aluguéis Recebidos
                                </div>
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                                    {totalImoveisRecebidosModal.map((imovel, index) => {
                                        return (
                                            imovel.tipoAluguel == "Aluguel recebido" ?
                                                <>
                                                    {
                                                        index == 0 &&
                                                        <div className="grid grid-cols-10 gap-10 items-center mb-4 p-4 font-bold">
                                                            <div>É residencial</div>
                                                            <div>Tipo aluguel</div>
                                                            <div>Tipo da outra parte</div>
                                                            <div>Condomínio destacado</div>
                                                            <div>Prazo determinado</div>
                                                            <div>Valor aluguel</div>
                                                            <div>Valor condomínio</div>
                                                            <div>Juros</div>
                                                            <div>Acréscimos</div>
                                                            <div>Quantidade</div>
                                                        </div>
                                                    }
                                
                                                    <div className={`grid grid-cols-10 gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                        <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                                        <div>{imovel.tipoAluguel}</div>
                                                        <div>{imovel.tipoOutraParte}</div>
                                                        <div>{imovel.condominioEmbutido ? "Não" : "Sim"}</div>
                                                        <div>{imovel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                        <div>{"R$ " + Number(imovel.valorAluguel).toLocaleString("pt-br")}</div>
                                                        <div>{"R$ " + Number(imovel.valorCondominio).toLocaleString("pt-br")}</div>
                                                        <div>{"R$ " + Number(imovel.juros).toLocaleString("pt-br")}</div>
                                                        <div>{imovel.acrescimos}</div>
                                                        <div>{imovel.quantidade}</div>
                                                    </div>
                                                </>
                                                :
                                                <></>
                                        )
                                    })}
                                </div>
                            </div>
                            :
                            <></>
                    }

                    {
                        totalImoveisModal.length > 0 &&
                        <div className="mt-6">
                            <BotaoGeral onClickFn={addImovelLocacao} principalBranco={true} text="Salvar" />
                        </div>
                    }
 
                </div>
            </div>
            )
            }




            <div className="">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-3xl mb-2">
                            Locação
                        </div>
                        <div className="flex gap-4">
                            <BotaoGeral onClickFn={abrirModalLocacaoFn} principalBranco={true} text="Adicionar Novo Imóvel (Locação)"/>
                            <BotaoGeral onClickFn={clicarInput} principalBranco={true} text="Subir XML" />
                            <input type="file" className="opacity-0" ref={fileRef} />
                        </div>
                    </div>
                </div>
                {
                    totalImoveisAlugueisPagos.length > 0 ?
                        <div className="flex flex-col gap-4 mt-8">
                            <div className="text-2xl pl-4">
                                Aluguéis Pagos
                            </div>
                            <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                {totalImoveisAlugueisPagos.map((imovel, index) => {
                                    return (
                                        imovel.tipoAluguel == "Aluguel pago"?
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>É residencial</div>
                                                        <div>Tipo aluguel</div>
                                                        <div>Tipo da outra parte</div>
                                                        <div>Condomínio destacado</div>
                                                        <div>Prazo determinado</div>
                                                        <div>Valor aluguel</div>
                                                        <div>Valor condomínio</div>
                                                        <div>Juros</div>
                                                        <div>Acréscimos</div>
                                                        <div>Compõe Custo</div>
                                                        <div>Quantidade</div>
                                                        <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                        </div>
                                                    </div>
                                                }
                            
                                                <div className={`grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                                    <div>{imovel.tipoAluguel}</div>
                                                    <div>{imovel.tipoOutraParte}</div>
                                                    <div>{imovel.condominioEmbutido ? "Não" : "Sim"}</div>
                                                    <div>{imovel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                    <div>{"R$ " + Number(imovel.valorAluguel).toLocaleString("pt-br")}</div>
                                                    <div>{"R$ " + Number(imovel.valorCondominio).toLocaleString("pt-br")}</div>
                                                    <div>{"R$ " + Number(imovel.juros).toLocaleString("pt-br")}</div>
                                                    <div>{imovel.acrescimos}</div>
                                                    <ToggleButtonMapeado texto="" valor={imovel.compoeCusto} onChangeFn={() => alterarCompoeCusto(imovel.id)}/>
                                                    <div>{imovel.quantidade}</div>
                                                    <Xis onClickFn={apagarImovelLocacao} id={imovel.id} />
                                                </div>
                                            </>
                                            :
                                            <></>
                                    )
                                })}
                            </div>
                        </div>
                        :
                        <></>
                }

                {
                    totalImoveisAlugueisRecebidos.length > 0 ?
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="text-2xl pl-4">
                                Aluguéis Recebidos
                            </div>
                            <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                                {totalImoveisAlugueisRecebidos.map((imovel, index) => {
                                    return (
                                        imovel.tipoAluguel == "Aluguel recebido" ?
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-10 gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>É residencial</div>
                                                        <div>Tipo aluguel</div>
                                                        <div>Tipo da outra parte</div>
                                                        <div>Condomínio destacado</div>
                                                        <div>Prazo determinado</div>
                                                        <div>Valor aluguel</div>
                                                        <div>Valor condomínio</div>
                                                        <div>Juros</div>
                                                        <div>Acréscimos</div>
                                                        <div>Quantidade</div>
                                                    </div>
                                                }
                            
                                                <div className={`grid grid-cols-10 gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                                    <div>{imovel.tipoAluguel}</div>
                                                    <div>{imovel.tipoOutraParte}</div>
                                                    <div>{imovel.condominioEmbutido ? "Não" : "Sim"}</div>
                                                    <div>{imovel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                    <div>{"R$ " + Number(imovel.valorAluguel).toLocaleString("pt-br")}</div>
                                                    <div>{"R$ " + Number(imovel.valorCondominio).toLocaleString("pt-br")}</div>
                                                    <div>{"R$ " + Number(imovel.juros).toLocaleString("pt-br")}</div>
                                                    <div>{imovel.acrescimos}</div>
                                                    <div>{imovel.quantidade}</div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                    )
                                })}
                            </div>
                        </div>
                        :
                        <></>
                }

            </div>
        </div>
    )
}