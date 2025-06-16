import { createContext, useState, Dispatch, SetStateAction } from "react";


type objAliquotasIva = {
    ibs: string,
    cbs: string,
}

type objAliquotas = {iss: string, icms: string, pisCo: string, ipi: string}

type objAreas = {
    industrial: objAliquotas,
    servicos: objAliquotas,
    comercial: objAliquotas,
    locacao: objAliquotas
}


type TiposContextoParametrosOpcionais = {       
    aliquotasIva: objAliquotasIva,
    setAliquotasIva: Dispatch<SetStateAction<objAliquotasIva>>,

    tabelaSimplesNacional: objAreas,
    setTabelaSimplesNacional: Dispatch<SetStateAction<objAreas>>,

    tabelaLucroReal: objAreas,
    setTabelaLucroReal: Dispatch<SetStateAction<objAreas>>,

    tabelaLucroPresumido: objAreas,
    setTabelaLucroPresumido: Dispatch<SetStateAction<objAreas>>,
}

const objInicialSimplesNacional: objAreas = {
        industrial: {icms: "4,8", ipi: "0,5", iss: "0", pisCo: "2,2"},
        servicos: {icms: "0", ipi: "0", iss: "5", pisCo: "3,3"},
        comercial: {icms: "4,8", ipi: "0", iss: "0", pisCo: "2,2"},
        locacao: {icms: "0", ipi: "0", iss: "0", pisCo: "3,3"},
    }

const objInicialLucroReal: objAreas = {
        industrial: {icms: "0", ipi: "0", iss: "0", pisCo: "9,25"},
        servicos: {icms: "0", ipi: "0", iss: "5", pisCo: "9,25"},
        comercial: {icms: "0", ipi: "0", iss: "0", pisCo: "9,25"},
        locacao: {icms: "0", ipi: "0", iss: "0", pisCo: "9,25"},
    }

const objInicialLucroPresumido: objAreas = {
        industrial: {icms: "0", ipi: "0", iss: "0", pisCo: "3,65"},
        servicos: {icms: "0", ipi: "0", iss: "5", pisCo: "3,65"},
        comercial: {icms: "0", ipi: "0", iss: "0", pisCo: "3,65"},
        locacao: {icms: "0", ipi: "0", iss: "0", pisCo: "3,65"},
    }

export const ContextoParametrosOpcionais = createContext<TiposContextoParametrosOpcionais>({

    aliquotasIva: {ibs: "18,7", cbs: "9,3"},
    setAliquotasIva: () => {},

    tabelaSimplesNacional: objInicialSimplesNacional,
    setTabelaSimplesNacional: () => {},

    tabelaLucroReal: objInicialLucroReal,
    setTabelaLucroReal: () => {},

    tabelaLucroPresumido: objInicialLucroPresumido,
    setTabelaLucroPresumido: () => {},

} as TiposContextoParametrosOpcionais)


export const ParametrosOpcionaisProvider = ({children}: {children: React.ReactNode}) => {

    const [aliquotasIva, setAliquotasIva] = useState<objAliquotasIva>({ibs: "18,7", cbs: "9,3"})

    const [tabelaSimplesNacional, setTabelaSimplesNacional] = useState<objAreas>(objInicialSimplesNacional)
    const [tabelaLucroReal, setTabelaLucroReal] = useState<objAreas>(objInicialLucroReal)
    const [tabelaLucroPresumido, setTabelaLucroPresumido] = useState<objAreas>(objInicialLucroPresumido)



    return (
        <ContextoParametrosOpcionais.Provider value={{
            aliquotasIva,
            setAliquotasIva,
            tabelaSimplesNacional,
            setTabelaSimplesNacional,
            tabelaLucroReal,
            setTabelaLucroReal,
            tabelaLucroPresumido,
            setTabelaLucroPresumido
        }}>
            {children}
        </ContextoParametrosOpcionais.Provider>
    )
}