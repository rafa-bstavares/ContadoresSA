import { useContext, useEffect, useState } from "react"
import { baseUrl } from "../../App"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"
import { ItemResultadoSalvo } from "../ItemResultadoSalvo/ItemResultadoSalvo"



export default function ResultadosSalvos(){

    type objResSalvo = {
        nome_calculo: string,
        tipo_usuario: "Empresa" | "Pessoa Fisica",
        id: string, 
        usuario_id: string
    } 

    const [resultadosSalvos, setResultadosSalvos] = useState<objResSalvo[]>([])
    const {setTemErro, setTextoErro} = useContext(ContextoErro)

    useEffect(() => {
        fetch(baseUrl + "/pegarResultadosSalvos", {
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then((data: {success: true, data: objResSalvo[], error: null} | {success: false, data: null, error: {code: number, message: string}}) => {
            console.log("resultado do pegar resultados salvos")
            console.log(data)
            if(data.success){
                setResultadosSalvos(data.data)
            }else{
                setTemErro(true)
                setTextoErro("Erro ao buscar os resultados salvos no banco de dados.")
            }
        })
    }, [])

    return (
        <div className="w-full p-12 flex flex-col gap-12 min-h-screen bg-premiumBg">
            <div className="text-4xl">
                Seus Calculos Salvos:
            </div>
            <div className="flex flex-col gap-4 items-start">
                {
                    resultadosSalvos.map(item => {return (
                        <ItemResultadoSalvo nomeCalculo={item.nome_calculo} calculoId={item.id} />
                    )})
                }
            </div>
        </div>
    )
}