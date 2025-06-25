import { useContext, useEffect, useState } from "react"
import { ContextoResultadoSimulador, tabelaCaixaType, tabelaDreType, totalComprasType, totalVendasType } from "../../Contextos/ContextoResultadoSimulador/ContextoResultadoSimulador"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import xisLogo from "../../assets/images/priceTaxIsotipo.png"
import setaFina from "../../assets/images/setaFina.png"
import { IndicadorColorido } from "../IndicadorColorido/IndicadorColorido"


export function ResultadoSimulador(){

    const controleDropTabelasInicial = {
        caixa: true,
        compras: true,
        vendas: true,
        dre: true,
    } as const      

    type nomesTabelasType = keyof typeof controleDropTabelasInicial

    type controleDropType = Record<nomesTabelasType, boolean>



    const [controleDropTabelas, setControleDropTabelas] = useState<controleDropType>(controleDropTabelasInicial)

    const nomeLinhasTabelaCaixa: Record<keyof tabelaCaixaType, string> = {
        fornecedores: "Fornecedores",
        tributosCredito: "Tributos Crédito",
        clientes: "Clientes",
        tributosDebito: "Tributos Débito",
        tributosRecolhidos: "Tributos Recolhidos",
        saldoCredor: "Saldo Credor",
        resultado: "Resultado",
        resultadoSemClientes: "Resultado Sobre Clientes (%)" 
    }

    const nomeLinhasTabelaDre: Record<keyof tabelaDreType, string> = {
        receitaBruta: "Receita Bruta",
        deducoesTributos: "Deduções Tributos",
        custoGeral: "Custo",
        lucroBruto: "Lucro Bruto",
        despesas: "Despesas",
        lucrosAntesIrCs: "Lucro Antes IR/CS",
        irCs: "IR/CS"
    }

    const nomeLinhasTabelaCompras: Record<keyof totalComprasType, string> = {
        comprasProdutos: "Compras Produtos",
        servicosTomados: "Serviços Tomados",
        locacaoMoveis: "Locação Móveis",
        locacaoImoveis: "Locação Imóveis"
    }

    const nomeLinhasTabelaVendas: Record<keyof totalVendasType, string> = {
        vendasProdutos: "Vendas Produtos",
        servicosPrestados: "Serviços Prestados",
        locacaoMoveis: "Locação Móveis",
        locacaoImoveis: "Locação Imóveis"
    }




    function trocarDropTabela(nomeTabela: nomesTabelasType){
        const objTabelaClone = {...controleDropTabelas}

        objTabelaClone[nomeTabela] = !objTabelaClone[nomeTabela]

        setControleDropTabelas(objTabelaClone)

    }


    // const {objResultado} = useContext(ContextoResultadoSimulador)

    const objResultado = {
    "servicosPrestados": [
        {
            "antesReforma": {
                "valor": 4444,
                "valorImpostos": 633.2700000000001,
                "valorDesonerado": 3810.73,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 4237.53176,
                    "valorImpostos": 426.80176000000006,
                    "porcentagemCargaTributaria": 0.11200000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 5555,
                "valorImpostos": 791.5875000000001,
                "valorDesonerado": 4763.4125,
                "porcentagemCargaTributaria": 0.1661807580174927,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 6097.168000000001,
                    "valorImpostos": 1333.7555000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 474.95250000000004,
                "valorDesonerado": 2858.0475,
                "porcentagemCargaTributaria": 0.1661807580174927,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 3658.3008,
                    "valorImpostos": 800.2533000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        }
    ],
    "servicosTomados": [
        {
            "antesReforma": {
                "valor": 4444,
                "valorImpostos": 384.40599999999995,
                "valorDesonerado": 4059.594,
                "porcentagemCargaTributaria": 0.09469074986316364,
                "custo": 4032.93
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 5196.28032,
                    "valorImpostos": 1136.68632,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 4059.594
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 5555,
                "valorImpostos": 461.065,
                "valorDesonerado": 5093.935,
                "porcentagemCargaTributaria": 0.09051254089422027,
                "custo": 5041.1625
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 6520.236800000001,
                    "valorImpostos": 1426.3018000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 5093.935
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 4444,
                "valorImpostos": 384.40599999999995,
                "valorDesonerado": 4059.594,
                "porcentagemCargaTributaria": 0.09469074986316364,
                "custo": 4444
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 5196.28032,
                    "valorImpostos": 1136.68632,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 4059.594
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 6666,
                "valorImpostos": 949.9050000000001,
                "valorDesonerado": 5716.095,
                "porcentagemCargaTributaria": 0.1661807580174927,
                "custo": 6666
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 7316.6016,
                    "valorImpostos": 1600.5066000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 5716.095
                }
            ]
        }
    ],
    "locacaoBensMoveis": [
        {
            "antesReforma": {
                "valor": 2222,
                "valorImpostos": 205.535,
                "valorDesonerado": 2016.465,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2581.0752,
                    "valorImpostos": 564.6102000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 474.9525,
                "valorDesonerado": 2858.0475,
                "porcentagemCargaTributaria": 0.16618075801749269,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 3658.3008,
                    "valorImpostos": 800.2533000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 109.989,
                "valorDesonerado": 3223.011,
                "porcentagemCargaTributaria": 0.03412616339193382,
                "custo": 3333
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 4125.45408,
                    "valorImpostos": 902.4430800000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 3223.011
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 308.3025,
                "valorDesonerado": 3024.6975,
                "porcentagemCargaTributaria": 0.10192837465564737,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 3871.6128000000003,
                    "valorImpostos": 846.9153000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 109.989,
                "valorDesonerado": 3223.011,
                "porcentagemCargaTributaria": 0.03412616339193382,
                "custo": 3333
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 4125.45408,
                    "valorImpostos": 902.4430800000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 3223.011
                }
            ]
        }
    ],
    "produtosVendidos": [
        {
            "antesReforma": {
                "valor": 222,
                "valorImpostos": 8.88,
                "valorDesonerado": 213.12,
                "porcentagemCargaTributaria": 0.04166666666666667,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 236.98944,
                    "valorImpostos": 23.869440000000004,
                    "porcentagemCargaTributaria": 0.11200000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 2222,
                "valorImpostos": 199.98,
                "valorDesonerado": 2022.02,
                "porcentagemCargaTributaria": 0.0989010989010989,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2588.1856,
                    "valorImpostos": 566.1656,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 433.29,
                "valorDesonerado": 2899.71,
                "porcentagemCargaTributaria": 0.14942528735632185,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2899.71,
                    "valorImpostos": 0,
                    "porcentagemCargaTributaria": 0,
                    "custo": null
                }
            ]
        }
    ],
    "produtosAdquiridos": [
        {
            "antesReforma": {
                "valor": 2222,
                "valorImpostos": 81.103,
                "valorDesonerado": 2140.897,
                "porcentagemCargaTributaria": 0.03788271925272444,
                "custo": 2140.897
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2740.34816,
                    "valorImpostos": 599.4511600000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3333,
                "valorImpostos": 233.31000000000003,
                "valorDesonerado": 3099.69,
                "porcentagemCargaTributaria": 0.07526881720430108,
                "custo": 3099.69
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 3446.85528,
                    "valorImpostos": 347.16528000000005,
                    "porcentagemCargaTributaria": 0.11200000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 5555,
                "valorImpostos": 513.8375,
                "valorDesonerado": 5041.1625,
                "porcentagemCargaTributaria": 0.10192837465564737,
                "custo": 5041.1625
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 5605.7727,
                    "valorImpostos": 564.6102000000001,
                    "porcentagemCargaTributaria": 0.112,
                    "custo": null
                }
            ]
        }
    ],
    "locacaoBensImoveis": [
        {
            "antesReforma": {
                "valor": 4988,
                "valorImpostos": 461.39,
                "valorDesonerado": 4526.61,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 4906.84524,
                    "valorImpostos": 380.23524000000003,
                    "porcentagemCargaTributaria": 0.08400000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 2322,
                "valorImpostos": 214.785,
                "valorDesonerado": 2107.215,
                "porcentagemCargaTributaria": 0.10192837465564737,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2233.82106,
                    "valorImpostos": 126.60606000000004,
                    "porcentagemCargaTributaria": 0.060082174813675886,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3433,
                "valorImpostos": 125.30449999999999,
                "valorDesonerado": 3307.6955,
                "porcentagemCargaTributaria": 0.03788271925272444,
                "custo": 3115.4475
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 3585.541922,
                    "valorImpostos": 277.8464220000001,
                    "porcentagemCargaTributaria": 0.08400000000000003,
                    "custo": 3307.6955
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 2544,
                "valorImpostos": 235.32,
                "valorDesonerado": 2308.68,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": 2544
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2452.20912,
                    "valorImpostos": 143.52912,
                    "porcentagemCargaTributaria": 0.06216934352097303,
                    "custo": 2308.68
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 2333,
                "valorImpostos": 215.8025,
                "valorDesonerado": 2117.1975,
                "porcentagemCargaTributaria": 0.10192837465564737,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2244.6420900000003,
                    "valorImpostos": 127.44459000000005,
                    "porcentagemCargaTributaria": 0.0601949463854931,
                    "custo": null
                }
            ]
        }
    ],
    "compraVendaBensImoveis": [
        {
            "antesReforma": {
                "valor": 22222,
                "valorImpostos": 113053.5,
                "valorDesonerado": -90831.5,
                "porcentagemCargaTributaria": -1.244650809465879,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": -114947.91,
                    "valorImpostos": -14116.410000000002,
                    "porcentagemCargaTributaria": 0.1554131551279017,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 33333,
                "valorImpostos": 169580.25,
                "valorDesonerado": -136247.25,
                "porcentagemCargaTributaria": -1.244650809465879,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 0,
                    "valorImpostos": 0,
                    "porcentagemCargaTributaria": 0,
                    "custo": null
                }
            ]
        }
    ],
    "totalCompras": {
        "comprasProdutos": {
            "valorAR": 11110,
            "impostosAR": 828.2505,
            "valorDesonerado": 10281.7495,
            "creditoAR": 828.2505,
            "custoAR": 10281.7495,
            "porcentagemCustoEfetivoAR": 0,
            "porcentagemCargaTributariaAR": 0.21507991111267288,
            "valorDR": 11792.97614,
            "impostosDR": 1511.2266400000003,
            "creditoDR": 0,
            "custoDR": 0,
            "porcentagemCustoEfetivoDR": 0,
            "porcentagemCargaTributariaDR": 0.504
        },
        "servicosTomados": {
            "valorAR": 21109,
            "impostosAR": 2179.782,
            "valorDesonerado": 18929.218,
            "creditoAR": 924.9075,
            "custoAR": 20184.0925,
            "porcentagemCargaTributariaAR": 0.11515436084047424,
            "porcentagemCustoEfetivoAR": 0.9561842105263157,
            "valorDR": 24229.399040000004,
            "impostosDR": 5300.1810399999995,
            "creditoDR": 5300.1810399999995,
            "custoDR": 18929.218,
            "porcentagemCustoEfetivoDR": 0.7812499999999999,
            "porcentagemCargaTributariaDR": 1.12
        },
        "locacaoMoveis": {
            "valorAR": 6666,
            "impostosAR": 219.978,
            "valorDesonerado": 6446.022,
            "creditoAR": 0,
            "custoAR": 6666,
            "porcentagemCargaTributariaAR": 0.06825232678386764,
            "porcentagemCustoEfetivoAR": 0,
            "valorDR": 8250.90816,
            "impostosDR": 1804.8861600000002,
            "creditoDR": 1804.8861600000002,
            "custoDR": 6446.022,
            "porcentagemCustoEfetivoDR": 0,
            "porcentagemCargaTributariaDR": 0.56
        },
        "locacaoImoveis": {
            "valorAR": 5977,
            "impostosAR": 360.6245,
            "valorDesonerado": 5616.3755,
            "creditoAR": 317.5525,
            "custoAR": 5659.4475,
            "porcentagemCargaTributariaAR": 0.13981109390837182,
            "porcentagemCustoEfetivoAR": 0,
            "valorDR": 6037.751042,
            "impostosDR": 421.3755420000001,
            "creditoDR": 421.3755420000001,
            "custoDR": 5616.3755,
            "porcentagemCustoEfetivoDR": 0,
            "porcentagemCargaTributariaDR": 0.14616934352097305
        }
    },
    "totalVendas": {
        "vendasProdutos": {
            "valorAR": 5777,
            "impostosAR": 642.15,
            "valorDesonerado": 5134.85,
            "porcentagemCargaTributariaAR": 0.2899930529240874,
            "valorDR": 5724.885039999999,
            "impostosDR": 590.0350400000001,
            "porcentagemCargaTributariaDR": 0.392
        },
        "servicosPrestados": {
            "valorAR": 13332,
            "impostosAR": 1899.8100000000002,
            "valorDesonerado": 11432.19,
            "porcentagemCargaTributariaAR": 0.49854227405247814,
            "valorDR": 13993.00056,
            "impostosDR": 2560.8105600000004,
            "porcentagemCargaTributariaDR": 0.672
        },
        "locacaoMoveis": {
            "valorAR": 8888,
            "impostosAR": 988.79,
            "valorDesonerado": 7899.21,
            "porcentagemCargaTributariaAR": 0.37003750732878743,
            "valorDR": 10110.988800000001,
            "impostosDR": 2211.7788,
            "porcentagemCargaTributariaDR": 0.8400000000000001
        },
        "locacaoImoveis": {
            "valorAR": 9643,
            "impostosAR": 891.9775,
            "valorDesonerado": 8751.0225,
            "porcentagemCargaTributariaAR": 0.30578512396694213,
            "valorDR": 9385.30839,
            "impostosDR": 634.2858900000001,
            "porcentagemCargaTributariaDR": 0.20427712119916902
        }
    },
    "dre": {
        "custoGeral": {
            "AR": 15658.989500000001,
            "DR": 8119.188
        },
        "despesas": {
            "AR": 27132.3,
            "DR": 22872.427499999998
        }
    }
}

    const valorVendaAR = Object.values(objResultado.totalVendas).reduce((soma, area) => {
        return soma + area.valorAR;
    }, 0)

    const valorVendaDR = Object.values(objResultado.totalVendas).reduce((soma, area) => {
        return soma + area.valorDR;
    }, 0)

    const valorCompraAR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
        return soma + area.valorAR;
    }, 0)

    const valorCompraDR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
        return soma + area.valorDR;
    }, 0)

    const custoCompraDR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
        return soma + area.custoDR
    }, 0)

    const custoCompraAR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
        return soma + area.custoDR
    }, 0)

    const tributosDebitoAR = Object.values(objResultado.totalVendas).reduce((soma, area) => {
        return soma + area.impostosAR
    }, 0)  

    const tributosDebitoDR = Object.values(objResultado.totalVendas).reduce((soma, area) => {
    return soma + area.impostosDR
    }, 0) 

    const tributosCreditoAR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
    return soma + area.creditoAR
    }, 0) 

    const tributosCreditoDR = Object.values(objResultado.totalCompras).reduce((soma, area) => {
    return soma + area.creditoDR
    }, 0) 

    const diferencaVendas = valorVendaDR - valorVendaAR
    const diferencaCompras = valorCompraDR - valorCompraAR
    const diferencaCustoCompras = custoCompraDR - custoCompraAR
    const diferencaTributosDebito = tributosDebitoDR - tributosDebitoAR
    const diferencaTributosCredito = tributosCreditoDR - tributosCreditoAR
    const tributosRecolhidosAR = ((tributosDebitoAR - tributosCreditoAR) > 0 ? (tributosDebitoAR - tributosCreditoAR) : 0)
    const tributosRecolhidosDR = ((tributosDebitoDR - tributosCreditoDR) > 0 ? (tributosDebitoDR - tributosCreditoDR) : 0)
    const saldoCredorAR = ((tributosCreditoAR - tributosDebitoAR) > 0 ? (tributosCreditoAR - tributosDebitoAR) : 0)
    const saldoCredorDR = ((tributosCreditoDR - tributosDebitoDR) > 0 ? (tributosCreditoDR - tributosDebitoDR) : 0)

    const caixa = {
        fornecedores: {AR: valorCompraAR, DR: valorCompraDR, diferencaReais: diferencaCompras, diferencaPercentual: valorCompraAR ? diferencaCompras / valorCompraAR : 0},
        tributosCredito: {AR: tributosCreditoAR, DR: tributosCreditoDR, diferencaReais: diferencaTributosCredito, diferencaPercentual: tributosCreditoAR ? diferencaTributosCredito / tributosCreditoAR : 0},
        clientes: {AR: valorVendaAR + (0.3 * valorVendaAR), DR: valorVendaDR + (0.3 * valorVendaDR), diferencaReais: diferencaVendas, diferencaPercentual: valorVendaAR ? diferencaVendas / valorVendaAR : 0},
        tributosDebito: {AR: tributosDebitoAR, DR: tributosDebitoDR, diferencaReais: diferencaTributosDebito, diferencaPercentual: tributosDebitoAR ? diferencaTributosDebito / tributosDebitoAR : 0},
        tributosRecolhidos: {AR: tributosRecolhidosAR, DR: tributosRecolhidosDR, diferencaReais: tributosRecolhidosDR - tributosRecolhidosAR, diferencaPercentual: tributosRecolhidosAR ? (tributosRecolhidosDR - tributosRecolhidosAR) / tributosRecolhidosAR : 0},
        saldoCredor: {AR: saldoCredorAR, DR: saldoCredorDR, diferencaReais: saldoCredorDR - saldoCredorAR, diferencaPercentual: saldoCredorAR ? (saldoCredorDR - saldoCredorAR) / saldoCredorAR : 0},
    }



    const resultadoCaixaAR = caixa.clientes.AR - caixa.fornecedores.AR + caixa.tributosCredito.AR - caixa.tributosDebito.AR
    const resultadoCaixaDR = caixa.clientes.DR - caixa.fornecedores.DR + caixa.tributosCredito.DR - caixa.tributosDebito.DR
    const resultadoCaixaDiferenca = resultadoCaixaDR - resultadoCaixaAR
    const resultadoCaixaDiferencaPercentual = resultadoCaixaDiferenca / resultadoCaixaAR 
    const resultadoSemClientesAR = resultadoCaixaAR / caixa.clientes.AR
    const resultadoSemClientesDR = resultadoCaixaDR / caixa.clientes.DR

    const caixaComResultado: tabelaCaixaType = {
        ...caixa,
        resultado: {
            AR: resultadoCaixaAR,
            DR: resultadoCaixaDR,
            diferencaReais: resultadoCaixaDiferenca,
            diferencaPercentual: resultadoCaixaDiferencaPercentual
        },
        resultadoSemClientes: {
            AR: resultadoSemClientesAR,
            DR: resultadoSemClientesDR,
            diferencaReais: resultadoSemClientesDR - resultadoSemClientesAR,
            diferencaPercentual: (resultadoSemClientesDR - resultadoSemClientesAR) / resultadoSemClientesAR
        }
    }

    const diferencaReaisCustoDre = objResultado.dre.custoGeral.DR - objResultado.dre.custoGeral.AR
    const diferencaReaisDespesasDre = objResultado.dre.despesas.DR - objResultado.dre.despesas.AR

    const tabelaDre: tabelaDreType = {
        receitaBruta: {AR: caixa.clientes.AR, DR: caixa.clientes.DR, diferencaReais: caixa.clientes.diferencaReais, diferencaPercentual: caixa.clientes.diferencaPercentual},
        deducoesTributos: {AR: caixa.tributosRecolhidos.AR, DR: caixa.tributosRecolhidos.DR, diferencaReais: caixa.tributosRecolhidos.diferencaReais, diferencaPercentual: caixa.tributosRecolhidos.diferencaPercentual},
        custoGeral: {AR: objResultado.dre.custoGeral.AR, DR: objResultado.dre.custoGeral.DR, diferencaReais: diferencaReaisCustoDre, diferencaPercentual: objResultado.dre.custoGeral.AR ? diferencaReaisCustoDre / objResultado.dre.custoGeral.AR : 0},
        lucroBruto: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
        despesas: {AR: objResultado.dre.despesas.AR, DR: objResultado.dre.despesas.DR, diferencaReais: diferencaReaisDespesasDre, diferencaPercentual: objResultado.dre.despesas.AR ? diferencaReaisDespesasDre / objResultado.dre.despesas.AR : 0},
        lucrosAntesIrCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
        irCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
    }

    const tabelaDreComResultados = {
        
    }


    const arrPropriedadesCaixa = Object.entries(caixaComResultado)

    const representacaoPaupavel = caixaComResultado.resultadoSemClientes.diferencaPercentual * caixaComResultado.clientes.AR


    function retornarValorDinheiro(num: number){
        return "R$ " + num.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    function retornarValorPorcentagem(num: number){
        return (num * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"
    }


    useEffect(() => {
        console.log("Resultado de dentro da tela de resultadooo")
        console.log(objResultado)
    }, [])

    return (
        <div className="w-full min-h-screen p-12">
            
            <div className="flex flex-col gap-30">

                <div className="flex items-center gap-8 self-center">
                    <div className="w-6 h-auto rotate-180 cursor-pointer">
                        <img src={setaFina} alt="seta esquerda" />
                    </div>
                    <div className="text-2xl">
                        Capítulo 1
                    </div>
                    <div className="w-6 h-auto cursor-pointer">
                        <img src={setaFina} alt="seta esquerda" />
                    </div>     
                </div>

                <div className="w-[80%] flex justify-center  self-center my-14">
                    <span className="text-8xl text-center flex items-end gap-4">O <img className="w-30 h-auto align-bottom inline" src={xisLogo} alt="Xis LogoTipo Pricetx" /> da Questão</span>
                </div>


                {/* DRE */}    
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full text-4xl flex flex-col gap-3">
                        <span className="mb-4 text-4xl font-bold">DRE - Demonstração de Resultado do Exercício</span>
                    </div>
                    <div className="flex flex-col border-solid border-white border-2 rounded-2xl w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex justify-between cursor-pointer" onClick={() => trocarDropTabela("dre")}>
                                <div className="text-3xl opacity-80">
                                    DRE
                                </div>
                                <div className="w-10 h-auto">
                                    <img className={`${controleDropTabelas.dre ? "rotate-180" : "rotate-0"} [transition:all_500ms] w-full h-auto object-cover`} src={setaSeletor} alt="seletor tabela dre" />
                                </div>
                            </div>
                        </div>
                        <div className={`${controleDropTabelas.dre ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                            <div className="overflow-hidden">
                                {Object.entries(tabelaDre).map(([nomeCategoria, dados], index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(5,_1fr)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Categoria</div>
                                                        <div>AR</div>
                                                        <div>DR</div>
                                                        <div>Diferença R$</div>
                                                        <div>Diferença %</div>
                                                    </div>
                                                }

                                                <div className={`grid grid-cols-[repeat(5,_1fr)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div className="font-bold">{nomeLinhasTabelaDre[nomeCategoria as keyof tabelaDreType]}</div>
                                                    <div>{retornarValorDinheiro(dados.AR)}</div>
                                                    <div>{retornarValorDinheiro(dados.DR)}</div>
                                                    <div>{retornarValorDinheiro(dados.diferencaReais)}</div>
                                                    <div>{retornarValorPorcentagem(dados.diferencaPercentual)}</div>
                                                </div>
                                            </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>


                {/* CAIXA */}    
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full text-3xl flex flex-col gap-3">
                        <span className="mb-4 text-4xl font-bold">Impactos no Fluxo de Caixa</span>
                        <div className="flex items-center gap-2">
                            <IndicadorColorido cor={`${resultadoCaixaDiferenca > 0? "verde" : "vermelho"}`}/>
                            <span>Seu caixa {resultadoCaixaDiferenca > 0? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{"R$" + Math.abs(resultadoCaixaDiferenca).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>, com impacto de <span className="text-4xl textoGradiente">{Math.abs(resultadoCaixaDiferencaPercentual * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span> {resultadoCaixaDiferenca > 0? "positivo" : "negativo"} no resultado.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IndicadorColorido cor={`${caixaComResultado.resultadoSemClientes.diferencaPercentual > 0 ? "verde" : "vermelho"}`}/>
                            <span>Sua capacidade de gerar caixa {caixaComResultado.resultadoSemClientes.diferencaPercentual > 0 ? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{Math.abs(caixaComResultado.resultadoSemClientes.diferencaPercentual * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"} </span>, que representa <span className="text-4xl textoGradiente">{"R$ " + Math.abs(representacaoPaupavel).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span>
                        </div>
                    </div>
                    <div className="flex flex-col border-solid border-white border-2 rounded-2xl w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex justify-between cursor-pointer" onClick={() => trocarDropTabela("caixa")}>
                                <div className="text-3xl opacity-80">
                                    Fluxo de Caixa
                                </div>
                                <div className="w-10 h-auto">
                                    <img className={`${controleDropTabelas.caixa ? "rotate-180" : "rotate-0"} [transition:all_500ms] w-full h-auto object-cover`} src={setaSeletor} alt="seletor tabela compras" />
                                </div>
                            </div>
                        </div>
                        <div className={`${controleDropTabelas.caixa ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                            <div className="overflow-hidden">
                                {arrPropriedadesCaixa.map(([nomeCategoria, dados], index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(5,_1fr)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Categoria</div>
                                                        <div>AR</div>
                                                        <div>DR</div>
                                                        <div>Diferença R$</div>
                                                        <div>Diferença %</div>
                                                    </div>
                                                }

                                                {
                                                    (index == arrPropriedadesCaixa.length - 1) &&
                                                    <div className="grid grid-cols-[repeat(5,_1fr)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                }

                                                <div className={`grid grid-cols-[repeat(5,_1fr)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div className="font-bold">{nomeLinhasTabelaCaixa[nomeCategoria as keyof tabelaCaixaType]}</div>
                                                    <div>{(index == arrPropriedadesCaixa.length - 1) ? retornarValorPorcentagem(dados.AR) : retornarValorDinheiro(dados.AR)}</div>
                                                    <div>{(index == arrPropriedadesCaixa.length - 1) ? retornarValorPorcentagem(dados.DR) : retornarValorDinheiro(dados.DR)}</div>
                                                    <div>{(index == arrPropriedadesCaixa.length - 1) ? retornarValorPorcentagem(dados.diferencaReais) : retornarValorDinheiro(dados.diferencaReais)}</div>
                                                    <div>{retornarValorPorcentagem(dados.diferencaPercentual)}</div>
                                                </div>
                                            </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
        

                {/* COMPRAS */}    
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full text-3xl flex flex-col gap-3">
                        <span className="mb-4 text-4xl font-bold">Impacto nas Compras</span>
                        <div className="flex items-center gap-2">
                            <IndicadorColorido cor={`${diferencaCompras > 0 ? "vermelho" : "verde"}`}/>
                            <span>O preço de compra sofreu {diferencaCompras > 0 ? "um aumento" : "uma redução"} de <span className="text-4xl textoGradiente">{"R$" + (Math.abs(diferencaCompras).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span>, representando uma variação de <span className="text-4xl textoGradiente">{Math.abs(diferencaCompras / (caixa.fornecedores.AR) * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IndicadorColorido cor={`${diferencaCustoCompras > 0 ? "vermelho" : "verde"}`}/>
                            <span>O seu custo {diferencaCustoCompras > 0 ? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{"R$" + (Math.abs(diferencaCustoCompras).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span> representando uma variação de <span className="text-4xl textoGradiente">{"R$" + (Math.abs((diferencaCustoCompras / custoCompraAR) * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span></span>
                        </div>
                    </div>
                    <div className="flex flex-col border-solid border-white border-2 rounded-2xl w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex justify-between cursor-pointer" onClick={() => trocarDropTabela("compras")}>
                                <div className="text-3xl opacity-80">
                                    Compras
                                </div>
                                <div className="w-10 h-auto">
                                    <img className={`${controleDropTabelas.compras ? "rotate-180" : "rotate-0"} [transition:all_500ms] w-full h-auto object-cover`} src={setaSeletor} alt="seletor tabela compras" />
                                </div>
                            </div>
                        </div>
                        <div className={`${controleDropTabelas.compras ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                            <div className="overflow-hidden">
                                {Object.entries(objResultado.totalCompras).map(([nomeCategoria, dados], index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(14,_1fr)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Categoria</div>
                                                        <div>valorAR</div>
                                                        <div>impostosAR</div>
                                                        <div>valorDesonerado</div>
                                                        <div>custoAR</div>
                                                        <div>% Custo Efetivo AR</div>
                                                        <div>Crédito AR</div>
                                                        <div>% Carga Tributária AR</div>
                                                        <div>valorDR</div>
                                                        <div>impostosDR</div>
                                                        <div>custoDR</div>
                                                        <div>% Custo Efetivo DR</div>
                                                        <div>Crédito DR</div>
                                                        <div>% Carga Tributária DR</div>
                                                    </div>
                                                }
                                                <div className={`grid grid-cols-[repeat(14,_1fr)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div className="font-bold">{nomeLinhasTabelaCompras[nomeCategoria as keyof totalComprasType]}</div>
                                                    <div>{retornarValorDinheiro(dados.valorAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.impostosAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.valorDesonerado)}</div>
                                                    <div>{retornarValorDinheiro(dados.custoAR)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCustoEfetivoAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.creditoAR)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCargaTributariaAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.valorDR)}</div>
                                                    <div>{retornarValorDinheiro(dados.impostosDR)}</div>
                                                    <div>{retornarValorDinheiro(dados.custoDR)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCustoEfetivoDR)}</div>
                                                    <div>{retornarValorDinheiro(dados.creditoDR)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCargaTributariaDR)}</div>
                                                </div>
                                            </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>


                {/* VENDAS */}    
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full text-3xl flex flex-col gap-3">
                        <span className="mb-4 text-4xl font-bold">Impacto nas Vendas</span>
                        <div className="flex items-center gap-2">
                            <IndicadorColorido cor={`${diferencaVendas > 0 ? "vermelho" : "verde"}`} />
                            <span>O preço de venda sofreu {diferencaVendas > 0 ? "um aumento" : "uma redução"} de <span className="text-4xl textoGradiente">{"R$" + Math.abs(diferencaVendas).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>, o que representa uma variação de <span className="text-4xl textoGradiente">{(Math.abs(diferencaVendas / (caixa.clientes.AR) * 100)).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span></span>
                        </div>
                        <span>
                            {
                                diferencaVendas > 0 ? 
                                "Se seus clientes não estiverem no regime regular do IBS/CBS, o custo de compra deles aumenta — e sua empresa pode ter que absorver esse impacto para seguir competitiva"
                                :
                                "Seu cliente terá uma redução de R$ XXX,XX (valorVendaDR - valorVendaAR?) no custo de compra e pode exigir preços menores para evitar repasse ao consumidor final"
                            }
                        </span>
                    </div>
                    <div className="flex flex-col border-solid border-white border-2 rounded-2xl w-full">
                        <div className="flex flex-col p-4">
                            <div className="flex justify-between cursor-pointer" onClick={() => trocarDropTabela("vendas")}>
                                <div className="text-3xl opacity-80">
                                    Vendas
                                </div>
                                <div className="w-10 h-auto">
                                    <img className={`${controleDropTabelas.vendas ? "rotate-180" : "rotate-0"} [transition:all_500ms] w-full h-auto object-cover`} src={setaSeletor} alt="seletor tabela compras" />
                                </div>
                            </div>
                        </div>
                        <div className={`${controleDropTabelas.vendas ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
                            <div className="overflow-hidden">
                                {Object.entries(objResultado.totalVendas).map(([nomeCategoria, dados], index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[repeat(8,_1fr)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>Categoria</div>
                                                        <div>valorAR</div>
                                                        <div>impostosAR</div>
                                                        <div>valorDesonerado</div>
                                                        <div>% Carga Tributária AR</div>
                                                        <div>valorDR</div>
                                                        <div>impostosDR</div>
                                                        <div>% Carga Tributária DR</div>
                                                    </div>
                                                }
                                                <div className={`grid grid-cols-[repeat(8,_1fr)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
                                                    <div className="font-bold">{nomeLinhasTabelaVendas[nomeCategoria as keyof totalVendasType]}</div>
                                                    <div>{retornarValorDinheiro(dados.valorAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.impostosAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.valorDesonerado)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCargaTributariaAR)}</div>
                                                    <div>{retornarValorDinheiro(dados.valorDR)}</div>
                                                    <div>{retornarValorDinheiro(dados.impostosDR)}</div>
                                                    <div>{retornarValorPorcentagem(dados.porcentagemCargaTributariaDR)}</div>
                                                </div>
                                            </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}