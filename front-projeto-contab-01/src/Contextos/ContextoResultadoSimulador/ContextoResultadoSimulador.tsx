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
}

export type totalVendasType = {
    vendasProdutos: objAreaVendasType,
    servicosPrestados: objAreaVendasType,
    locacaoMoveis: objAreaVendasType,
    locacaoImoveis: objAreaVendasType,
}

export type linhasDreType = {
  custoGeral: {AR: number, DR: number},
  despesas: {AR: number, DR: number},
}

export type tabelaDreType = {
  receitaBruta: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  deducoesTributos: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  custoGeral: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  lucroBruto: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  despesas: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  lucrosAntesIrCs: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  irCs: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
}

export type tabelaCaixaType = {
  fornecedores: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  tributosCredito: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  clientes: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  tributosDebito: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  tributosRecolhidos: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  saldoCredor: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  resultado: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
  resultadoSemClientes: {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number},
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

export type objRespostaFinalType = {
    servicosPrestados: objItemFinal[],
    servicosTomados: objItemFinal[],
    locacaoBensMoveis: objItemFinal[],
    produtosVendidos: objItemFinal[],
    produtosAdquiridos: objItemFinal[],
    locacaoBensImoveis: objItemFinal[],
    compraVendaBensImoveis: objItemFinal[],
    totalCompras: totalComprasType,
    totalVendas: totalVendasType,
    dre: linhasDreType
}

type TiposContextoResultadoSimulador = {       
    objResultado: objRespostaFinalType
    setObjResultado: Dispatch<SetStateAction<objRespostaFinalType>>
}

const valorInicialResultadoSimulador = {
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
              },
              dre: {
                custoGeral: {AR: 0, DR: 0},
                despesas: {AR: 0, DR: 0}
              }
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