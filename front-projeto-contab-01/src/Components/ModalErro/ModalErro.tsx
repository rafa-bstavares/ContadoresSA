import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { useContext } from "react"
import Xis from "../../assets/images/xisContab.svg"


export function ModalErro(){

    const {textoErro, setTemErro} = useContext(ContextoErro)

    function fecharErro(){
        setTemErro(false)
    }

    return (
        <div className="fixed right-6 bottom-6 [font-family:'Manrope',sans-serif] text-white z-50">
            <div className="w-[25vw] max-h-[30vh] bg-red-600 border-2 border-solid border-red-400 rounded-md p-4">
                <div className="flex justify-end">
                    <div onClick={fecharErro} className="w-4 h-4 cursor-pointer">
                        <img className="w-full h-full object-cover" src={Xis} alt="fechar erro" />
                    </div>
                </div>
                <div className="font-bold">
                    Ocorreu um erro:
                </div>
                <div>
                    {textoErro}
                </div>
            </div>
        </div>
    )
}