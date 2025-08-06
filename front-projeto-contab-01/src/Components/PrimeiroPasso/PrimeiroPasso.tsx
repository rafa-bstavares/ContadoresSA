import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { BotaoGeral } from "../BotaoGeral/BotaoGeral";
import { baseUrl } from "../../App";
import { ContextoGeral, tipoObjEmpresa, tipoObjPessoaFisica } from "../../Contextos/ContextoGeral/ContextoGeral";
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro";
import { ContextoUsuario } from "../../Contextos/ContextoUsuario/ContextoUsuario";
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { InputReais } from "../InputReais/InputReais";


type Props = {
    modoBranco: boolean
}

type cnaeDescricao = {
    cnae:string,
    descricao: string
}


export function verificarDigVerif(baseCnpj: string, cnpj: string, numSlice: number){
    
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


export function validarCnpj(cnpj: string): {valido: boolean, cnpj: null | string}{
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
                return {valido: true, cnpj: cnpj}
            }else{
                return {valido: false, cnpj: null}
            }

        }   
    }else{
        return {valido: false, cnpj: null}
    }
}


export async function buscarCnaesApi(cnpj: string): Promise<string[]>{
    //buscar CNAES na api e caso de certo habilitar os toggles
    const novoArrCnaes: string[] = []
    const res = await fetch(`https://open.cnpja.com/office/${cnpj}`)
    const data = await res.json()

    console.log("retorno api cnaes")
    console.log(data)


    //VERIFICANDO SE OS CNAES PRECISAM DE ZEROS À ESQUERDA
    // CNAE principal
    let cnaePrincipalStr = data.mainActivity.id.toString()

    // conferir se tem 7 dígitos
    if(cnaePrincipalStr.length < 7){
        do{
            cnaePrincipalStr = "0" + cnaePrincipalStr
        }while(cnaePrincipalStr.length < 7)
    }
    

    novoArrCnaes.push(cnaePrincipalStr)

    // CNAEs secundários
    const arrCnaesSec = data.sideActivities
    if(arrCnaesSec.length > 0){
        arrCnaesSec.forEach((item: {id: number}) => {
            let cnaeAtualStr = item.id.toString()
            if(cnaeAtualStr.length < 7){
                do{
                    cnaeAtualStr = "0" + cnaeAtualStr
                }while(cnaeAtualStr.length < 7)
            }

            novoArrCnaes.push(cnaeAtualStr)
        })
    }



    return novoArrCnaes
}




export function PrimeiroPasso({modoBranco}: Props){
    type CriarEmpresaBodyType = {
        
        cnpj: string,
        folha: string
        faturamento_mensal_medio: string
        nome_fantasia?: string
        razao_social?: string
        uf?: string             
        cnae_principal?: string 
        cnae_secundario?: string 
        descricao_atividade_principal?: string 
        regularidade?: boolean, 
        regime_tributario: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO",
        cnaes: string[]
    }

    type posicaoObjType = {
        emCima: boolean,
        naTela: boolean,
        emBaixo: boolean
    }

    type telasType = 
        "inputCpfOuCnpj" |
        "regime" |
        "folha"


    type objOpRegime = {label: "Simples Nacional" | "Lucro Real" | "Lucro Presumido", valor: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO"}


    const [regimeTributario, setRegimeTributario] = useState<"SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO">()
    const [precisaRegime, setPrecisaRegime] = useState<boolean>(false)
    const [precisaFolha, setPrecisaFolha] = useState<boolean>(false)
    const [precisaCpf, setPrecisaCpf] = useState<boolean>(true)
    const [inputCpfOuCnpj, setInputCpfOuCnpj] = useState<string>("")
    const [inputNomeFantasia, setInputNomeFantasia] = useState<string>("")
    const [posicaoInputCpfCnpj, setPosicaoInputCpfCnpj] = useState<posicaoObjType>({emCima: false, naTela: true, emBaixo: false})
    const [posicaoRegime, setPosicaoRegime] = useState<posicaoObjType>({emCima: false, naTela: false, emBaixo: true})
    const [posicaoFolha, setPosicaoFolha] = useState<posicaoObjType>({emCima: false, naTela: false, emBaixo: true})
    const [ultimoNaTela, setUltimoNaTela] = useState<telasType>()
    const [minhasEmpresasAberto, setMinhasEmpresasAberto] = useState<boolean>(false)
    const [cnpjMinhaEmpresaSeletor, setCnpjMinhaEmpresaSeletor] = useState<string>("")
    const [telaSaberTipoEmpresa, setTelaSaberTipoEmpresa] = useState<boolean>(true)
    const [empresaCadastrada, setEmpresaCadastrada] = useState<boolean>(true)
    const [aposPrimeiroRender, setAposPrimeiroRender] = useState<boolean>(false)
    const [regimeAberto, setRegimeAberto] = useState<boolean>(false)
    const [ regimeTela, setRegimeTela] = useState<"Simples Nacional" | "Lucro Real" | "Lucro Presumido">()
    const [folhaAdd, setFolhaAdd] = useState<number>(0)
    const [faturamentoMensalAdd, setFaturementoMensalAdd] = useState<number>(0)
    let meuCnpjOuCpfVerificado = ""
    


    const { objMinhaEmpresaOuPessoaAtual, setObjMinhaEmpresaOuPessoaAtual, setSoImoveis, passo1, passo2, setPasso1, setPasso2} = useContext(ContextoGeral)
    const {setTextoErro, setTemErro} = useContext(ContextoErro)
    const {setMinhasEmpresas, minhasEmpresas} = useContext(ContextoUsuario)

    const regimeOpcoes: objOpRegime[] = [
        { label: "Simples Nacional", valor: "SIMPLES_NACIONAL" },
        { label: "Lucro Real",      valor: "LUCRO_REAL"     },
        { label: "Lucro Presumido", valor: "LUCRO_PRESUMIDO"}
    ]
    



    function checkCnpj(cnpj: string){
        if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
            const objCnpj = validarCnpj(cnpj)
            if(objCnpj.valido){
                //CNPJ VÁLIDO, podemos chamar API
                console.log("cnpj válido")
                //varificar se tem na nossa base de dados
                fetch(baseUrl + "/buscarEmpresa", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        cnpj: objCnpj.cnpj
                    })
                }).then(res => res.json()).then((data) => {
                    if(data.success == true){
                        // encontrou cnpj
                        console.log("encontrou cnpj")
                        console.log("dados retornados da empresa existente: ")
                        console.log(data)
                        console.log(data.data.regime_tributario)
                        let regimeAtual: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "" = ""
                        switch(data.data.regime_tributario){
                            case "SIMPLES_NACIONAL":
                                regimeAtual = "Simples Nacional" 
                                break

                            case "LUCRO_PRESUMIDO":
                                regimeAtual = "Lucro Presumido"
                                break

                            case "LUCRO_REAL": 
                                regimeAtual = "Lucro Real"
                                break
                        }
                        const objInfosMinhaEmpresaOuPessoaClone = {...objMinhaEmpresaOuPessoaAtual}
                        objInfosMinhaEmpresaOuPessoaClone.meuRegime = regimeAtual
                        setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaClone)

                        buscarCnaesApi(objMinhaEmpresaOuPessoaAtual.cnpj)

                        // IR PARA PASSO 2
                        setPasso1(false)
                        setPasso2(true)
                        
                    }else if(data.success == false){
                        if(data.error.code == 404){
                            console.log("CNPJ não encontrado")
                            setPrecisaRegime(true)
                        }
                        
                    }
                })


            }else{
                console.log("O campo CNPJ não pode estar vazio, deve conter exatamente 14 dígitos e precisa ser um CNPJ válido.")
            }
        }
    }


    async function registrarEmpresaDb(): Promise<{erroChamada: boolean, criadoSucesso: boolean}>{

        if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
            if(objMinhaEmpresaOuPessoaAtual.cnpj && regimeTributario && objMinhaEmpresaOuPessoaAtual.folha && inputNomeFantasia && objMinhaEmpresaOuPessoaAtual.faturamentoMensalMedio){

                console.log("Regime")
                console.log(objMinhaEmpresaOuPessoaAtual.meuRegime)

                console.log("CNAE PRINCIPAL")
                console.log(objMinhaEmpresaOuPessoaAtual.cnaes[0])
                console.log("CNPJ ENVIADO:")
                console.log(objMinhaEmpresaOuPessoaAtual.cnpj)

                const novoArrCnaes = await buscarCnaesApi(objMinhaEmpresaOuPessoaAtual.cnpj)

                const objInfosMinhaEmpresaOuPessoaClone = {...objMinhaEmpresaOuPessoaAtual}
                objInfosMinhaEmpresaOuPessoaClone.cnaes = novoArrCnaes
                setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaClone)

                // Como eu acabei de buscar os CNAES, não posso usar o state objMinhaEmpresaOuPessoaAtual.cnaes para preencher o body, pois o estado ainda não vai estar atualizado


                const body: CriarEmpresaBodyType = {
                    cnpj: objMinhaEmpresaOuPessoaAtual.cnpj,
                    regime_tributario: regimeTributario,
                    nome_fantasia: inputNomeFantasia,
                    cnae_principal: novoArrCnaes.length > 0 ? novoArrCnaes[0] : "",
                    folha: objMinhaEmpresaOuPessoaAtual.folha.toString(),
                    faturamento_mensal_medio: objMinhaEmpresaOuPessoaAtual.faturamentoMensalMedio.toString(),
                    cnaes: novoArrCnaes
                } 
        
                // fazer o cadastro "simplificado" da empresa, buscar CNAES na api e caso de certo habilitar os campos de baixo dos toggles buttons 
                const resposta = await fetch(baseUrl + "/criarEmpresa", {
                    method: "POST",
                    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                    body: JSON.stringify(body)
                })

                const data = await resposta.json()
                console.log("resposta criar empresa")
                console.log(data)
                if(data.success == true){
                    console.log("Dados da empresa cadastrados com sucesso")
                    // await buscarCnaesApi() APAGUEI 14/05
                    
                    // setPrecisaFolha(true)

                    //IR PARA PASSO 2 (isso precisa ser ativado na função do bt de envio da folha)
                    //setPasso1(false)
                    //setPasso2(true)
                    let regimeAtual: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "" = ""
                    switch(regimeTributario){
                        case "SIMPLES_NACIONAL":
                            regimeAtual = "Simples Nacional" 
                            break

                        case "LUCRO_PRESUMIDO":
                            regimeAtual = "Lucro Presumido"
                            break

                        case "LUCRO_REAL": 
                            regimeAtual = "Lucro Real"
                            break
                    }

                    //const objInfosMinhaEmpresaOuPessoaClone = {...objMinhaEmpresaOuPessoaAtual}
                    //objInfosMinhaEmpresaOuPessoaClone.meuRegime = regimeAtual
                    //setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaClone)

                    return {criadoSucesso: true, erroChamada: false}
                }else{
                    if(data.error.code == 400){
                        setTemErro(true)
                        setTextoErro("Você já cadastrou essa empresa")
                        // Caso eu já tenha cadastrado e isso passou despercebido na ultima conferencia, deve-se passar para o próximo passo com o regime que tá no banco
                    }else if(data.error.code == 500){
                        setTemErro(true)
                        setTextoErro("Tivemos problemas para cadastrar sua empresa, por favor, tente novamente")
                    }
                    return {criadoSucesso: false, erroChamada: true}

                }
            }else{
                setTemErro(true)
                setTextoErro("Preencha todos os campos, por favor.")
                return {criadoSucesso: false, erroChamada: true}
            }
        }else{
            setTemErro(true)
            setTextoErro("Você está tentando criar uma empresa a partir de um CPF, o que não é possível")
            return {criadoSucesso: false, erroChamada: true}
        }
        
    }


    function valorRegime(e: ChangeEvent<HTMLInputElement>){
        if(e.target.checked){
            setRegimeTributario(e.target.id as "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO")
        }
    }




    function validarCpf(cpf: string){

        if (/^(\d)\1{10}$/.test(cpf)) {
            return {valido: false, cpf: null}
          }

          const digitos = cpf.split('').map(d => parseInt(d, 10))

          // Calcula o primeiro dígito verificador
          let soma = 0;
          for (let i = 0; i < 9; i++) {
            soma += digitos[i] * (10 - i)
          }
          let resto = soma % 11;
          const dig1 = resto < 2 ? 0 : 11 - resto;
          if (dig1 !== digitos[9]) {
            return {valido: false, cpf: null}
          }
        
          // Calcula o segundo dígito verificador
          soma = 0;
          for (let i = 0; i < 10; i++) {
            soma += digitos[i] * (11 - i);
          }
          resto = soma % 11;
          const dig2 = resto < 2 ? 0 : 11 - resto;
          if (dig2 !== digitos[10]) {
            return {valido: false, cpf: null}
          }
        
          // Se passou por todas as etapas, o CPF é válido
          return {valido: true, cpf}

    }

    // função para verificar se o que foi digitado no passo 1 é cnpj ou cpf e se os valores são válidos
    async function identificarCnpjOuCpf(cpfOuCnpj: string): Promise<{tamanhoValido: boolean, valido: boolean, tipo: "cpf" | "cnpj", registradoDb: boolean | null, erroDeApi: boolean}>{
        if(cpfOuCnpj.length == 11){
            // Verificar se é CPF válido
            const respCpf = validarCpf(cpfOuCnpj)
            if(respCpf.valido){
                // Só adiciono no meu obj de infos da empresa ou pessoa se for válido
                meuCnpjOuCpfVerificado = respCpf.cpf ? respCpf.cpf : ""

                // Se for pessoa fisica não verifico no db
                const objInfosMinhaEmpresaOuPessoaNovo: tipoObjPessoaFisica = {
                    cpf: meuCnpjOuCpfVerificado,
                    tipoUsuario: "Pessoa Física"
                }
                setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaNovo)
                setPasso1(false)
                setPasso2(true)
                // COLOCAR STATE PARA ABRIR SÓ OS IMOVEIS
                setSoImoveis(true)
                console.log("cpf")

                return {tamanhoValido: true, valido: true, tipo: "cpf", registradoDb: null, erroDeApi: false}


            }else{
                setTemErro(true)
                setTextoErro("O CPF informado não é válido, por favor, tente novamente")
                return {tamanhoValido: true, valido: false, tipo: "cpf", registradoDb: null, erroDeApi: false}
            }

        }else if(cpfOuCnpj.length == 14){
            console.log("cnpj")
            // Verificar se é CNPJ válido
            const respCnpj = validarCnpj(cpfOuCnpj)
            if(respCnpj.valido){
                //CNPJ VÁLIDO, podemos chamar API

                //Só adiciono ao obj de ionfos da empresa ou pessoa se for um cnpj válido
                meuCnpjOuCpfVerificado = respCnpj.cnpj ? respCnpj.cnpj : ""

                console.log("cnpj válido")
                //varificar se tem na nossa base de dados
                try{
                    const resposta = await fetch(baseUrl + "/buscarEmpresa", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            cnpj: respCnpj.cnpj
                        })
                    })
                    const data = await resposta.json()
                    if(data.success == true){
                        // encontrou cnpj na nossa base de dados
                        console.log("encontrou cnpj")
                        console.log("dados retornados da empresa existente: ")
                        console.log(data)
                        console.log(data.data.regime_tributario)
                        let regimeAtual: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "" = ""
                        switch(data.data.regime_tributario){
                            case "SIMPLES_NACIONAL":
                                regimeAtual = "Simples Nacional" 
                                break

                            case "LUCRO_PRESUMIDO":
                                regimeAtual = "Lucro Presumido"
                                break

                            case "LUCRO_REAL": 
                                regimeAtual = "Lucro Real"
                                break
                        }

                        // const arrCnaes = await buscarCnaesApi() Não vamos mais fazer pois se o CNPJ foi encontrado, os cnaes dele já estão na tabela CNAES do db e deve vir no "data

                        const objInfosMinhaEmpresaOuPessoaNovo: tipoObjEmpresa = {
                            tipoUsuario: "Empresa",
                            meuRegime: regimeAtual,
                            cnpj: meuCnpjOuCpfVerificado,
                            cnaes: data.data.cnaes,
                            folha: Number(data.data.folha),
                            faturamentoMensalMedio: Number(data.data.faturamento_mensal_medio)
                        }
                        setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaNovo)



                        // Quero que um retorno fique aqui
                        return {tamanhoValido: true, valido: true, tipo: "cnpj", registradoDb: true, erroDeApi: false}

                        setPrecisaCpf(false)
                        setPrecisaFolha(true)

                        // IR PARA PASSO 2 (isso vai precisar ser ativado dentro da função do botao de enviar folha)
                        //setPasso1(false)
                        //setPasso2(true)
                        
                    }else if(data.success == false){
                        if(data.error.code == 404){

                            
                            // const arrCnaes = await buscarCnaesApi() Vai buscar os CNAES na hora de enviar, na hora de criar empresa (botão avançar da folha)

                            console.log("CNPJ não encontrado")
                            const objInfosMinhaEmpresaOuPessoaNovo: tipoObjEmpresa = {
                                tipoUsuario: "Empresa",
                                cnpj: meuCnpjOuCpfVerificado,
                                meuRegime: "",
                                cnaes: [],
                                faturamentoMensalMedio: 0,
                                folha: 0
                            }
                            console.log("CONSOLE NO MOMENTO QUE ALTERA O OBJINFOS")
                            setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaNovo)
                            //setPrecisaCpf(false)
                            //setPrecisaRegime(true)
                        }
                        
                        // Quero outro retorno aqui
                        return {tamanhoValido: true, valido: true, tipo: "cnpj", registradoDb: false, erroDeApi: false}

                    }else{
                        return {tamanhoValido: true, valido: true, tipo: "cnpj", registradoDb: false, erroDeApi: true}
                    }

                }catch(err: any) {
                    return {tamanhoValido: true, valido: true, tipo: "cnpj", registradoDb: false, erroDeApi: true}
                }
            }else{
                setTemErro(true)
                setTextoErro("O CNPJ informado não é válido, por favor, tente novamente")
                return {tamanhoValido: true, valido: false, tipo: "cnpj", registradoDb: null, erroDeApi: false}
            }

        }else{
            setTemErro(true)
            setTextoErro("No campo de CNPJ ou CPF, coloque um valor válido. Em caso de CPF devem ser 11 dígitos, em caso de CNPJ devem ser 14 dígitos")
            return {tamanhoValido: false, valido: false, tipo: "cnpj", registradoDb: null, erroDeApi: false}
        }


    }


    async function acaoPrimeiroPassoAvancar(){

        // Primeiro verificar quem está na tela atualmente
        if(posicaoInputCpfCnpj.naTela){
            // Aqui só tenho botão de avançar, se quiser voltar tem que clicar pra fechar o modal, que ativará outra função
            console.log("executando parte cpf/cnpj")
            const resposta = await identificarCnpjOuCpf(inputCpfOuCnpj)

            if(!resposta.tamanhoValido){
                // O tratamento do erro já ocorre dentro da função "identificarCnpjOuCpf"
                return 
            }

            if(resposta.erroDeApi){
                setTemErro(true)
                setTextoErro("Ocorreu um erro de API, por favor, tente novamente")
                return 
            }
            console.log("resposta do identificar cnpj ou cpf: ")
            console.log(resposta)

            if(resposta.valido){
                console.log("resposta do identificar cnpj ou cpf: ")
                console.log(resposta)
                // Se for CPF válido, ele já manda para o passo 2 direto na função "identificarnpjOuCpf", então só preciso conferir o CNPJ
                if(resposta.tipo == "cnpj"){
                    if(resposta.registradoDb){
                        // Vai direto pro passo2
                        setPasso1(false)
                        setPasso2(true)

                    }else if (resposta.registradoDb == false){
                        // Tem que ir para regime (inputCnpj ir pra cima e regime ir pra tela)
                        const objPosicaoCpfOuCnpjClone = {...posicaoInputCpfCnpj}
                        objPosicaoCpfOuCnpjClone.naTela = false
                        objPosicaoCpfOuCnpjClone.emCima = true
                        objPosicaoCpfOuCnpjClone.emBaixo = false
                        setPosicaoInputCpfCnpj(objPosicaoCpfOuCnpjClone)

                        const objPosicaoRegimeClone = {...posicaoRegime}
                        objPosicaoRegimeClone.emBaixo = false
                        objPosicaoRegimeClone.naTela = true
                        objPosicaoRegimeClone.emCima = false
                        setPosicaoRegime(objPosicaoRegimeClone)

                        setUltimoNaTela("inputCpfOuCnpj")

                    }else{
                        // Caso de registradoDb == null
                    }
                }
            }else{
                // O tratamento do erro já ocorre dentro da função "identificarCnpjOuCpf"
                return 
            }


        }

        if(posicaoRegime.naTela){

            if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
                if(regimeTributario && inputNomeFantasia){
                    
                    let regimeAtual: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "" = ""
                    switch(regimeTributario){
                        case "SIMPLES_NACIONAL":
                            regimeAtual = "Simples Nacional" 
                            break

                        case "LUCRO_PRESUMIDO":
                            regimeAtual = "Lucro Presumido"
                            break

                        case "LUCRO_REAL": 
                            regimeAtual = "Lucro Real"
                            break
                    }
                    
                    const objInfosMinhaEmpresaOuPessoaClone = {...objMinhaEmpresaOuPessoaAtual}
                    objInfosMinhaEmpresaOuPessoaClone.meuRegime = regimeAtual
                    setObjMinhaEmpresaOuPessoaAtual(objInfosMinhaEmpresaOuPessoaClone)

                    // Ir para folha (regime pra cima e folha pra tela)
                    const objPosicaoRegimeClone = {...posicaoRegime}
                    objPosicaoRegimeClone.emBaixo = false
                    objPosicaoRegimeClone.naTela = false
                    objPosicaoRegimeClone.emCima = true
                    setPosicaoRegime(objPosicaoRegimeClone)

                    const objPosicaoFolhaClone = {...posicaoFolha}
                    objPosicaoFolhaClone.emBaixo = false
                    objPosicaoFolhaClone.naTela = true
                    objPosicaoFolhaClone.emCima = false
                    setPosicaoFolha(objPosicaoFolhaClone)

                    setUltimoNaTela("regime")

                }else{
                    setTemErro(true)
                    setTextoErro("Por favor, Regime Tributário e o Nome Fantasia devem ser preenchidos corretamente")
                }
            }else{
                setTemErro(true)
                setTextoErro("Você está tentando adicionar um regime tributário para uma Pessoa Física, o que não é possível. Por favor, reinicie o processo ou entre em contato com o suporte")
            }




        }

        if(posicaoFolha.naTela){
            const respRegistroDb = await registrarEmpresaDb()

            if(respRegistroDb.criadoSucesso){
                setPasso1(false)
                setPasso2(true)
            }
            
        }
    }


    function acaoPrimeiroPassoVoltar(){
        if(posicaoInputCpfCnpj.naTela){

        }

        if(posicaoRegime.naTela){
            // voltar para InputCpfOuCnpj (Regime descer e inputCpfOuCnpj pra tela)
            const objPosicaoRegimeClone = {...posicaoRegime}
            objPosicaoRegimeClone.emBaixo = true
            objPosicaoRegimeClone.naTela = false
            objPosicaoRegimeClone.emCima = false
            setPosicaoRegime(objPosicaoRegimeClone)

            const objPosicaoCpfOuCnpjClone = {...posicaoInputCpfCnpj}
            objPosicaoCpfOuCnpjClone.naTela = true
            objPosicaoCpfOuCnpjClone.emCima = false
            objPosicaoCpfOuCnpjClone.emBaixo = false
            setPosicaoInputCpfCnpj(objPosicaoCpfOuCnpjClone)
        }

        if(posicaoFolha.naTela){
            // ver quem é o ultimo
            if(ultimoNaTela == "inputCpfOuCnpj"){
                // voltar para InputCpfOuCnpj (Folha descer e inputCpfOuCnpj pra tela)
                const objPosicaoFolhaClone = {...posicaoFolha}
                objPosicaoFolhaClone.emBaixo = true
                objPosicaoFolhaClone.naTela = false
                objPosicaoFolhaClone.emCima = false
                setPosicaoFolha(objPosicaoFolhaClone)

                const objPosicaoCpfOuCnpjClone = {...posicaoInputCpfCnpj}
                objPosicaoCpfOuCnpjClone.naTela = true
                objPosicaoCpfOuCnpjClone.emCima = false
                objPosicaoCpfOuCnpjClone.emBaixo = false
                setPosicaoInputCpfCnpj(objPosicaoCpfOuCnpjClone)

            }else if(ultimoNaTela == "regime"){
                // voltar para Regime (Folha descer e regime pra tela)
                const objPosicaoFolhaClone = {...posicaoFolha}
                objPosicaoFolhaClone.emBaixo = true
                objPosicaoFolhaClone.naTela = false
                objPosicaoFolhaClone.emCima = false
                setPosicaoFolha(objPosicaoFolhaClone)

                const objPosicaoRegimeClone = {...posicaoRegime}
                objPosicaoRegimeClone.emBaixo = false
                objPosicaoRegimeClone.naTela = true
                objPosicaoRegimeClone.emCima = false
                setPosicaoRegime(objPosicaoRegimeClone)

            }
        }


    }


    function setPropFolha(folhaAtual: number){
        if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
            const objMinhaEmpresaOuPessoaAtualClone: tipoObjEmpresa = {...objMinhaEmpresaOuPessoaAtual}
            objMinhaEmpresaOuPessoaAtualClone.folha = folhaAtual
            setObjMinhaEmpresaOuPessoaAtual(objMinhaEmpresaOuPessoaAtualClone)
        }else{
            setTemErro(true)
            setTextoErro("Você está tentando adicionar uma folha de pagamento para uma Pessoa Física, o que não é possível. Por favor, reinicie o processo ou entre em contato com o suporte")
        }

    }

    function setPropFaturamento(faturamentoAtual: number){

        if(objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa"){
            const objMinhaEmpresaOuPessoaAtualClone = {...objMinhaEmpresaOuPessoaAtual}
            objMinhaEmpresaOuPessoaAtualClone.faturamentoMensalMedio = faturamentoAtual
            setObjMinhaEmpresaOuPessoaAtual(objMinhaEmpresaOuPessoaAtualClone)
        }else{
            setTemErro(true)
            setTextoErro("Você está tentando adicionar um faturamento médio para uma Pessoa Física, o que não é possível. Por favor, reinicie o processo ou entre em contato com o suporte")
        }


    }


    function escolherMinhaEmpresaSeletor(cnpj: string){
        setCnpjMinhaEmpresaSeletor(cnpj)
        setMinhasEmpresasAberto(false)
    }

    function caminhoEmpresaCadastradaFn(){
        setTelaSaberTipoEmpresa(false)
        setEmpresaCadastrada(true)
    }

    function caminhoEmpresaNovaFn(){
        setEmpresaCadastrada(false)
    }

    function voltarTelaEmpresaCadastrada(){
        setEmpresaCadastrada(true)
    }

    


    async function avancarEmpresaCadastrada(){
        const dadosEmpresaAtual = minhasEmpresas.filter(item => item.cnpj == cnpjMinhaEmpresaSeletor)
        console.log("Dados empresa Atuallll")
        console.log(dadosEmpresaAtual)
        if(dadosEmpresaAtual.length > 0){

            let regimeAtual: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "" = ""
            switch(dadosEmpresaAtual[0].regime_tributario){
                case "SIMPLES_NACIONAL":
                    regimeAtual = "Simples Nacional" 
                    break

                case "LUCRO_PRESUMIDO":
                    regimeAtual = "Lucro Presumido"
                    break

                case "LUCRO_REAL": 
                    regimeAtual = "Lucro Real"
                    break
            }


            const objMinhaEmpresaOuPessoaAtualNovo: tipoObjEmpresa = {
                tipoUsuario: "Empresa",
                cnpj: dadosEmpresaAtual[0].cnpj,
                cnaes: dadosEmpresaAtual[0].cnaes,
                meuRegime: regimeAtual,
                faturamentoMensalMedio: dadosEmpresaAtual[0].faturamento_mensal_medio,
                folha: dadosEmpresaAtual[0].folha

            }

            setObjMinhaEmpresaOuPessoaAtual(objMinhaEmpresaOuPessoaAtualNovo)

            setPasso1(false)
            setPasso2(true)

        }
    }


    useEffect(() => {
        console.log("Mudou a empresa")
        console.log(objMinhaEmpresaOuPessoaAtual)
    }, [objMinhaEmpresaOuPessoaAtual])

    useEffect(() => {

        setAposPrimeiroRender(true)

        fetch(baseUrl + "/minhasEmpresas", {
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
            console.log("resposta minhas empresas")
            console.log(data)
            if(data.success){
                setMinhasEmpresas(data.data)
            }
        })
    }, [])

    useEffect(() => {
        console.log("minhasEmpresas: ")
        console.log(minhasEmpresas)

    }, [minhasEmpresas])


    return (
        <div className="absolute z-30 flex justify-center items-center right-0 left-0 top-0 h-screen bg-black/80">
            <div className={`flex flex-col h-[70%] gap-4 border-2 border-solid border-fundoCinzaEscuro rounded-xl p-26 bg-fundoCinzaEscuro justify-center items-center ${modoBranco? "text-fundoCinzaEscuro" : "text-white"}`}>
            
                    {
                        empresaCadastrada ?
                            <>
                                <div className="flex flex-col relative">
                                    <div className="flex flex-col absolute top-0 left-0 right-0 z-20">
                                        <label className="text-gray-400">Minhas empresas cadastradas:</label>
                                        <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                                            <div
                                            onClick={() => (setMinhasEmpresasAberto(!minhasEmpresasAberto))}
                                            className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                            >
                                                <div className="text-sm opacity-50">
                                                    {cnpjMinhaEmpresaSeletor
                                                    ? cnpjMinhaEmpresaSeletor
                                                    : "Escolha"}
                                                </div>
                                                <div
                                                    className={`
                                                    ${minhasEmpresasAberto ? "rotate-180" : "rotate-0"}
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
                                                ${minhasEmpresasAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                                [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro
                                            `}
                                            >
                                                <div className="overflow-hidden">
                                                    {minhasEmpresas.map(item => (
                                                    <div
                                                        key={item.cnpj}
                                                        className="p-2 rounded-md cursor-pointer hover:bg-gray-300"
                                                        onClick={() => escolherMinhaEmpresaSeletor(item.cnpj)}
                                                    >
                                                        {item.cnpj}
                                                    </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <label className="text-gray-400">Minhas empresas cadastradas:</label>
                                    <div className="flex flex-col border-2 border-solid border-transparent rounded-md">
                                        <div
            
                                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                        >
                                        <div className="text-sm opacity-50">
                                            {cnpjMinhaEmpresaSeletor
                                            ? cnpjMinhaEmpresaSeletor
                                            : "Escolha"}
                                        </div>
                                        <div
                                            className={`
                                            ${minhasEmpresasAberto ? "rotate-180" : "rotate-0"}
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
                                    </div>
                                    <div className="self-center mt-8 flex gap-4">
                                        <BotaoGeral onClickFn={caminhoEmpresaNovaFn} principalBranco={false} text="Nova empresa" />
                                        <BotaoGeral onClickFn={avancarEmpresaCadastrada} principalBranco={true} text="Avançar" />
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                    <div className="text-gray-400">Primeiro preencha as seguintes informações:</div>
            
                                    {/* Div que teráh-h0% e overflow hidden para que os elementos sumam ao sair dela */}
                                    <div className={`h-[80%] w-full overflow-hidden flex justify-center items-center relative`}>
                                    {/* Padrão para ficar no meio: bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 */}
                                        <div className={`absolute flex flex-col w-full ${posicaoInputCpfCnpj.naTela ? "bottom-1/2 translate-y-1/2" : posicaoInputCpfCnpj.emCima? "bottom-full translate-y-0" : "bottom-0 translate-y-full"} right-1/2 translate-x-1/2 ${aposPrimeiroRender ? 'transition-[bottom,translate] duration-500 ease-in-out' : ''}`}>
                                            <div className="flex flex-col gap-1 w-full">
                                                <label htmlFor="cnpjIn">Digite seu CNPJ ou CPF (apenas números):</label>
                                                <input readOnly={passo1? (precisaRegime? true: false) : true} onChange={(e) => setInputCpfOuCnpj(e.target.value)} id="cnpjIn" type="number" placeholder='CNPJ ou CPF' className={`outline-none border-2 border-solid ${modoBranco ? "border-fundoCinzaEscuro" : "border-white"} rounded-md px-4 py-2 w-full ${passo1? (precisaRegime? "bg-gray-500": "") : "bg-gray-500"}`}/>
                                            </div>
                                            <div className="pt-2 flex gap-4 self-center mt-4">
                                                <BotaoGeral onClickFn={voltarTelaEmpresaCadastrada} principalBranco={false} text="Voltar" />
                                                <BotaoGeral principalBranco={true} text="Avançar" onClickFn={acaoPrimeiroPassoAvancar} />
                                            </div>
                                            {/*<BotaoGeral text="enviar CNPJ ou CPF" onClickFn={() => identificarCnpjOuCpf(inputCpfOuCnpj)} />*/}
                                        </div>
                                        <div className={`absolute w-full flex flex-col items-center ${posicaoRegime.naTela ? "bottom-1/2 translate-y-1/2" : posicaoRegime.emCima? "bottom-full translate-y-0" : "bottom-0 translate-y-full"} right-1/2 translate-x-1/2 ${aposPrimeiroRender ? 'transition-[bottom,translate] duration-500 ease-in-out' : ''}`}>
                                            <div className="mb-1">Qual o regime tributário da empresa acima?</div>
                                            <div className="relative w-full">
            
                                                <div
                                                onClick={() => (setRegimeAberto(!regimeAberto))}
                                                className="flex gap-2 items-center justify-between p-2 cursor-pointer border-2 border-solid border-white rounded-md"
                                                >
                                                    <div className="opacity-50">
                                                        {regimeTela
                                                        ? regimeTela
                                                        : "Escolha"}
                                                    </div>
                                                    <div
                                                        className={`
                                                        ${regimeAberto ? "rotate-180" : "rotate-0"}
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
                                                <div className="absolute top-0 left-0 right-0 flex flex-col border-gray-300 border-solid border-2 rounded-md bg-fundoCinzaEscuro">
                                                    <div
                                                    onClick={() => (setRegimeAberto(!regimeAberto))}
                                                    className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                                                    >
                                                        <div className="opacity-50">
                                                            {regimeTela
                                                            ? regimeTela
                                                            : "Escolha"}
                                                        </div>
                                                        <div
                                                            className={`
                                                            ${regimeAberto ? "rotate-180" : "rotate-0"}
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
                                                        ${regimeAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                                                        [transition:grid-template-rows_500ms] bg-fundoCinzaEscuro
                                                    `}
                                                    >
                                                        <div className="overflow-hidden">
                                                            {regimeOpcoes.map(opt => (
                                                                <div
                                                                key={opt.label}
                                                                className="py-2 px-4 cursor-pointer rounded-md hover:bg-fundoPreto"
                                                                onClick={() => {
                                                                    setRegimeTributario(opt.valor)
                                                                    setRegimeTela(opt.label)
                                                                    setRegimeAberto(false)
                                                                }}
                                                                >
                                                                {opt.label}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 mt-2 w-full">
                                                <label htmlFor="cnpjIn">Nome Fantasia:</label>
                                                <input readOnly={passo1? (precisaRegime? true: false) : true} onChange={(e) => setInputNomeFantasia(e.target.value)} id="cnpjIn" type="string" placeholder='Nome Fantasia' className={`outline-none border-2 border-solid ${modoBranco ? "border-fundoCinzaEscuro" : "border-white"} rounded-md px-4 py-2 w-full ${passo1? (precisaRegime? "bg-gray-500": "") : "bg-gray-500"}`}/>
                                            </div>
                                            <div className="pt-2 flex gap-4 mt-8">
                                                <BotaoGeral principalBranco={false} text="Voltar" onClickFn={acaoPrimeiroPassoVoltar}/>
                                                <BotaoGeral principalBranco={true} text="Avançar" onClickFn={acaoPrimeiroPassoAvancar}/>
                                                {/*<BotaoGeral onClickFn={enviarRegime} text="enviar regime"/>*/}
                                            </div>
                                        </div>
                                        <div className={`absolute w-full flex flex-col gap-2 items-center ${posicaoFolha.naTela ? "bottom-1/2 translate-y-1/2" : posicaoFolha.emCima? "bottom-full translate-y-0" : "bottom-0 translate-y-full"} right-1/2 translate-x-1/2 ${aposPrimeiroRender ? 'transition-[bottom,translate] duration-500 ease-in-out' : ''}`}>
                                            <div>
                                                <label htmlFor="folhaIn">Digite a folha de pagamento mensal relativa ao CNPJ acima (apenas números. Exemplo: 100000):</label>
                                                <InputReais onChange={setPropFolha} value={folhaAdd.toString()} />
                                            </div>
                                            <div>
                                                <label htmlFor="folhaIn">Digite o faturamento mensal médio:</label>
                                                <InputReais onChange={setPropFaturamento} value={faturamentoMensalAdd.toString()} />
                                            </div>
                                            {/*<BotaoGeral onClickFn={enviarFolhaFn} text="enviar folha" />*/}
                                            <div className="pt-2 flex gap-4 mt-8">
                                                <BotaoGeral principalBranco={false} text="Voltar" onClickFn={acaoPrimeiroPassoVoltar}/>
                                                <BotaoGeral principalBranco={true} text="Avançar" onClickFn={acaoPrimeiroPassoAvancar}/>
                                                {/*<BotaoGeral onClickFn={enviarRegime} text="enviar regime"/>*/}
                                            </div>
                                        </div>
                                    </div>
                            </>
                    }
                    { !empresaCadastrada &&
                        <>
            
                        </>}
                {/*
                    precisaRegime && passo1?
                    <div className="pt-2">
                        <BotaoGeral onClickFn={enviarRegime} text="enviar regime"/>
                    </div>
                    :
                    <div className="pt-2">
                        <BotaoGeral onClickFn={checkCnpj} text="próximo passo"/>
                    </div>
                */}
                {
                    passo2 &&
                    <div>
                        Meu regime: {objMinhaEmpresaOuPessoaAtual.tipoUsuario == "Empresa" ? objMinhaEmpresaOuPessoaAtual.meuRegime : "Pessoa Física"}
                    </div>
                }
            </div>
        </div>
    )
}