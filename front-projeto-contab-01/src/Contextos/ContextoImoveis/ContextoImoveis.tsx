import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";

export type ImoveisLocacaoObj = {
    valorAluguel: number,
    tipoAluguel: "Aluguel pago" | "Aluguel recebido"
    valorCondominio: number,
    juros: number,
    acrescimos: number,
    residencial: boolean,
    condominioEmbutido: boolean,
    tipoOutraParte: "Pessoa física" | "Pessoa jurídica",
    prazoDeterminado: boolean,
    regimeOutro: "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica",
    quantidade: number,
    id: number
}

export type tipoOperacaoCompraVendaType = "Usado" | "Novo" 
export type tipoImovelCompraVendaType = "Lote" | "Imóvel"

export type ImoveisCompraVendaObj = {
    residencial: boolean,
    valorVendaImovel: number,
    valorAquisicao: number,
    diaAquisicao: string,
    mesAquisicao: string,
    anoAquisicao: string,
    diaVenda: string,
    mesVenda: string,
    anoVenda: string,
    tipoOperacao: tipoOperacaoCompraVendaType,
    tipoImovel: tipoImovelCompraVendaType,
    id: number

}

type TiposContextoImoveis = {       
    totalImoveisLocacao: ImoveisLocacaoObj[],
    setTotalImoveisLocacao: Dispatch<SetStateAction<ImoveisLocacaoObj[]>>,
    totalImoveisCompraVenda: ImoveisCompraVendaObj[],
    setTotalImoveisCompraVenda: Dispatch<SetStateAction<ImoveisCompraVendaObj[]>>,
    totalImoveisAlugueisPagos : ImoveisLocacaoObj[],
    setTotalImoveisAlugueisPagos: Dispatch<SetStateAction<ImoveisLocacaoObj[]>>,
    totalImoveisAlugueisRecebidos: ImoveisLocacaoObj[],
    setTotalImoveisAlugueisRecebidos: Dispatch<SetStateAction<ImoveisLocacaoObj[]>>
}

export const ContextoImoveis = createContext<TiposContextoImoveis>({
    totalImoveisLocacao: [],
    setTotalImoveisLocacao: () => {},
    totalImoveisCompraVenda: [],
    setTotalImoveisCompraVenda: () => {},
    totalImoveisAlugueisPagos: [],
    setTotalImoveisAlugueisPagos: () => {},
    totalImoveisAlugueisRecebidos: [],
    setTotalImoveisAlugueisRecebidos: () => {}
} as TiposContextoImoveis)


export const ImoveisProvider = ({children}: {children: React.ReactNode}) => {

    const [totalImoveisLocacao, setTotalImoveisLocacao] = useState<ImoveisLocacaoObj[]>([])
    const [totalImoveisCompraVenda, setTotalImoveisCompraVenda] = useState<ImoveisCompraVendaObj[]>([])
    const [totalImoveisAlugueisPagos, setTotalImoveisAlugueisPagos] = useState<ImoveisLocacaoObj[]>([])
    const [totalImoveisAlugueisRecebidos, setTotalImoveisAlugueisRecebidos] = useState<ImoveisLocacaoObj[]>([])


    return (
        <ContextoImoveis.Provider value={{
            totalImoveisLocacao,
            setTotalImoveisLocacao,
            setTotalImoveisCompraVenda,
            totalImoveisCompraVenda,
            totalImoveisAlugueisPagos,
            setTotalImoveisAlugueisPagos,
            totalImoveisAlugueisRecebidos,
            setTotalImoveisAlugueisRecebidos
        }}>
            {children}
        </ContextoImoveis.Provider>
    )
}