import { createContext, useState, Dispatch, SetStateAction } from "react";


type TiposContextoParametrosOpcionais = {       
    aliquotaIbs: string,
    aliquotaCbs: string,
    setAliquotaIbs: Dispatch<SetStateAction<string>>,
    setAliquotaCbs: Dispatch<SetStateAction<string>>,
    erroParametros: string,
    setErroParametros: Dispatch<SetStateAction<string>>,
    pisCoSimplesServAdquiridos: string,
    setPisCoSimplesServAdquiridos: Dispatch<SetStateAction<string>>,
    pisCoSimplesIndustria: string,
    setPisCoSimplesIndustria: Dispatch<SetStateAction<string>>,
    pisCoSimplesComercio: string,
    setPisCoSimplesComercio: Dispatch<SetStateAction<string>>,
    icmsSimplesServAdquiridos: string,
    setIcmsSimplesServAdquiridos: Dispatch<SetStateAction<string>>,
    icmsSimplesIndustrial: string,
    setIcmsSimplesIndustrial: Dispatch<SetStateAction<string>>,
    icmsSimplesComercial: string,
    setIcmsSimplesComercial: Dispatch<SetStateAction<string>>,
    ipiSimplesServAdquiridos: string,
    setIpiSimplesServAdquiridos: Dispatch<SetStateAction<string>>,
    ipiSimplesIndustria: string,
    setIpiSimplesIndustria: Dispatch<SetStateAction<string>>,
    issSimplesServAdquiridos: string,
    setIssSimplesServAdquiridos: Dispatch<SetStateAction<string>>,
    pisCoLucroRealServAdquiridos: string,
    setPisCoLucroRealServAdquiridos: Dispatch<SetStateAction<string>>,
    pisCoLucroRealComercial: string,
    setPisCoLucroRealComercial: Dispatch<SetStateAction<string>>,
    pisCoLucroRealIndustrial: string,
    setPisCoLucroRealIndustrial: Dispatch<SetStateAction<string>>,
    issLucroRealServAdquiridos: string,
    setIssLucroRealServAdquiridos: Dispatch<SetStateAction<string>>,
    issLucroRealComercial: string,
    setIssLucroRealComercial: Dispatch<SetStateAction<string>>,
    issLucroRealIndustrial: string,
    setIssLucroRealIndustrial: Dispatch<SetStateAction<string>>,
    
    pisCoLucroPresumidoServAdquiridos: string,
    setPisCoLucroPresumidoServAdquiridos: Dispatch<SetStateAction<string>>,
    pisCoLucroPresumidoComercial: string,
    setPisCoLucroPresumidoComercial: Dispatch<SetStateAction<string>>,
    pisCoLucroPresumidoIndustrial: string,
    setPisCoLucroPresumidoIndustrial: Dispatch<SetStateAction<string>>,
    issLucroPresumidoServAdquiridos: string,
    setIssLucroPresumidoServAdquiridos: Dispatch<SetStateAction<string>>,
    issLucroPresumidoComercial: string,
    setIssLucroPresumidoComercial: Dispatch<SetStateAction<string>>,
    issLucroPresumidoIndustrial: string,
    setIssLucroPresumidoIndustrial: Dispatch<SetStateAction<string>>,

    pisCoLucroPresumidoLocacao: string,
    setPisCoLucroPresumidoLocacao: Dispatch<SetStateAction<string>>,
    pisCoLucroRealLocacao: string,
    setPisCoLucroRealLocacao: Dispatch<SetStateAction<string>>,
    pisCoSimplesLocacao: string,
    setPisCoSimplesLocacao: Dispatch<SetStateAction<string>>
}

export const ContextoParametrosOpcionais = createContext<TiposContextoParametrosOpcionais>({
    aliquotaIbs: "18,7",
    aliquotaCbs: "9,3",
    setAliquotaIbs: () => {},
    setAliquotaCbs: () => {},
    erroParametros: "",
    setErroParametros: () => {},
    pisCoSimplesServAdquiridos: "3,3",
    setPisCoSimplesServAdquiridos: () => {},
    pisCoSimplesIndustria: "2,2",
    setPisCoSimplesIndustria: () => {},
    pisCoSimplesComercio: "2,2",
    setPisCoSimplesComercio: () => {},
    icmsSimplesServAdquiridos: "0",
    setIcmsSimplesServAdquiridos: () => {},
    icmsSimplesIndustrial: "4,8",
    setIcmsSimplesIndustrial: () => {},
    icmsSimplesComercial: "4,8",
    setIcmsSimplesComercial: () => {},
    ipiSimplesServAdquiridos: "0",
    setIpiSimplesServAdquiridos: () => {},
    ipiSimplesIndustria: "0,5",
    setIpiSimplesIndustria: () => {},
    issSimplesServAdquiridos: "5",
    setIssSimplesServAdquiridos: () => {},
    pisCoLucroRealServAdquiridos: "9,25",
    setPisCoLucroRealServAdquiridos: () => {},
    pisCoLucroRealComercial: "9,25",
    setPisCoLucroRealComercial: () => {},
    pisCoLucroRealIndustrial: "9,25",
    setPisCoLucroRealIndustrial: () => {},
    issLucroRealServAdquiridos: "5",
    setIssLucroRealServAdquiridos: () => {},
    issLucroRealComercial: "0",
    setIssLucroRealComercial: () => {},
    issLucroRealIndustrial: "0",
    setIssLucroRealIndustrial: () => {},

    pisCoLucroPresumidoServAdquiridos: "3,65",
    setPisCoLucroPresumidoServAdquiridos: () => {},
    pisCoLucroPresumidoComercial: "3,65",
    setPisCoLucroPresumidoComercial: () => {},
    pisCoLucroPresumidoIndustrial: "3,65",
    setPisCoLucroPresumidoIndustrial: () => {},
    issLucroPresumidoServAdquiridos: "3",
    setIssLucroPresumidoServAdquiridos: () => {},
    issLucroPresumidoComercial: "0",
    setIssLucroPresumidoComercial: () => {},
    issLucroPresumidoIndustrial: "0",
    setIssLucroPresumidoIndustrial: () => {},

    pisCoLucroPresumidoLocacao: "3,65",
    setPisCoLucroPresumidoLocacao: () => {},
    pisCoLucroRealLocacao: "9,25",
    setPisCoLucroRealLocacao: () => {},
    pisCoSimplesLocacao: "3,3",
    setPisCoSimplesLocacao: () => {}
} as TiposContextoParametrosOpcionais)


export const ParametrosOpcionaisProvider = ({children}: {children: React.ReactNode}) => {

    const [aliquotaIbs, setAliquotaIbs] = useState<string>("18,7")
    const [aliquotaCbs, setAliquotaCbs] = useState<string>("9,3")
    const [erroParametros, setErroParametros] = useState<string>("")
    const [pisCoSimplesServAdquiridos, setPisCoSimplesServAdquiridos] = useState<string>("3,3")
    const [pisCoSimplesIndustria, setPisCoSimplesIndustria] = useState<string>("2,2")
    const [pisCoSimplesComercio, setPisCoSimplesComercio] = useState<string>("2,2")
    const [icmsSimplesServAdquiridos, setIcmsSimplesServAdquiridos] = useState<string>("0")
    const [icmsSimplesIndustrial, setIcmsSimplesIndustrial] = useState<string>("4,8")
    const [icmsSimplesComercial, setIcmsSimplesComercial] = useState<string>("4,8")
    const [issSimplesServAdquiridos, setIssSimplesServAdquiridos] = useState<string>("5")
    const [ipiSimplesServAdquiridos, setIpiSimplesServAdquiridos] = useState<string>("0")
    const [ipiSimplesIndustria, setIpiSimplesIndustria] = useState<string>("0,5")
    const [pisCoLucroRealServAdquiridos, setPisCoLucroRealServAdquiridos] = useState<string>("9,25")
    const [pisCoLucroRealComercial, setPisCoLucroRealComercial] = useState<string>("9,25")
    const [pisCoLucroRealIndustrial, setPisCoLucroRealIndustrial] = useState<string>("9,25")
    const [issLucroRealServAdquiridos, setIssLucroRealServAdquiridos] = useState<string>("5")
    const [issLucroRealComercial, setIssLucroRealComercial] = useState<string>("0")
    const [issLucroRealIndustrial, setIssLucroRealIndustrial] = useState<string>("0")
    
    const [pisCoLucroPresumidoServAdquiridos, setPisCoLucroPresumidoServAdquiridos] = useState<string>("3,65")
    const [pisCoLucroPresumidoComercial, setPisCoLucroPresumidoComercial] = useState<string>("3,65")
    const [pisCoLucroPresumidoIndustrial, setPisCoLucroPresumidoIndustrial] = useState<string>("3,65")
    const [issLucroPresumidoServAdquiridos, setIssLucroPresumidoServAdquiridos] = useState<string>("5")
    const [issLucroPresumidoComercial, setIssLucroPresumidoComercial] = useState<string>("0")
    const [issLucroPresumidoIndustrial, setIssLucroPresumidoIndustrial] = useState<string>("0")

    const [pisCoLucroPresumidoLocacao, setPisCoLucroPresumidoLocacao] = useState<string>("3,65")
    const [pisCoLucroRealLocacao, setPisCoLucroRealLocacao] = useState<string>("9,25")
    const [pisCoSimplesLocacao, setPisCoSimplesLocacao] = useState<string>("3,3")



    return (
        <ContextoParametrosOpcionais.Provider value={{
            aliquotaCbs,
            aliquotaIbs,
            setAliquotaIbs,
            setAliquotaCbs,
            erroParametros,
            setErroParametros,
            pisCoSimplesServAdquiridos,
            setPisCoSimplesServAdquiridos,
            pisCoSimplesIndustria,
            setPisCoSimplesIndustria,
            pisCoSimplesComercio,
            setPisCoSimplesComercio,
            icmsSimplesServAdquiridos,
            setIcmsSimplesServAdquiridos,
            icmsSimplesIndustrial,
            setIcmsSimplesIndustrial,
            icmsSimplesComercial,
            setIcmsSimplesComercial,
            ipiSimplesServAdquiridos,
            setIpiSimplesServAdquiridos,
            ipiSimplesIndustria,
            setIpiSimplesIndustria,
            issSimplesServAdquiridos,
            setIssSimplesServAdquiridos,
            pisCoLucroRealComercial,
            pisCoLucroRealIndustrial,
            pisCoLucroRealServAdquiridos,
            setPisCoLucroRealComercial,
            setPisCoLucroRealIndustrial,
            setPisCoLucroRealServAdquiridos,
            issLucroRealComercial,
            issLucroRealIndustrial,
            issLucroRealServAdquiridos,
            setIssLucroRealComercial,
            setIssLucroRealIndustrial,
            setIssLucroRealServAdquiridos,

            pisCoLucroPresumidoComercial,
            pisCoLucroPresumidoIndustrial,
            pisCoLucroPresumidoServAdquiridos,
            setPisCoLucroPresumidoComercial,
            setPisCoLucroPresumidoIndustrial,
            setPisCoLucroPresumidoServAdquiridos,
            issLucroPresumidoComercial,
            issLucroPresumidoIndustrial,
            issLucroPresumidoServAdquiridos,
            setIssLucroPresumidoComercial,
            setIssLucroPresumidoIndustrial,
            setIssLucroPresumidoServAdquiridos,

            pisCoLucroPresumidoLocacao,
            setPisCoLucroPresumidoLocacao,
            pisCoLucroRealLocacao,
            setPisCoLucroRealLocacao,
            pisCoSimplesLocacao,
            setPisCoSimplesLocacao

        }}>
            {children}
        </ContextoParametrosOpcionais.Provider>
    )
}