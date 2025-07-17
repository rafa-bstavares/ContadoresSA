import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import interrogacaoImg from "../../assets/images/interrogaçãoImg.svg"
import InfoTooltip from "../InfoToolTip/InfoToolTip"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import xis from "../../assets/images/xisContab.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { ContextoMoveis, MoveisLocacaoObj } from "../../Contextos/ContextoMoveis/ContextoMoveis"
import { Xis } from "../Xis/Xis"
import { ToggleButtonMapeado } from "../ToggleButtonMapeado/ToggleButtonMapeado"
import { ToggleButton } from "../ToggleButton/ToggleButton"

type Props = {
    modoBranco: boolean
}

export default function LocacaoMoveis({modoBranco}: Props){
    const fileRef = useRef<HTMLInputElement>(null)

    function clicarInput(){
        fileRef.current?.click()
    }

    type TiposAluguelType = "Aluguel pago" | "Aluguel recebido"
    type TiposOutroType = "Pessoa física" | "Pessoa jurídica"
    type TiposCobrancaCondominio = "Embutido no aluguel" | "Separado do aluguel"
    type simNaoType = "Sim" | "Não"
    type regimeOutroType = "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica"

    const [valorLocacaoAdd, setValorLocacaoAdd] = useState<string>("")
    const [valorMaoObraAdd, setValorMaoObraAdd] = useState<string>("")
    const [tipoAluguelAdd, setTipoAluguelAdd] = useState<TiposAluguelType>()
    const [tipoOutroAdd, setTipoOutroAdd] = useState<TiposOutroType>()
    const [prazoDeterminadoAdd, setPrazoDeterminadoAdd] = useState<boolean>(true)
    const [creditaPisCofinsAdd, setCreditaPisCofinsAdd] = useState<boolean>(true)
    const [comOperadorAdd, setComOperadorAdd] = useState<boolean>(true)
    const [regimeOutroAdd, setRegimeOutroAdd] = useState<regimeOutroType>()
    const [totalMoveisModal, setTotalMoveisModal] = useState<MoveisLocacaoObj[]>([])
    const [totalMoveisPagosModal, setTotalMoveisPagosModal] = useState<MoveisLocacaoObj[]>([])
    const [totalMoveisRecebidosModal, setTotalMoveisRecebidosModal] = useState<MoveisLocacaoObj[]>([])

    const [tiposAlugueis, setTiposAlugueis] = useState<(TiposAluguelType)[]>(["Aluguel pago","Aluguel recebido"])
    const [regimesOutro, setRegimesOutro] = useState<regimeOutroType[]>(["Lucro Presumido","Lucro Real","Simples Nacional"])
    const [maoObraNaTela, setMaoObraNaTela] = useState<boolean>(false)

    const [tipoAluguelAberto, setTipoAluguelAberto] = useState<boolean>(false)
    const [creditaPisCofinsAberto, setCreditaPisCofinsAberto] = useState<boolean>(false)
    const [comOperadorAberto, setComOperadorAberto] = useState<boolean>(false)
    const [tipoOutroAberto, setTipoOutroAberto] = useState<boolean>(false)
    const [regimeOutroAberto, setRegimeOutroAberto] = useState<boolean>(false)
    const [prazoDeterminadoAberto, setPrazoDeterminadoAberto] = useState<boolean>(false)
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [modalLocacaoMoveisAberto, setModalLocacaoMoveisAberto] = useState<boolean>(false)


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

    const {totalMoveisLocacao, setTotalMoveisLocacao, setTotalMoveisAlugueisPagos, setTotalMoveisAlugueisRecebidos, totalMoveisAlugueisPagos, totalMoveisAlugueisRecebidos} = useContext(ContextoMoveis)
    const {setTemErro,setTextoErro} = useContext(ContextoErro)
    const {objMinhaEmpresaOuPessoaAtual, passo1} = useContext(ContextoGeral)


    function mudarValorLocacaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorLocacaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorLocacaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarValorMaoObraAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorMaoObraAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorMaoObraAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function addMovelLocacao(){
        const novoArrFinal = [...totalMoveisLocacao, ...totalMoveisModal]
        setTotalMoveisLocacao(novoArrFinal)
        
        //Resetar inputs e fechar modal
        setValorLocacaoAdd("")
        setTipoAluguelAdd(undefined)
        setTipoOutroAdd(undefined)
        setPrazoDeterminadoAdd(true)
        setComOperadorAdd(true)
        setCreditaPisCofinsAdd(true)
        setValorMaoObraAdd("")
        setRegimeOutroAdd("Pessoa Fisica")
        
        setInfo2Aberto(false)
        setInfo1Aberto(true)
        setTotalMoveisModal([])

        setModalLocacaoMoveisAberto(false)

    }

    function addItemMovelLocacao(temMaoDeObra: boolean){
        // como estou verificando a quantidadeAdd aqui no if, posso colocar ela como zero na parte de verificar se é inteiro, ai caso ele n preencha ou deixe zero n passa
        console.log("////////////")
        console.log("valor locacao")
        console.log(tipoAluguelAdd)
        if(valorLocacaoAdd && tipoAluguelAdd && tipoOutroAdd && creditaPisCofinsAdd !== undefined && comOperadorAdd !== undefined){

            let maxId = 0
            let idAtual  
            totalMoveisLocacao.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            const indexItemAtual = totalMoveisModal.length

            idAtual = maxId + 1 + indexItemAtual


            const novoArr = [...totalMoveisModal]
            const novoObjAtual: MoveisLocacaoObj = {
                valorLocacao: Number(valorLocacaoAdd),
                tipoAluguel: tipoAluguelAdd,
                tipoOutraParte: tipoOutroAdd,
                prazoDeterminado: prazoDeterminadoAdd,
                comOperador: comOperadorAdd,
                creditaPisCofins: creditaPisCofinsAdd,
                valorMaoObra: temMaoDeObra ? Number(valorLocacaoAdd) : 0 ,
                compoeCusto: false,
                regimeOutro: tipoOutroAdd == "Pessoa física" ? "Pessoa Fisica" : regimeOutroAdd ? regimeOutroAdd : "Simples Nacional",
                id: idAtual 
             }
            novoArr.push(novoObjAtual)

            setTotalMoveisModal(novoArr)

             setValorLocacaoAdd("")
             setTipoAluguelAdd(undefined)
             setTipoOutroAdd(undefined)
             setPrazoDeterminadoAdd(true)
             setComOperadorAdd(true)
             setCreditaPisCofinsAdd(true)
             setValorMaoObraAdd("")
             setRegimeOutroAdd("Pessoa Fisica")
             
             setInfo2Aberto(false)
             setInfo1Aberto(true)
             

        }else{
            setTemErro(true)
            setTextoErro("Para adicionar uma nova locação preencha todos os campos com dados válidos. A quantidade deve ser maior que zero")
        }
    }

    function conferirMovelLocacao(){
        if((tipoAluguelAdd == "Aluguel pago" && (regimeOutroAdd == "Lucro Presumido" || regimeOutroAdd == "Lucro Real")) || (tipoAluguelAdd == "Aluguel recebido" && (objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Presumido" || objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real"))){
            // O locador é lucro real ou lucro presumido, logo, tem que ter valor mão de obra
            if(valorMaoObraAdd){
                addItemMovelLocacao(true)
            }else{
                setTemErro(true)
                setTextoErro("Preencha o valor de mão de obra. Não pode ser zero")
            }


        }else{
            addItemMovelLocacao(false)
        }
    }

    function trocarDroptipoAluguel(){
        setTipoAluguelAberto(!tipoAluguelAberto)
    }

    function trocarDropTipoOutro(){
        setTipoOutroAberto(!tipoOutroAberto)
    }

    function trocarDropComOperador(){
        setComOperadorAberto(!comOperadorAberto)
    }

    function trocarDropRegimeOutro(){
        setRegimeOutroAberto(!regimeOutroAberto)
    }
    
    function trocarDropCreditaPisCofins(){
        setCreditaPisCofinsAberto(!creditaPisCofinsAberto)
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

    function escolherCreditaPisCofins(){
        setCreditaPisCofinsAdd(!creditaPisCofinsAdd)
    }

    function escolherComOperador(item: simNaoType){
        switch(item){
            case "Sim":
                setComOperadorAdd(true)
                break

            case "Não":
                setComOperadorAdd(false)
                break
        }

        trocarDropComOperador()
    }

    function avancarParaInfo2(){
        if(tipoOutroAdd){
            if(tipoOutroAdd == "Pessoa jurídica"){
                if(tipoAluguelAdd && tipoOutroAdd && regimeOutroAdd && prazoDeterminadoAdd !== undefined && comOperadorAdd !== undefined && creditaPisCofinsAdd !== undefined){
                    setInfo1Aberto(false)
                    setInfo2Aberto(true)
                }else{
                    setTemErro(true)
                    setTextoErro("Preencha todos os campos de 'Informações gerais'")
                }
            }else{
                if(tipoAluguelAdd && tipoOutroAdd && prazoDeterminadoAdd !== undefined && comOperadorAdd !== undefined && creditaPisCofinsAdd !== undefined){
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


    function checkTemCreditoPisCofinsModal(id: number){
        const novoArr = [...totalMoveisModal]
        const index = novoArr.findIndex(item => item.id == id)
            if(index > -1){
                novoArr[index].creditaPisCofins = !novoArr[index].creditaPisCofins
            }
        setTotalMoveisModal(novoArr)
    }

    function checkTemCreditoPisCofinsResultado(id: number){
        const novoArr = [...totalMoveisLocacao]
        const index = novoArr.findIndex(item => item.id == id)
            if(index > -1){
                novoArr[index].creditaPisCofins = !novoArr[index].creditaPisCofins
            }
        setTotalMoveisLocacao(novoArr)
    }


    function abrirModalLocacaoMoveisFn(){
        setModalLocacaoMoveisAberto(true)
    }

    function apagarMovelLocacao(id: number){
        const novoArr = [...totalMoveisLocacao]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalMoveisLocacao(arrFinal)
    }

    function apagarMovelLocacaoModal(id: number){
        console.log("id recebido: " + id)
        console.log("total moveis modal: ")
        console.log(totalMoveisModal)
        const novoArr = [...totalMoveisModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        console.log("arr Final")
        setTotalMoveisModal(arrFinal)
    }


    function alterarCompoeCusto(id: number){
        const objTotalMoveisClone = [...totalMoveisLocacao]
        const idEncontrado = objTotalMoveisClone.findIndex(item => item.id == id)
        if(idEncontrado > -1){
            objTotalMoveisClone[idEncontrado].compoeCusto = !objTotalMoveisClone[idEncontrado].compoeCusto 
            setTotalMoveisLocacao(objTotalMoveisClone)
        }else{
            console.log("ID compoe custo não encontrado")
        }
    }



    useEffect(() => {
        console.log("Total moveis locação")
        console.log(totalMoveisLocacao)
    }, [totalMoveisLocacao])

    useEffect(() => {
        console.log("mudou valor locacao add")
        console.log(valorLocacaoAdd)
    }, [valorLocacaoAdd])



    useEffect(() => {

        console.log("REGIME MINHA EMPRESA")
        console.log(objMinhaEmpresaOuPessoaAtual.meuRegime)    

        if(tipoAluguelAdd == "Aluguel pago"){
            // O locador é o outro, preciso conferir se ele é real ou presumido, se sim, habilitar campo valor mão de obra
            console.log("Regime do oputro")
            console.log(regimeOutroAdd)
            console.log("TIPO LOCADOR")
            console.log(tipoOutroAdd)
            if((tipoOutroAdd == "Pessoa jurídica") && (regimeOutroAdd == "Lucro Real" || regimeOutroAdd == "Lucro Presumido")){
                setMaoObraNaTela(true)
            }else{
                setMaoObraNaTela(false)
            }
        }else{
            // O locador é o meu cliente, preciso conferir se ele é real ou presumido, se sim, habilitar campo valor mão de obra
            if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Presumido" || objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real"){
                setMaoObraNaTela(true)
            }else{
                setMaoObraNaTela(false)
            }
        }
    }, [tipoAluguelAdd, tipoOutroAdd, regimeOutroAdd])



    useEffect(() => {
        console.log("Regimes Outro locacao:")
        console.log(regimesOutro)
    }, [regimesOutro])


    useEffect(() => {

        const arrAlugueisPagos = totalMoveisLocacao.filter(movel => movel.tipoAluguel == "Aluguel pago")
        const arrAlugueisRecebidos = totalMoveisLocacao.filter(movel => movel.tipoAluguel == "Aluguel recebido")

        setTotalMoveisAlugueisPagos(arrAlugueisPagos)
        setTotalMoveisAlugueisRecebidos(arrAlugueisRecebidos)

    }, [totalMoveisLocacao])

    useEffect(() => {

        const arrAlugueisPagos = totalMoveisModal.filter(movel => movel.tipoAluguel == "Aluguel pago")
        const arrAlugueisRecebidos = totalMoveisModal.filter(movel => movel.tipoAluguel == "Aluguel recebido")

        setTotalMoveisPagosModal(arrAlugueisPagos)
        setTotalMoveisRecebidosModal(arrAlugueisRecebidos)

    }, [totalMoveisModal])



    return (
        <div className="flex flex-col gap-2">
            {
            modalLocacaoMoveisAberto && (
            <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center  ${modoBranco ? "bg-white/90 text-black" : "bg-black/90 text-white"} z-50`}>


                <div className={`flex flex-col overflow-y-scroll h-[90vh] gap-6 ${modoBranco ? "bg-white" : "bg-premiumBg"} px-24 py-12 rounded-md`}>
                    <div className="flex self-end mb-6 cursor-pointer" onClick={() => setModalLocacaoMoveisAberto(false)}>
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
                                    <label className="text-gray-400 w-[10vw]">Tipo de Aluguel:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDroptipoAluguel}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                            <div className=" opacity-50">
                                                {tipoAluguelAdd || "Escolha o tipo de aluguel"}
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
                                        ? "Regime do Locatário:"
                                        : "Regime do Locador"}
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
                                    <label className="text-gray-400 w-[10vw]">Com Operador</label>

                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropComOperador}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className="opacity-50">
                                            {comOperadorAdd ? "Sim" : "Não"}
                                        </div>
                                        <div
                                            className={`
                                            ${comOperadorAberto ? "rotate-180" : "rotate-0"}
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
                                            ${comOperadorAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {arrSimNao.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherComOperador(item)}
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
                        <div className="flex gap-8 p-6 items-end">
                            <div className="flex flex-col flex-1">
                                <label
                                    htmlFor="valorAluguel" 
                                    className="flex flex-col text-gray-400"
                                > 
                                    <div>Valor Locação</div>
                                    <div className="text-gray-400 text-sm">(Se a locação incluir mão de obra, considere o valor total com a mão de obra já incorporada ao valor da locação.)</div>
                                </label>
                                <input
                                    className="outline-none rounded-md border-2 border-solid border-gray-300 p-1"
                                    type="number"
                                    id="valorAluguel"
                                    value={valorLocacaoAdd}
                                    onChange={mudarValorLocacaoAdd}
                                />
                            </div>
                        
                            {
                            maoObraNaTela &&
                            <div className="flex flex-col flex-1">
                                <label
                                    htmlFor="valorAluguel" 
                                    className="flex gap-2 items-center text-gray-400"
                                > 
                                    Valor Mão de Obra
                                </label>
                                <input
                                    className="outline-none rounded-md border-2 border-solid border-gray-300 p-1"
                                    type="number"
                                    id="valorAluguel"
                                    onChange={mudarValorMaoObraAdd}
                                />
                            </div>
                            }

                        </div>

                        <div className="flex gap-4 px-6 pb-6">
                            <BotaoGeral
                            onClickFn={voltarParaInfo1}
                            principalBranco={false}
                            text="Voltar"
                            />
                            <BotaoGeral
                            onClickFn={conferirMovelLocacao}
                            principalBranco={true}
                            text="Adicionar Item"
                            />
                        </div>
                        </div>
                    </div>
                    </div>

                    <div>
                        {
                        totalMoveisPagosModal.length > 0 ?
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="text-2xl pl-4">
                                    Aluguéis Pagos Para Adicionar
                                </div>
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                    {totalMoveisPagosModal.map((movel, index) => {
                                        return (
                                            movel.tipoAluguel == "Aluguel pago"?
                                                <>
                                                    {
                                                        index == 0 &&
                                                        <div className="grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                            <div>Tipo aluguel</div>
                                                            <div>Tipo da outra parte</div>
                                                            <div>Prazo determinado</div>
                                                            <div>Mão de obra</div>
                                                            <div>Crédito PIS-COFINS</div>
                                                            <div>Com operador</div>
                                                            <div>Valor locação</div>
                                                            <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                            </div>
                                                        </div>
                                                    }
                                
                                                    <div className={`grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                        <div>{movel.tipoAluguel}</div>
                                                        <div>{movel.tipoOutraParte}</div>
                                                        <div>{movel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                        <div>{"R$ " + Number(movel.valorMaoObra).toLocaleString("pt-br")}</div>
                                                        <ToggleButtonMapeado texto="" valor={movel.creditaPisCofins} onChangeFn={() => checkTemCreditoPisCofinsModal(movel.id)} />
                                                        <div>{movel.comOperador ? "Sim" : "Não"}</div>
                                                        <div>{"R$ " + Number(movel.valorLocacao).toLocaleString("pt-br")}</div>
                                                        <Xis onClickFn={apagarMovelLocacaoModal} id={movel.id} />
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
                            totalMoveisRecebidosModal.length > 0 ?
                                <div className="mt-8 flex flex-col gap-4">
                                    <div className="text-2xl pl-4">
                                        Aluguéis Recebidos Para Adicionar
                                    </div>
                                    <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                                        {totalMoveisRecebidosModal.map((movel, index) => {
                                            return (
                                                movel.tipoAluguel == "Aluguel recebido" ?
                                                    <>
                                                        {
                                                            index == 0 &&
                                                            <div className="grid grid-cols-10 gap-10 items-center mb-4 p-4 font-bold">
                                                                <div>Tipo aluguel</div>
                                                                <div>Tipo da outra parte</div>
                                                                <div>Prazo determinado</div>
                                                                <div>Valor locação</div>
                                                            </div>
                                                        }
                                    
                                                        <div className={`grid grid-cols-10 gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                            <div>{movel.tipoAluguel}</div>
                                                            <div>{movel.tipoOutraParte}</div>
                                                            <div>{movel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                            <div>{"R$ " + Number(movel.valorLocacao).toLocaleString("pt-br")}</div>
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
                            totalMoveisModal.length > 0 &&
                            <div className="mt-6">
                                <BotaoGeral onClickFn={addMovelLocacao} principalBranco={true} text="Salvar" />
                            </div>
                        }

                    </div>        

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
                            <BotaoGeral onClickFn={abrirModalLocacaoMoveisFn} principalBranco={true} text="Adicionar Novo Bem Móvel (Locação)"/>
                            <BotaoGeral onClickFn={clicarInput} principalBranco={true} text="Subir XML" />
                            <input type="file" ref={fileRef} className="opacity-0" />
                        </div>
                    </div>
                </div>
                {
                    totalMoveisAlugueisPagos.length > 0 ?
                        <div className="flex flex-col gap-4 mt-8">
                            <div className="text-2xl pl-4">
                                Aluguéis Pagos
                            </div>
                            <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                {totalMoveisAlugueisPagos.map((movel, index) => {
                                    return (
                                        movel.tipoAluguel == "Aluguel pago"?
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(9,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Tipo aluguel</div>
                                                        <div>Tipo da outra parte</div>
                                                        <div>Prazo determinado</div>
                                                        <div>Mão de obra</div>
                                                        <div>Crédito PIS-COFINS</div>
                                                        <div>Com operador</div>
                                                        <div>Valor locação</div>
                                                        <div>Compõe Custo</div>
                                                        <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                        </div>
                                                    </div>
                                                }
                            
                                                <div className={`grid grid-cols-[repeat(9,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div>{movel.tipoAluguel}</div>
                                                    <div>{movel.tipoOutraParte}</div>
                                                    <div>{movel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                    <div>{"R$ " + Number(movel.valorMaoObra).toLocaleString("pt-br")}</div>
                                                    <ToggleButtonMapeado texto="" valor={movel.creditaPisCofins} onChangeFn={() => checkTemCreditoPisCofinsResultado(movel.id)} />
                                                    <div>{movel.comOperador ? "Sim" : "Não"}</div>
                                                    <div>{"R$ " + Number(movel.valorLocacao).toLocaleString("pt-br")}</div>
                                                    <ToggleButtonMapeado texto="" valor={movel.compoeCusto} onChangeFn={() => alterarCompoeCusto(movel.id)} />

                                                    <Xis onClickFn={apagarMovelLocacao} id={movel.id} />
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
                    totalMoveisAlugueisRecebidos.length > 0 ?
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="text-2xl pl-4">
                                Aluguéis Recebidos
                            </div>
                            <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                                {totalMoveisAlugueisRecebidos.map((movel, index) => {
                                    return (
                                        movel.tipoAluguel == "Aluguel recebido" ?
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-10 gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Tipo aluguel</div>
                                                        <div>Tipo da outra parte</div>
                                                        <div>Prazo determinado</div>
                                                        <div>Valor locação</div>
                                                    </div>
                                                }
                            
                                                <div className={`grid grid-cols-10 gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div>{movel.tipoAluguel}</div>
                                                    <div>{movel.tipoOutraParte}</div>
                                                    <div>{movel.prazoDeterminado ? "Sim" : "Não"}</div>
                                                    <div>{"R$ " + Number(movel.valorLocacao).toLocaleString("pt-br")}</div>
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