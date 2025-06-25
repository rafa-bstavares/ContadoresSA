

type Props = {
    cor: "vermelho" | "verde"
}

export function IndicadorColorido({cor}: Props){
    return (
        <div className={`w-3 h-3 rounded-full ${cor == "vermelho" ? "bg-red-600" : "bg-green-500"}`}>

        </div>
    )
}