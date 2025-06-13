import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import xis from "../../assets/images/xisContab.svg"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoProduto, tipoOperacaoAdquiridoArr, TipoOperacaoAdquiridoType, ProdutoAdquiridoObj, MetodoAdquiridoType, metodoAdquiridoArr, RegimesAdquiridoType, regimesAdquiridoArr, SimNaoType, simNaoArr } from "../../Contextos/ContextoProduto/ContextoProduto"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import lixeira from "../../assets/images/lixeira.svg"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { ContextoParametrosOpcionais } from "../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais"




export function ProdutosAdquiridosInput(){

    const [tipoOperacaoAdd, setTipoOperacaoAdd] = useState<TipoOperacaoAdquiridoType>()
    const [metodoAdd, setMetodoAdd] = useState<MetodoAdquiridoType>()
    const [regimeFornecedorAdd, setRegimeFornecedorAdd] = useState<RegimesAdquiridoType>()
    const [valorOperacaoAdd, setValorOperacaoAdd] = useState<string>("")
    const [cnpjFornecedorAdd, setCnpjFornecedorAdd] = useState<string>("")
    const [ncmAdd, setNcmAdd] = useState<string>("")
    const [icms, setIcms] = useState<string>("0")
    const [creditoIcms, setCreditoIcms] = useState<boolean>(false)
    const [pis, setPis] = useState<string>("0")
    const [cofins, setCofins] = useState<string>("0")
    const [creditoPisCofins, setCreditoPisCofins] = useState<boolean>(false)
    const [ipi, setIpi] = useState<string>("0")
    const [creditoIpi, setCreditoIpi] = useState<boolean>(false)
    const [ncmGenerico, setNcmGenerico] = useState<boolean>(false)
    const [totalProdutosAdquiridosModal, setTotalProdutosAdquiridosModal] = useState<ProdutoAdquiridoObj[]>([])
    const [fornecedorIndustrialAdd, setFornecedorIndustrialAdd] = useState<boolean>(false)

    const [modalProdutosAberto, setModalProdutosAberto] = useState<boolean>(false)
    const [info1Aberto, setInfo1Aberto] = useState<boolean>(true)
    const [info2Aberto, setInfo2Aberto] = useState<boolean>(false)
    const [tipoOperacaoAberto, setTipoOperacaoAberto] = useState<boolean>(false)
    const [metodoAberto, setMetodoAberto] = useState<boolean>(false)
    const [regimeFornecedorAberto, setRegimeFornecedorAberto] = useState<boolean>(false)
    const [fornecedorIndustrialAberto, setFornecedorIndustrialAberto] = useState<boolean>(false)

    const {totalProdutosAdquiridos, setTotalProdutosAdquiridos} = useContext(ContextoProduto)
    const {icmsSimplesIndustrial, icmsSimplesComercial, ipiSimplesIndustria, pisCoSimplesIndustria, pisCoSimplesComercio, pisCoLucroRealComercial, pisCoLucroRealIndustrial, pisCoLucroPresumidoComercial, pisCoLucroPresumidoIndustrial} = useContext(ContextoParametrosOpcionais)
    const {setTemErro, setTextoErro} = useContext(ContextoErro)

    


    function abrirModalProdutosFn(){
        setModalProdutosAberto(true)
    }

    function trocarDropTipoOperacao(){
        setTipoOperacaoAberto(!tipoOperacaoAberto)
    }

    function trocarDropMetodo(){
        setMetodoAberto(!metodoAberto)
    }

    function trocarDropFornecedorIndustrial(){
        setFornecedorIndustrialAberto(!fornecedorIndustrialAberto)
    }

    function trocarDropRegimeFornecedor(){
        setRegimeFornecedorAberto(!regimeFornecedorAberto)
    }

    function escolherTipoOperacao(item: TipoOperacaoAdquiridoType){
        setTipoOperacaoAdd(item)
        trocarDropTipoOperacao()
    }
    
    function escolherMetodo(item: MetodoAdquiridoType){
        setMetodoAdd(item)
        trocarDropMetodo()
    }

    function escolherRegime(item: RegimesAdquiridoType){
        setRegimeFornecedorAdd(item)
        trocarDropRegimeFornecedor()
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

    function escolherPis(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPis("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setPis("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setPis("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setPis(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setPis(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }
    }

    function escolherCofins(e: React.ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setCofins("0")
            return 
        }

        const arrSeparadoVirgula = valorInput.split(",")
        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){

            if(temVirgula){
                setCofins("0," + arrSeparadoVirgula[1])
                return 
            }else{
                setCofins("0")
                return 
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            setCofins(arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
            return 
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            setCofins(arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
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

    function escolherFornecedorIndustrial(item: SimNaoType){
        switch(item){
            case "Sim":
                setFornecedorIndustrialAdd(true)
                break

            case "Não":
                setFornecedorIndustrialAdd(false)
                break
        }

        trocarDropFornecedorIndustrial()
    }

    function avancarParaInfo2(){
        const objCnpj = validarCnpj()
        if(metodoAdd){
            if(metodoAdd == "Por CNPJ" ? objCnpj.valido : true){
                if(metodoAdd == "Por CNPJ"){
                    if((ncmGenerico ? true : ncmAdd) && cnpjFornecedorAdd && fornecedorIndustrialAdd !== undefined && regimeFornecedorAdd){
                        setInfo1Aberto(false)
                        setInfo2Aberto(true)
                    }else{
                        setTemErro(true)
                        setTextoErro("Preencha todos os valores de Informações Gerais")
                    }
                }else if(metodoAdd == "Por Operação"){
                    if((ncmGenerico ? true : ncmAdd.length == 8) && tipoOperacaoAdd && fornecedorIndustrialAdd !== undefined && regimeFornecedorAdd){
                        setInfo1Aberto(false)
                        setInfo2Aberto(true)
                    }else{
                        setTemErro(true)
                        setTextoErro("Preencha todos os valores de Informações Gerais. O NCM deve conter exatamente 8 dígitos.")
                    }
                }
            }else{
                setTemErro(true)
                setTextoErro("CNPJ inválido")
            }
        }else{
            setTemErro(true)
            setTextoErro("Escolha um método")
        }
    }

    function voltarParaInfo1(){
        setInfo2Aberto(false)
        setInfo1Aberto(true)
    }


    function addProdutosAdquiridos(){
        const novoArrFinal = [...totalProdutosAdquiridos, ...totalProdutosAdquiridosModal]
        setTotalProdutosAdquiridos(novoArrFinal)
        
        //Resetar inputs e fechar modal

        setTipoOperacaoAdd(undefined)
        setIcms("0")
        setPis("0")
        setCofins("0")
        setIpi("0")
        setTotalProdutosAdquiridosModal([])
        setNcmAdd("")
        setValorOperacaoAdd("")
        setMetodoAdd(undefined)
        setCnpjFornecedorAdd("")   
        setNcmGenerico(false)
        setFornecedorIndustrialAdd(false)

        setInfo2Aberto(false)
        setInfo1Aberto(true)

        setModalProdutosAberto(false)

    }

    function addItemProdutoVendidoModal(){
            if(valorOperacaoAdd && icms && pis && cofins && ipi && metodoAdd && regimeFornecedorAdd){
                let maxId = 0
                let idAtual  
                totalProdutosAdquiridos.forEach(item => {
                    if(item.id > maxId){
                        maxId = item.id
                    }
                })

                const indexItemAtual = totalProdutosAdquiridosModal.length

                idAtual = maxId + 1 + indexItemAtual         
                

                const novoArr = [...totalProdutosAdquiridosModal]
                const novoObjAtual: ProdutoAdquiridoObj = {
                    tipoOperacao: metodoAdd == "Por Operação" ? (tipoOperacaoAdd ? tipoOperacaoAdd : "") : "",
                    metodo: metodoAdd,
                    icms: Number(icms.replace(",", ".")),
                    pis: Number(pis.replace(",", ".")),
                    cofins: Number(cofins.replace(",", ".")),
                    ipi: Number(ipi.replace(",", ".")),
                    ncm: ncmGenerico ? "" : ncmAdd,
                    valorOperacao: Number(valorOperacaoAdd),
                    cnpjFornecedor: metodoAdd == "Por CNPJ" ? cnpjFornecedorAdd : "",
                    creditoIcms,
                    creditoIpi,
                    creditoPisCofins,
                    regimeTributarioOutro: regimeFornecedorAdd,
                    fornecedorIndustrial: fornecedorIndustrialAdd,
                    beneficio: 0,
                    id: idAtual
                }
                novoArr.push(novoObjAtual)

                setTotalProdutosAdquiridosModal(novoArr)


                //Resetar inputs e fechar modal

                setTipoOperacaoAdd(undefined)
                setIcms("0")
                setPis("0")
                setCofins("0")
                setIpi("0")
                setNcmAdd("")
                setValorOperacaoAdd("")
                setMetodoAdd(undefined)
                setCnpjFornecedorAdd("")
                setNcmGenerico(false)
                setFornecedorIndustrialAdd(false)
                
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

    function mudarCnpjFornecedor(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setCnpjFornecedorAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setCnpjFornecedorAdd(valorInput.replace(",", "*").replace(".", ",").replace("*", "."))
            return 
        }
    }

    function checkTemCreditoPisCofinsInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setCreditoPisCofins(true)
        }else{
            setCreditoPisCofins(false)
        }
    }

    function checkTemCreditoPisCofins(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridos]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoPisCofins = true
            }else{
                novoArr[index].creditoPisCofins = false
            }
        }
    }
    
    function checkTemCreditoPisCofinsModal(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridosModal]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoPisCofins = true
            }else{
                novoArr[index].creditoPisCofins = false
            }
        }
    }

    function checkTemCreditoIcmsInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setCreditoIcms(true)
        }else{
            setCreditoIcms(false)
        }
    }

    function checkTemCreditoIcms(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridos]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoIcms = true
            }else{
                novoArr[index].creditoIcms = false
            }
        }
    }

    function checkTemCreditoIcmsModal(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridosModal]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoIcms = true
            }else{
                novoArr[index].creditoIcms = false
            }
        }
    }

    function checkTemCreditoIpiInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setCreditoIpi(true)
        }else{
            setCreditoIpi(false)
        }
    }

    function checkTemCreditoIpi(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridos]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoIpi = true
            }else{
                novoArr[index].creditoIpi = false
            }
        }
    }

    function checkTemCreditoIpiModal(e: React.ChangeEvent<HTMLInputElement>, id: number){
        const novoArr = [...totalProdutosAdquiridosModal]
        const index = novoArr.findIndex(item => item.id == id)
        if(index > -1){
            if(e.target.checked){
                novoArr[index].creditoIpi = true
            }else{
                novoArr[index].creditoIpi = false
            }
        }
    }

    function checkNcmGenericoInput(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setNcmGenerico(true)
        }else{
            setNcmGenerico(false)
        }
    }


    function apagarProdutoAdquirido(id: number){
        const novoArr = [...totalProdutosAdquiridos]
        const arrFinal = novoArr.filter(item => item.id !== id)
        setTotalProdutosAdquiridos(arrFinal)
    }

    function apagarProdutoAdquiridoModal(id: number){
        const novoArr = [...totalProdutosAdquiridosModal]
        const arrFinal = novoArr.filter(item => item.id !== id)
        console.log("arr Final")
        setTotalProdutosAdquiridosModal(arrFinal)
    }


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
        const cnpj = cnpjFornecedorAdd
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

    useEffect(() => {
        console.log(totalProdutosAdquiridosModal)
    }, [totalProdutosAdquiridosModal])

    useEffect(() => {
        if(tipoOperacaoAdd == "Insumo" || tipoOperacaoAdd == "Revenda" || !ncmGenerico){
            // mudar states
            setCreditoIcms(true)
            setCreditoIpi(true)
            setCreditoPisCofins(true)
        }else{
            setCreditoIcms(false)
            setCreditoIpi(false)
            setCreditoPisCofins(false)
        }
    }, [tipoOperacaoAdd, ncmGenerico])

    useEffect(() => {
        if(regimeFornecedorAdd && fornecedorIndustrialAdd !== undefined){
            // Só ativa quando regimeFornecedorAdd e fornecedorIndustrialAdd estiverem com algum valor
            if(regimeFornecedorAdd == "Simples Nacional"){
                if(fornecedorIndustrialAdd){
                    // TABELA SIMPLES COLUNA INDUSTRIAL
                    setIcms(icmsSimplesIndustrial)
                    setIpi(ipiSimplesIndustria)
                    setPis(pisCoSimplesIndustria)
                }else{
                    // TABELA SIMPLES COLUNA COMERCIAL
                    setIcms(icmsSimplesComercial)
                    setPis(pisCoSimplesComercio)
                }
            }else if(regimeFornecedorAdd == "Lucro Presumido"){
                if(fornecedorIndustrialAdd){
                    // TABELA LUCRO PRESUMIDO COLUNA INDUSTRIAL
                    setPis(pisCoLucroPresumidoIndustrial)
                }else{
                    // TABELA LUCRO PRESUMIDO COLUNA COMERCIAL
                    setPis(pisCoLucroPresumidoComercial)
                }
            }else if(regimeFornecedorAdd == "Lucro Real"){
                if(fornecedorIndustrialAdd){
                    // TABELA LUCRO REAL COLUNA INDUSTRIAL
                    setPis(pisCoLucroRealIndustrial)
                }else{
                    // TABELA LUCRO REAL COLUNA COMERCIAL
                    setPis(pisCoLucroPresumidoComercial)
                }
            }
        }
    }, [regimeFornecedorAdd, fornecedorIndustrialAdd])


    return (
        <div className="flex flex-col gap-2">
            {
            modalProdutosAberto && (
            <div className={`fixed left-0 right-0 top-0 h-screen flex flex-col items-center justify-center bg-black/90 text-white z-50`}>


                <div className={`flex flex-col overflow-y-scroll h-[90vh] gap-6 bg-premiumBg px-24 py-12 rounded-md`}>
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


                                <div className="flex flex-col">
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
                                            {metodoAdquiridoArr.map(item => (
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
                                    <div className="flex flex-col">
                                        <label className="text-gray-400 w-[10vw]">Tipo do Operação:</label>
                                        <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                            <div
                                            onClick={trocarDropTipoOperacao}
                                            className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                            >
                                                <div className=" opacity-50">
                                                    {tipoOperacaoAdd || "Escolha o tipo do aluguel"}
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
                                                {tipoOperacaoAdquiridoArr.map(item => (
                                                <div
                                                    key={item}
                                                    className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                    onClick={() => escolherTipoOperacao(item)}
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
                                    <div className="flex flex-col flex-1">
                                        <label
                                            htmlFor="cnpj" 
                                            className="flex flex-col text-gray-400"
                                        > 
                                            <div>CNPJ Fornecedor</div>
                                        </label>
                                        <input
                                            className="outline-none rounded-md border-2 border-solid border-gray-300 p-2"
                                            type="number"
                                            id="ncm"
                                            value={cnpjFornecedorAdd}
                                            onChange={mudarCnpjFornecedor}
                                        />
                                    </div>  
                                }

                                <div className="flex flex-col">
                                    <label className="text-gray-400 w-[10vw]">Fornecedor Industrial:</label>

                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropFornecedorIndustrial}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className="opacity-50">
                                            {fornecedorIndustrialAdd ? "Sim" : "Não"}
                                        </div>
                                        <div
                                            className={`
                                            ${fornecedorIndustrialAberto ? "rotate-180" : "rotate-0"}
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
                                            ${fornecedorIndustrialAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {simNaoArr.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                onClick={() => escolherFornecedorIndustrial(item)}
                                            >
                                                {item}
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col flex-1">
                                    {
                                        !ncmGenerico &&
                                        <div className="flex flex-col">
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
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="ncmGenerico">NCM genérico?</label>
                                        <input checked={ncmGenerico} onChange={(e) => checkNcmGenericoInput(e)} type="checkbox" name="ncmGenerico" id="ncmGenerico" />
                                    </div>
                                </div>
                            
                                <div className="flex flex-col">
                                    <label className="text-gray-400 w-[10vw]">Regime Fornecedor:</label>
                                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                        <div
                                        onClick={trocarDropRegimeFornecedor}
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                            <div className=" opacity-50">
                                                {regimeFornecedorAdd || "Escolha o método"}
                                            </div>
                                            <div
                                                className={`
                                                ${regimeFornecedorAberto ? "rotate-180" : "rotate-0"}
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
                                            ${regimeFornecedorAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                            [transition:grid-template-rows_500ms]
                                        `}
                                        >
                                        <div className="overflow-hidden">
                                            {regimesAdquiridoArr.map(item => (
                                            <div
                                                key={item}
                                                className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                onClick={() => escolherRegime(item)}
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

                                <div className="flex flex-col gap-2">
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
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="creditoIcms">Tem crédito ICMS?</label>
                                        <input checked={creditoIcms} onChange={(e) => checkTemCreditoIcmsInput(e)} type="checkbox" name="creditoIcms" id="creditoIcms" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <label className="text-gray-400 w-[10vw]">Aliq. PIS</label>
                                        <input
                                        value={pis}
                                        onChange={escolherPis}
                                        inputMode="numeric"
                                        pattern="\d*"
                                        className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="creditoPisCofins">Tem crédito PIS-COFINS?</label>
                                        <input checked={creditoPisCofins} onChange={(e) => checkTemCreditoPisCofinsInput(e)} type="checkbox" name="creditoPisCofins" id="creditoPisCofins" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-gray-400 w-[10vw]">Aliq. COFINS</label>
                                    <input
                                    value={cofins}
                                    onChange={escolherCofins}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                                    /> 
                                </div>

                                <div className="flex flex-col gap-2">
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
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="creditoIpi">Tem crédito IPI?</label>
                                        <input checked={creditoIpi} onChange={(e) => checkTemCreditoIpiInput(e)} type="checkbox" name="creditoIpi" id="creditoIpi" />
                                    </div>                            
                                </div>

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
                        totalProdutosAdquiridosModal.length > 0 ?
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="text-2xl pl-4">
                                    Produtos Adquiridos Para Adicionar
                                </div>
                                <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                                    {totalProdutosAdquiridosModal.map((produto, index) => {
                                        return (
                                                <>
                                                    {
                                                        index == 0 &&
                                                        <div className="grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                            <div>Método</div>
                                                            <div>Tipo Operação</div>
                                                            <div>CNPJ Fornecedor</div>
                                                            <div>Regime Fornecedor</div>
                                                            <div>Fornecedor Industrial</div>
                                                            <div>NCM</div>
                                                            <div>Aliq. ICMS</div>
                                                            <div>Aliq. PIS</div>
                                                            <div>Aliq. COFINS</div>
                                                            <div>Aliq. IPI</div>
                                                            <div>Valor Operação</div>
                                                            <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                                <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                            </div>
                                                        </div>
                                                    }
                                
                                                    <div className={`grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                        <div>{produto.metodo}</div>
                                                        <div>{produto.metodo == "Por Operação" ? produto.tipoOperacao : ""}</div>
                                                        <div>{produto.metodo == "Por Operação" ? "Diversos" : produto.cnpjFornecedor}</div>
                                                        <div>{produto.regimeTributarioOutro}</div>
                                                        <div>{produto.fornecedorIndustrial ? "Sim" : "Não"}</div>
                                                        <div>{produto.ncm}</div>
                                                        <div>{produto.icms}% - {produto.creditoIcms ? "Com Crédito" : "Sem Crédito"}</div>
                                                        <div>{produto.pis}%</div>
                                                        <div>{produto.cofins}%</div>
                                                        <div>{produto.ipi}% - {produto.creditoIpi ? "Com Crédito" : "Sem Crédito"}</div>
                                                        <div>{produto.valorOperacao}</div>
                                                        <div onClick={() => {apagarProdutoAdquiridoModal(produto.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                            <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                        </div>
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
                            totalProdutosAdquiridosModal.length > 0 &&
                            <div className="mt-6">
                                <BotaoGeral onClickFn={addProdutosAdquiridos} principalBranco={true} text="Salvar" />
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
                            Produtos Adquiridos
                        </div>
                        <div>
                            <BotaoGeral onClickFn={abrirModalProdutosFn} principalBranco={true} text="Adicionar Novo Produto Adquirido"/>
                        </div>
                    </div>
                </div>
                {
                    totalProdutosAdquiridos.length > 0 ?
                    <div className="flex flex-col gap-4 mt-8">
                        <div className="flex flex-col gap-2 border-solid border-white border-2 rounded-2xl">

                            {totalProdutosAdquiridos.map((produto, index) => {
                                return (
                                        <>
                                            {
                                                index == 0 &&
                                                <div className="grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center mb-4 p-4 font-bold">
                                                    <div>Método</div>
                                                    <div>Tipo Operação</div>
                                                    <div>CNPJ Fornecedor</div>
                                                    <div>Regime Fornecedor</div>
                                                    <div>Fornecedor Industrial</div>
                                                    <div>NCM</div>
                                                    <div>Aliq. ICMS</div>
                                                    <div>Aliq. PIS</div>
                                                    <div>Aliq. COFINS</div>
                                                    <div>Aliq. IPI</div>
                                                    <div>Valor Operação</div>
                                                    <div onClick={() => {}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer opacity-0">
                                                        <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                    </div>
                                                </div>
                                            }
                        
                                            <div className={`grid grid-cols-[repeat(11,_1fr)_auto] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                <div>{produto.metodo}</div>
                                                <div>{produto.metodo == "Por Operação" ? produto.tipoOperacao : ""}</div>
                                                <div>{produto.metodo == "Por CNPJ" ? produto.cnpjFornecedor : "Diversos"}</div>
                                                <div>{produto.regimeTributarioOutro}</div>
                                                <div>{produto.fornecedorIndustrial ? "Sim" : "Não"}</div>
                                                <div>{produto.ncm}</div>
                                                <div>{produto.icms}% - {produto.creditoIcms ? "Com Crédito" : "Sem Crédito"}</div>
                                                <div>{produto.pis}%</div>
                                                <div>{produto.cofins}%</div>
                                                <div>{produto.ipi}% - {produto.creditoIpi ? "Com Crédito" : "Sem Crédito"}</div>
                                                <div>{produto.valorOperacao}</div>
                                                <div onClick={() => {apagarProdutoAdquirido(produto.id)}} className="bg-red-600 p-1 rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
                                                    <img className="w-3 h-3" src={lixeira} alt="lixeira" />
                                                </div>
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