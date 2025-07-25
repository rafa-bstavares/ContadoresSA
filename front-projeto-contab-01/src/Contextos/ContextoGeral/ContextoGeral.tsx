import { createContext, useState, Dispatch, SetStateAction } from "react";


export type tipoObjEmpresa = {
    tipoUsuario: "Empresa",
    cnpj: string,
    meuRegime: "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "",
    folha: number,
    faturamentoMensalMedio: number,
    cnaes: string[]
}

export type tipoObjPessoaFisica = {
    tipoUsuario: "Pessoa Física",
    cpf: string
}

export type TipoObjMinhaEmpresaOuPessoaAtual = tipoObjEmpresa | tipoObjPessoaFisica

type TiposContextoGeral = {       
    objMinhaEmpresaOuPessoaAtual: TipoObjMinhaEmpresaOuPessoaAtual,
    setObjMinhaEmpresaOuPessoaAtual: Dispatch<SetStateAction<TipoObjMinhaEmpresaOuPessoaAtual>>
    soImoveis: boolean,
    setSoImoveis: Dispatch<SetStateAction<boolean>>,
    passo1: boolean,
    setPasso1: Dispatch<SetStateAction<boolean>>,
    passo2: boolean,
    setPasso2: Dispatch<SetStateAction<boolean>>,
    passo3: boolean,
    setPasso3: Dispatch<SetStateAction<boolean>>
}

export const ContextoGeral = createContext<TiposContextoGeral>({
    objMinhaEmpresaOuPessoaAtual: {
        tipoUsuario: "Empresa",
        meuRegime: "",
        cnpj: "",
        folha: 0,
        faturamentoMensalMedio: 0,
        cnaes: []
    },
    setObjMinhaEmpresaOuPessoaAtual: () => {},
    soImoveis: false,
    setSoImoveis: () => {},
    passo1: true,
    setPasso1: () => {},
    passo2: false,
    setPasso2: () => {},
    passo3: false,
    setPasso3: () => {}
} as TiposContextoGeral)


export const GeralProvider = ({children}: {children: React.ReactNode}) => {

    const [soImoveis, setSoImoveis] = useState<boolean>(false)
    // Informações da empresa (ou cpf, caso imoveis) que ele está usando para fazer os calculos naquele momento
    const [objMinhaEmpresaOuPessoaAtual, setObjMinhaEmpresaOuPessoaAtual] = useState<TipoObjMinhaEmpresaOuPessoaAtual>({tipoUsuario: "Empresa", meuRegime: "", cnpj: "", folha: 0, faturamentoMensalMedio: 0, cnaes: []})
    const [passo1, setPasso1] = useState<boolean>(true)
    const [passo2, setPasso2] = useState<boolean>(false)
    const [passo3, setPasso3] = useState<boolean>(false)

    return (
        <ContextoGeral.Provider value={{
            objMinhaEmpresaOuPessoaAtual,
            setObjMinhaEmpresaOuPessoaAtual,
            soImoveis,
            setSoImoveis,
            passo1,
            passo2,
            passo3,
            setPasso1,
            setPasso2,
            setPasso3
        }}>
            {children}
        </ContextoGeral.Provider>
    )
}