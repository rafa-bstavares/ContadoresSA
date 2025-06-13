import { ChangeEvent, useContext, useEffect, useState } from "react"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import interrogacaoImg from "../../assets/images/interrogaçãoImg.svg"
import InfoTooltip from "../InfoToolTip/InfoToolTip"
import { ContextoImoveis } from "../../Contextos/ContextoImoveis/ContextoImoveis"
import { ImoveisLocacaoObj } from "../../Contextos/ContextoImoveis/ContextoImoveis"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"

type Props = {
    modoBranco: boolean
}

export default function Locacao2({modoBranco}: Props){

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
    const [regimeOutroAdd, setRegimeOutroAdd] = useState<regimeOutroType>("Pessoa Fisica")
    const [quantidadeAdd, setQuantidadeAdd] = useState<number>(1)
    const [quantidadeTela, setQuantidadeTela] = useState<string>("1")
    const [tiposAlugueis, setTiposAlugueis] = useState<(TiposAluguelType)[]>(["Aluguel pago","Aluguel recebido"])
    const [regimesOutro, setRegimesOutro] = useState<regimeOutroType[]>(["Lucro Presumido","Lucro Real","Simples Nacional"])
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [info3Aberto, setInfo3Aberto] = useState<boolean>(false)
    const [info4Aberto, setInfo4Aberto] = useState<boolean>(false)


    const arrRegimesImutavel: regimeOutroType[] = ["Lucro Presumido","Lucro Real","Simples Nacional"]
    

    const tiposCobrancasCondominio: TiposCobrancaCondominio[] = [
        "Embutido no aluguel",
        "Separado do aluguel"
    ]

    const tiposOutro: (TiposOutroType)[] = [
        "Pessoa física",
        "Pessoa jurídica"
    ]

    const arrSimNao: simNaoType[] = [
        "Sim", 
        "Não"
    ]

    const {totalImoveisLocacao, setTotalImoveisLocacao} = useContext(ContextoImoveis)
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

    function mudarQuantidade(e: ChangeEvent<HTMLInputElement>){

            const raw = e.target.value

            if(raw.includes(",") || raw.includes(".")){
                return 
            }
          
            // 1) Se estiver vazio, limpa
            if (raw === "") {
              setQuantidadeTela("")
              setQuantidadeAdd(0)
              return
            }
          
            // 2) Normaliza vírgula para ponto (se você ainda quiser suportar "1,0")
            const normalized = raw.replace(",", ".")
          
            // 3) Tenta converter para número
            const parsed = Number(normalized)
            if (Number.isNaN(parsed)) {
              // não é um número válido
              return
            }
          
            // 4) Só aceita se for inteiro
            if (!Number.isInteger(parsed)) {
              // aqui você pode exibir uma mensagem de erro, bloquear o set, etc.
              console.warn("Digite apenas números inteiros.")
              return
            }
          
            // 5) OK, é inteiro
            setQuantidadeAdd(parsed)
            setQuantidadeTela(parsed.toString())
          

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
        // como estou verificando a quantidadeAdd aqui no if, posso colocar ela como zero na parte de verificar se é inteiro, ai caso ele n preencha ou deixe zero n passa
        console.log("////////////")
        console.log(regimeOutroAdd)
        console.log()
        if(valorAluguelAdd && valorCondominioAdd && jurosAdd && tipoAluguelAdd && tipoOutroAdd && condominioEmbutidoAdd !== undefined && regimeOutroAdd && quantidadeAdd){


            let maxId = 0
            let idAtual  
            totalImoveisLocacao.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            idAtual = maxId + 1  


            const novoArr = [...totalImoveisLocacao]
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
                regimeOutro: regimeOutroAdd,
                quantidade: quantidadeAdd,
                id: idAtual 
             }
            novoArr.push(novoObjAtual)

            setTotalImoveisLocacao(novoArr)

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
             
             setInfo4Aberto(false)
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
                if(residencialAdd !== undefined && tipoAluguelAdd && condominioEmbutidoAdd !== undefined && tipoOutroAdd && regimeOutroAdd){
                    setInfo1Aberto(false)
                    setInfo2Aberto(true)
                }else{
                    setTemErro(true)
                    setTextoErro("Preencha todos os campos de 'Informações gerais'")
                }
            }else{
                if(residencialAdd !== undefined && tipoAluguelAdd && condominioEmbutidoAdd !== undefined && tipoOutroAdd && regimeOutroAdd){
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

    function voltarParaInfo1(){
        setInfo2Aberto(false)
        setInfo1Aberto(true)
    }

    function avancarParaInfo3(){
        if(valorAluguelAdd && valorCondominioAdd && jurosAdd){
            setInfo3Aberto(true)
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

    useEffect(() => {
        console.log(quantidadeAdd)
    }, [quantidadeAdd])

    useEffect(() => {
        console.log(totalImoveisLocacao)
    }, [totalImoveisLocacao])


    useEffect(() => {
        if(passo1 == false){
            // Ajeitando tipos Algueis
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


    return (
        <div className="flex flex-col gap-2 w-1/2">
            <div className="p-12">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-3xl mb-2">
                            Locação
                        </div>
                        <div className="flex flex-col gap-6 items-start">
                        {/*                    <div className="flex flex-col" >
                                <label htmlFor="eResidencial">É residencial:</label>
                                <div className="flex gap-6">
                                    <div className="flex gap-2">
                                        <input onChange={(e) => mudarResidencial(e)} type="radio" className="residencial" name="residencial" id="sim residencial" defaultChecked/>
                                        <label htmlFor="sim residencial">Sim</label>
                                    </div>
                                    <div className="flex gap-2">
                                        <input onChange={(e) => mudarResidencial(e)} type="radio" className="residencial" name="residencial" id="nao residencial" />
                                        <label htmlFor="nao residencial">Não</label>
                                    </div>
                                </div>
                            </div>*/}
                                {/* Infos Gerais */}
                                <div className="flex flex-col gap-1 bg-[#222222] pb-12 rounded-xl ">
                                    <div className="text-lg flex items-center gap-2 mb-6 px-8 py-2 bg-[#1d1d1d] border-[#9b9a9a] border-2 border-solid rounded-xl">
                                        <div className="  rounded-full h-full aspect-square flex justify-center items-center p-4">
                                            1
                                        </div>
                                        <div>
                                            Informações Gerais
                                        </div>
                                    </div>
                                    <div className={`gap-6 ml-6 px-8 ${info1Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                        <div className="overflow-hidden flex flex-col gap-8">
                                            <div className="flex gap-8">
                                                {<div className="flex flex-col">
                                                    <label className="text-gray-400">É residencial?</label>
                                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                        <div onClick={trocarDropResidencial} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                            <div className="text-sm opacity-50">
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
                                                </div>}
                                                <div className="flex flex-col">
                                                    <label className="text-gray-400">Tipo do aluguel:</label>
                                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                        <div onClick={trocarDroptipoAluguel} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                            <div className="text-sm opacity-50">
                                                                {
                                                                    tipoAluguelAdd ?
                                                                        tipoAluguelAdd
                                                                            :
                                                                        "Escolha o tipo do aluguel"
                                                                }
                                                            </div>
                                                            <div className={`${tipoAluguelAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                                <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                            </div>
                                                        </div>
                                                        <div className={` ${tipoAluguelAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                            <div className={`overflow-hidden`}>
                                                                {
                                                                    tiposAlugueis.map(item => {
                                                                        return (
                                                                            <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherTipoAluguel(item)} >{item}</div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    tipoAluguelAdd &&
                                                    <div className="flex flex-col">
                                                        <label className="text-gray-400">{tipoAluguelAdd == "Aluguel recebido" ? "Tipo do locatário:" : "Tipo do locador"}</label>
                                                        <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                            <div onClick={trocarDropTipoOutro} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                                <div className="text-sm opacity-50">
                                                                    {
                                                                        tipoOutroAdd ?
                                                                            tipoOutroAdd
                                                                                :
                                                                            "Escolha o tipo " + (tipoAluguelAdd == "Aluguel recebido" ? "locatário" : "locador")
                                                                    }
                                                                </div>
                                                                <div className={`${tipoOutroAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                                    <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                                </div>
                                                            </div>
                                                            <div className={` ${tipoOutroAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                                <div className={`overflow-hidden`}>
                                                                    {
                                                                        tiposOutro.map(item => {
                                                                            return (
                                                                                <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherTipoOutro(item)} >{item}</div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    tipoOutroAdd == "Pessoa jurídica" &&
                                                    <div className="flex flex-col">
                                                        <label className="text-gray-400">{tipoAluguelAdd == "Aluguel recebido" ? "Regime do locatário:" : "Regime do locador"}</label>
                                                        <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                            <div onClick={trocarDropRegimeOutro} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                                <div className="text-sm opacity-50">
                                                                    {
                                                                        regimeOutroAdd ?
                                                                            regimeOutroAdd
                                                                                :
                                                                            "Regime do " + (tipoAluguelAdd == "Aluguel recebido" ? "locatário" : "locador")
                                                                    }
                                                                </div>
                                                                <div className={`${regimeOutroAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                                    <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                                </div>
                                                            </div>
                                                            <div className={` ${regimeOutroAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                                <div className={`overflow-hidden`}>
                                                                    {
                                                                        regimesOutro.map(item => {
                                                                            return (
                                                                                <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300"onClick={() => escolherRegimeOutro(item)} >{item}</div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="flex flex-col">
                                                    <label className="text-gray-400">Condomínio destacado:</label>
                                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                        <div onClick={trocarDropCondominioEmbutido} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                            <div className="text-sm opacity-50">
                                                                {
                                                                    condominioEmbutidoAdd !== undefined ?
                                                                        condominioEmbutidoAdd ? "Não" : "Sim"
                                                                            :
                                                                        "Escolha"
                                                                }
                                                            </div>
                                                            <div className={`${condominioEmbutidoAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                                <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                            </div>
                                                        </div>
                                                        <div className={` ${condominioEmbutidoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                            <div className={`overflow-hidden`}>
                                                                {
                                                                    arrSimNao.map(item => {
                                                                        return (
                                                                            <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300" onClick={() => escolherCobrancaCondominio(item)}>{item}</div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <BotaoGeral onClickFn={avancarParaInfo2} principalBranco={true} text="Próximo"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/* Valores */}
                            <div className="flex flex-col gap-1 bg-[#222222] p-4 rounded-md">
                                <div className="text-lg flex items-center gap-4 mb-6">
                                    <div className="border-2 border-solid border-white rounded-full h-full aspect-square flex justify-center items-center p-4">
                                        2
                                    </div>
                                    <div>
                                        Valores
                                    </div>
                                </div>
                                <div className={`gap-6 ml-6 ${info2Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                    <div className="flex flex-col overflow-hidden gap-8">
                                        <div className="flex gap-8">
                                            <div className="flex flex-col">
                                                <label htmlFor="valorAluguel" className="flex gap-2 items-center text-gray-400">
                                                    Valor aluguel
                                                    <div className="text-gray-400 text-sm">*sem condomínio</div>
                                                </label>
                                                <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1" type="number" id="valorAluguel" onChange={(e) => mudarValorAluguelAdd(e)}/>
                                            </div>
                                            <div className="flex flex-col ">
                                                <label htmlFor="valorCondominio" className="text-gray-400">Valor condomínio:</label>
                                                <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 w-28" type="number" id="valorCondominio" onChange={(e) => mudarValorCondominioAdd(e)}/>
                                            </div>
                                            <div className="flex flex-col ">
                                                <div className="flex gap-2">
                                                    <label htmlFor="juros" className="text-gray-400">Juros:</label>
                                                    <InfoTooltip alt="explicação campo" iconSrc={interrogacaoImg} tooltipText="Do valor dos juros e das variações monetárias, em função da taxa de câmbio ou de índice ou coeficiente aplicáveis por disposição legal ou contratual"/>
                                                </div>
                                                <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 w-28" type="number" id="juros" onChange={(e) => mudarJurosAdd(e)}/>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <BotaoGeral onClickFn={voltarParaInfo1} principalBranco={false} text="Voltar"/>
                                            <BotaoGeral onClickFn={avancarParaInfo3} principalBranco={true} text="Próximo"/>
                                        </div>
                                        {/*<div className="flex flex-col ">
                                            <div className="flex gap-2">
                                                <label htmlFor="acrescimos" className="text-gray-400">Acréscimos e ajustes</label>
                                                <InfoTooltip alt="explicação campo" iconSrc={interrogacaoImg} tooltipText="Dos valores de acréscimo decorrentes de ajuste do valor da operação, multas, juros, acréscimos e encargos, bem como os descontos condicionais"/>
                                            </div>
                                            <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-1 w-28" type="number" id="acrescimos" onChange={(e) => mudarAcrescimosAdd(e)}/>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                            {/* Datas */}
                            <div className="flex flex-col gap-1 bg-[#222222] p-4 rounded-md">
                                <div className="text-lg flex items-center gap-4 mb-6">
                                    <div className="border-2 border-solid border-white rounded-full h-full aspect-square flex justify-center items-center p-4">
                                        3
                                    </div>
                                    <div>
                                        Datas
                                    </div>
                                </div>
                                <div className={`gap-6 ml-6 ${info3Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                    <div className="flex flex-col overflow-hidden gap-8">
                                        <div className="flex gap-8">
                                            <div className="flex flex-col">
                                                <label className="text-gray-400">Prazo determinado:</label>
                                                <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                                    <div onClick={trocarDropPrazoDeterminado} className="flex gap-2 items-center justify-between p-2 cursor-pointer">
                                                        <div className="text-sm opacity-50">
                                                            {
                                                                prazoDeterminadoAdd ?
                                                                    "Sim"
                                                                        :
                                                                    "Não"
                                                            }
                                                        </div>
                                                        <div className={`${prazoDeterminadoAberto ? "rotate-180" : "rotate-0"} transition-all ease-linear duration-500`}>
                                                            <img src={setaSeletor} alt="setaa-seletor" className="w-4 h-4 "/>
                                                        </div>
                                                    </div>
                                                    <div className={` ${prazoDeterminadoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                                        <div className={`overflow-hidden`}>
                                                            {
                                                                arrSimNao.map(item => {
                                                                    return (
                                                                        <div className="p-2 rounded-md cursor-pointer hover:bg-gray-300" onClick={() => escolherPrazoDeterminado(item)}>{item}</div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <BotaoGeral onClickFn={voltarParaInfo2} principalBranco={false} text="Voltar"/>
                                            <BotaoGeral onClickFn={avancarParaInfo4} principalBranco={true} text="Próximo"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 bg-[#222222] p-4 rounded-md">
                                <div className="text-lg flex items-center gap-4 mb-6">
                                    <div className="border-2 border-solid border-white rounded-full h-full aspect-square flex justify-center items-center p-4">
                                        4
                                    </div>
                                    <div>
                                        Quantidade
                                    </div>
                                </div>
                                <div className={` gap-6 ml-6 ${info4Aberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                                    <div className="overflow-hidden flex flex-col ml-6 gap-8">
                                        <div className="">
                                            <input value={quantidadeTela} className=" outline-none rounded-md border-2 border-solid border-gray-300 p-1 w-28" type="number" id="acrescimos" onChange={(e) => mudarQuantidade(e)}/>
                                        </div>
                                        <div className="flex gap-4">
                                            <BotaoGeral onClickFn={voltarParaInfo3} principalBranco={false} text="Voltar"/>
                                            <BotaoGeral onClickFn={addImovelLocacao} principalBranco={true} text="Adicionar Imóvel"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 flex flex-col gap-2">
                    {totalImoveisLocacao.map((imovel, index) => {
                        return (
                            <>
                                {
                                    index == 0 &&
                                    <div className="grid grid-cols-10 gap-10 items-center mb-4">
                                        <div>É residencial</div>
                                        <div>Tipo aluguel</div>
                                        <div>Tipo da outra parte</div>
                                        <div>Condomínio destacado</div>
                                        <div>Prazo determinado</div>
                                        <div>Valor aluguel</div>
                                        <div>Valor condomínio</div>
                                        <div>Juros</div>
                                        <div>Demais acréscimos e ajustes</div>
                                        <div>Quantidade</div>
                                    </div>
                                }
                
                                <div className="grid grid-cols-10 gap-10 items-center">
                                    <div>{imovel.residencial ? "Sim" : "Não"}</div>
                                    <div>{imovel.tipoAluguel}</div>
                                    <div>{imovel.tipoOutraParte}</div>
                                    <div>{imovel.condominioEmbutido ? "Não" : "Sim"}</div>
                                    <div>{imovel.prazoDeterminado ? "Sim" : "Não"}</div>
                                    <div>{imovel.valorAluguel}</div>
                                    <div>{imovel.valorCondominio}</div>
                                    <div>{imovel.juros}</div>
                                    <div>{imovel.acrescimos}</div>
                                    <div>{imovel.quantidade}</div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}