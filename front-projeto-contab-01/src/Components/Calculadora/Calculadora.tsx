import { useContext } from "react"
import { ContextoGeral } from "../../Contextos/ContextoGeral/ContextoGeral"
import { PrimeiroPasso } from "../PrimeiroPasso/PrimeiroPasso"
import { SegundoPasso } from "../SegundoPasso/SegundoPasso"


export function Calculadora(){


    const {passo1, passo2} = useContext(ContextoGeral)

    return (

            <div className={`relative w-full ${passo1 ? "h-[100vh] flex justify-center items-center" : "h-auto p-12" } flex min-h-screen bg-premiumBg}`}>
                {
                    passo1 && !passo2 &&
                    <PrimeiroPasso modoBranco={false}/>
                }
                { 
                    <SegundoPasso modoBranco={false}/>
                }
            </div>

    )
}