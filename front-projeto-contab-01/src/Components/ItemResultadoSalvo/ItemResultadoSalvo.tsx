import { useContext } from "react"
import { baseUrl } from "../../App"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoResultadoSimulador } from "../../Contextos/ContextoResultadoSimulador/ContextoResultadoSimulador"
import { useNavigate } from "react-router-dom"

type Props = {
    nomeCalculo: string,
    calculoId: string
}

export function ItemResultadoSalvo({nomeCalculo, calculoId}: Props){

    const {setObjResultado} = useContext(ContextoResultadoSimulador)

    const navigate = useNavigate()

    function verResultadoCompleto(){
        fetch(baseUrl + "/pegarResultado", {
            headers: {
                "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                calculoId
            })
        }).then(res => res.json()).then(data => {
            console.log("Resposta Calculo Salvo Atual: ")
            console.log(data)

            if(data.success){
                setObjResultado(data.data)
                navigate("/Perfil/Resultado")
            }

        })
        
    }


    return (
        <div className=" flex gap-4 p-4 border-solid w-[20vw] border-white border-2 rounded-xl">
            <div className="flex-1">
                {nomeCalculo}
            </div>
            <BotaoGeral text="Ver completo" principalBranco={true} onClickFn={verResultadoCompleto} />
        </div>
    )
}