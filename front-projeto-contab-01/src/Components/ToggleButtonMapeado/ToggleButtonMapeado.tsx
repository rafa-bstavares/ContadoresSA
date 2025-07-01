
import { Dispatch, SetStateAction } from "react"

// USADO EM ELEMENTOS QUE SEJAM RENDERIZADOS A PARTIR DE ARRAYS MAPEADOS, E QUE PRECISE DE UMA FUNÇÃO MAIS COMPLEXA DE FILTER COM ID PARA IDENTIFICAR O VALOR PARA ALTERAR

type Props = {
    valor: boolean,
    onChangeFn: () => void,
    texto: string
}

export function ToggleButtonMapeado({valor, onChangeFn, texto}: Props){
    return (
        <div className="flex flex-col gap-1">
            <div>{texto}</div>
            <div onClick={onChangeFn} className={`w-12 h-6 flex items-center ${valor ? "bg-[linear-gradient(120deg,#ff9d00,50%,#FFDD00)]" : "bg-gray-400"} rounded-full p-1 cursor-pointer`}>
                {/* Como tem padding 1 (4px) no container da bola, ela tem que ser a altura desse container menos 4px tbm, como no tailwind, já vai aumentando e diminuindo de 4px em 4px por padrão... de se o container tiver h-6 a bola terá h-5... generalizando: se o container tiver h-x a bola terá h-(x-1)  */}
                <div className={`w-5 h-5 rounded-full bg-white inset-shadow-xs transition ${valor ? "translate-x-5" : ""}`}>
                </div>
            </div>
        </div>
    )
}