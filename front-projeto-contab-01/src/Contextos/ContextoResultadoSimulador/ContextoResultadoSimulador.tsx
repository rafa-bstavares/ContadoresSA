import { createContext, useState, Dispatch, SetStateAction } from "react";

type objAreaComprasType = {
    valorAR: number,
    impostosAR: number,
    valorDesonerado: number,
    creditoAR: number, 
    custoAR: number,
    porcentagemCustoEfetivoAR: number,
    porcentagemCargaTributariaAR: number,
    valorDR: number,
    impostosDR: number,
    creditoDR: number,
    custoDR: number,
    porcentagemCustoEfetivoDR: number,
    porcentagemCargaTributariaDR: number,
}

type objAreaVendasType = {
    valorAR: number,
    impostosAR: number,
    valorDesonerado: number,
    porcentagemCargaTributariaAR: number,
    valorDR: number,
    impostosDR: number,
    porcentagemCargaTributariaDR: number,
}

export type totalComprasType = {
    comprasProdutos: objAreaComprasType,
    servicosTomados: objAreaComprasType,
    locacaoMoveis: objAreaComprasType,
    locacaoImoveis: objAreaComprasType,
    total: objAreaComprasType
}

export type totalVendasType = {
    vendasProdutos: objAreaVendasType,
    servicosPrestados: objAreaVendasType,
    locacaoMoveis: objAreaVendasType,
    locacaoImoveis: objAreaVendasType,
    total: objAreaVendasType
}

export type linhasDreType = {
  custoGeral: {AR: number, DR: number},
  despesas: {AR: number, DR: number},
}

export type linhaArDrDiferencas = {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number}

export type tabelaDreType = {
  receitaBruta: linhaArDrDiferencas,
  deducoesTributos: linhaArDrDiferencas,
  custoGeral: linhaArDrDiferencas,
  lucroBruto: linhaArDrDiferencas,
  despesas: linhaArDrDiferencas,
  lucrosAntesIrCs: linhaArDrDiferencas,
  irCs: linhaArDrDiferencas,
  lucroLiquido: linhaArDrDiferencas
}

export type tabelaCaixaType = {
  fornecedores: linhaArDrDiferencas,
  tributosCredito: linhaArDrDiferencas,
  clientes: linhaArDrDiferencas,
  tributosDebito: linhaArDrDiferencas,
  tributosRecolhidos: linhaArDrDiferencas,
  saldoCredor: linhaArDrDiferencas,
  resultado: linhaArDrDiferencas,
  irCs: linhaArDrDiferencas,
  resultadoPosIrCs: linhaArDrDiferencas,
  resultadoSobreClientes: linhaArDrDiferencas,
}


type objAntesReforma = {
    valor: number, 
    valorImpostos: number,
    valorDesonerado: number,
    porcentagemCargaTributaria: number,
    custo: number | null, 
} 

type objDepoisReforma = {
    ano: string,
    valor: number,
    valorImpostos: number,
    porcentagemCargaTributaria: number,
    custo: number | null
}

type objItemFinal = {
antesReforma: objAntesReforma,
depoisReforma: objDepoisReforma[]
}      

export type objRegimeType = {
    servicosPrestados: objItemFinal[],
    servicosTomados: objItemFinal[],
    locacaoBensMoveis: objItemFinal[],
    produtosVendidos: objItemFinal[],
    produtosAdquiridos: objItemFinal[],
    locacaoBensImoveis: objItemFinal[],
    compraVendaBensImoveis: objItemFinal[],
    totalCompras: totalComprasType,
    totalVendas: totalVendasType,
    dre: tabelaDreType,
    caixa: tabelaCaixaType
}

export type regimesType = "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "Pessoa Física" | ""

export type regimesChavesObjType = "simplesNacional" | "lucroReal" | "lucroPresumido"

export type objRespostaFinalType = {
  simplesNacional: objRegimeType,
  lucroReal: objRegimeType,
  lucroPresumido: objRegimeType,
  meuRegime: regimesType,
  cnpj: string
}

type TiposContextoResultadoSimulador = {       
    objResultado: objRespostaFinalType
    setObjResultado: Dispatch<SetStateAction<objRespostaFinalType>>
}

export const valorInicialobjRegime = {
              servicosPrestados: [],
              servicosTomados: [],
              locacaoBensMoveis: [],
              produtosVendidos: [],
              produtosAdquiridos: [],
              locacaoBensImoveis: [],
              compraVendaBensImoveis: [],
              totalCompras: {
                  comprasProdutos: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    custoAR: 0, 
                    creditoAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    custoDR: 0,
                    creditoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  servicosTomados: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    custoAR: 0, 
                    creditoAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    custoDR: 0,
                    creditoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoMoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    custoAR: 0, 
                    creditoAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    custoDR: 0,
                    creditoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoImoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    custoAR: 0, 
                    creditoAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    custoDR: 0,
                    creditoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  total: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    custoAR: 0, 
                    creditoAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    custoDR: 0,
                    creditoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
              },
              totalVendas: {
                  vendasProdutos: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  servicosPrestados: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoMoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoImoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  total: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
              },
              dre: {
                receitaBruta: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                deducoesTributos: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                custoGeral: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucroBruto: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                despesas: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucrosAntesIrCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                irCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucroLiquido: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
              },
              caixa: {
                fornecedores: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosCredito: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                clientes: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosDebito: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosRecolhidos: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                saldoCredor: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultado: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                irCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultadoPosIrCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultadoSobreClientes: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
              }
          }  

  const valorInicialResultadoSimulador: objRespostaFinalType = {
    simplesNacional: valorInicialobjRegime,
    lucroReal: valorInicialobjRegime,
    lucroPresumido: valorInicialobjRegime,
    cnpj: "",
    meuRegime: "Simples Nacional"
  }

export const ContextoResultadoSimulador = createContext<TiposContextoResultadoSimulador>({
    objResultado: valorInicialResultadoSimulador,
    setObjResultado: () => {}
} as TiposContextoResultadoSimulador)


export const ResultadoSimuladorProvider = ({children}: {children: React.ReactNode}) => {

    const [objResultado, setObjResultado] = useState<objRespostaFinalType>(valorInicialResultadoSimulador)


    return (
        <ContextoResultadoSimulador.Provider value={{
            objResultado,
            setObjResultado
        }}>
            {children}
        </ContextoResultadoSimulador.Provider>
    )
}