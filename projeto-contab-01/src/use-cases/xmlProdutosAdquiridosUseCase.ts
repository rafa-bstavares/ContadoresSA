import { Multipart, MultipartFile} from "@fastify/multipart";
import { XMLParser } from "fast-xml-parser";
import { custoDespesaType, MetodoAdquiridoType, ProdutoAdquiridoXmlObj, ProdutoVendidoXmlObj } from "./calcularSimplificadoUseCase";
import * as XLSX from 'xlsx';

type ProdutoFinal = Omit<ProdutoAdquiridoXmlObj, "id">

type linhaTabelaCFOP = {
    "CFOP": number,
    "Descrição CFOP": string,
    "REFORMA TRIBUTÁRIA": string,
    "ZFM": string,
    "TIPO OPERAÇÃO GENÉRICO": string,
    "DESCRIÇÃO RESUMIDA CFOP": string,
    "TIPO OPERAÇÃO DETALHADA": string,
    "ENTRADA/SAÍDA": string
}

export class XmlProdutosAdquiridosUseCase{
    constructor(){}

    async execute(parts: AsyncIterable<Multipart>){
        const parser = new XMLParser()

        const resultados: ProdutoFinal[] = []

        // Cada "part" é um XML, isso pq a gente permite que sejam enviados vários XML's de uma vez

        let custoDespesa: custoDespesaType = "Custo"
        const arquivos: MultipartFile[] = []

        for await (const part of parts) {
            if (part.type === "field" && part.fieldname === "custoDespesa") {
                custoDespesa = part.value as custoDespesaType;
                console.log("ENTROU NO IF CUSTO DESPESA");
            }

            if (part.type === "file" && part.filename.endsWith(".xml")) {
                arquivos.push(part);
            }
        }

        console.log("CUSTO DESPESA")
        console.log(custoDespesa)

        for await(const arquivo of arquivos){
            const buffer = await arquivo.toBuffer()
            const conteudo = buffer.toString("utf-8")

            // Parceia para JSON o XML
            const json = parser.parse(conteudo)

            const nfe = json?.nfeProc?.NFe?.infNFe

            // Garante que itens sempre seja um array, mesmo quando só tiver 1 produto (quando tem 1 produto as vezes só vem um objeto)
            const itens = Array.isArray(nfe.det) ? nfe.det : [nfe.det]

            // Encontrando CNPJ Fornecedor
            let cnpjFornecedor = nfe?.emit?.CNPJ.toString()
            let metodo: MetodoAdquiridoType = "Por CNPJ"
            console.log("CNPJ FORNECEDOR")
            console.log(cnpjFornecedor)
            if(cnpjFornecedor){
                console.log("length do cnpj")
                console.log(cnpjFornecedor.length)
                if(cnpjFornecedor.length == 14){
                    cnpjFornecedor = cnpjFornecedor
                    console.log("entrou no length 14, deu certo")
                    console.log(cnpjFornecedor)
                }else{
                    cnpjFornecedor = ""
                    metodo = "Por Operação"
                }
            }else{
                cnpjFornecedor = ""
                metodo = "Por Operação"
            }

            // Encontrando regime tributário fornecedor
            let regimeFornecedor = "Lucro Real"
            let crt = nfe?.emit?.CRT
            switch(crt){
                case 1:
                    regimeFornecedor = "Simples Nacional"
                    break
                case 2: 
                    regimeFornecedor = "Simples Nacional"
                    break
                case 3:
                    if(itens.length > 0){
                        const valorPrimeiroPis = itens[0].imposto?.PIS?.PISAliq?.pPIS ? itens[0].imposto?.PIS?.PISAliq?.pPIS : 0
                        const valorPrimeiroCofins = itens[0].imposto?.COFINS?.COFINSAliq?.pCOFINS ? itens[0].imposto?.COFINS?.COFINSAliq?.pCOFINS : 0
                        const valorPrimeiroPisCofins = valorPrimeiroCofins + valorPrimeiroPis
                        if(valorPrimeiroPisCofins == 9.25){
                            regimeFornecedor = "Lucro Real"
                        }else if(valorPrimeiroPisCofins == 3.65){
                            regimeFornecedor == "Lucro Presumido"
                        }else{
                            regimeFornecedor == "Lucro Real"
                        }
                    }

            }

            for (const item of itens) {
                const prod = item.prod
                const cfop = (prod?.CFOP || 0)
                if(cfop){

                    // Encontrar linha CFOP
                    const filePath = "src/xlsx/BD CFOP.xlsx";

                    // Lê o workbook a partir do arquivo Excel
                    const workbook = XLSX.readFile(filePath)
                    
                    // Selecione a planilha desejada; por exemplo, a primeira
                    const worksheet = workbook.Sheets["CFOP Infos"];
                    
                    // Converter os dados da planilha para um array de objetos
                    // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                    const data = XLSX.utils.sheet_to_json<linhaTabelaCFOP>(worksheet)

                    const linhaCFOPAtual = data.find(linhaCFOP => linhaCFOP["CFOP"] == cfop)

                    if(linhaCFOPAtual){
                        // Só é pra calcular pros casos de coluna reforma tributaria no CFOP ser "Sim" e caso o tipo operação seja industrial ou comercial
                        if(linhaCFOPAtual["REFORMA TRIBUTÁRIA"] == "Sim" && (linhaCFOPAtual["TIPO OPERAÇÃO GENÉRICO"] == "INDUSTRIAL" || linhaCFOPAtual["TIPO OPERAÇÃO GENÉRICO"] == "COMERCIAL")){
                            const imposto = item.imposto

                            // Conferir se é industrial ou não (se cfop terminar com 101 é industrial)
                            let fornecedorIndustrial
                            if(cfop.toString().slice(-3) == "101"){
                                fornecedorIndustrial = true
                            }else{
                                fornecedorIndustrial = false
                            }

                            // Aqui não preciso conferir CRT para ver o regime do fornecedor, pq como é produto vendido, o fornecedor é o cliente do meu sistema, logo sempre temos o regiume dele
                            let icmsTag = Object.keys(imposto?.ICMS).find(tag => tag.startsWith("ICMS")) 
                            icmsTag = icmsTag ? icmsTag : "ICMS00"
                            const valorIcms = Number(imposto?.ICMS[icmsTag]?.vICMS || 0)
                            const valorIcmsSt = Number(imposto?.ICMS[icmsTag]?.vICMSST || 0)
                            const valorIcmsDifal = Number(imposto?.ICMSUFDest?.vICMSUFDest || 0) 
                            const aliqIcmsPuro = Number(imposto?.ICMS[icmsTag]?.pICMS || 0) - (Number(imposto?.ICMS[icmsTag]?.pICMS || 0) * Number(imposto?.ICMS[icmsTag]?.pRedBC || 0))
                            const aliqIcmsDifal = Number(imposto?.ICMSUFDest?.vICMSUFDest || 0) / Number(imposto?.ICMSUFDest?.vBCFCPUFDest || 0)
                            const aliqIcmsSt = Number(imposto?.ICMS[icmsTag]?.vICMSST || 0) / Number(imposto?.ICMS[icmsTag]?.vBCST || 0)

                            const aliqIcmsTotal = aliqIcmsPuro + aliqIcmsDifal + aliqIcmsSt

                            const valorPis = Number(imposto?.PIS?.PISAliq?.vPIS || 0)
                            const valorCofins = Number(imposto?.COFINS?.COFINSAliq?.vCOFINS || 0)
                            const valorIpi = Number(imposto?.IPI?.IPITrib?.vIPI || 0)
                            const valorOperacao = Number(prod.vProd || 0) + Number(prod.vFrete || 0) + valorIpi + valorIcmsSt

                            console.log("cnpj fornecedor antes de preencher")
                            console.log(cnpjFornecedor)

                            const produtoConvertido: ProdutoFinal = {
                                custoDespesa,
                                fornecedorIndustrial: fornecedorIndustrial, 
                                regimeTributarioOutro: regimeFornecedor, 
                                cnpjFornecedor,
                                aliquotas: {icms: aliqIcmsTotal, ipi: null, iss: null, pisCo: null},
                                valores: {icms: valorIcms, ipi: valorIpi, iss: null, pisCo: valorCofins + valorPis},
                                creditoIcms: false,
                                creditoIpi: false,
                                creditoPisCofins: false,
                                metodo,
                                valorOperacao,
                                ncm: prod.NCM.toString(),
                                beneficio: 0,
                                manterBeneficio: true,
                                descricaoAnexo: "",
                                tipoInput: "XML"
                            };

                            resultados.push(produtoConvertido)
                        }
                    }  
                }
            }
        }

        return resultados

    }

}