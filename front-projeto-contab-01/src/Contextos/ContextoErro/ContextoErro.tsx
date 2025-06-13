import { createContext, useState, Dispatch, SetStateAction } from "react";


type TiposContextoErro = {       
    temErro: boolean,
    setTemErro: Dispatch<SetStateAction<boolean>>,
    textoErro: string,
    setTextoErro: Dispatch<SetStateAction<string>>
}

export const ContextoErro = createContext<TiposContextoErro>({
    temErro: false,
    setTemErro: () => {},
    textoErro: "",
    setTextoErro: () => {}
} as TiposContextoErro)


export const ErroProvider = ({children}: {children: React.ReactNode}) => {

    const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")


    return (
        <ContextoErro.Provider value={{
            temErro,
            setTemErro,
            setTextoErro,
            textoErro
        }}>
            {children}
        </ContextoErro.Provider>
    )
}