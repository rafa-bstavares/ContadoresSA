import { createContext, useState, Dispatch, SetStateAction } from "react";

type objAreaComprasTransicaoType = {
      ano: anosType
      valor: number,
      impostos: number,
      credito: number,
      custo: number,
      porcentagemCustoEfetivo: number,
      porcentagemCargaTributaria: number
}

type objAreaComprasType = {
    antesReforma: {
      valorAR: number,
      impostosAR: number,
      valorDesonerado: number,
      creditoAR: number, 
      custoAR: number,
      porcentagemCustoEfetivoAR: number,
      porcentagemCargaTributariaAR: number
    },
    depoisReforma: objAreaComprasTransicaoType[]
}

type objAreaVendasTransicaoType = {
      ano: anosType
      valor: number,
      impostos: number,
      porcentagemCargaTributaria: number
}

type objAreaVendasType = {
    antesReforma: {
      valorAR: number,
      impostosAR: number,
      valorDesonerado: number,
      porcentagemCargaTributariaAR: number
    },
    depoisReforma: objAreaVendasTransicaoType[]
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

export type anosType = "2026" | "2027" | "2028" | "2029" | "2030" | "2031" | "2032" | "2033"
export const arrAnos: anosType[] = ["2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"]


type objDepoisReformaDreCaixa = {
  ano: anosType,
  valor: number
}

export type linhaArDrDiferencas = {
  antesReforma: {
    valor: number
  },
  depoisReforma: objDepoisReformaDreCaixa[]
} 

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
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      creditoAR: 0,
                      custoAR: 0, 
                      porcentagemCustoEfetivoAR: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  servicosTomados: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      creditoAR: 0,
                      custoAR: 0, 
                      porcentagemCustoEfetivoAR: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  locacaoMoveis: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      creditoAR: 0,
                      custoAR: 0, 
                      porcentagemCustoEfetivoAR: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  locacaoImoveis: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      creditoAR: 0,
                      custoAR: 0, 
                      porcentagemCustoEfetivoAR: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  total: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      creditoAR: 0,
                      custoAR: 0, 
                      porcentagemCustoEfetivoAR: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
              },
              totalVendas: {
                  vendasProdutos: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  servicosPrestados: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  locacaoMoveis: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  locacaoImoveis: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
                  total: {
                    antesReforma: {
                      valorAR: 0,
                      impostosAR: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributariaAR: 0,
                    },
                    depoisReforma: [
                      {ano: "2026", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2027", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2028", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2029", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2030", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2031", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2032", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                      {ano: "2033", valor: 0, impostos: 0, porcentagemCargaTributaria: 0},
                    ]
                  },
              },
              dre: {
                receitaBruta: {antesReforma: {valor: 0}, depoisReforma: []},
                deducoesTributos: {antesReforma: {valor: 0}, depoisReforma: []},
                custoGeral: {antesReforma: {valor: 0}, depoisReforma: []},
                lucroBruto: {antesReforma: {valor: 0}, depoisReforma: []},
                despesas: {antesReforma: {valor: 0}, depoisReforma: []},
                lucrosAntesIrCs: {antesReforma: {valor: 0}, depoisReforma: []},
                irCs: {antesReforma: {valor: 0}, depoisReforma: []},
                lucroLiquido: {antesReforma: {valor: 0}, depoisReforma: []}
              },
              caixa: {
                fornecedores: {antesReforma: {valor: 0}, depoisReforma: []},
                tributosCredito: {antesReforma: {valor: 0}, depoisReforma: []},
                clientes: {antesReforma: {valor: 0}, depoisReforma: []},
                tributosDebito: {antesReforma: {valor: 0}, depoisReforma: []},
                tributosRecolhidos: {antesReforma: {valor: 0}, depoisReforma: []},
                saldoCredor: {antesReforma: {valor: 0}, depoisReforma: []},
                resultado: {antesReforma: {valor: 0}, depoisReforma: []},
                irCs: {antesReforma: {valor: 0}, depoisReforma: []},
                resultadoPosIrCs: {antesReforma: {valor: 0}, depoisReforma: []},
                resultadoSobreClientes: {antesReforma: {valor: 0}, depoisReforma: []}
              }
          }  

  const valorInicialResultadoSimulador: objRespostaFinalType = {
    simplesNacional: JSON.parse(JSON.stringify(valorInicialobjRegime)),
    lucroReal: JSON.parse(JSON.stringify(valorInicialobjRegime)),
    lucroPresumido: JSON.parse(JSON.stringify(valorInicialobjRegime)),
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