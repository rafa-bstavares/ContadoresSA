import { Dispatch, SetStateAction, useState, useContext, useEffect } from "react"
import { objAtividadesAdquitidasType } from "../SegundoPasso/SegundoPasso"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import lixeira from "../../assets/images/lixeira.svg"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import xis from "../../assets/images/xisContab.svg"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { metodosType } from "../SegundoPasso/SegundoPasso"


type Props = {
    totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
    setTotalAtividadesAdquiridas: Dispatch<SetStateAction<objAtividadesAdquitidasType[]>>
}

export function ServicoAdquiridoInput({setTotalAtividadesAdquiridas, totalAtividadesAdquiridas}: Props){

    const {objMinhaEmpresaOuPessoaAtual} = useContext(ContextoGeral)

    const [metodoAdd, setMetodoAdd] = useState<metodosType>()
    const [operacaoAdd, setOperacaoAdd] = useState<string>("")
    const [cnpjAdquiridoAdd, setCnpjAdquiridoAdd] = useState<string>()
    const [cnpjFaturamentoAdd, setCnpjFaturamentoAdd] = useState<number>()
    const [metodoAberto, setMetodoAberto] = useState<boolean>(false)
    const [operacaoAberto, setOperacaoAberto] = useState<boolean>(false)
    const [modalServicosTomadosAberto, setModalServicosTomadosAberto] = useState<boolean>(false)
    const {setTemErro, setTextoErro} = useContext(ContextoErro)
    const [totalServicosTomadosModal, setTotalServicosTomadosModal] = useState<objAtividadesAdquitidasType[]>([])

    const metodos: metodosType[] = ["Por CNPJ", "Por Operação"]
    const operacoes: string[] = [
        "Serviços Profissionais - Regulamentados",
        "Limpeza",
        "Publicidade e Propaganda",
        "Segurança",
        "Frete Intermunicipal",
        "Frete - Operação interna",
        "Frete - Operação Interestadual",
        "Seguros",
        "Manutenção Equipamentos ou veículos",
        "Licenciamento e Suporte técnico",
        "Despesas com viagem e hotel",
        "Serviços Médicos"
    ]


    function verificarDigVerif(baseCnpj: string, cnpj: string, numSlice: number){
            
        console.log("BASE")
        console.log(baseCnpj)
        let tamanhoBase = baseCnpj.length
        let multiplicador = 9
        let somaMult = 0

        for(let i = (tamanhoBase - 1); i >= 0; i--){
            somaMult += Number(baseCnpj[i]) * multiplicador

            multiplicador--
            multiplicador = multiplicador < 2 ? 9 : multiplicador
        }

        const digVerif = somaMult % 11
        console.log("Dig verif: " + digVerif)
        baseCnpj += digVerif
        return baseCnpj
    }

    function validarCnpj(){
        const cnpj = cnpjAdquiridoAdd
        if(cnpj){
            if(cnpj.length !== 14 || cnpj.split("").every(item => item == cnpj[0])){
                // Validando tamanho e todos os valores iguais
                return {valido: false, cnpj: null}
            }else{
                // Validando dígitos verificadores
                let baseCnpj = cnpj.slice(0, 12)
                baseCnpj = verificarDigVerif(baseCnpj, cnpj, 12)
                baseCnpj = verificarDigVerif(baseCnpj, cnpj, 13)

                if(baseCnpj == cnpj){
                    //CNPJ VÁLIDO
                    return {valido: true, cnpj}
                }else{
                    return {valido: false, cnpj: null}
                }

            }   
        }else{
            return {valido: false, cnpj: null}
        }
    }

    function addServicoAdquirido(){
        const novoArrFinal = [...totalAtividadesAdquiridas, ...totalServicosTomadosModal]
        setTotalAtividadesAdquiridas(novoArrFinal)

        // resetar valores modal
        setMetodoAdd(undefined)
        setOperacaoAdd("")
        setCnpjAdquiridoAdd(undefined)
        setCnpjFaturamentoAdd(undefined)
        setMetodoAberto(false)
        setOperacaoAberto(false)
        setTotalServicosTomadosModal([])

        setModalServicosTomadosAberto(false)

    }


    function alterarCompoeCusto(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const objTotalServAdqClone = [...totalAtividadesAdquiridas]
        const idEncontrado = objTotalServAdqClone.findIndex(item => item.id == id)
        if(idEncontrado > -1){
            if(e.target.checked){
                objTotalServAdqClone[idEncontrado].compoeCusto = true
            }else{
                objTotalServAdqClone[idEncontrado].compoeCusto = false
            }

            setTotalAtividadesAdquiridas(objTotalServAdqClone)
        }else{
            console.log("ID compoe custo não encontrado")
        }
    }

    async function addItemServicoAdquirido(){
        const jaTem = totalAtividadesAdquiridas.some(item => item.cpfOuCnpj == cnpjAdquiridoAdd)
        if(jaTem){
            console.log("Atividade Já está adicionada")
        }else{



            let maxId = 0
            let idAtual  
            totalAtividadesAdquiridas.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            const indexAtual = totalServicosTomadosModal.length

            idAtual = maxId + 1 + indexAtual

            if(cnpjFaturamentoAdd !== undefined && metodoAdd){

                let cnaePrincipalStr: string
                let operacao
                let regimeTributario: "Simples Nacional" | "Lucro Real" | "Lucro Presumido"
                let cnpjPorOperacao: string

                if(metodoAdd == "Por CNPJ"){
                    const objCnpj = validarCnpj()

                    if(objCnpj.valido){
                        // pegar na API optante SImples e cnae
                        const res = await fetch(`https://open.cnpja.com/office/${cnpjAdquiridoAdd}`)
                        const data = await res.json()
                    
                        // CNAE principal
                        cnaePrincipalStr = data.mainActivity.id.toString()
                        // Preenche com zeros à esquerda até ter 7 dígitos
                        while (cnaePrincipalStr.length < 7) {
                            cnaePrincipalStr = "0" + cnaePrincipalStr
                        }
                    
                        regimeTributario = data.company.simples.optant ? "Simples Nacional" : "Lucro Real";
                        console.log("optante do simples: " + regimeTributario)

                        operacao = ""
                    }else{
                        setTemErro(true)
                        setTextoErro("CNPJ inválido")
                        // return para parar a execução da função e acionar o erro
                        return 
                    }



                }else{
                    // Método == Por Operação
                    cnaePrincipalStr = ""
                    operacao = operacaoAdd
                    regimeTributario = "Simples Nacional"
                    cnpjPorOperacao = ""

                }
            
                const novoObj: objAtividadesAdquitidasType = {
                    cpfOuCnpj: cnpjAdquiridoAdd ? cnpjAdquiridoAdd : "",
                    faturamento: cnpjFaturamentoAdd,
                    id: idAtual,
                    regimeTributario,
                    cnaePrincipal: cnaePrincipalStr,
                    temCreditoPisCofins: false,
                    operacao,
                    beneficio: 0,
                    compoeCusto: false,
                    metodo: metodoAdd
                };
                let novoArr = [...totalServicosTomadosModal]
                novoArr.push(novoObj)
                setTotalServicosTomadosModal(novoArr)

                // resetar valores modal
                setMetodoAdd(undefined)
                setOperacaoAdd("")
                setCnpjAdquiridoAdd(undefined)
                setCnpjFaturamentoAdd(undefined)
                setMetodoAberto(false)
                setOperacaoAberto(false)



    
    
            }else{
                setTemErro(true)
                setTextoErro("Todos os campos da área de serviços adquiridos devem estar preenchidos, além disso, o cnpj deve conter exatamente 14 dígitos e precisa ser um CNPJ válido.")
            }

        }

    }

    function apagarAtividadeModal(id: number){
        const novoArr = [...totalServicosTomadosModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalServicosTomadosModal(arrFinal)
    }

    function apagarAtividade(id: number){
        const novoArr = [...totalAtividadesAdquiridas]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalAtividadesAdquiridas(arrFinal)
    }

    function mudarRegimeModal(id: number, regime: "Lucro Real" | "Lucro Presumido" | "Simples Nacional"){
        const novoArr = totalServicosTomadosModal.map(item => {
            if(item.id == id){
                item.regimeTributario = regime
            }
            return item
        })


        setTotalServicosTomadosModal(novoArr)
    
    }

    function mudarRegimeAposAdicionado(id: number, regime: "Lucro Real" | "Lucro Presumido" | "Simples Nacional"){
        const novoArr = totalAtividadesAdquiridas.map(item => {
            if(item.id == id){
                item.regimeTributario = regime
            }
            return item
        })


        setTotalAtividadesAdquiridas(novoArr)
    
    }
    

    function checkTemCreditoPisCofins(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalAtividadesAdquiridas]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].temCreditoPisCofins = true
            }else{
                novoArr[index].temCreditoPisCofins = false
            }
        }
    }

    function abrirModalServicosTomadosFn(){
        setModalServicosTomadosAberto(true)
    }

    function trocarDropMetodo(){
        setMetodoAberto(!metodoAberto)
    }

    function escolherMetodo(item: metodosType){
        setMetodoAdd(item)
        trocarDropMetodo()
    }

    function trocarDropOperacao(){
        setOperacaoAberto(!operacaoAberto)
    }

    function escolherOperacao(item: string){
        setOperacaoAdd(item)
        trocarDropOperacao()
    }


    useEffect(() => {

        console.log(totalAtividadesAdquiridas)
    }, [totalAtividadesAdquiridas])




    return (
        <div className="flex flex-col gap-2">

            {
                modalServicosTomadosAberto && (
                    <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center z-50 bg-black/90`}>


                        <div className="flex flex-col gap-12 w-[95vw] bg-premiumBg px-24 py-12 rounded-2xl ">
                            <div className="flex self-end cursor-pointer" onClick={() => setModalServicosTomadosAberto(false)}>
                                <img
                                className="w-12 h-12"
                                src={xis}
                                alt="fechar modal locação"
                                />
                            </div>
                            <div className="flex items-start justify-center gap-6">


                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-400 w-[10vw]">Método:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropMetodo}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                            <div className=" opacity-50">
                                                {metodoAdd || "Escolha o método"}
                                            </div>
                                            <div
                                                className={`
                                                ${metodoAberto ? "rotate-180" : "rotate-0"}
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
                                            ${metodoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {metodos.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                onClick={() => escolherMetodo(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>


                                {
                                    metodoAdd == "Por Operação" &&
                                    <div className="flex flex-col gap-1">
                                        <label className="text-gray-400 w-[10vw]">Operações:</label>
                                        <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                            <div
                                            onClick={trocarDropOperacao}
                                            className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                            >
                                                <div className=" opacity-50">
                                                    {operacaoAdd || "Escolha o método"}
                                                </div>
                                                <div
                                                    className={`
                                                    ${operacaoAberto ? "rotate-180" : "rotate-0"}
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
                                                ${operacaoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                                [transition:grid-template-rows_500ms]
                                            `}
                                            >
                                            <div className="overflow-hidden">
                                                {operacoes.map(item => (
                                                <div
                                                    key={item}
                                                    className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                    onClick={() => escolherOperacao(item)}
                                                >
                                                    {item}
                                                </div>
                                                ))}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    metodoAdd == "Por CNPJ" &&
                                    <div className="flex flex-col gap-1">
                                        <label className="text-gray-400" htmlFor="cnpjAdquirido">Cnpj:</label>
                                        <input className="outline-none rounded-md border-2 border-solid border-gray-300 p-2" type="number" id="cnpjAdquirido" onChange={(e) => setCnpjAdquiridoAdd(e.target.value)}/>
                                    </div>
                                }

                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-400" htmlFor="cnpjFaturamento">Valor Total:</label>
                                    <input value={cnpjFaturamentoAdd} className="outline-none p-2 rounded-md border-2 border-solid border-gray-300" type="number" id="cnpjFaturamento" onChange={(e) => setCnpjFaturamentoAdd(Number(e.target.value))}/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-gray-400 opacity-0" htmlFor="cnpjFaturamento">Valor Total:</label>
                                    <BotaoGeral principalBranco={true} text="Adicionar" onClickFn={addItemServicoAdquirido}/>
                                </div>
                            </div>

                            {/* APRESENTAÇÃO DE RESULTADOS DENTRO DO MODAL */}
                            {
                                totalServicosTomadosModal.length > 0 &&
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                                    {totalServicosTomadosModal.map((item, index) => {
                                        return (
                                            <div className="mt-8">
                                                {
                                                    index == 0 &&
                                                    <div className={`grid ${objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" ? "grid-cols-[repeat(5,1fr)_auto]" : "grid-cols-[repeat(4,1fr)_auto]"} gap-10 items-center mb-4 p-4 font-bold`}>
                                                        <div>Método</div>
                                                        <div>CNPJ</div>
                                                        <div>Faturamento</div>
                                                        <div>Regime Tributário</div>
                                                        {
                                                            objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" &&
                                                            <div>Crédito</div>
                                                        }
                                                        <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                        </div>
                                                    </div>
                                                }
                                                <div className={`grid ${objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" ? "grid-cols-[repeat(5,1fr)_auto]" : "grid-cols-[repeat(4,1fr)_auto]"} gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div>{item.metodo}</div>
                                                    <div>{item.metodo == "Por CNPJ" ? item.cpfOuCnpj : "Diversos"}</div>
                                                    <div>{"R$ " + item.faturamento.toLocaleString("pt-br")}</div>
                                                    {
                                                        // Podemos fazer assim pq quando recebemos da API verificamos se o regime é simples, se não for colocamos como real
                                                        (item.regimeTributario == "Lucro Real" || item.regimeTributario == "Lucro Presumido") || (item.metodo == "Por Operação") ?
                                                        <div className="flex gap-4" >
                                                            {
                                                                item.metodo == "Por Operação" &&
                                                                <div className="flex gap-2" >
                                                                    <input onChange={() => mudarRegimeModal(item.id, "Simples Nacional")} type="radio" className={`regime${index}-modal`} name={`regime${index}-modal`} id={`simples-radio-${index}-modal`} defaultChecked={item.metodo == "Por Operação"}/>
                                                                    <label htmlFor={`simples-radio-${index}`}>Simples Nacional</label>
                                                                </div>
                                                            }
                                                            <div className="flex gap-2" >
                                                                <input onChange={() => mudarRegimeModal(item.id, "Lucro Real")} type="radio" className={`regime${index}-modal`} name={`regime${index}-modal`} id={`lucroReal-radio-${index}-modal`} defaultChecked={item.metodo == "Por CNPJ"}/>
                                                                <label htmlFor={`lucroReal-radio-${index}`}>Lucro Real</label>
                                                            </div>
                                                            <div className="flex gap-2" >
                                                                <input onChange={() => mudarRegimeModal(item.id, "Lucro Presumido")} type="radio" className={`regime${index}-modal`} name={`regime${index}-modal`} id={`lucroPresumido-radio-${index}-modal`} />
                                                                <label htmlFor={`lucroPresumido-radio-${index}`}>Lucro Presumido</label>
                                                            </div>
                                                        </div>
                                                            :
                                                        <div>
                                                            Simples Nacional
                                                        </div>
                                                    }
                                                    {
                                                        objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" &&
                                                        <div className="flex gap-2">
                                                            <input onChange={(e) => checkTemCreditoPisCofins(e, item.id)} type="checkbox" name="temCreditoPisCofins" id="temCreditoPisCofins" />
                                                            <label htmlFor="temCreditoPisCofins">Tem crédito pis-cofins</label>
                                                        </div>
                                                    }
                                                    <div onClick={() => {apagarAtividadeModal(item.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                        <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            }

                            {
                                totalServicosTomadosModal.length > 0 &&
                                <div className="mt-6">
                                    <BotaoGeral onClickFn={addServicoAdquirido} principalBranco={true} text="Salvar" />
                                </div>
                            }
                            
                        </div>

                    </div>
                )
            }

            <div className="font-bold text-3xl mb-2">
                Serviços Tomados
            </div>
            <div>
                <BotaoGeral onClickFn={abrirModalServicosTomadosFn} principalBranco={true} text="Adicionar Serviço Tomado"/>
            </div>




            {
                totalAtividadesAdquiridas.length > 0 &&
                <div className=" flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">
                    {totalAtividadesAdquiridas.map((item, index) => {
                        return (    
                            <div className="mt-8">
                                {
                                    index == 0 &&
                                    <div className={`grid ${objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" ? "grid-cols-[repeat(6,1fr)_auto]" : "grid-cols-[repeat(5,1fr)_auto]"} gap-10 items-center mb-4 p-4 font-bold`}>
                                        <div>Método</div>
                                        <div>CNPJ</div>
                                        <div>Faturamento</div>
                                        <div>Regime Tributário</div>
                                        {
                                            objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" &&
                                            <div>Crédito</div>
                                        }
                                        <div>Compõe Custo</div>
                                        <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                        </div>
                                    </div> 
                                }

                                <div className={`grid ${objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" ? "grid-cols-[repeat(6,1fr)_auto]" : "grid-cols-[repeat(6,1fr)_auto]"} gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                    <div>{item.metodo}</div>
                                    <div>{item.metodo == "Por CNPJ" ? item.cpfOuCnpj : "Diversos"}</div>
                                    <div>{"R$ " + item.faturamento.toLocaleString("pt-br")}</div>
                                    {
                                        // Podemos fazer assim pq quando recebemos da API verificamos se o regime é simples, se não for colocamos como real
                                        (item.regimeTributario == "Lucro Real" || item.regimeTributario == "Lucro Presumido") || (item.metodo == "Por Operação") ?

                                        <div className="flex gap-4" >
                                            {
                                                item.metodo == "Por Operação" &&
                                                <div className="flex gap-2" >
                                                    <input onChange={() => mudarRegimeAposAdicionado(item.id, "Simples Nacional")} type="radio" className={`regime${index}`} name={`regime${index}`} id={`simples-radio-${index}`} checked={item.regimeTributario == "Simples Nacional"}/>
                                                    <label htmlFor={`simples-radio-${index}`}>Simples Nacional</label>
                                                </div>
                                            }
                                            <div className="flex gap-2" >
                                                <input onChange={() => mudarRegimeAposAdicionado(item.id, "Lucro Real")} type="radio" className={`regime${index}`} name={`regime${index}`} id={`lucroReal-radio-${index}`} checked={item.regimeTributario == "Lucro Real"}/>
                                                <label htmlFor={`lucroReal-radio-${index}`}>Lucro Real</label>
                                            </div>
                                            <div className="flex gap-2" >
                                                <input onChange={() => mudarRegimeAposAdicionado(item.id, "Lucro Presumido")} type="radio" className={`regime${index}`} name={`regime${index}`} id={`lucroPresumido-radio-${index}`} checked={item.regimeTributario == "Lucro Presumido"}/>
                                                <label htmlFor={`lucroPresumido-radio-${index}`}>Lucro Presumido</label>
                                            </div>
                                        </div>
                                            :
                                        <div>
                                            Simples Nacional
                                        </div>

                                    }
                                    {
                                        objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Real" && 
                                        <div className="flex gap-2">
                                            <input onChange={(e) => checkTemCreditoPisCofins(e, item.id)} type="checkbox" name="temCreditoPisCofins" id="temCreditoPisCofins" />
                                            <label htmlFor="temCreditoPisCofins">Tem crédito pis-cofins</label>
                                        </div>
                                    }
                                    <div className="flex flex-col items-start">
                                        <input checked={item.compoeCusto} onChange={(e) => alterarCompoeCusto(e, item.id)} type="checkbox" name="compoeCustoServAdq" id="compoeCustoServAdq" />
                                    </div>
                                    <div onClick={() => {apagarAtividade(item.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                        <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}