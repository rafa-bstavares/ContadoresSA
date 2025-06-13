import { accessSpreadsheet } from "./buscaDadosPlanilha";

export async function descricaoPorNcm(){
    const sheetsData = await accessSpreadsheet()

    const ncmAtual = "23021234"
    
    const arrAliq = sheetsData?.find(item => {
        const ncmItem = item[1]
        const tamanhoNcm = ncmItem.length
        return ncmAtual.slice(0, tamanhoNcm) == ncmItem
    })
    
    console.log(arrAliq)


}