import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react";
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral";
import SetaNao from "../../Components/SetaNao/SetaNao"
import { objIsCheckedType } from "../SegundoPasso/SegundoPasso";

type Props = {
    objIsChecked: objIsCheckedType,
    setObjIsChecked: Dispatch<SetStateAction<objIsCheckedType>>
}


export default function ProdutosBotao({objIsChecked, setObjIsChecked}: Props){


      function handleToggle(){
        if(objIsChecked.isCheckedProdutos){
            const objIsCheckedClone = {...objIsChecked}
            objIsCheckedClone.isCheckedProdutos = false
            setObjIsChecked(objIsCheckedClone)
        }else{
            const objIsCheckedClone = {...objIsChecked}
            objIsCheckedClone.isCheckedProdutos = true
            objIsCheckedClone.isCheckedServicos = false
            objIsCheckedClone.isCheckedImoveis = false
            objIsCheckedClone.isCheckedMoveis = false
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
                        Produtos
                    </div>
                    <div className='opacity-70'>
                        Importe os XMLs de entrada e saída para verificar os efeitos da Reforma sobre produtos, NCMs, fornecedores e clientes.
                    </div>
                </div>
                <div className='self-end'>
                    <SetaNao condicaoNao={objIsChecked.isCheckedProdutos}  />
                </div>
            </div>

        </div>
    )
}