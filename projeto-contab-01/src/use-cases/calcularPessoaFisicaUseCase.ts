import { anosType, ImoveisLocacaoObj, MoveisLocacaoObj, objAnoAAnoType, objDepoisReforma, objItemFinal, objRegimeType, parametrosEntrada, valorInicialObjRegime } from "./calcularSimplificadoUseCase";


type tiposRegime = "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "Pessoa Fisica" | ""


// Tipos da resposta final

export type respostaFinalCaluloPessoaFisicaType = {
    tipoUsuario: "Pessoa Física"
    respostaFinal: objRegimeType
    cpf: string
}


export class CalcularPessoaFisicaUseCase{

    constructor(private cpf: string, private totalImoveisLocacao: ImoveisLocacaoObj[], private totalMoveisLocacao: MoveisLocacaoObj[], private parametrosEntrada: parametrosEntrada, nomeCalculo: string){}



    async execute(){

        const totalMoveisLocacao = this.totalMoveisLocacao
        const totalImoveisLocacao = this.totalImoveisLocacao
        const cpf = this.cpf
        const parametrosEntrada = this.parametrosEntrada
        const ibsBruto = parametrosEntrada.aliquotaIbs / 100
        const cbsBruto = parametrosEntrada.aliquotaCbs / 100
        const ivaBruto = parametrosEntrada.aliquotaIva / 100        



        const arrAnos: anosType[] = ["A2026", "A2027", "A2028", "A2029", "A2030", "A2031", "A2032", "A2033"]  

        const anoAano: objAnoAAnoType[] = [
            {ano: "A2027", porcentagemCbs: 0.9892, porcentagemIbs: 0.001, porcentagemIcmsIss: 1},
            {ano: "A2028", porcentagemCbs: 0.9892, porcentagemIbs: 0.001, porcentagemIcmsIss: 1},
            {ano: "A2029", porcentagemCbs: 1, porcentagemIbs: 0.1, porcentagemIcmsIss: 0.9},
            {ano: "A2030", porcentagemCbs: 1, porcentagemIbs: 0.2, porcentagemIcmsIss: 0.8},
            {ano: "A2031", porcentagemCbs: 1, porcentagemIbs: 0.3, porcentagemIcmsIss: 0.7},
            {ano: "A2032", porcentagemCbs: 1, porcentagemIbs: 0.4, porcentagemIcmsIss: 0.6},
            {ano: "A2033", porcentagemCbs: 1, porcentagemIbs: 1, porcentagemIcmsIss: 0},
        ]        

        let dreCustoGeralAR = 0
        let dreCustoGeralTransicao: {ano: anosType, custoGeralAnoVigente: number}[] = [
            {ano: "A2026", custoGeralAnoVigente: 0},
            {ano: "A2027", custoGeralAnoVigente: 0},
            {ano: "A2028", custoGeralAnoVigente: 0},
            {ano: "A2029", custoGeralAnoVigente: 0},
            {ano: "A2030", custoGeralAnoVigente: 0},
            {ano: "A2031", custoGeralAnoVigente: 0},
            {ano: "A2032", custoGeralAnoVigente: 0},
            {ano: "A2033", custoGeralAnoVigente: 0},
        ]
        let dreDespesasAR = 0
        let dreDespesasTransicao: {ano: anosType, despesaAnoVigente: number}[] = [
            {ano: "A2026", despesaAnoVigente: 0},
            {ano: "A2027", despesaAnoVigente: 0},
            {ano: "A2028", despesaAnoVigente: 0},
            {ano: "A2029", despesaAnoVigente: 0},
            {ano: "A2030", despesaAnoVigente: 0},
            {ano: "A2031", despesaAnoVigente: 0},
            {ano: "A2032", despesaAnoVigente: 0},
            {ano: "A2033", despesaAnoVigente: 0},
        ]
        let valorImpostosPermanecerTotal = 0

        type regimesChavesObjType = "simplesNacional" | "lucroReal" | "lucroPresumido"

        let respostaFinalCalculo: respostaFinalCaluloPessoaFisicaType = {
            tipoUsuario: "Pessoa Física",
            respostaFinal: JSON.parse(JSON.stringify(valorInicialObjRegime)),
            cpf
        }



              // BENS MÓVEIS - LOCAÇÃO
              if(totalMoveisLocacao.length > 0){
                let pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                let iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                let icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                let ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0
                const ibsBruto = this.parametrosEntrada.aliquotaIbs / 100
                const cbsBruto = this.parametrosEntrada.aliquotaCbs / 100
                const ivaBruto = this.parametrosEntrada.aliquotaIva / 100
              

                console.log("BENS MOVEIS")
                console.log("/////////////////////////////////////////////////////////////")
                console.log("Começo do calculo")
                // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
                let pfRegimeRegular = false
                let totalAluguelMensal = 0
                totalImoveisLocacao.forEach(imovel => {
                    if(imovel.tipoAluguel == 'Aluguel recebido'){
                        totalAluguelMensal += imovel.valorAluguel
                    }
                })

                  let faturamentoTotalMensal = 0
                  totalMoveisLocacao.filter(movel => movel.tipoAluguel == "Aluguel recebido").forEach(movel => {
                    faturamentoTotalMensal += movel.valorLocacao
                  })



                  totalMoveisLocacao.forEach((movel, index) => {
                    console.log("MOVEL " + (index + 1))

                    let respMoveisLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }
      

                    //

                    let valorBase = movel.valorLocacao
                    console.log("Valor Base: ")
                    console.log(valorBase)

                    //DESONERAR
                    let aliquotaDesonerar = 0
                    let creditoAtual = 0
                    let creditoDR = 0
                    let temCreditoIva = false
                    let valorImpostosAtuais = 0
                    let valorImpostosPermanecer = 0
                    if(movel.tipoAluguel == 'Aluguel pago'){
                      // o locador é o OUTRO
                      if(movel.regimeOutro == "Lucro Presumido"){
                          pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0   
                      }else if(movel.regimeOutro == "Lucro Real"){
                          pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                      }else{
                          pisCo = this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaSimplesNacional.locacao.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaSimplesNacional.locacao.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaSimplesNacional.locacao.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.ipi / 100 : 0
                      }
                      aliquotaDesonerar = pisCo + iss + icms + ipi
                      valorImpostosAtuais = valorBase * aliquotaDesonerar

                        // CRÉDITOAR: para PF é sempre ZERO, então não precisa fazer nada pq ele é inicializado como ZERO




                        // *************************************************************
                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(true){ // é pra ter crédito aqui quando for pf regime regular
                          temCreditoIva = true
                        }
                      

                    }else if(movel.tipoAluguel == 'Aluguel recebido'){
                        // Minha empresa é o locador
                        // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente

                        // CRÉDITO: para PF é sempre ZERO, então não precisa fazer nada pq ele é inicializado como ZERO

                        //ANTES DA REFORMA PF não são cobrados impostos 
                        icms = 0
                        iss = 0
                        pisCo = 0
                        ipi = 0
                        aliquotaDesonerar = pisCo + iss + icms + ipi
                        valorImpostosAtuais = valorBase * aliquotaDesonerar


                        // *************************************************************
                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(true){ // pra ter crédito só quando é pf regime regular
                          temCreditoIva = true
                        }
                    }


                    // valor impostos ANTES da reforma
                    // Aqui o valor base já tem que estar com a redução??

                    console.log("valor dos impostos atuais (a desonerar): " + valorImpostosAtuais)
                    let valorDesonerado = valorBase - valorImpostosAtuais
                    console.log("valor desonerado: " + valorDesonerado)
                    const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                    // Crédito antes reforma
                    console.log("O crédito do locatário atual é: " + creditoAtual)

                    // sempre no valor base
                    const custoAR = valorBase - creditoAtual
                    console.log("custoAtual: " + custoAR)



                    // ONERAR NOVOS IMPOSTOS

                    anoAano.forEach(objAno => {
                        // CALCULAR VALOR IVA
                        let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                        let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                        const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                        const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                        const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                        // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                        const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                        const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                        // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                        const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                        const valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                        // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                        const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                        const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                        const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                        const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                        const creditoAnoVigente = (temCreditoIva ? valorIvaAnoVigente : 0)
                        const custoAnoVigente = novoValorAnoVigente - creditoAnoVigente
                        const objAnoVigente: objDepoisReforma  = {
                            ano: objAno.ano,
                            valor: novoValorAnoVigente,
                            valorSemIva: valorSemIvaAnoVigente,
                            valorImpostos: valorImpostosAnoVigente,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                            custo: movel.tipoAluguel == "Aluguel pago" ? custoAnoVigente : null
                        }
                        respMoveisLocacaoAtual.depoisReforma.push(objAnoVigente)

                        if(movel.tipoAluguel == "Aluguel pago"){
                          const objAnoVigenteCompras = respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteComprasTotal = respostaFinalCalculo.respostaFinal.totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                            objAnoVigenteCompras[0].valor += novoValorAnoVigente
                            objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteCompras[0].credito += creditoAnoVigente
                            objAnoVigenteCompras[0].custo += custoAnoVigente
                            objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                            objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado

                            objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                            objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                            objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                            objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado
                          }

                            if(movel.compoeCusto){
                              const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                              if(objCustoGeralAtual){
                                objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                              }
                            }else{
                              const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                              if(objDespesaAtual){
                                objDespesaAtual.despesaAnoVigente += custoAnoVigente
                              }
                            }
                  
                        }else if(movel.tipoAluguel == "Aluguel recebido"){
                          const objAnoVigenteVendas = respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteVendasTotal = respostaFinalCalculo.respostaFinal.totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                            objAnoVigenteVendas[0].valor += novoValorAnoVigente
                            objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado

                            objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado
                          }
                        }
                

                    })

                    let baseIva = valorDesonerado
                    const aliquotaIva = 0.28
                    const valorImpostosNovos = baseIva * aliquotaIva
                    const novoValorTotal = valorDesonerado + valorImpostosNovos
                    const porcentagemCargaTributariaDR = valorImpostosNovos / valorDesonerado

                    creditoDR = temCreditoIva ? valorImpostosNovos : 0
                    const custoDR = temCreditoIva ? valorDesonerado : novoValorTotal


                    const objMoveisLocacaoAtualAR = {
                        valor: valorBase,
                        valorImpostos: valorImpostosAtuais,
                        valorDesonerado: valorDesonerado,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                        custo: movel.tipoAluguel == "Aluguel pago" ? custoAR : null
                      }

                    respMoveisLocacaoAtual.antesReforma = objMoveisLocacaoAtualAR

                    /*const respMoveisLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: valorBase,
                        valorImpostos: valorImpostosAtuais,
                        valorDesonerado: valorDesonerado,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                        custo: movel.tipoAluguel == "Aluguel pago" ? custoAR : null
                      },
                      depoisReforma: [
                        {
                          ano: "2033",
                          valor: novoValorTotal,
                          valorImpostos: valorImpostosNovos,
                          porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                          custo: movel.tipoAluguel == "Aluguel pago" ? custoDR : null,
                        }
                      ]
                    }*/

                    respostaFinalCalculo.respostaFinal.locacaoBensMoveis.push(respMoveisLocacaoAtual)


                    if(movel.tipoAluguel == "Aluguel pago"){
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorAR += valorBase
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.creditoAR += creditoAtual
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.custoAR += custoAR
                        respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.custoAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorAR

                        //preenchendo total
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.valorAR += valorBase
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.creditoAR += creditoAtual
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.custoAR += custoAR
                        respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.custoAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoMoveis.antesReforma.valorAR

                        if(movel.compoeCusto){
                          console.log("Movel COM CUSTO")
                          console.log(movel)
                          dreCustoGeralAR += custoAR
                        }else{
                          dreDespesasAR += custoAR
                        }

                    }else if(movel.tipoAluguel == "Aluguel recebido"){
                        respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.valorAR += valorBase
                        respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.valorDesonerado

                        //preenchendo total
                        respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.valorAR += valorBase
                        respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalVendas.locacaoMoveis.antesReforma.valorDesonerado
                    }

                  })
              }



              

              //LOCACAO IMÓVEIS

              if(totalImoveisLocacao.length > 0){
                console.log("/////////////////////////////////////////////////////////////")
                console.log("Começo do calculo")
                // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
                let pfRegimeRegular = false

                let totalAluguelMensal = 0
                let quantidadeImoveis = 0
                totalImoveisLocacao.forEach(imovel => {
                    if(imovel.tipoAluguel == 'Aluguel recebido'){
                        totalAluguelMensal += imovel.valorAluguel
                        quantidadeImoveis += imovel.quantidade
                    }
                })

                const totalAluguelAnual = totalAluguelMensal * 12

                if((quantidadeImoveis > 3 && totalAluguelAnual > 240000) || (totalAluguelAnual > 288000)){
                    pfRegimeRegular = true
                    console.log("o nosso cliente é pf regime regular")
                }else{
                    console.log("o nosso cliente é pf fora do regime regular")
                }
                




                  totalImoveisLocacao.forEach((imovel, index) => {

                    // IMPOSTOS AR PF ZERO CASO SEJA RECEBIDO, CASO SEJA PAGO, É DEFINIDO MAIS A FRENTE
                    let pisCo = 0
                    let iss = 0
                    let icms = 0
                    let ipi = 0


                    // Inicializando obj resposta final item atual
                    let respImovelLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }

                    console.log("IMOVEL " + (index + 1))

                    //

                    let valorBase = 0
                    let valorImpostosAtuais = 0

                    if(imovel.condominioEmbutido){
                      // Nao destacado
                      valorBase = imovel.valorAluguel + imovel.acrescimos + imovel.juros + imovel.valorCondominio
                      console.log("Condominio não está destacado, logo o valor base é: aluguel + acrescimos + condominio")
                    }else{
                      // Destacado
                      valorBase = imovel.valorAluguel + imovel.acrescimos + imovel.juros
                      console.log("Condominio está destacado, logo o valor base é: aluguel + acrescimos") 
                    }

                    
                    console.log("Valor Base: ")
                    console.log(valorBase)

                    //DESONERAR
                    let aliquotaDesonerar = 0
                    let creditoAtual = 0
                    let creditoDR = 0
                    let temCreditoIva = false

                    // Dentro do ifElse Aluguel pagou ou recebido definimos: as alíquotas uma a uma, alíquota a desonerar, e se tem crédito antes e depois da reforma
                    if(imovel.tipoAluguel == 'Aluguel pago'){
                        // O outro que é o locador (Simples Nacional não pode ser locador)
                        if(imovel.tipoOutraParte == 'Pessoa jurídica'){
                          if(imovel.regimeOutro == 'Lucro Presumido'){
                              pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                              iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                              icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                              ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0
                          }else if(imovel.regimeOutro == 'Lucro Real'){
                              pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                              iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                              icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                              ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                          }
                          aliquotaDesonerar = pisCo + iss + icms + ipi
                          console.log("aliquota a desonerar: " + aliquotaDesonerar)
                        }else{
                          // Caso a outra parte seja PF manterá a aliquota a desonerar como zero, logo, não haverá desoneração
                          pisCo = 0
                          iss = 0
                          icms = 0
                          ipi = 0
                          aliquotaDesonerar = pisCo + iss + icms + ipi
                        }


                        //CRÉDITO: ANTES REFORMA PF NÃO TEM CRÉDITO
                        creditoAtual = 0


                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(pfRegimeRegular){
                            temCreditoIva = true
                        }


                    }else if(imovel.tipoAluguel == 'Aluguel recebido'){
                        //ANTES DA REFORMA PF não são cobrados impostos 
                        icms = 0
                        iss = 0
                        pisCo = 0
                        ipi = 0
                        aliquotaDesonerar = pisCo + iss + icms + ipi
                        
                        // CRÉDITO ATUAL: ANTES DA REFORMA PF NÃO TEM CRÉDITO
                        creditoAtual = 0

                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(imovel.regimeOutro == 'Lucro Presumido' || imovel.regimeOutro == 'Lucro Real' || imovel.regimeOutro == "Simples Nacional"){
                          temCreditoIva = true
                        }
                    }

                    // usando a aliquotaDesonerar definida acima pra achar o valorImpostosAtuais
                    valorImpostosAtuais = valorBase * aliquotaDesonerar

                    console.log("valor dos impostos atuais (a desonerar): " + valorImpostosAtuais)
                    let valorDesonerado = valorBase - valorImpostosAtuais
                    console.log("valor desonerado: " + valorDesonerado)
                    const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                    // Crédito antes reforma
                    console.log("O crédito do locatário atual é: " + creditoAtual)

                    // sempre no valor base
                    const custoAtual = valorBase - creditoAtual
                    console.log("custoAtual: " + custoAtual)


                    // ONERAR NOVOS IMPOSTOS


                    anoAano.forEach(objAno => {
                      if(objAno.ano == "A2026"){

                      }else{
                        // SIMULAÇÃO 1 (Nela usar valorBaseNovosTributosSimu1 como base, e na simu2 usar o valorDesonerado)
                        //CASO DE PESSOA FÍSICA
                        if(imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular)){

                            // Nesse caso não aplica IVA
                            objAno.porcentagemCbs = 0
                            objAno.porcentagemIbs = 0
                            let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                            let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                            const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                            const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                            // CALCULAR VALOR ISS (base é o valorBaseNovosTributosSimu1 + valorIva)
                            const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                            const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                            // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                            const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                            const valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                            const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                            const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                            const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente // Mas nesse caso como eu fiz as porcentagens do IVA receberem 0, o valor que entra aqui é o valor sem IVA
                            const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                            const objAnoVigente: objDepoisReforma = {
                                ano: objAno.ano,
                                valor: novoValorAnoVigente,
                                valorSemIva: valorSemIvaAnoVigente,
                                valorImpostos: valorImpostosAnoVigente,
                                porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                custo: null
                            }
                            respImovelLocacaoAtual.depoisReforma.push(objAnoVigente)

                        }else{

                            // CONFERIR REDUÇÃO DE BASE
                            let valorBaseNovosTributosSimu1 = valorDesonerado
                            if(imovel.residencial){
                              // quando adicionar a quantidade, caso sejam 3 imoveis na linha tem que diminuir 3x600
                              console.log("Redutor social")
                              console.log("Quanto reduziu: " + (600 * imovel.quantidade))

                              valorBaseNovosTributosSimu1 = valorDesonerado - (600 * imovel.quantidade)
                              console.log("Valor após a redução: " + valorBaseNovosTributosSimu1)
                            }

                            // CALCULAR VALOR IVA
                            const reducaoAliquota = 0.7 // redução padrão de 70%
                            let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                            let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoAliquota) // Aplicando redução padrão de alíquota
                            aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoAliquota) // Aplicando redução padrão de alíquota
                            const valorIbsAnoVigente = valorBaseNovosTributosSimu1 * aliquotaIbsAnoVigente
                            const valorCbsAnoVigente = valorBaseNovosTributosSimu1 * aliquotaCbsAnoVigente
                            const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                            // CALCULAR VALOR ISS (base é o valorBaseNovosTributosSimu1 + valorIva)
                            const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                            const valorIssAnoVigente = (valorBaseNovosTributosSimu1 + valorIvaAnoVigente) * aliquotaIssAnoVigente

                            // CALCULAR VALOR ICMS (base é valorBaseNovosTributosSimu1 + ICMS (ou seja, por dentro) + IVA)
                            const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                            const valorIcmsAnoVigente = ((valorBaseNovosTributosSimu1 + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                            // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                            const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                            const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorBaseNovosTributosSimu1
                            const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                            const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                            let custoAnoVigente = novoValorAnoVigente
                            let creditoAnoVigente = 0

                            // Calcular custo
                            // Só tem que conferir creditoIVA se for condominio embutido e quem paga não é simples nacional (esse é o único caso que eu tenho certeza se tem ou não crédito através da variavel temCreditoIva)
                            if(imovel.condominioEmbutido && !((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional"))){
                                if(temCreditoIva){
                                  creditoAnoVigente = valorIvaAnoVigente
                                  custoAnoVigente = novoValorAnoVigente - creditoAnoVigente
                                }
                            }

                            const objAnoVigente: objDepoisReforma = {
                                ano: objAno.ano,
                                valor: novoValorAnoVigente,
                                valorSemIva: valorSemIvaAnoVigente,
                                valorImpostos: valorImpostosAnoVigente,
                                porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                custo: custoAnoVigente
                            }
                            respImovelLocacaoAtual.depoisReforma.push(objAnoVigente)

                            if(imovel.tipoAluguel == "Aluguel pago"){
                                const objAnoVigenteCompras = respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                const objAnoVigenteComprasTotal = respostaFinalCalculo.respostaFinal.totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                                  objAnoVigenteCompras[0].valor += novoValorAnoVigente
                                  objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteCompras[0].credito += creditoAnoVigente
                                  objAnoVigenteCompras[0].custo += custoAnoVigente
                                  objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado

                                  objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                                  objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                                  objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                                  objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado
                                }

                                if(imovel.compoeCusto){
                                  const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                  if(objCustoGeralAtual){
                                    objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                                  }
                                }else{
                                  const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                  if(objDespesaAtual){
                                    objDespesaAtual.despesaAnoVigente += custoAnoVigente
                                  }
                                }
                            }else if(imovel.tipoAluguel == "Aluguel recebido"){
                              const objAnoVigenteVendas = respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                              const objAnoVigenteVendasTotal = respostaFinalCalculo.respostaFinal.totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                              if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                                objAnoVigenteVendas[0].valor += novoValorAnoVigente
                                objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                                objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                                objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado

                                objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                                objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                                objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado
                              }
                            }
                    

                        }

                      }
                    })


                    let valorBaseNovosTributosSimu1 = valorDesonerado
                    if(imovel.residencial){
                      // quando adicionar a quantidade, caso sejam 3 imoveis na linha tem que diminuir 3x600
                      console.log("Redutor social")
                      console.log("Quanto reduziu: " + (600 * imovel.quantidade))

                      valorBaseNovosTributosSimu1 = valorDesonerado - (600 * imovel.quantidade)
                      console.log("Valor após a redução: " + valorBaseNovosTributosSimu1)
                    }

                    let valorNovosTributos = 0
                    let valorFinalSimu1 = 0

                    // Coloquei regimeAtual == "Pessoa Fisica", pois por padrão o pfRegimeRegular é false, e aqui queremos apenas o caso onde é pessoa física e não está no regime
                    //CASO DE PESSOA FÍSICA
                    if(/*imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular && regimeAtual == "Pessoa Fisica")*/ false){
                        // locador for pf sem regime regular n tem IVA

                        // nao aplica iva 
                        console.log("como o locador desse imóvel é pesso física fora do regime regular, então não é aplicado o IVA")
                        console.log("valor final: " + valorDesonerado)
                        valorFinalSimu1 = valorDesonerado
                    }else{

                        if(imovel.tipoOutraParte == "Pessoa física"){
                            console.log("O valor de IVA calculado será custo se o destinatário (locatário) for pessoa física não optante pelo Regime Regular de IBS/CBS. Sendo a Pessoa Física optante pelo Regime Regular, o valor do IVA ficará como crédito para abatimento das operações futuras de faturamento.")
                        }

                            // pf regime regular e pj
                            const reducaoAliquota = 0.7
                            const aliquotaPadrao = 0.28
          
                            const aliquotaFinal = aliquotaPadrao - (reducaoAliquota * aliquotaPadrao)
                            console.log("aliquota Final")
                            console.log(aliquotaFinal) 
          
          
                            // AQUI ANTES EU TAVA FAZENDO A ALIQUOTA FINAL MULTIPLICAR O VALORBASE (COM OS IMPOSTOS ANTIGOS), MAS MUDEI PARA O VALOR DESONERADO, TA CERTO?
                            valorNovosTributos = valorBaseNovosTributosSimu1 * aliquotaFinal
          
                            console.log("Novos Tributos simulação 1: ")
                            console.log(valorNovosTributos)
          
          
          
                            console.log("Novos tributos simulação 2: ")
                            // Usando valorDesonerado e não valorBaseNovosTributosSimu1 porque na simulação 2 não tem redução de base por imovel em nenhuma hipótese
                            const novosTributosSimu2 = valorDesonerado * 0.0365
                            console.log(novosTributosSimu2)
          
          
                            if(imovel.condominioEmbutido){
                              // Não destacado

                              // Se quem tá pagando aluguel é do SIMPLES NACIONAL
                              if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional")){

                                // Como é simples nacional, eu não tenho certeza se tem crédito ou não então tenho que apresentar os dois casos
                                  // SIMULAÇÃO 1
                                valorFinalSimu1 = valorDesonerado + valorNovosTributos

                                // SIMULAÇÃO 2
                                const valorFinalSimu2SemCredito = valorDesonerado + novosTributosSimu2

                                if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional")){
                                  console.log("Como o outro é o locatário e simples nacional, caso ele opte por estar no regime regular, na simulação 1 ele terá crédito de " + valorNovosTributos + " e na simulaçao 2 ele terá um crédito de " + novosTributosSimu2 + ", caso ele opte por ficar fora do regime regular esses valores passarão a ser custo.")
                                }else{
                                  console.log("Como você é o locatário e simples nacional, caso você opte por estar no regime regular, na simulação 1 você terá crédito de " + valorNovosTributos + " e na simulaçao 2 você terá um crédito de " + novosTributosSimu2 + ", caso você opte por ficar fora do regime regular esses valores passarão a ser custo.")
                                }

                                console.log("Valor final simulação 1 Com Crédito: " + (valorFinalSimu1 - valorNovosTributos))
                                console.log("Valor final simulação 1 Sem Crédito: " + (valorFinalSimu1))
                                console.log("Valor final simulação 2 Com Crédito: " + (valorFinalSimu2SemCredito - novosTributosSimu2))
                                console.log("Valor final simulação 2 Sem Crédito: " + (valorFinalSimu2SemCredito))

                              }else{
                                  // SIMULAÇÃO 1
                                  console.log("Valor final simulação 1:")
                                  // To usando valorDesonerado e não valorBaseNovosTributos1 porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
                                  valorFinalSimu1 = valorDesonerado + valorNovosTributos
                                  if(temCreditoIva){
                                    console.log("Você tem direito ao crédito novo")
                                    const valorFinalSimu1ComCredito = valorFinalSimu1 - valorNovosTributos
                                    console.log("valor final simulação 1 com crédito: " + valorFinalSimu1ComCredito)
                                  }else{
                                    console.log("Você não tem direito ao crédito novo")
                                    console.log("Valor final simulação 1 sem crédito: " + valorFinalSimu1)
                                  }
              
                                  
                                    // SIMULAÇÃO 2
                                  console.log("Valor final simulação 2:")
                                    // usei valorDesonerado porque na simulaçao 2 não tem redução devido a ser residencial em nenhuma hipotese
                                  let valorFinalSimu2SemCredito = valorDesonerado + novosTributosSimu2
                                  if(temCreditoIva){
                                    console.log("Você tem direito ao crédito novo")
                                    const valorFinalSimu2ComCredito = valorFinalSimu2SemCredito - valorNovosTributos
                                    console.log("valor final simulação 1 com crédito: " + valorFinalSimu2ComCredito)
                                  }else{
                                    console.log("Você não tem direito ao crédito novo")
                                    console.log("Valor final simulação 1 sem crédito: " + valorFinalSimu2SemCredito)
                                  }
                              }
                              
          
                            }else{

                              // A diferença é que aqui não tem credito IVA em todos os casos
                              
                              console.log("Valor final simulação 1:")
                              // Somei "(600 * imovel.quantidade)" porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
                              valorFinalSimu1 = valorDesonerado + valorNovosTributos
                              console.log(valorFinalSimu1)
          
                              console.log("Valor final simulação 2:")
                              // Somei "(600 * imovel.quantidade)" porque na simulaçao 2 não tem redução em nenhuma hipotese
                              const valorFinalSimu2 = valorDesonerado + novosTributosSimu2
                              console.log(valorFinalSimu2)
          
                            }
                    }

                    const porcentagemCargaTributariaDR = valorNovosTributos / valorDesonerado
                    creditoDR = temCreditoIva ? valorNovosTributos : 0
                    const custoDR = temCreditoIva ? valorFinalSimu1 - valorNovosTributos : valorFinalSimu1


                      const objImovelLocacaoAtualAR = {
                        valor: valorBase,
                        valorImpostos: valorImpostosAtuais,
                        valorDesonerado: valorDesonerado,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                        custo: imovel.tipoAluguel == "Aluguel pago" ? custoAtual : null
                      }

                      respImovelLocacaoAtual.antesReforma = objImovelLocacaoAtualAR

                      /*const respImovelLocacaoAtual: objItemFinal = {
                          antesReforma: {
                            valor: valorBase,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: valorDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                            custo: imovel.tipoAluguel == "Aluguel pago" ? custoAtual : null
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: valorFinalSimu1,
                              valorImpostos: valorNovosTributos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                              custo: imovel.tipoAluguel == "Aluguel pago" ? custoDR : null,
                            }
                          ]
                        }*/

                        respostaFinalCalculo.respostaFinal.locacaoBensImoveis.push(respImovelLocacaoAtual)

                        if(imovel.tipoAluguel == "Aluguel pago"){
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorAR += valorBase
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.creditoAR += creditoAtual
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.custoAR += custoAtual
                          respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.custoAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorAR

                          // preenchendo total
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.valorAR += valorBase
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.creditoAR += creditoAtual
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.custoAR += custoAtual
                          respostaFinalCalculo.respostaFinal.totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.custoAR / respostaFinalCalculo.respostaFinal.totalCompras.locacaoImoveis.antesReforma.valorAR


                          if(imovel.compoeCusto){
                            console.log("imovel COM CUSTO")
                            console.log(imovel)
                            dreCustoGeralAR += custoAtual
                          }else{
                            dreDespesasAR += custoAtual
                          }

                        }else if(imovel.tipoAluguel == "Aluguel recebido"){
                          respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.valorAR += valorBase
                          respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.valorDesonerado 

                          // preenchendo total
                          respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.valorAR += valorBase
                          respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo.respostaFinal.totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo.respostaFinal.totalVendas.locacaoImoveis.antesReforma.valorDesonerado 
                        }

                  })
              }



        return respostaFinalCalculo

    }

}