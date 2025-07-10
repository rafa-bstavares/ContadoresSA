import { useContext, useEffect, useState } from "react"
import { ContextoResultadoSimulador, objRegimeType, objRespostaFinalType, regimesChavesObjType, regimesType, tabelaCaixaType, tabelaDreType, totalComprasType, totalVendasType, valorInicialobjRegime } from "../../Contextos/ContextoResultadoSimulador/ContextoResultadoSimulador"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import xisLogo from "../../assets/images/priceTaxIsotipo.png"
import setaFina from "../../assets/images/setaFina.png"
import { IndicadorColorido } from "../IndicadorColorido/IndicadorColorido"


export function ResultadoSimulador(){

    const [objRegimeAtual, setObjRegimeAtual] = useState<objRegimeType>(valorInicialobjRegime)
    const [regimeAtual, setRegimeAtual] = useState<regimesType>("Simples Nacional")
    const [regimeAtualAberto, setRegimeAtualAberto] = useState<boolean>(false)

    const arrRegimes: ("Simples Nacional" | "Lucro Real" | "Lucro Presumido")[] = ["Simples Nacional", "Lucro Real", "Lucro Presumido"]

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
        irCs: "IR/CS",
        resultadoPosIrCs: "Resultado Pós IR/CS",
        resultadoSobreClientes: "Resultado Sobre Clientes (%)" 
    }

    const nomeLinhasTabelaDre: Record<keyof tabelaDreType, string> = {
        receitaBruta: "Receita Bruta",
        deducoesTributos: "Deduções Tributos",
        custoGeral: "Custo",
        lucroBruto: "Lucro Bruto",
        despesas: "Despesas",
        lucrosAntesIrCs: "Lucro Antes IR/CS",
        irCs: "IR/CS",
        lucroLiquido: "Lucro Líquido"
    }

    const nomeLinhasTabelaCompras: Record<keyof totalComprasType, string> = {
        comprasProdutos: "Compras Produtos",
        servicosTomados: "Serviços Tomados",
        locacaoMoveis: "Locação Móveis",
        locacaoImoveis: "Locação Imóveis",
        total: "Total"
    }

    const nomeLinhasTabelaVendas: Record<keyof totalVendasType, string> = {
        vendasProdutos: "Vendas Produtos",
        servicosPrestados: "Serviços Prestados",
        locacaoMoveis: "Locação Móveis",
        locacaoImoveis: "Locação Imóveis",
        total: "Total"
    }




    function trocarDropTabela(nomeTabela: nomesTabelasType){
        const objTabelaClone = {...controleDropTabelas}

        objTabelaClone[nomeTabela] = !objTabelaClone[nomeTabela]

        setControleDropTabelas(objTabelaClone)

    }

    function trocarDropRegimeAtual(){
        setRegimeAtualAberto(!regimeAtualAberto)
    }

    function escolherRegimeAtual(item: regimesType){
        setRegimeAtual(item)
        trocarDropRegimeAtual()
    }


    const {objResultado} = useContext(ContextoResultadoSimulador)

    /*
    const objRegimeExemplo = {
    "servicosPrestados": [
        {
            "antesReforma": {
                "valor": 1000,
                "valorImpostos": 142.50000000000003,
                "valorDesonerado": 857.5,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 953.54,
                    "valorImpostos": 96.04000000000002,
                    "porcentagemCargaTributaria": 0.11200000000000003,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 2000,
                "valorImpostos": 285.00000000000006,
                "valorDesonerado": 1715,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 2195.2,
                    "valorImpostos": 480.20000000000005,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 1500,
                "valorImpostos": 213.75000000000003,
                "valorDesonerado": 1286.25,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 1430.31,
                    "valorImpostos": 144.06000000000003,
                    "porcentagemCargaTributaria": 0.11200000000000003,
                    "custo": null
                }
            ]
        }
    ],
    "servicosTomados": [
        {
            "antesReforma": {
                "valor": 500,
                "valorImpostos": 71.25000000000001,
                "valorDesonerado": 428.75,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": 453.75
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 548.8,
                    "valorImpostos": 120.05000000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 428.75
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 300,
                "valorImpostos": 42.75000000000001,
                "valorDesonerado": 257.25,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": 272.25
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 329.28,
                    "valorImpostos": 72.03,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 257.25
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 200,
                "valorImpostos": 28.500000000000004,
                "valorDesonerado": 171.5,
                "porcentagemCargaTributaria": 0.16618075801749274,
                "custo": 200
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 219.52,
                    "valorImpostos": 48.02,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 171.5
                }
            ]
        }
    ],
    "locacaoBensMoveis": [
        {
            "antesReforma": {
                "valor": 500,
                "valorImpostos": 46.25,
                "valorDesonerado": 453.75,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": 453.75
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 580.8,
                    "valorImpostos": 127.05000000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 453.75
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 400,
                "valorImpostos": 13.200000000000001,
                "valorDesonerado": 386.8,
                "porcentagemCargaTributaria": 0.03412616339193382,
                "custo": 400
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 495.10400000000004,
                    "valorImpostos": 108.30400000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": 386.8
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 1000,
                "valorImpostos": 142.5,
                "valorDesonerado": 857.5,
                "porcentagemCargaTributaria": 0.1661807580174927,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 1097.6,
                    "valorImpostos": 240.10000000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 1000,
                "valorImpostos": 142.5,
                "valorDesonerado": 857.5,
                "porcentagemCargaTributaria": 0.1661807580174927,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 1097.6,
                    "valorImpostos": 240.10000000000002,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 700,
                "valorImpostos": 64.75,
                "valorDesonerado": 635.25,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 813.12,
                    "valorImpostos": 177.87,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        }
    ],
    "produtosVendidos": [
        {
            "antesReforma": {
                "valor": 700,
                "valorImpostos": 21,
                "valorDesonerado": 679,
                "porcentagemCargaTributaria": 0.030927835051546393,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 730.3324,
                    "valorImpostos": 51.3324,
                    "porcentagemCargaTributaria": 0.0756,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 500,
                "valorImpostos": 75,
                "valorDesonerado": 425,
                "porcentagemCargaTributaria": 0.17647058823529413,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 425,
                    "valorImpostos": 0,
                    "porcentagemCargaTributaria": 0,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 450,
                "valorImpostos": 54.00000000000001,
                "valorDesonerado": 396,
                "porcentagemCargaTributaria": 0.13636363636363638,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 480.2688,
                    "valorImpostos": 84.26880000000001,
                    "porcentagemCargaTributaria": 0.21280000000000004,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 600,
                "valorImpostos": 90.00000000000001,
                "valorDesonerado": 510,
                "porcentagemCargaTributaria": 0.17647058823529416,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 567.12,
                    "valorImpostos": 57.12000000000001,
                    "porcentagemCargaTributaria": 0.11200000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 560,
                "valorImpostos": 67.2,
                "valorDesonerado": 492.8,
                "porcentagemCargaTributaria": 0.13636363636363635,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 547.9936,
                    "valorImpostos": 55.19360000000001,
                    "porcentagemCargaTributaria": 0.11200000000000002,
                    "custo": null
                }
            ]
        }
    ],
    "produtosAdquiridos": [
        {
            "antesReforma": {
                "valor": 300,
                "valorImpostos": 27.75,
                "valorDesonerado": 272.25,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": 272.25
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 305.7912,
                    "valorImpostos": 33.5412,
                    "porcentagemCargaTributaria": 0.12320000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 300,
                "valorImpostos": 10.95,
                "valorDesonerado": 289.05,
                "porcentagemCargaTributaria": 0.03788271925272444,
                "custo": 289.05
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 321.4236,
                    "valorImpostos": 32.3736,
                    "porcentagemCargaTributaria": 0.112,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 200,
                "valorImpostos": 18.5,
                "valorDesonerado": 181.5,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": 200
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 232.32,
                    "valorImpostos": 50.82000000000001,
                    "porcentagemCargaTributaria": 0.28,
                    "custo": null
                }
            ]
        }
    ],
    "locacaoBensImoveis": [
        {
            "antesReforma": {
                "valor": 600,
                "valorImpostos": 0,
                "valorDesonerado": 600,
                "porcentagemCargaTributaria": 0,
                "custo": 600
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 650.4,
                    "valorImpostos": 50.40000000000001,
                    "porcentagemCargaTributaria": 0.08400000000000002,
                    "custo": 600
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 700,
                "valorImpostos": 25.549999999999997,
                "valorDesonerado": 674.45,
                "porcentagemCargaTributaria": 0.037882719252724434,
                "custo": 635.25
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 731.1038000000001,
                    "valorImpostos": 56.65380000000002,
                    "porcentagemCargaTributaria": 0.08400000000000002,
                    "custo": 674.45
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 1500,
                "valorImpostos": 138.75,
                "valorDesonerado": 1361.25,
                "porcentagemCargaTributaria": 0.10192837465564739,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 1475.595,
                    "valorImpostos": 114.34500000000003,
                    "porcentagemCargaTributaria": 0.08400000000000002,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 1620,
                "valorImpostos": 149.85,
                "valorDesonerado": 1470.15,
                "porcentagemCargaTributaria": 0.10192837465564737,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": 1593.6426000000001,
                    "valorImpostos": 123.49260000000004,
                    "porcentagemCargaTributaria": 0.08400000000000002,
                    "custo": null
                }
            ]
        }
    ],
    "compraVendaBensImoveis": [
        {
            "antesReforma": {
                "valor": 5000,
                "valorImpostos": 37000,
                "valorDesonerado": -32000,
                "porcentagemCargaTributaria": -1.15625,
                "custo": null
            },
            "depoisReforma": [
                {
                    "ano": "2033",
                    "valor": -37620,
                    "valorImpostos": -4620,
                    "porcentagemCargaTributaria": 0.144375,
                    "custo": null
                }
            ]
        },
        {
            "antesReforma": {
                "valor": 3000,
                "valorImpostos": 18500,
                "valorDesonerado": -15500,
                "porcentagemCargaTributaria": -1.1935483870967742,
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
            "valorAR": 800,
            "impostosAR": 57.2,
            "valorDesonerado": 742.8,
            "creditoAR": 38.7,
            "custoAR": 761.3,
            "porcentagemCustoEfetivoAR": 0.9516249999999999,
            "porcentagemCargaTributariaAR": 0.07700592353257944,
            "valorDR": 859.5347999999999,
            "impostosDR": 116.73480000000002,
            "creditoDR": 0,
            "custoDR": 0,
            "porcentagemCustoEfetivoDR": 0,
            "porcentagemCargaTributariaDR": 0.15715508885298873
        },
        "servicosTomados": {
            "valorAR": 1000,
            "impostosAR": 142.50000000000003,
            "valorDesonerado": 857.5,
            "creditoAR": 74,
            "custoAR": 926,
            "porcentagemCargaTributariaAR": 0.16618075801749274,
            "porcentagemCustoEfetivoAR": 0.926,
            "valorDR": 1097.6,
            "impostosDR": 240.10000000000002,
            "creditoDR": 240.10000000000002,
            "custoDR": 857.5,
            "porcentagemCustoEfetivoDR": 0.7812500000000001,
            "porcentagemCargaTributariaDR": 0.28
        },
        "locacaoMoveis": {
            "valorAR": 900,
            "impostosAR": 59.45,
            "valorDesonerado": 840.55,
            "creditoAR": 46.25,
            "custoAR": 853.75,
            "porcentagemCargaTributariaAR": 0.07072749985128786,
            "porcentagemCustoEfetivoAR": 0.9486111111111111,
            "valorDR": 1075.904,
            "impostosDR": 235.35400000000004,
            "creditoDR": 235.35400000000004,
            "custoDR": 840.55,
            "porcentagemCustoEfetivoDR": 0.78125,
            "porcentagemCargaTributariaDR": 0.2800000000000001
        },
        "locacaoImoveis": {
            "valorAR": 1300,
            "impostosAR": 25.549999999999997,
            "valorDesonerado": 1274.45,
            "creditoAR": 64.75,
            "custoAR": 1235.25,
            "porcentagemCargaTributariaAR": 0.020047863784377572,
            "porcentagemCustoEfetivoAR": 0.9501923076923077,
            "valorDR": 1381.5038,
            "impostosDR": 107.05380000000002,
            "creditoDR": 107.05380000000002,
            "custoDR": 1274.45,
            "porcentagemCustoEfetivoDR": 0.4343093374046456,
            "porcentagemCargaTributariaDR": 0.08400000000000002
        },
        "total": {
            "valorAR": 4000,
            "impostosAR": 284.7,
            "valorDesonerado": 3715.3,
            "creditoAR": 223.7,
            "custoAR": 3776.3,
            "porcentagemCargaTributariaAR": 0.07700592353257944,
            "porcentagemCustoEfetivoAR": 0.9516249999999999,
            "valorDR": 4414.5426,
            "impostosDR": 699.2426000000002,
            "creditoDR": 582.5078000000001,
            "custoDR": 2972.5,
            "porcentagemCustoEfetivoDR": 0,
            "porcentagemCargaTributariaDR": 0.15715508885298873
        }
    },
    "totalVendas": {
        "vendasProdutos": {
            "valorAR": 2810,
            "impostosAR": 307.2,
            "valorDesonerado": 2502.8,
            "porcentagemCargaTributariaAR": 0.12274252836822758,
            "valorDR": 2750.7147999999997,
            "impostosDR": 247.9148,
            "porcentagemCargaTributariaDR": 0.09905497842416493
        },
        "servicosPrestados": {
            "valorAR": 4500,
            "impostosAR": 641.2500000000001,
            "valorDesonerado": 3858.75,
            "porcentagemCargaTributariaAR": 0.16618075801749274,
            "valorDR": 4579.049999999999,
            "impostosDR": 720.3000000000001,
            "porcentagemCargaTributariaDR": 0.18666666666666668
        },
        "locacaoMoveis": {
            "valorAR": 2700,
            "impostosAR": 349.75,
            "valorDesonerado": 2350.25,
            "porcentagemCargaTributariaAR": 0.14881395596213168,
            "valorDR": 3008.3199999999997,
            "impostosDR": 658.07,
            "porcentagemCargaTributariaDR": 0.28
        },
        "locacaoImoveis": {
            "valorAR": 3120,
            "impostosAR": 288.6,
            "valorDesonerado": 2831.4,
            "porcentagemCargaTributariaAR": 0.10192837465564739,
            "valorDR": 3069.2376000000004,
            "impostosDR": 237.83760000000007,
            "porcentagemCargaTributariaDR": 0.08400000000000002
        },
        "total": {
            "valorAR": 13130,
            "impostosAR": 1586.8000000000002,
            "valorDesonerado": 11543.199999999999,
            "porcentagemCargaTributariaAR": 0.12274252836822758,
            "valorDR": 13407.322400000001,
            "impostosDR": 1864.1224000000004,
            "porcentagemCargaTributariaDR": 0.09905497842416493
        }
    },
    "dre": {
        "receitaBruta": {
            "AR": 26260,
            "DR": 23086.399999999998,
            "diferencaReais": -3173.600000000002,
            "diferencaPercentual": -0.12085300837776093
        },
        "deducoesTributos": {
            "AR": 2726.2000000000003,
            "DR": 0,
            "diferencaReais": -2726.2000000000003,
            "diferencaPercentual": -1
        },
        "custoGeral": {
            "AR": 761.3,
            "DR": 428.75,
            "diferencaReais": -332.54999999999995,
            "diferencaPercentual": -0.4368185997635623
        },
        "lucroBruto": {
            "AR": 22772.5,
            "DR": 22657.649999999998,
            "diferencaReais": -114.85000000000218,
            "diferencaPercentual": -0.005043363706224709
        },
        "despesas": {
            "AR": 3015,
            "DR": 2543.75,
            "diferencaReais": -471.25,
            "diferencaPercentual": -0.15630182421227198
        },
        "lucrosAntesIrCs": {
            "AR": 19757.5,
            "DR": 20113.899999999998,
            "diferencaReais": 356.3999999999978,
            "diferencaPercentual": 0.018038719473617505
        },
        "irCs": {
            "AR": 4741.8,
            "DR": 4838.725999999999,
            "diferencaReais": 96.92599999999857,
            "diferencaPercentual": 0.02044076089248778
        },
        "lucroLiquido": {
            "AR": 15015.7,
            "DR": 15275.173999999999,
            "diferencaReais": 259.47399999999834,
            "diferencaPercentual": 0.017280180078184722
        }
    },
    "caixa": {
        "fornecedores": {
            "AR": 8000,
            "DR": 8829.0852,
            "diferencaReais": 829.0851999999995,
            "diferencaPercentual": 0.10363564999999994
        },
        "tributosCredito": {
            "AR": 447.4,
            "DR": 1165.0156000000002,
            "diferencaReais": 717.6156000000002,
            "diferencaPercentual": 1.6039687080911942
        },
        "clientes": {
            "AR": 26260,
            "DR": 26814.644800000002,
            "diferencaReais": 554.6448000000019,
            "diferencaPercentual": 0.02112127951256671
        },
        "tributosDebito": {
            "AR": 3173.6000000000004,
            "DR": 3728.2448000000004,
            "diferencaReais": 554.6448,
            "diferencaPercentual": 0.17476833879505924
        },
        "tributosRecolhidos": {
            "AR": 2726.2000000000003,
            "DR": 2563.2292,
            "diferencaReais": -162.97080000000005,
            "diferencaPercentual": -0.059779473259482074
        },
        "saldoCredor": {
            "AR": 0,
            "DR": 0,
            "diferencaReais": 0,
            "diferencaPercentual": 0
        },
        "resultado": {
            "AR": 15533.800000000001,
            "DR": 15422.330399999999,
            "diferencaReais": -111.46960000000217,
            "diferencaPercentual": -0.007175938920290088
        },
        "irCs": {
            "AR": 4741.8,
            "DR": 4838.725999999999,
            "diferencaReais": 96.92599999999857,
            "diferencaPercentual": 0.02044076089248778
        },
        "resultadoPosIrCs": {
            "AR": 10792,
            "DR": 10583.6044,
            "diferencaReais": -208.39559999999983,
            "diferencaPercentual": -0.01931019273535951
        },
        "resultadoSobreClientes": {
            "AR": 0.5915384615384616,
            "DR": 0.5751458024161483,
            "diferencaReais": -0.016392659122313247,
            "diferencaPercentual": -0.02771190748895607
        }
    }
}

    const objResultado: objRespostaFinalType = {
        simplesNacional: objRegimeExemplo,
        lucroPresumido: objRegimeExemplo,
        lucroReal: objRegimeExemplo,
        cnpj: "04200700000180",
        meuRegime: "Simples Nacional"
    }

    */


    useEffect(() => {

        let meuRegimeChave: regimesChavesObjType = "simplesNacional"

        switch(regimeAtual){
            case "Simples Nacional":
                meuRegimeChave = "simplesNacional"
                break

            case "Lucro Presumido":
                meuRegimeChave = "lucroPresumido"
                break

            case "Lucro Real":
                meuRegimeChave = "lucroReal"
                break

            default:
                meuRegimeChave = "simplesNacional"
        }

        setObjRegimeAtual(objResultado[meuRegimeChave])

    }, [regimeAtual])


    useEffect(() => {
        setRegimeAtual(objResultado.meuRegime)
    }, [objResultado])

/*
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
    const resultadoCaixaDiferencaPercentual = resultadoCaixaAR ? (resultadoCaixaDiferenca / resultadoCaixaAR) : 0 
    const resultadoSemClientesAR = caixa.clientes.AR ? (resultadoCaixaAR / caixa.clientes.AR) : 0
    const resultadoSemClientesDR = caixa.clientes.DR ? (resultadoCaixaDR / caixa.clientes.DR) : 0

    const caixaComResultado: tabelaCaixaType = {
        ...caixa,
        resultado: {
            AR: resultadoCaixaAR,
            DR: resultadoCaixaDR,
            diferencaReais: resultadoCaixaDiferenca,
            diferencaPercentual: resultadoCaixaDiferencaPercentual
        },
        resultadoSobreClientes: {
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
    */

    const arrPropriedadesCaixa = Object.entries(objRegimeAtual.caixa)
    const diferencaCustoCompras = objRegimeAtual.totalCompras.total.custoDR - objRegimeAtual.totalCompras.total.custoAR
    const diferencaVendas = objRegimeAtual.totalVendas.total.valorDR - objRegimeAtual.totalVendas.total.valorAR
    const representacaoPaupavel = objRegimeAtual.caixa.resultadoSobreClientes.diferencaPercentual * objRegimeAtual.caixa.clientes.AR

    
    


    function retornarValorDinheiro(num: number){
        return "R$ " + num.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    function retornarValorPorcentagem(num: number){
        return (num * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"
    }


    useEffect(() => {
        console.log("Resultado de dentro da tela de resultadooo")
        console.log(objRegimeAtual)
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

                {/* DROP REGIMES */}
                <div className="flex flex-col max-w-[400px]">
                    <label className="text-gray-400 w-[10vw]">Mude o regime:</label>
                    <div className="flex flex-col border-gray-300 border-solid border-2 rounded-md">
                        <div
                        onClick={trocarDropRegimeAtual}
                        className="flex gap-2 items-center justify-between p-2 cursor-pointer"
                        >
                            <div className=" opacity-50">
                                {regimeAtual}
                            </div>
                            <div
                                className={`
                                ${regimeAtualAberto ? "rotate-180" : "rotate-0"}
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
                            ${regimeAtualAberto ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}
                            [transition:grid-template-rows_500ms]
                        `}
                        >
                        <div className="overflow-hidden">
                            {arrRegimes.map(item => (
                            <div
                                key={item}
                                className="p-2 rounded-md cursor-pointer hover:bg-premiumBg"
                                onClick={() => escolherRegimeAtual(item)}
                            >
                                {item}
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                </div>


                {/* DRE */}    
                <div className="flex flex-col gap-8 items-center">
                    <div className="w-full text-3xl flex flex-col gap-3">
                        <span className="mb-4 text-4xl font-bold">DRE - Demonstração de Resultado do Exercício</span>
                        <div className="flex items-start gap-2 ">
                            <div className="flex items-center mt-[20px] ">
                                <IndicadorColorido cor={`${objRegimeAtual.dre.lucroLiquido.diferencaReais > 0 ? "verde" : "vermelho"}`}/>
                            </div>
                            {
                                objRegimeAtual.dre.lucroLiquido.diferencaReais > 0 ?
                                <span className="">Seu Lucro Líquido aumentou em <span className="text-4xl textoGradiente">{"R$" + Math.abs(objRegimeAtual.dre.lucroLiquido.diferencaReais).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>, isso significa que você pode trabalhar o preço de venda em <span className="text-4xl textoGradiente">{Math.abs(objRegimeAtual.dre.lucroLiquido.diferencaPercentual * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span> para buscar mais competitividade e manter um preço equilibrado até o fim da cadeia (consumidor final)</span>
                                :
                                <span>A queda de <span className="text-4xl textoGradiente">{"R$" + Math.abs(objRegimeAtual.dre.lucroLiquido.diferencaReais).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span> no Lucro Líquido exige ação: renegocie com fornecedores ou ajuste seus preços para manter a lucratividade</span>
                            }
                        </div>
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
                                {Object.entries(objRegimeAtual.dre).map(([nomeCategoria, dados], index) => {
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
                            <div className="flex items-center mt-[0.3em] ">
                                <IndicadorColorido cor={`${objRegimeAtual.caixa.resultado.diferencaReais > 0? "verde" : "vermelho"}`}/>
                            </div>
                            <span>Seu caixa {objRegimeAtual.caixa.resultado.diferencaReais > 0? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{"R$" + Math.abs(objRegimeAtual.caixa.resultado.diferencaReais).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>, com impacto de <span className="text-4xl textoGradiente">{Math.abs(objRegimeAtual.caixa.resultado.diferencaPercentual * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span> {objRegimeAtual.caixa.resultado.diferencaReais > 0? "positivo" : "negativo"} no resultado.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center mt-[0.3em]">
                                <IndicadorColorido cor={`${objRegimeAtual.caixa.resultadoSobreClientes.diferencaPercentual > 0 ? "verde" : "vermelho"}`}/>
                            </div>
                            <span>Sua capacidade de gerar caixa {objRegimeAtual.caixa.resultadoSobreClientes.diferencaPercentual > 0 ? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{Math.abs(objRegimeAtual.caixa.resultadoSobreClientes.diferencaPercentual * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"} </span>, que representa <span className="text-4xl textoGradiente">{"R$ " + Math.abs(representacaoPaupavel).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span>
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
                            <div className="flex items-center mt-[0.3em]">
                                <IndicadorColorido cor={`${objRegimeAtual.caixa.fornecedores.diferencaReais > 0 ? "vermelho" : "verde"}`}/>
                            </div>
                            <span>O preço de compra sofreu {objRegimeAtual.caixa.fornecedores.diferencaReais > 0 ? "um aumento" : "uma redução"} de <span className="text-4xl textoGradiente">{"R$" + (Math.abs(objRegimeAtual.caixa.fornecedores.diferencaReais).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span>, representando uma variação de <span className="text-4xl textoGradiente">{Math.abs(objRegimeAtual.caixa.fornecedores.diferencaReais / (objRegimeAtual.caixa.fornecedores.AR) * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center mt-[0.3em]">
                                <IndicadorColorido cor={`${diferencaCustoCompras > 0 ? "vermelho" : "verde"}`}/>
                            </div>
                            <span>O seu custo {diferencaCustoCompras > 0 ? "aumentou" : "reduziu"} em <span className="text-4xl textoGradiente">{"R$" + (Math.abs(diferencaCustoCompras).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span> representando uma variação de <span className="text-4xl textoGradiente">{"R$" + (Math.abs((diferencaCustoCompras / objRegimeAtual.totalCompras.total.custoAR) * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}))}</span></span>
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
                                {Object.entries(objRegimeAtual.totalCompras).map(([nomeCategoria, dados], index) => {
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
                            <div className="flex items-center mt-[0.3em]">
                                <IndicadorColorido cor={`${diferencaVendas > 0 ? "vermelho" : "verde"}`} />
                            </div>
                            <span>O preço de venda sofreu {diferencaVendas > 0 ? "um aumento" : "uma redução"} de <span className="text-4xl textoGradiente">{"R$" + Math.abs(diferencaVendas).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>, o que representa uma variação de <span className="text-4xl textoGradiente">{(Math.abs(diferencaVendas / (objRegimeAtual.caixa.clientes.AR) * 100)).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "%"}</span></span>
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
                                {Object.entries(objRegimeAtual.totalVendas).map(([nomeCategoria, dados], index) => {
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