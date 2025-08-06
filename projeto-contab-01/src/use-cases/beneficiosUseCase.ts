import { objAtividadeFinal, objAtividadesAdquitidasType, ProdutoAdquiridoObj, ProdutoVendidoObj } from "./calcularSimplificadoUseCase"

import { linhaTabelaNcmType } from "./calcularSimplificadoUseCase";
import ExcelJS from "exceljs"



interface beneficiosBodySchema{
    beneficiosPorCnae: {
        totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
        totalAtividadesPrestadas: objAtividadeFinal[]
    },
    beneficiosPorNcm: {
        totalProdutosVendidos: ProdutoVendidoObj[],
        totalProdutosAdquiridos: ProdutoAdquiridoObj[]
    }
}

type beneficiosPorNcmType = {
  [K in keyof beneficiosBodySchema["beneficiosPorNcm"]]: (
    beneficiosBodySchema["beneficiosPorNcm"][K] & { beneficio?: number }[]
  );
};

type beneficiosPorCnaeType = {
  [K in keyof beneficiosBodySchema["beneficiosPorCnae"]]: (
    beneficiosBodySchema["beneficiosPorCnae"][K] & { beneficio?: number }[]
  );
};

interface ExcelRow {
  "Subclasse": string;
  "Descrição Atividades": string;
  "Redução de"?: string;
  "Base Legal"?: string;
  "NBS?": string;
  "Descrição NBS"?: string;
}


export function worksheetToJson<T>(worksheet: ExcelJS.Worksheet): T[] {
    const data: T[] = [];
    const headers: string[] = [];
    
    // Pega headers da primeira linha
    const firstRow = worksheet.getRow(1);
    firstRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.text;
    });
    
    // Processa as outras linhas
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const rowData: any = {};
        
        row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) {
                rowData[header] = cell.value;
            }
        });
        
        if (Object.keys(rowData).length > 0) {
            data.push(rowData as T);
        }
    }
    
    return data;
}


export class BeneficiosUseCase{

    constructor(){}

    async execute(data: beneficiosBodySchema){

        // O único pré requisito é que todos os arrays dentro de beneficiosPorCnae, tevem conter objetos com uma propriedade cnae e outra id
        // O único pré requisito é que todos os arrays dentro de beneficiosPorNcm, tevem conter objetos com uma propriedade ncm e outra id

        const beneficiosPorCnae = data.beneficiosPorCnae
        const beneficiosPorNcm = data.beneficiosPorNcm

        let respostaFinal: {
                    beneficiosPorCnae: beneficiosBodySchema["beneficiosPorCnae"],
                    beneficiosPorNcm: beneficiosPorNcmType
                } = {
                beneficiosPorCnae: {} as beneficiosPorCnaeType,
                beneficiosPorNcm: {} as beneficiosPorNcmType
            }


        const filePath = "src/xlsx/BD BENEFÍCIOS.xlsx";
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheetCnae = workbook.getWorksheet("BENEFICIOS IVA-CNAE");
        const worksheetNcm = workbook.getWorksheet("BENEFICIO IVA-NCM");          


        for(const nomeArrBeneficioNcmAtual of Object.keys(beneficiosPorNcm) as (keyof typeof beneficiosPorNcm)[]){
            const arrBeneficioAtual = beneficiosPorNcm[nomeArrBeneficioNcmAtual];
            const arrBeneficioAtualClone = [...arrBeneficioAtual];

            console.log(arrBeneficioAtual)


            let indexInput = 0
            for(const linhaInput of arrBeneficioAtual){

                const ncmInputAtualStr = linhaInput.ncm.toString()

                // Encontrar redução NCM   
                /*
                // Lê o workbook a partir do arquivo Excel
                const workbook = XLSX.readFile(filePath)
                
                // Selecione a planilha desejada; por exemplo, a primeira
                const worksheet = workbook.Sheets["BENEFICIO IVA-NCM"];
                
                // Converter os dados da planilha para um array de objetos
                // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                const data = XLSX.utils.sheet_to_json<linhaTabelaNcmType>(worksheet)
                */

                let arrNcms: {ncmLinha: string, reducao: number, descricaoAnexo: string}[] = []

                if(worksheetNcm){
                    const data = worksheetToJson<linhaTabelaNcmType>(worksheetNcm)
                    console.log("DATA FINAL")
                    console.log(data)
                    data.forEach((linhaTabelaNcm) => {
                        const ncmLinhaTabela = linhaTabelaNcm.NCM
                        let tamanhoMinNcm = 0

                        const tamanhoNcmLinhaAtual = ncmLinhaTabela.length

                        // conferir se o NCM da linha atual da tabela está contido no NCM input
                        if(ncmInputAtualStr.slice(0, tamanhoNcmLinhaAtual) == ncmLinhaTabela){
                            if(tamanhoNcmLinhaAtual >= tamanhoMinNcm){
                                arrNcms.push({ncmLinha: ncmLinhaTabela, reducao: linhaTabelaNcm["REDUÇÃO BASE"], descricaoAnexo: linhaTabelaNcm["DESCRIÇÃO ANEXO"]})
                            }
                        }

                    })
                }


                let reducaoIva = 0
                let descricaoAnexoFinal = ""

                if(arrNcms.length > 0){
                    let maiorReducao = 0
                    arrNcms.forEach(item => {
                        if(item.reducao > maiorReducao){
                            maiorReducao = item.reducao
                            descricaoAnexoFinal = item.descricaoAnexo
                        }
                    })

                    reducaoIva = maiorReducao

                }


                arrBeneficioAtualClone[indexInput].beneficio = reducaoIva
                arrBeneficioAtualClone[indexInput].descricaoAnexo = descricaoAnexoFinal

                indexInput++

            }


            respostaFinal.beneficiosPorNcm[nomeArrBeneficioNcmAtual] = arrBeneficioAtualClone as any;

        }


        for(const nomeArrBeneficioCnaeAtual of Object.keys(beneficiosPorCnae) as (keyof typeof beneficiosPorCnae)[]){
            const arrBeneficioAtual = beneficiosPorCnae[nomeArrBeneficioCnaeAtual];
            const arrBeneficioAtualClone = [...arrBeneficioAtual];

            console.log(arrBeneficioAtual)

            let indexInput = 0
            for(const linhaInput of arrBeneficioAtual){

                /*
                const filePath = "src/xlsx/BD BENEFÍCIOS.xlsx";

                // Lê o workbook a partir do arquivo Excel
                const workbook = XLSX.readFile(filePath)
            
                // Selecione a planilha desejada; por exemplo, a primeira
                const worksheet = workbook.Sheets["BENEFICIOS IVA-CNAE"];
            
                // Converter os dados da planilha para um array de objetos
                // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet)
                */


                if(worksheetCnae){
                    const data = worksheetToJson<ExcelRow>(worksheetCnae)
                    console.log("Data")
                    console.log(data)
                    const linhaCnaeBeneficios = data.find(elem => elem["Subclasse"] == linhaInput.cnaePrincipal.toString())

                    let reducaoIva = 0

                    if(linhaCnaeBeneficios !== undefined){
                        // Caso tenha achado benefício, redução já vem pronto pra conta, exemplo 60% vem 0.6
                        const reducao = linhaCnaeBeneficios["Redução de"]
                        if(reducao !== undefined){
                        const reducaoNum = Number(reducao)
                        if(reducaoNum){
                            reducaoIva = reducaoNum
                        }
                        }else{
                        console.log("CNAE não tem redução IVA")
                        }
                    }else{
                    console.log("nao achou beneficio listado")
                    }

                    arrBeneficioAtualClone[indexInput].beneficio = reducaoIva 
                }

                indexInput++

            }

            respostaFinal.beneficiosPorCnae[nomeArrBeneficioCnaeAtual] = arrBeneficioAtualClone as
             any;
        }



        console.log("RESPOSTA FINAL")
        console.log("Total produtos adquiridos")
        console.log(respostaFinal.beneficiosPorNcm.totalProdutosAdquiridos)
        console.log("Total produtos vendidos")
        console.log(respostaFinal.beneficiosPorNcm.totalProdutosVendidos)
        console.log("Total servicos tomados")
        console.log(respostaFinal.beneficiosPorCnae.totalAtividadesAdquiridas)
        console.log("Total Serviços Prestados")
        console.log(respostaFinal.beneficiosPorCnae.totalAtividadesPrestadas)


        return respostaFinal
    }

}