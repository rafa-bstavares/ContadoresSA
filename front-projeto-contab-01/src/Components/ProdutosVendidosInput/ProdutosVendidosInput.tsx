import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import xis from "../../assets/images/xisContab.svg"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoProduto, tipoOperacaoVendidoArr, TipoOperacaoVendidoType, ProdutoVendidoObj, ProdutoVendidoManualObj, ProdutoVendidoXmlObj } from "../../Contextos/ContextoProduto/ContextoProduto"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import uploadImg from "../../assets/images/uploadImg.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { ToggleButton, toogleFn } from "../ToggleButton/ToggleButton"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import { ContextoParametrosOpcionais } from "../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais"
import { Xis } from "../Xis/Xis"
import { baseUrl } from "../../App"




export function ProdutosVendidosInput(){

    const [tipoOperacaoAdd, setTipoOperacaoAdd] = useState<TipoOperacaoVendidoType>()
    const [valorOperacaoAdd, setValorOperacaoAdd] = useState<string>("")
    const [ncmAdd, setNcmAdd] = useState<string>("")
    const [icms, setIcms] = useState<string | null>(null)
    const [icmsSt, setIcmsSt] = useState<string>("0")
    const [icmsDifal, setIcmsDifal] = useState<string>("0")
    const [pisCofins, setPisCofins] = useState<string | null>(null)
    const [ipi, setIpi] = useState<string | null>(null)
    const [ncmGenerico, setNcmGenerico] = useState<boolean>(false)
    const [totalProdutosVendidosModal, setTotalProdutosVendidosModal] = useState<ProdutoVendidoManualObj[]>([])

    const [modalProdutosAberto, setModalProdutosAberto] = useState<boolean>(false)
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [tipoOperacaoAberto, setTipoOperacaoAberto] = useState<boolean>(false)

    const {totalProdutosVendidos, setTotalProdutosVendidos} = useContext(ContextoProduto)
    const {objMinhaEmpresaOuPessoaAtual} = useContext(ContextoGeral)
    const {setTemErro, setTextoErro} = useContext(ContextoErro)
    const {tabelaSimplesNacional, tabelaLucroPresumido, tabelaLucroReal} = useContext(ContextoParametrosOpcionais)


    function abrirModalProdutosFn(){
        setModalProdutosAberto(true)
    }

    function trocarDropTipoOperacao(){
        setTipoOperacaoAberto(!tipoOperacaoAberto)
    }

    function escolherTipoOperacao(item: TipoOperacaoVendidoType){
        setTipoOperacaoAdd(item)
        trocarDropTipoOperacao()
    }

    function escolherIcms(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcms("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setIcms("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setIcms("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setIcms(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setIcms(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function escolherIcmsSt(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcmsSt("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setIcmsSt("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setIcmsSt("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setIcmsSt(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setIcmsSt(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function escolherIcmsDifal(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcmsDifal("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setIcmsDifal("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setIcmsDifal("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setIcmsDifal(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setIcmsDifal(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function escolherPisCofins(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCofins("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setPisCofins("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setPisCofins("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setPisCofins(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setPisCofins(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function escolherIpi(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIpi("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setIpi("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setIpi("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setIpi(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setIpi(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function avancarParaInfo2(){
        if(tipoOperacaoAdd && (ncmGenerico ? true : ncmAdd.length == 8)){
            setInfo1Aberto(false)
            setInfo2Aberto(true)
        }else{
            setTemErro(true)
            setTextoErro("Preencha todos os valores de Informações Gerais. o NCM deve conter exatamente 8 dígitos.")
        }
    }

    function voltarParaInfo1(){
        setInfo2Aberto(false)
        setInfo1Aberto(true)
    }


    function addProdutosVendidos(){
        const novoArrFinal = [...totalProdutosVendidos, ...totalProdutosVendidosModal]
        setTotalProdutosVendidos(novoArrFinal)
        
        //Resetar inputs e fechar modal

        setTipoOperacaoAdd(undefined)
        setIcms("0")
        setIcmsSt("0")
        setIcmsDifal("0")
        setPisCofins("0")
        setIpi("0")
        setTotalProdutosVendidosModal([])
        setNcmAdd("")
        setValorOperacaoAdd("")
        setNcmGenerico(false)
        
        setInfo2Aberto(false)
        setInfo1Aberto(true)

        setModalProdutosAberto(false)

    }

    function addItemProdutoVendidoModal(){

        if(tipoOperacaoAdd && valorOperacaoAdd && icmsSt && icmsDifal){
            let maxId = 0
            let idAtual  
            totalProdutosVendidos.forEach(item => {
                if(item.id > maxId){
                    maxId = item.id
                }
            })

            const indexItemAtual = totalProdutosVendidosModal.length

            idAtual = maxId + 1 + indexItemAtual         
            

            const novoArr = [...totalProdutosVendidosModal]
            // Como vem do modal, sempre é manual aqui
            const novoObjAtual: ProdutoVendidoManualObj = {
                tipoOperacao: tipoOperacaoAdd,
                icms: icms ? Number(icms.replace(",", ".")) : 0,
                icmsSt: Number(icmsSt.replace(",", ".")),
                icmsDifal: Number(icmsDifal.replace(",", ".")),
                ipi: ipi ? Number(ipi.replace(",", ".")) : 0,
                ncm: ncmGenerico ? "" : ncmAdd,
                pisCofins: pisCofins ? Number(pisCofins.replace(",", ".")) : 0,
                valorOperacao: Number(valorOperacaoAdd),
                beneficio: 0,
                manterBeneficio: true,
                descricaoAnexo: "",
                tipoInput: "Manual",
                id: idAtual
             }
            novoArr.push(novoObjAtual)

            setTotalProdutosVendidosModal(novoArr)


            //Resetar inputs e fechar modal

            setTipoOperacaoAdd(undefined)
            setIcms("0")
            setIcmsSt("0")
            setIcmsDifal("0")
            setPisCofins("0")
            setIpi("0")
            setNcmAdd("")
            setValorOperacaoAdd("")
            setNcmGenerico(false)
            
            setInfo2Aberto(false)
            setInfo1Aberto(true)

        }else{
            setTemErro(true)
            setTextoErro("Para adicionar um novo produto vendido, preencha todos os campos solicitados.")
        }
    }

    function mudarValorOperacaoAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setValorOperacaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setValorOperacaoAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function mudarNcmAdd(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value
        console.log("VALOR NA MUDANÇA DO NCM")
        console.log(valorInput)

        if(valorInput === ""){
            setNcmAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setNcmAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }


    /*function checkNcmGenericoInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setNcmGenerico(true)
        }else{
            setNcmGenerico(false)
        }
    }*/

    function apagarProdutoVendido(id: number){
        const novoArr = [...totalProdutosVendidos]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalProdutosVendidos(arrFinal)
    }

    function apagarProdutoVendidoModal(id: number){
        const novoArr = [...totalProdutosVendidosModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        console.log("arr Final")
        setTotalProdutosVendidosModal(arrFinal)
    }

    function onChangeXmlVendido(e: ChangeEvent<HTMLInputElement>){
        if (e.target.files && e.target.files[0]) {
            // ENVIAR O e.target.files[0] para o backend
            const formData = new FormData()
            const file = e.target.files[0]
            formData.append("arquivo", file)

            fetch(baseUrl + "/xmlProdutosVendidos", {
                method: "POST",
                body: formData,
            }).then(res => res.json()).then((data: {success: true, data: (Omit<ProdutoVendidoXmlObj, "id">)[], error: null} | {success: false, data: null, error: string})=> {
                console.log("RETORNO XML PRODUTOS VENDIDOS")
                console.log(data)

                if(data.success){
                    const arrProdutosXml = data.data
                    let maxId = 0
                    if(totalProdutosVendidos.length > 0){
                        // id do ultimo produto no array final de produtos vendidos
                        maxId = totalProdutosVendidos[totalProdutosVendidos.length - 1].id
                    }

                    const cloneTotalProdutosVendidos = [...totalProdutosVendidos]
                    arrProdutosXml.forEach(produtoXml => {
                        const produtoFinalXmlTela: ProdutoVendidoXmlObj = {...produtoXml, id: maxId}
                        cloneTotalProdutosVendidos.push(produtoFinalXmlTela)
                        maxId++
                    })

                    setTotalProdutosVendidos(cloneTotalProdutosVendidos)

                }


            })

        }
    }

    useEffect(() => {
        console.log(totalProdutosVendidosModal)
    }, [totalProdutosVendidosModal])

    useEffect(() => {
        console.log("ABRIU O BGLH Q TEM Q VER O REGIME")
        // Em produtos, para saber de qual tabela pegar os parametros inicais, sempre vemos o regime do fornecedor, como nesse caso o meu cliente é o fornecedor (produtos vendidos):
        if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Simples Nacional"){
            console.log("meu regime simples")
            setIcms(tabelaSimplesNacional.comercial.icms)
            setIpi(tabelaSimplesNacional.comercial.ipi)
            setPisCofins(tabelaSimplesNacional.comercial.pisCo)
        }else if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Presumido"){
            console.log("meu regime presumido")
            setIcms(tabelaLucroPresumido.comercial.icms)
            setIpi(tabelaLucroPresumido.comercial.ipi)
            setPisCofins(tabelaLucroPresumido.comercial.pisCo)
        }else{
            console.log("meu regime real")
            setIcms(tabelaLucroReal.comercial.icms)
            setIpi(tabelaLucroReal.comercial.ipi)
            setPisCofins(tabelaLucroReal.comercial.pisCo)
        }
    }, [modalProdutosAberto])

    useEffect(() => {
        let colunaSelecionar: ("comercial" | "industrial") = "comercial"
        if(tipoOperacaoAdd == "Indústria" || tipoOperacaoAdd == "Indústria - Consumidor final fora do Estado"){
            colunaSelecionar = "industrial"
        }else{
            colunaSelecionar = "comercial"
        }

        if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Simples Nacional"){
            console.log("meu regime simples")
            setIcms(tabelaSimplesNacional[colunaSelecionar].icms)
            setIpi(tabelaSimplesNacional[colunaSelecionar].ipi)
            setPisCofins(tabelaSimplesNacional[colunaSelecionar].pisCo)
        }else if(objMinhaEmpresaOuPessoaAtual.meuRegime == "Lucro Presumido"){
            console.log("meu regime presumido")
            setIcms(tabelaLucroPresumido[colunaSelecionar].icms)
            setIpi(tabelaLucroPresumido[colunaSelecionar].ipi)
            setPisCofins(tabelaLucroPresumido[colunaSelecionar].pisCo)
        }else{
            console.log("meu regime real")
            setIcms(tabelaLucroReal[colunaSelecionar].icms)
            setIpi(tabelaLucroReal[colunaSelecionar].ipi)
            setPisCofins(tabelaLucroReal[colunaSelecionar].pisCo)
        }

    }, [tipoOperacaoAdd])


    return (
        <div className="flex flex-col gap-2">
            {
            modalProdutosAberto && (
            <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center bg-black/90 text-white z-50`}>


                <div className={`flex flex-col overflow-y-scroll w-[95vw] h-[90vh] gap-6 bg-premiumBg px-24 py-12 rounded-md`}>
                    <div className="flex self-end mb-6 cursor-pointer" onClick={() => setModalProdutosAberto(false)}>
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
                                    <label className="text-gray-400 w-[10vw]">Tipo de Operação:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropTipoOperacao}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                            <div className=" opacity-50">
                                                {tipoOperacaoAdd || "Escolha o tipo de Operação"}
                                            </div>
                                            <div
                                                className={`
                                                ${tipoOperacaoAberto ? "rotate-180" : "rotate-0"}
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
                                            ${tipoOperacaoAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {tipoOperacaoVendidoArr.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                                onClick={() => escolherTipoOperacao(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    {
                                        !ncmGenerico &&
                                        <div className="flex flex-col flex-1">
                                            <label
                                                htmlFor="ncm"
                                                className="flex flex-col text-gray-400"
                                            >
                                                <div>NCM</div>
                                            </label>
                                            <input
                                                className="outline-none rounded-md border-2 border-solid border-gray-300 p-2"
                                                type="number"
                                                id="ncm"
                                                value={ncmAdd}
                                                onChange={mudarNcmAdd}
                                            />
                                        </div>
                                    }
                                    <ToggleButton valor={ncmGenerico} onChangeFn={() => toogleFn(setNcmGenerico, ncmGenerico)} texto="NCM Genérico"/>
                                    {/*<div className="flex flex-col items-start">
                                        <label htmlFor="ncmGenericoVendidos">NCM genérico?</label>
                                        <input checked={ncmGenerico} onChange={(e) => checkNcmGenericoInput(e)} type="checkbox" name="ncmGenericoVendidos" id="ncmGenericoVendidos" />
                                    </div>*/}
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
                                        <div>Valor Operação</div>
                                    </label>
                                    <input
                                        className="outline-none rounded-md border-2 border-solid border-gray-300 p-2"
                                        type="number"
                                        id="valorAluguel"
                                        value={valorOperacaoAdd}
                                        onChange={mudarValorOperacaoAdd}
                                    />
                                </div>

                                {
                                    icms !== null &&
                                    <div className="flex flex-col">
                                        <label className="text-gray-400 w-[10vw]">Aliq. ICMS</label>
                                        <input
                                        value={icms}
                                        onChange={escolherIcms}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                        /> 
                                    </div>
                                }

                                <div className="flex flex-col">
                                    <label className="text-gray-400 w-[10vw]">Aliq. ICMS ST</label>
                                    <input
                                    value={icmsSt}
                                    onChange={escolherIcmsSt}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                    /> 
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-400 w-[10vw]">Aliq. ICMS Difal</label>
                                    <input
                                    value={icmsDifal}
                                    onChange={escolherIcmsDifal}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                    /> 
                                </div>

                                {
                                    pisCofins !== null &&
                                    <div className="flex flex-col">
                                        <label className="text-gray-400 w-[10vw]">Aliq. PIS-COFINS</label>
                                        <input
                                        value={pisCofins}
                                        onChange={escolherPisCofins}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                        /> 
                                    </div>
                                }

                                {
                                    ipi !== null &&
                                    <div className="flex flex-col">
                                        <label className="text-gray-400 w-[10vw]">Aliq. IPI</label>
                                        <input
                                        value={ipi}
                                        onChange={escolherIpi}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
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
                            onClickFn={addItemProdutoVendidoModal}
                            principalBranco={true}
                            text="Adicionar Item"
                            />
                        </div>
                        </div>
                    </div>
                    </div>

                    <div>
                        {
                        totalProdutosVendidosModal.length > 0 ?
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="text-2xl pl-4">
                                    Produtos Vendidos Para Adicionar
                                </div>
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                    {totalProdutosVendidosModal.map((produto, index) => {
                                        return (
                                                <>
                                                    {
                                                        index == 0 &&
                                                        <div className="grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                            <div>Tipo Operação</div>
                                                            <div>NCM</div>
                                                            <div>Aliq. ICMS</div>
                                                            <div>Aliq. ICMS ST</div>
                                                            <div>Aliq. ICMS Difal</div>
                                                            <div>Aliq. PIS-COFINS</div>
                                                            <div>Aliq. IPI</div>
                                                            <div>Valor Operação</div>
                                                            <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                            </div>
                                                        </div>
                                                    }
                                
                                                    <div className={`grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                        <div>{produto.tipoOperacao}</div>
                                                        <div>{produto.ncm}</div>
                                                        <div>{produto.icms}</div>
                                                        <div>{produto.icmsSt}</div>
                                                        <div>{produto.icmsDifal}</div>
                                                        <div>{produto.pisCofins}</div>
                                                        <div>{produto.ipi}</div>
                                                        <div>{produto.valorOperacao}</div>
                                                        <Xis onClickFn={apagarProdutoVendidoModal} id={produto.id} />
                                                    </div>
                                                </>
                                        )
                                    })}
                                </div>
                            </div>
                            :
                            <></>
                        }

                        
                        {
                            totalProdutosVendidosModal.length > 0 &&
                            <div className="mt-6">
                                <BotaoGeral onClickFn={addProdutosVendidos} principalBranco={true} text="Salvar" />
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
                            Produtos Vendidos
                        </div>
                        <div className="flex gap-4">
                            <BotaoGeral onClickFn={abrirModalProdutosFn} principalBranco={true} text="Adicionar Novo Produto Vendido"/>
                            <label className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-solid border-white bg-white text-black cursor-pointer" htmlFor="xml-produtos-vendidos-upload">
                                <div>
                                    Subir XML
                                </div>
                                <img className="h-4 w-auto" src={uploadImg} alt="" />
                            </label>
                            <input type="file" className="hidden" accept=".xml" id="xml-produtos-vendidos-upload" onChange={(e) => onChangeXmlVendido(e)} />
                        </div>
                    </div>
                </div>
                {
                    totalProdutosVendidos.length > 0 ?
                    <div className="flex flex-col gap-4 mt-8">
                        <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                            {totalProdutosVendidos.map((produto, index) => {
                                return (
                                        <>
                                            {
                                                index == 0 &&
                                                <div className="grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                    <div>Tipo Operação</div>
                                                    <div>NCM</div>
                                                    <div>Aliq. ICMS</div>
                                                    <div>Aliq. ICMS ST</div>
                                                    <div>Aliq. ICMS Difal</div>
                                                    <div>Aliq. PIS-COFINS</div>
                                                    <div>Aliq. IPI</div>
                                                    <div>Valor Operação</div>
                                                    <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                        <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                    </div>
                                                </div>
                                            }
                        
                                            <div className={`grid grid-cols-[repeat(8,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                {produto.tipoInput == "Manual" ?
                                                    <>
                                                        <div>{produto.tipoOperacao}</div>
                                                        <div>{produto.ncm}</div>
                                                        <div>{produto.icms}</div>
                                                        <div>{produto.icmsSt}</div>
                                                        <div>{produto.icmsDifal}</div>
                                                        <div>{produto.pisCofins}</div>
                                                        <div>{produto.ipi}</div>
                                                        <div>{produto.valorOperacao}</div>
                                                        <Xis onClickFn={apagarProdutoVendido} id={produto.id} />
                                                    </>
                                                    :
                                                    <>
                                                        <div>{produto.tipoOperacao}</div>
                                                        <div>{produto.ncm}</div>
                                                        <div>{produto.valorIcms}</div>
                                                        <div>{produto.valorIcmsSt}</div>
                                                        <div>{produto.valorIcmsDifal}</div>
                                                        <div>{produto.valorPisCofins}</div>
                                                        <div>{produto.valorIpi}</div>
                                                        <div>{produto.valorOperacao}</div>
                                                        <Xis onClickFn={apagarProdutoVendido} id={produto.id} />      
                                                    </>
                                                }
                                            </div>
                                        </>
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