import { Multipart, MultipartFile} from "@fastify/multipart";
import { XMLParser } from "fast-xml-parser";
import { ProdutoVendidoXmlObj } from "./calcularSimplificadoUseCase";

import ExcelJS from "exceljs"
import { worksheetToJson } from "./beneficiosUseCase";

type ProdutoFinal = Omit<ProdutoVendidoXmlObj, "id">

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

export class XmlProdutosVendidosUseCase{
    constructor(){}

    async execute(parts: AsyncIterable<Multipart>){
        const parser = new XMLParser()

        const resultados: ProdutoFinal[] = []

        // Cada "part" é um XML, isso pq a gente permite que sejam enviados vários XML's de uma vez
        for await (const part of parts) {
            if(part.type === "file" && part.filename.endsWith(".xml")){
                const buffer = await part.toBuffer()
                const conteudo = buffer.toString("utf-8")

                // Parceia para JSON o XML
                const json = parser.parse(conteudo)

                const nfe = json?.nfeProc?.NFe?.infNFe
                // Garante que itens sempre seja um array, mesmo quando só tiver 1 produto (quando tem 1 produto as vezes só vem um objeto)
                const itens = Array.isArray(nfe.det) ? nfe.det : [nfe.det]

                for (const item of itens) {
                    const prod = item.prod
                    const cfop = (prod?.CFOP || 0)
                    if(cfop){
                        /*
                        // Encontrar linha CFOP
                        const filePath = "src/xlsx/BD CFOP.xlsx";

                        // Lê o workbook a partir do arquivo Excel
                        const workbook = XLSX.readFile(filePath)
                        
                        // Selecione a planilha desejada; por exemplo, a primeira
                        const worksheet = workbook.Sheets["CFOP Infos"];
                        
                        // Converter os dados da planilha para um array de objetos
                        // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                        const data = XLSX.utils.sheet_to_json<linhaTabelaCFOP>(worksheet)
                        */
                        const filePath = "src/xlsx/BD CFOP.xlsx";
                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.readFile(filePath);
                        const worksheetCfop = workbook.getWorksheet("CFOP Infos");
                        let linhaCFOPAtual
                        if(worksheetCfop){
                            const data = worksheetToJson<linhaTabelaCFOP>(worksheetCfop)
                            linhaCFOPAtual = data.find(linhaCFOP => linhaCFOP["CFOP"] == cfop)
                        }


                        if(linhaCFOPAtual){
                            // Só é pra calcular pros casos de coluna reforma tributaria no CFOP ser "Sim" e caso o tipo operação seja industrial ou comercial
                            if(linhaCFOPAtual["REFORMA TRIBUTÁRIA"] == "Sim" && (linhaCFOPAtual["TIPO OPERAÇÃO GENÉRICO"] == "INDUSTRIAL" || linhaCFOPAtual["TIPO OPERAÇÃO GENÉRICO"] == "COMERCIAL")){
                                // Se entrou aqui é pq de fato queremos aproveitar esse produto

                                const imposto = item.imposto

                                let tipoOperacao: "Indústria" | "Revenda"
                                switch(linhaCFOPAtual["TIPO OPERAÇÃO GENÉRICO"]){
                                    case "INDUSTRIAL":
                                        tipoOperacao = "Indústria"
                                        break
                                    
                                    case "COMERCIAL":
                                        tipoOperacao = "Revenda"
                                        break
                                }

                                // Aqui não preciso conferir CRT para ver o regime do fornecedor, pq como é produto vendido, o fornecedor é o cliente do meu sistema, logo sempre temos o regiume dele
                                let icmsTag = Object.keys(imposto?.ICMS).find(tag => tag.startsWith("ICMS")) 
                                icmsTag = icmsTag ? icmsTag : "ICMS00"
                                const valorIcms = Number(imposto?.ICMS[icmsTag]?.vICMS || 0)
                                const valorIcmsSt = Number(imposto?.ICMS[icmsTag]?.vICMSST || 0)
                                const valorIcmsDifal = Number(imposto?.ICMSUFDest?.vICMSUFDest || 0) // pode ajustar depois
                                const aliqIcmsPuro = Number(imposto?.ICMS[icmsTag]?.pICMS || 0) - (Number(imposto?.ICMS[icmsTag]?.pICMS || 0) * Number(imposto?.ICMS[icmsTag]?.pRedBC || 0))
                                const aliqIcmsDifal = Number(imposto?.ICMSUFDest?.vBCFCPUFDest || 0) ? (Number(imposto?.ICMSUFDest?.vICMSUFDest || 0) / Number(imposto?.ICMSUFDest?.vBCFCPUFDest || 0)) : 0
                                const aliqIcmsSt = Number(imposto?.ICMS[icmsTag]?.vBCST || 0) ? (Number(imposto?.ICMS[icmsTag]?.vICMSST || 0) / Number(imposto?.ICMS[icmsTag]?.vBCST || 0)) : 0

                                const aliqIcmsTotal = aliqIcmsPuro + aliqIcmsDifal + aliqIcmsSt

                                const valorPis = Number(imposto?.PIS?.PISAliq?.vPIS || 0)
                                const valorCofins = Number(imposto?.COFINS?.COFINSAliq?.vCOFINS || 0)
                                const valorIpi = Number(imposto?.IPI?.IPITrib?.vIPI || 0)
                                const valorOperacao = Number(prod.vProd || 0) + Number(prod.vFrete || 0) + valorIpi + valorIcmsSt

                                const produtoConvertido: ProdutoFinal = {
                                    tipoOperacao,
                                    valorOperacao,
                                    ncm: prod.NCM.toString(),
                                    valorIcms,
                                    aliqIcms: aliqIcmsTotal,
                                    valorIcmsSt,
                                    valorIcmsDifal,
                                    valorPisCofins: valorPis + valorCofins,
                                    valorIpi,
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
        }

        return resultados

    }

}