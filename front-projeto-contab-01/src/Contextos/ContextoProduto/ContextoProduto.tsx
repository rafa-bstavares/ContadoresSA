import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";


export type TipoOperacaoVendidoType = "Revenda" | "Indústria" | "Exportação" | "Revenda - Consumidor final fora do Estado" | "Indústria - Consumidor final fora do Estado"
export const tipoOperacaoVendidoArr: TipoOperacaoVendidoType[] = ["Revenda", "Indústria", "Exportação", "Revenda - Consumidor final fora do Estado", "Indústria - Consumidor final fora do Estado"]

export type ProdutoVendidoObj = {
    tipoOperacao: TipoOperacaoVendidoType,
    valorOperacao: number,
    ncm: string,
    icms: number,
    icmsSt: number,
    icmsDifal: number,
    pisCofins: number,
    ipi: number,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    id: number,
}


export type TipoOperacaoAdquiridoType ="Consumo"| "Insumo" | "Alimentação" | "Imobilizado" | "Revenda"
export const tipoOperacaoAdquiridoArr: TipoOperacaoAdquiridoType[] = ["Consumo", "Insumo", "Alimentação", "Imobilizado", "Revenda"]

export type MetodoAdquiridoType = "Por Operação"| "Por CNPJ" 
export const metodoAdquiridoArr: MetodoAdquiridoType[] = ["Por CNPJ", "Por Operação"]

export type RegimesAdquiridoType = "Simples Nacional" | "Lucro Real" | "Lucro Presumido"
export const regimesAdquiridoArr: RegimesAdquiridoType[] = ["Simples Nacional", "Lucro Real", "Lucro Presumido"]

export type SimNaoType = "Sim" | "Não"
export const simNaoArr: SimNaoType[] = ["Sim", "Não"]

export type aliquotasParametrosFinalType = {iss: number | null, icms: number | null, pisCo: number | null, ipi: number | null}

export type ProdutoAdquiridoObj = {
    metodo: MetodoAdquiridoType,
    tipoOperacao: TipoOperacaoAdquiridoType | "",
    valorOperacao: number,
    ncm: string,
    aliquotas: aliquotasParametrosFinalType
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    id: number,
}


type TiposContextoProduto = {       
    totalProdutosVendidos: ProdutoVendidoObj[],
    setTotalProdutosVendidos: Dispatch<SetStateAction<ProdutoVendidoObj[]>>,
    totalProdutosAdquiridos: ProdutoAdquiridoObj[],
    setTotalProdutosAdquiridos: Dispatch<SetStateAction<ProdutoAdquiridoObj[]>>,
}

export const ContextoProduto = createContext<TiposContextoProduto>({
    totalProdutosVendidos: [],
    setTotalProdutosVendidos: () => {},
    totalProdutosAdquiridos: [],
    setTotalProdutosAdquiridos: () => {},
} as TiposContextoProduto)


export const ProdutoProvider = ({children}: {children: React.ReactNode}) => {

    const [totalProdutosVendidos, setTotalProdutosVendidos] = useState<ProdutoVendidoObj[]>([])
    const [totalProdutosAdquiridos, setTotalProdutosAdquiridos] = useState<ProdutoAdquiridoObj[]>([])

    return (
        <ContextoProduto.Provider value={{
            totalProdutosVendidos,
            setTotalProdutosVendidos,
            totalProdutosAdquiridos,
            setTotalProdutosAdquiridos
        }}>
            {children}
        </ContextoProduto.Provider>
    )
}