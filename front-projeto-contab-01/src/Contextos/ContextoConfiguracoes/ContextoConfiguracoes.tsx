import { createContext, useState, Dispatch, SetStateAction } from "react";


type TiposContextoConfiguracoes = {       
    configAberta: boolean,
    setConfigAberta: Dispatch<SetStateAction<boolean>>
}

export const ContextoConfiguracoes = createContext<TiposContextoConfiguracoes>({
    configAberta: false,
    setConfigAberta: () => {}
} as TiposContextoConfiguracoes)


export const ConfiguracoesProvider = ({children}: {children: React.ReactNode}) => {

    const [configAberta, setConfigAberta] = useState<boolean>(false)



    return (
        <ContextoConfiguracoes.Provider value={{
            configAberta,
            setConfigAberta
        }}>
            {children}
        </ContextoConfiguracoes.Provider>
    )
}