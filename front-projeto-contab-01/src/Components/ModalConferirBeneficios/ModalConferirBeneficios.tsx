import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { BotaoGeral } from "../BotaoGeral/BotaoGeral";
import { objAtividadeFinal, objAtividadesAdquitidasType } from "../SegundoPasso/SegundoPasso";
import * as XLSX from 'xlsx';
import xis from "../../assets/images/xisContab.svg"
import { ItemBeneficioCnae } from "../ItemBeneficioCnae/ItemBeneficioCnae";
import { ContextoProduto } from "../../Contextos/ContextoProduto/ContextoProduto";
import { ItemBeneficioNcm } from "../ItemBeneficioNcm/ItemBeneficioNcm";

type ObjInfosType = {
    cnae: string,
    descricao: string,
    anexo: string,
    aliquota: string | number,
}

export type beneficiosPorCnaeType = {
    cnae: string, 
    descricao: string, 
    reducao: number, 
    aliquotaIva: number, 
    manter: boolean, 
    id: number,
    origem: "Servico Adquirido" | "Servico Prestado",
    naTela: boolean
}

export type beneficiosPorNcmType = {
    ncm: string, 
    reducao: number, 
    aliquotaIva: number, 
    manter: boolean, 
    id: number,
    origem: "Produto Adquirido" | "Produto Vendido",
    naTela: boolean,
    descricaoAnexo: string
}

type Props = {
    totalAtividadesPrestadas: objAtividadeFinal[],
    setTotalAtividadesPrestadas: Dispatch<SetStateAction<objAtividadeFinal[]>>,
    totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
    setTotalAtividadesAdquiridas: Dispatch<SetStateAction<objAtividadesAdquitidasType[]>>,
    arrInfosEmpresa: ObjInfosType[],
    setModalBeneficiosAberto: Dispatch<SetStateAction<boolean>>,
    enviarInfosFn: () => void
}

export function ModalConferirBeneficios({setTotalAtividadesAdquiridas,setTotalAtividadesPrestadas,totalAtividadesAdquiridas,totalAtividadesPrestadas, arrInfosEmpresa, setModalBeneficiosAberto, enviarInfosFn}: Props){

    const [beneficiosPorCnae, setBeneficiosPorCnae] = useState<beneficiosPorCnaeType[]>([])
    const [beneficiosPorNcm, setBeneficiosPorNcm] = useState<beneficiosPorNcmType[]>([])

    const {totalProdutosAdquiridos, totalProdutosVendidos} = useContext(ContextoProduto)


    function fecharModal(){
        setModalBeneficiosAberto(false)
    }



/*
    useEffect(() => {

        async function preencherBeneficiosPorCnae(){
            const novoArrBeneficiosCnae: beneficiosPorCnae[] = []

            totalAtividadesPrestadas.filter(item => item.beneficio > 0).forEach(atividadePrestada => {

                // obj com informações mais específicas do cnae, como descricao e anexo
                const objInfoEmpresaAtual = arrInfosEmpresa.filter(elem => elem.cnae == atividadePrestada.cnaePrincipal)

                const objAtual: beneficiosPorCnae = {
                    cnae: atividadePrestada.cnaePrincipal, 
                    descricao: objInfoEmpresaAtual.length > 0 ? objInfoEmpresaAtual[0].descricao : "", 
                    reducao: atividadePrestada.beneficio, 
                    aliquotaIva: (0.28 - (atividadePrestada.beneficio * 0.28)), 
                    manter: true,
                    id: atividadePrestada.id,
                    origem: "Servico Prestado",
                    naTela: atividadePrestada.
                }

                novoArrBeneficiosCnae.push(objAtual)

            })



            // Supondo que o arquivo esteja em "public/data/arquivo.xlsx"
            const response = await fetch('src/xlsx/IMPACTOS RT PILOTO FELIPE.xlsx');
            const arrayBuffer = await response.arrayBuffer();
    
            // Lê o workbook a partir do arrayBuffer
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
            // Se
            const worksheet = workbook.Sheets["CNAE SIMPLES NACIONAL"];
    
            // Converte a planilha para um array de arrays (você pode ajustar conforme necessário)
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });



            totalAtividadesAdquiridas.filter(item => item.beneficio > 0).forEach(async (atividadeAdquirida) => {

                // Encontrar descrições de CNAES  
                let descricaoAtividade: string = ""
                const cnaesIguais = jsonData.filter(elem => elem[0] == atividadeAdquirida.cnaePrincipal)
                // como ainda n to colocando a folha de pagamento (talvez por isso seja interessante fazer essa calculo no back) vou sempre pegar o primeiro
                if(cnaesIguais.length > 0){
                    descricaoAtividade = cnaesIguais[0][1] ? cnaesIguais[0][1] : ""
                }
            
                

                const objAtual: beneficiosPorCnae = {
                    cnae: atividadeAdquirida.cnaePrincipal, 
                    descricao: descricaoAtividade, 
                    reducao: atividadeAdquirida.beneficio, 
                    aliquotaIva: (0.28 - (atividadeAdquirida.beneficio * 0.28)), 
                    manter: true,
                    id: atividadeAdquirida.id,
                    origem: "Servico Adquirido"
                }

                novoArrBeneficiosCnae.push(objAtual)

            })

            setBeneficiosPorCnae(novoArrBeneficiosCnae)
        }


        preencherBeneficiosPorCnae()



    }, [totalAtividadesAdquiridas, totalAtividadesPrestadas])
*/

    useEffect(() => {

        async function setarBeneficiosPorCnaeInical(){

            const novoArrBeneficiosCnae: beneficiosPorCnaeType[] = []
    
            // Supondo que o arquivo esteja em "public/data/arquivo.xlsx"
            const response = await fetch('src/xlsx/IMPACTOS RT PILOTO FELIPE.xlsx');
            const arrayBuffer = await response.arrayBuffer();

            // Lê o workbook a partir do arrayBuffer
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Se
            const worksheet = workbook.Sheets["CNAE SIMPLES NACIONAL"];

            // Converte a planilha para um array de arrays (você pode ajustar conforme necessário)
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            totalAtividadesAdquiridas.forEach(atividadeAdquirida => {
                // Encontrar descrições de CNAES  
                let descricaoAtividade: string = ""
                const cnaesIguais = jsonData.filter(elem => elem[0] == atividadeAdquirida.cnaePrincipal)
                // como ainda n to colocando a folha de pagamento (talvez por isso seja interessante fazer essa calculo no back) vou sempre pegar o primeiro
                if(cnaesIguais.length > 0){
                    // cnaesIguais[0][1] representa a coluna de descrição do cnae encontrado no xlsx
                    descricaoAtividade = cnaesIguais[0][1] ? cnaesIguais[0][1] : ""
                }
            
                

                const objAtual: beneficiosPorCnaeType = {
                    cnae: atividadeAdquirida.cnaePrincipal, 
                    descricao: descricaoAtividade, 
                    reducao: atividadeAdquirida.beneficio, 
                    aliquotaIva: (0.28 - (atividadeAdquirida.beneficio * 0.28)), 
                    manter: true,
                    id: atividadeAdquirida.id,
                    origem: "Servico Adquirido",
                    naTela: atividadeAdquirida.beneficio > 0 
                }

                novoArrBeneficiosCnae.push(objAtual)
            })


            totalAtividadesPrestadas.filter(item => item.beneficio > 0).forEach(atividadePrestada => {

                // obj com informações mais específicas do cnae, como descricao e anexo
                const objInfoEmpresaAtual = arrInfosEmpresa.filter(elem => elem.cnae == atividadePrestada.cnaePrincipal)

                const objAtual: beneficiosPorCnaeType = {
                    cnae: atividadePrestada.cnaePrincipal, 
                    descricao: objInfoEmpresaAtual.length > 0 ? objInfoEmpresaAtual[0].descricao : "", 
                    reducao: atividadePrestada.beneficio, 
                    aliquotaIva: (0.28 - (atividadePrestada.beneficio * 0.28)), 
                    manter: true,
                    id: atividadePrestada.id,
                    origem: "Servico Prestado",
                    naTela: atividadePrestada.beneficio > 0
                }

                novoArrBeneficiosCnae.push(objAtual)

            })

            setBeneficiosPorCnae(novoArrBeneficiosCnae)
        }


        async function setarBeneficiosPorNcmInical(){

            const novoArrBeneficiosNcm: beneficiosPorNcmType[] = []
    

            totalProdutosAdquiridos.forEach(produtoAdquirido => {         

                const objAtual: beneficiosPorNcmType = {
                    ncm: produtoAdquirido.ncm, 
                    reducao: produtoAdquirido.beneficio, 
                    aliquotaIva: (0.28 - (produtoAdquirido.beneficio * 0.28)), 
                    manter: produtoAdquirido.manterBeneficio,
                    id: produtoAdquirido.id,
                    origem: "Produto Adquirido",
                    naTela: produtoAdquirido.beneficio > 0 ,
                    descricaoAnexo:  produtoAdquirido.descricaoAnexo
                }

                novoArrBeneficiosNcm.push(objAtual)
            })


            totalProdutosVendidos.forEach(produtoVendido => {

                const objAtual: beneficiosPorNcmType = {
                    ncm: produtoVendido.ncm,  
                    reducao: produtoVendido.beneficio, 
                    aliquotaIva: (0.28 - (produtoVendido.beneficio * 0.28)), 
                    manter: produtoVendido.manterBeneficio,
                    id: produtoVendido.id,
                    origem: "Produto Vendido",
                    naTela: produtoVendido.beneficio > 0,
                    descricaoAnexo: produtoVendido.descricaoAnexo
                }

                novoArrBeneficiosNcm.push(objAtual)

            })

            setBeneficiosPorNcm(novoArrBeneficiosNcm)
        }
    

        setarBeneficiosPorCnaeInical()
        setarBeneficiosPorNcmInical()

    }, [])




    useEffect(() => {
        console.log("BENEFICIOS POR CNAE")
        console.log(beneficiosPorCnae)

        console.log("total PRESTADAS")
        console.log(totalAtividadesPrestadas)

        console.log("total ADQUIRIDAS")
        console.log(totalAtividadesAdquiridas)

    }, [beneficiosPorCnae, totalAtividadesAdquiridas, totalAtividadesPrestadas])

    return (
        <div className="fixed left-0 top-0 right-0 h-screen bg-black/90 flex justify-center items-center">
            <div className="flex flex-col gap-6 rounded-2xl bg-fundoCinzaEscuro p-12 overflow-y-scroll max-h-[90vh]"> 
                <div className="flex justify-end">
                    <div onClick={fecharModal} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xis} alt="fechar modal login" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col gap-12">
                        {
                            beneficiosPorCnae.length > 0 ? 
                            <div className="border-solid border-2 border-white rounded-2xl">
                                <div className="py-2 px-8 mb-2 text-xl opacity-80">
                                    Beneficios Por CNAE
                                </div>
                                {beneficiosPorCnae.filter(item => item.naTela).map((linhaBeneficio, index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[100px_300px_repeat(3,_100px)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>CNAE</div>
                                                        <div>Descrição</div>
                                                        <div>Redução</div>
                                                        <div>Alíquota IVA</div>
                                                        <div>Manter Benefício</div>
                                                    </div>
                                                }
                            
                                                <ItemBeneficioCnae beneficiosPorCnae={beneficiosPorCnae} index={index} linhaBeneficio={linhaBeneficio} setBeneficiosPorCnae={setBeneficiosPorCnae} setTotalAtividadesAdquiridas={setTotalAtividadesAdquiridas} setTotalAtividadesPrestadas={setTotalAtividadesPrestadas} totalAtividadesAdquiridas={totalAtividadesAdquiridas} totalAtividadesPrestadas={totalAtividadesPrestadas}/>
                                            </>
                                    )
                                })}
                            </div>
                                :
                            <div>Não foi encontrada redução para nenhum CNAE fornecido</div>
                        }
                        {
                            beneficiosPorNcm.length > 0 ? 
                            <div className="border-solid border-2 border-white rounded-2xl">
                                <div className="py-2 px-8 mb-2 text-xl opacity-80">
                                    Beneficios Por NCM
                                </div>
                                {beneficiosPorNcm.filter(item => item.naTela).map((linhaBeneficio, index) => {
                                    return (
                                            <>
                                                {
                                                    index == 0 &&
                                                    <div className="grid grid-cols-[100px_300px_repeat(3,_100px)] gap-10 items-center mb-4 p-4 font-bold">
                                                        <div>NCM</div>
                                                        <div>Descrição</div>
                                                        <div>Redução</div>
                                                        <div>Alíquota IVA</div>
                                                        <div>Manter Benefício</div>
                                                    </div>
                                                }
                            
                                                <ItemBeneficioNcm beneficiosPorNcm={beneficiosPorNcm} index={index} linhaBeneficio={linhaBeneficio} setBeneficiosPorNcm={setBeneficiosPorNcm}/>
                                            </>
                                    )
                                })}
                            </div>
                                :
                            <div>Não foi encontrada redução para nenhum NCM fornecido</div>
                        }
                    </div>
                </div>
                <div>
                    <BotaoGeral onClickFn={enviarInfosFn} principalBranco={true} text="Confirmar e Enviar"/>
                </div>
            </div>
        </div>
    )
}