import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";


export type TipoOperacaoVendidoType = "Revenda" | "Indústria" | "Exportação" | "Revenda - Consumidor final fora do Estado" | "Indústria - Consumidor final fora do Estado"
export const tipoOperacaoVendidoArr: TipoOperacaoVendidoType[] = ["Revenda", "Indústria", "Exportação", "Revenda - Consumidor final fora do Estado", "Indústria - Consumidor final fora do Estado"]

export type ProdutoVendidoManualObj = {
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
    tipoInput: "Manual",
    id: number,
}

export type ProdutoVendidoXmlObj = {
    tipoOperacao: TipoOperacaoVendidoType,
    valorOperacao: number,
    ncm: string,
    valorIcms: number,
    aliqIcms: number,
    valorIcmsSt: number,
    valorIcmsDifal: number,
    valorPisCofins: number,
    valorIpi: number,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "XML",
    id: number,
}


export type ProdutoVendidoObj = ProdutoVendidoManualObj | ProdutoVendidoXmlObj


export type TipoOperacaoAdquiridoType ="Consumo"| "Insumo" | "Alimentação" | "Imobilizado" | "Revenda" | "Depreciação"
export const tipoOperacaoAdquiridoArr: TipoOperacaoAdquiridoType[] = ["Consumo", "Insumo", "Alimentação", "Imobilizado", "Revenda", "Depreciação"]

export type MetodoAdquiridoType = "Por Operação"| "Por CNPJ" 
export const metodoAdquiridoArr: MetodoAdquiridoType[] = ["Por CNPJ", "Por Operação"]

export type RegimesAdquiridoType = "Simples Nacional" | "Lucro Real" | "Lucro Presumido"
export const regimesAdquiridoArr: RegimesAdquiridoType[] = ["Simples Nacional", "Lucro Real", "Lucro Presumido"]

export type SimNaoType = "Sim" | "Não"
export const simNaoArr: SimNaoType[] = ["Sim", "Não"]

export type impostosParametrosFinalType = {iss: number | null, icms: number | null, pisCo: number | null, ipi: number | null}

export type ProdutoAdquiridoManualObj = {
    metodo: MetodoAdquiridoType,
    tipoOperacao: TipoOperacaoAdquiridoType | "",
    valorOperacao: number,
    ncm: string,
    aliquotas: impostosParametrosFinalType
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "Manual",
    id: number,
}

export type custoDespesaXmlType = ("Custo" | "Despesa")

export type ProdutoAdquiridoXmlObj = {
    metodo: MetodoAdquiridoType,
    custoDespesa: custoDespesaXmlType
    valorOperacao: number,
    ncm: string,
    aliquotas: impostosParametrosFinalType,
    valores: impostosParametrosFinalType,
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "XML",
    id: number,
}



export type ProdutoAdquiridoObj = ProdutoAdquiridoManualObj | ProdutoAdquiridoXmlObj


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