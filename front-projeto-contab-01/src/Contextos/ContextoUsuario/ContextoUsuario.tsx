import { createContext, useState, Dispatch, SetStateAction } from "react";


export type ufTypes = "AC"| "AL"| "AP"| "AM"| "BA"| "CE"| "DF"| "ES"| "GO"| "MA"| 
        "MT"| "MS"| "MG"| "PA"| "PB"| "PR"| "PE"| "PI"| "RJ"| "RN"| 
        "RS"| "RO"| "RR"| "SC"| "SP"| "SE"| "TO" | ""

export type empresasType = {
    cnpj: string,
    nome_fantasia?: string,
    razao_social?: string,
    uf?: ufTypes,             
    cnae_principal?: string, 
    cnae_secundario?: string, 
    descricao_atividade_principal?: string, 
    regularidade?: boolean, 
    regime_tributario: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO" ,
    folha: number,
    faturamento_mensal_medio: number,
    cnaes: string[],
    id: string
}

type TiposContextoUsuario = {       
    minhasEmpresas: empresasType[]
    setMinhasEmpresas: Dispatch<SetStateAction<empresasType[]>>
}

export const ContextoUsuario = createContext<TiposContextoUsuario>({
    minhasEmpresas: [],
    setMinhasEmpresas: () => {}
} as TiposContextoUsuario)


export const UsuarioProvider = ({children}: {children: React.ReactNode}) => {

    const [minhasEmpresas, setMinhasEmpresas] = useState<empresasType[]>([])


    return (
        <ContextoUsuario.Provider value={{
            minhasEmpresas,
            setMinhasEmpresas
        }}>
            {children}
        </ContextoUsuario.Provider>
    )
}