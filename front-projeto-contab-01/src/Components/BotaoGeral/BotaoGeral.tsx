
type Props = {
    onClickFn: () => void,
    text: string,
    principalBranco: boolean,
    tamanhoGrande?: boolean 
}

export function BotaoGeral({onClickFn, text, principalBranco, tamanhoGrande}: Props){
    return (
        <button onClick={onClickFn} className={`px-4 py-2 ${tamanhoGrande? "w-[30vw]" : ""} rounded-md border-2 border-solid border-white ${principalBranco? "bg-white text-black" : "bg-fundoCinzaEscuro text-white"} cursor-pointer`}>
            {text}
        </button>
    )
}