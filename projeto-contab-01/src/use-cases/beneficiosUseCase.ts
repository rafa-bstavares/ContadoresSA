import { objAtividadeFinal, objAtividadesAdquitidasType, ProdutoAdquiridoObj, ProdutoVendidoObj } from "./calcularSimplificadoUseCase"
import * as XLSX from 'xlsx';
import { linhaTabelaNcmType } from "./calcularSimplificadoUseCase";



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

        for(const nomeArrBeneficioNcmAtual of Object.keys(beneficiosPorNcm) as (keyof typeof beneficiosPorNcm)[]){
            const arrBeneficioAtual = beneficiosPorNcm[nomeArrBeneficioNcmAtual];
            const arrBeneficioAtualClone = [...arrBeneficioAtual];

            console.log(arrBeneficioAtual)



            arrBeneficioAtual.forEach((linhaInput, indexInput) => {

                const ncmInputAtualStr = linhaInput.ncm.toString()

                // Encontrar redução NCM   
                const filePath = "src/xlsx/BD BENEFÍCIOS.xlsx";

                // Lê o workbook a partir do arquivo Excel
                const workbook = XLSX.readFile(filePath)
                
                // Selecione a planilha desejada; por exemplo, a primeira
                const worksheet = workbook.Sheets["BENEFICIO IVA-NCM"];
                
                // Converter os dados da planilha para um array de objetos
                // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                const data = XLSX.utils.sheet_to_json<linhaTabelaNcmType>(worksheet)


                let arrNcms: {ncmLinha: string, reducao: number, descricaoAnexo: string}[] = []

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


            })


            respostaFinal.beneficiosPorNcm[nomeArrBeneficioNcmAtual] = arrBeneficioAtualClone as any;

        }


        for(const nomeArrBeneficioCnaeAtual of Object.keys(beneficiosPorCnae) as (keyof typeof beneficiosPorCnae)[]){
            const arrBeneficioAtual = beneficiosPorCnae[nomeArrBeneficioCnaeAtual];
            const arrBeneficioAtualClone = [...arrBeneficioAtual];

            console.log(arrBeneficioAtual)

            arrBeneficioAtual.forEach((linhaInput, indexInput) => {

        
                const filePath = "src/xlsx/BD BENEFÍCIOS.xlsx";

                // Lê o workbook a partir do arquivo Excel
                const workbook = XLSX.readFile(filePath)
            
                // Selecione a planilha desejada; por exemplo, a primeira
                const worksheet = workbook.Sheets["BENEFICIOS IVA-CNAE"];
            
                // Converter os dados da planilha para um array de objetos
                // Se sua planilha possuir cabeçalhos, você pode omitir o header: 1
                const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet)
            

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


            })

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