import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react";
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral";
import iconeImoveis from "../../assets/images/imoveisBotaoBgBranco100.svg"
import SetaNao from "../../Components/SetaNao/SetaNao"
import { objIsCheckedType } from "../SegundoPasso/SegundoPasso";

type Props = {
    objIsChecked: objIsCheckedType,
    setObjIsChecked: Dispatch<SetStateAction<objIsCheckedType>>
}


export default function Imoveis({objIsChecked, setObjIsChecked}: Props){



      const {passo1} = useContext(ContextoGeral)

    
      function handleToggle(){
        if(objIsChecked.isCheckedImoveis){
            const objIsCheckedClone = {...objIsChecked}
            objIsCheckedClone.isCheckedImoveis = false
            setObjIsChecked(objIsCheckedClone)
        }else{
            const objIsCheckedClone = {...objIsChecked}
            objIsCheckedClone.isCheckedImoveis = true
            objIsCheckedClone.isCheckedServicos = false
            objIsCheckedClone.isCheckedMoveis = false
            objIsCheckedClone.isCheckedProdutos = false
            setObjIsChecked(objIsCheckedClone)
        }

      };


      

    return (
        <div className='flex flex-col justify-end px-6 py-4 rounded-xl shadow-lg cursor-pointer border-2 border-solid bg-fundoCinzaEscuro object-cover aspect-[9/7] h-[29vh] border-white text-white' onClick={handleToggle}>
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
                        Bens Imóveis
                    </div>
                    <div className='opacity-70'>
                        Lance os aluguéis pagos e recebidos para calcular os impactos da nova tributação nas locações de imóveis.
                    </div>
                </div>
                <div className='self-end'>
                    <SetaNao condicaoNao={objIsChecked.isCheckedImoveis}  />
                </div>
            </div>

        </div>
    )
}