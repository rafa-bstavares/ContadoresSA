import { useContext, useState } from "react"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import { PrimeiroPasso } from "../PrimeiroPasso/PrimeiroPasso"
import { SegundoPasso } from "../SegundoPasso/SegundoPasso"
import { BarraLateral } from "../BarraLateral/BarraLateral"
import { Menu } from "../Menu/Menu"
import { Calculadora } from "../Calculadora/Calculadora"
import { Outlet } from "react-router-dom"




export function Perfil(){


    const [modoBranco, setModoBranco] = useState<boolean>(false)


    return (


        <div className={`transition-bg relative flex flex-col items-start  w-full min-h-[100vh] justify-center  ${modoBranco ? "bg-white" : "bg-premiumBg"} text-white`}>
            <Menu/>

            <div className='flex items-start w-full text-white'>
                <div className=" w-[60px]">
                    {/* Precisei fazer outra div para colocar só o "absolute", pois se colocasse o absolute na div acima ela não ia conseguir receber por padrão o "self-stretch" do align-items e não acompanharia o tamanho da pagina */}
                    <div className="absolute">
                        <BarraLateral modoBranco={modoBranco}/>
                    </div>
                </div>
                <div className='flex-1 min-h-[100vh] rounded-tl-2xl overflow-hidden '>
                    <Outlet/>
                </div>
            </div>

        </div>

    )
}