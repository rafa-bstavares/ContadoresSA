import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";

export type MoveisLocacaoObj = {
    valorLocacao: number,
    tipoAluguel: "Aluguel pago" | "Aluguel recebido" // por aqui vamos saber quem é o locador e locatário
    tipoOutraParte: "Pessoa física" | "Pessoa jurídica",
    prazoDeterminado: boolean,
    creditaPisCofins: boolean,
    comOperador: boolean,
    valorMaoObra: number,
    regimeOutro: "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica",
    id: number
}


type TiposContextoMoveis = {       
    totalMoveisLocacao: MoveisLocacaoObj[],
    setTotalMoveisLocacao: Dispatch<SetStateAction<MoveisLocacaoObj[]>>,
    totalMoveisAlugueisPagos : MoveisLocacaoObj[],
    setTotalMoveisAlugueisPagos: Dispatch<SetStateAction<MoveisLocacaoObj[]>>,
    totalMoveisAlugueisRecebidos: MoveisLocacaoObj[],
    setTotalMoveisAlugueisRecebidos: Dispatch<SetStateAction<MoveisLocacaoObj[]>>
}

export const ContextoMoveis = createContext<TiposContextoMoveis>({
    totalMoveisLocacao: [],
    setTotalMoveisLocacao: () => {},
    totalMoveisAlugueisPagos : [],
    setTotalMoveisAlugueisPagos: () => {},
    totalMoveisAlugueisRecebidos: [],
    setTotalMoveisAlugueisRecebidos: () => {}
} as TiposContextoMoveis)


export const MoveisProvider = ({children}: {children: React.ReactNode}) => {

    const [totalMoveisLocacao, setTotalMoveisLocacao] = useState<MoveisLocacaoObj[]>([])
    const [totalMoveisAlugueisPagos, setTotalMoveisAlugueisPagos] = useState<MoveisLocacaoObj[]>([])
    const [totalMoveisAlugueisRecebidos, setTotalMoveisAlugueisRecebidos] = useState<MoveisLocacaoObj[]>([])

    return (
        <ContextoMoveis.Provider value={{
            totalMoveisLocacao,
            setTotalMoveisLocacao,
            setTotalMoveisAlugueisPagos,
            setTotalMoveisAlugueisRecebidos,
            totalMoveisAlugueisPagos,
            totalMoveisAlugueisRecebidos
        }}>
            {children}
        </ContextoMoveis.Provider>
    )
}