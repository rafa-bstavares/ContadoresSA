import { createContext, useState, Dispatch, SetStateAction } from "react";


type TiposContextoLogin = {       
        usuarioLogado: boolean,
        setUsuarioLogado: Dispatch<SetStateAction<boolean>>,
        abrirModalLogin: boolean,
        setAbrirModalLogin: Dispatch<SetStateAction<boolean>>,
}

export const ContextoLogin = createContext<TiposContextoLogin>({
    usuarioLogado: false,
    setUsuarioLogado: () => {},
    abrirModalLogin: false,
    setAbrirModalLogin: () => {}
} as TiposContextoLogin)


export const LoginProvider = ({children}: {children: React.ReactNode}) => {

    const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false)
    const [abrirModalLogin, setAbrirModalLogin] = useState<boolean>(false)


    return (
        <ContextoLogin.Provider value={{
            usuarioLogado,
            setUsuarioLogado,
            abrirModalLogin,
            setAbrirModalLogin
        }}>
            {children}
        </ContextoLogin.Provider>
    )
}