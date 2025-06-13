
type Props = {
    condicaoNao: boolean
}


export default function setaNao({condicaoNao}: Props){

    const larguraPalitos = "2"
    const tamanhoLitraPrincipal = 60
    const coordenadaRightMenores = ((100 - tamanhoLitraPrincipal) / 2)


    return (
        <div className="relative h-[6.67vh] aspect-square rounded-full border-solid border-white border-2">
            <div className={`absolute w-[50%] h-[2px] rounded-full bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${condicaoNao ? "-rotate-45" : "rotate-0"}`}></div>

            <div className={`absolute w-[2px] h-[25%] bg-white bottom-1/2 origin-bottom translate-x-1/2 transition-all ${condicaoNao ? "-rotate-[45deg] right-[50%]" : "-rotate-53 right-[25%]" }`}></div> 
            <div className={`absolute w-[2px] h-[25%]  bg-white top-1/2 origin-top translate-x-1/2 transition-all ${condicaoNao ? "-rotate-[45deg] right-[50%]" : "rotate-53 right-[25%]" }`}></div> 




        </div>
    )
}