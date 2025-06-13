import { ChangeEvent, useContext, useState } from "react";
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral";

type Props = {
    Children: React.ComponentType,
    titulo: string,
    cnaes?: number[]
}

export function DropDownInput({Children, titulo, cnaes}: Props){


  const [isChecked, setIsChecked] = useState<boolean>(false);
  const {soImoveis, passo1} = useContext(ContextoGeral)

  const handleToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(event.target.checked);
  };


    return (
        <div className='flex flex-col w-full p-4 rounded-xl shadow-lg'>
          <div className='flex gap-2 mb-6'> 
            <label  className="flex items-center cursor-pointer">
              <div className="relative">
                {/* Input oculto para acessibilidade */}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={soImoveis || passo1 ? () => {} : handleToggle}
                />
                {/* Container do toggle (linha) */}
                <div className={`w-14 h-6 ${isChecked ? "bg-blue-500" : "bg-gray-600"} rounded-full shadow-inner`}></div>
                {/* Ponto (dot) do toggle, posicionado dentro do container */}
                <div
                  className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                    isChecked ? 'translate-x-8 bg-green-500' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </label>
            <div className='text-xl'>
                {titulo}
            </div>
          </div>
          <div className={`${isChecked ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"} [transition:grid-template-rows_500ms]`}>
            <div className={`overflow-hidden`}>
              <Children/>
            </div>
          </div>
        </div>
    )
}