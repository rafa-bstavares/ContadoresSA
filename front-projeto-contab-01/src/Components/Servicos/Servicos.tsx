import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import * as XLSX from 'xlsx';
import { objAtividadeFinal } from "../SegundoPasso/SegundoPasso";
import { objAtividadesAdquitidasType } from "../SegundoPasso/SegundoPasso";
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral";
import iconeServicos from "../../assets/images/servicosBotaoBgBranco100.svg"
import SetaNao from "../../Components/SetaNao/SetaNao"
import { objIsCheckedType } from "../SegundoPasso/SegundoPasso";

type objCnaesDesc = {
  cnae: string,
  descricao: string
}

type Props = {
    cnaes: string[],
    arrInfosEmpresa: ObjInfosType[],
    setArrInfosEmpresa: Dispatch<SetStateAction<ObjInfosType[]>>,
    totalAtividadesPrestadas: objAtividadeFinal[],
    setTotalAtividadesPrestadas: Dispatch<SetStateAction<objAtividadeFinal[]>>,
    totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
    setTotalAtividadesAdquiridas: Dispatch<SetStateAction<objAtividadesAdquitidasType[]>>,
    objIsChecked: objIsCheckedType,
    setObjIsChecked: Dispatch<SetStateAction<objIsCheckedType>>
}

type ObjInfosType = {
    cnae: string,
    descricao: string,
    anexo: string,
    aliquota: string | number,
}


export default function Servicos({cnaes, arrInfosEmpresa, setArrInfosEmpresa, totalAtividadesPrestadas, setTotalAtividadesPrestadas, setTotalAtividadesAdquiridas, totalAtividadesAdquiridas, objIsChecked, setObjIsChecked}: Props){

    const [data, setData] = useState<any[][]>([]);
    const {soImoveis, passo1} = useContext(ContextoGeral)



    async function buscarAtividadesPorCnae(){
        console.log("BUSCAR ATIVIDADES POR CNAE ACIONADA DE NOVO")
        try {
            // Supondo que o arquivo esteja em "public/data/arquivo.xlsx"
            const response = await fetch('src/xlsx/IMPACTOS RT PILOTO FELIPE.xlsx');
            const arrayBuffer = await response.arrayBuffer();
    
            // Lê o workbook a partir do arrayBuffer
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
            // Se
            const worksheet = workbook.Sheets["CNAE SIMPLES NACIONAL"];
    
            // Converte a planilha para um array de arrays (você pode ajustar conforme necessário)
            const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const novoArrInfos = [...arrInfosEmpresa]
            
            cnaes.forEach(item => {
                const cnaesIguais = jsonData.filter(elem => elem[0] == item)
                // como ainda n to colocando a folha de pagamento (talvez por isso seja interessante fazer essa calculo no back) vou sempre pegar o primeiro
                if(cnaesIguais.length > 0){
                  const arrCnaeCorreto = cnaesIguais[0]
                  const objAtual: ObjInfosType = {cnae: item, descricao: arrCnaeCorreto[1], anexo: arrCnaeCorreto[2], aliquota: arrCnaeCorreto[4]}
                  novoArrInfos.push(objAtual)
                }
            })

            setArrInfosEmpresa(novoArrInfos)

          } catch (error) {
            console.error('Erro ao carregar o arquivo Excel:', error);
          }
    }

    useEffect(() => {
        console.log("arr infos empresa")
        console.log(arrInfosEmpresa)
    }, [arrInfosEmpresa])

    useEffect(() => {
        buscarAtividadesPorCnae()
    }, [cnaes])

    useEffect(() => {
        console.log(data)
    }, [data])


  function handleToggle(){
    if(objIsChecked.isCheckedServicos){
        const objIsCheckedClone = {...objIsChecked}
        objIsCheckedClone.isCheckedServicos = false
        setObjIsChecked(objIsCheckedClone)

    }else{
      // se ele n está aberto, quero abrir, logo tenho q abrir ele e fechar todos os outros
        const objIsCheckedClone = {...objIsChecked}
        objIsCheckedClone.isCheckedServicos = true
        objIsCheckedClone.isCheckedImoveis = false
        objIsCheckedClone.isCheckedMoveis = false
        objIsCheckedClone.isCheckedProdutos = false
        setObjIsChecked(objIsCheckedClone)

    }
  };


    return (
        <div className='flex flex-col justify-end px-6 py-4 rounded-xl shadow-lg cursor-pointer bg-contain bg-fundoCinzaEscuro aspect-[9/7] h-[29vh] border-2 border-solid border-white text-white' onClick={soImoveis? () => {} : handleToggle}>
            <div className='flex flex-col gap-2  justify-between h-full'>     
                <div className='flex flex-col gap-2'>
                    {/*<label  className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                        type="checkbox"
                        className="sr-only"
                        checked={isCheckedServicos}
                        onChange={handleToggle} //soImoveis || passo1 ? () => {} : handleToggle
                        />
                        <div className={`w-14 h-6 ${isCheckedServicos ? "bg-blue-500" : "bg-gray-600"} rounded-full shadow-inner`}></div>
                        <div
                        className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                            isCheckedServicos ? 'translate-x-8 bg-green-500' : 'translate-x-0'
                        }`}
                        ></div>
                    </div>
                    </label>*/}
                    <div className='text-4xl'>
                        Serviços
                    </div>
                    <div className='opacity-70'>
                        Informe os serviços prestados e tomados no mês para analisar os impactos da Reforma nas alíquotas, créditos e regime aplicável.
                    </div>
                </div>
                <div className='self-end'>
                    <SetaNao condicaoNao={objIsChecked.isCheckedServicos}  />
                </div>
            </div>

        </div>
    )
}