import { ChangeEvent, useContext, useEffect } from "react"
import { ContextoParametrosOpcionais, objAliquotas, objAreas } from "../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais"


type objLinhaParametros = {
    id: string,
    valor: string | null,
    area: keyof objAreas,
    aliquota: keyof objAliquotas
}

export function ParametrosEntrada(){

    const {
        aliquotasIva,
        setAliquotasIva,
        tabelaLucroPresumido,
        setTabelaLucroPresumido,
        tabelaSimplesNacional,
        setTabelaSimplesNacional,
        tabelaLucroReal,
        setTabelaLucroReal
    } = useContext(ContextoParametrosOpcionais)

    

    const cabecalhosTabelas = ["", "Industrial", "Serviços", "Comercial", "Locação"]

    {/* Variáveis linhas Simples Nacional */}
    const simplesNacionalLinhasPisCofins: objLinhaParametros[] = [
        {id: "pisCoSimplesIndustrial", valor: tabelaSimplesNacional.industrial.pisCo, area: "industrial", aliquota: "pisCo"},
        {id: "pisCoSimplesServAdquiridos", valor: tabelaSimplesNacional.servicos.pisCo, area: "servicos", aliquota: "pisCo"},
        {id: "pisCoSimplesComercial", valor: tabelaSimplesNacional.comercial.pisCo, area: "comercial", aliquota: "pisCo"},
        {id: "pisCoSimplesLocacao", valor: tabelaSimplesNacional.locacao.pisCo, area: "locacao", aliquota: "pisCo"},
    ]
    const simplesNacionalLinhasIpi: objLinhaParametros[] = [
        {id: "ipiSimplesIndustrial", valor: tabelaSimplesNacional.industrial.ipi, area: "industrial", aliquota: "ipi"},
        {id: "ipiSimplesServAdquiridos", valor: tabelaSimplesNacional.servicos.ipi, area: "servicos", aliquota: "ipi"},
        {id: "ipiSimplesComercial", valor: tabelaSimplesNacional.comercial.ipi, area: "comercial", aliquota: "ipi"},
        {id: "ipiSimplesLocacao", valor: tabelaSimplesNacional.locacao.ipi, area: "locacao", aliquota: "ipi"},
    ]
    const simplesNacionalLinhasIcms: objLinhaParametros[] = [
        {id: "icmsSimplesIndustrial", valor: tabelaSimplesNacional.industrial.icms, area: "industrial", aliquota: "icms"},
        {id: "icmsSimplesServAdquiridos", valor: tabelaSimplesNacional.servicos.icms, area: "servicos", aliquota: "icms"},
        {id: "icmsSimplesComercial", valor: tabelaSimplesNacional.comercial.icms, area: "comercial", aliquota: "icms"},
        {id: "icmsSimplesLocacao", valor: tabelaSimplesNacional.locacao.icms, area: "locacao", aliquota: "icms"},
    ]
    const simplesNacionalLinhasIss: objLinhaParametros[] = [
        {id: "issSimplesIndustrial", valor: tabelaSimplesNacional.industrial.iss, area: "industrial", aliquota: "iss"},
        {id: "issSimplesServAdquiridos", valor: tabelaSimplesNacional.servicos.iss, area: "servicos", aliquota: "iss"},
        {id: "issSimplesComercial", valor: tabelaSimplesNacional.comercial.iss, area: "comercial", aliquota: "iss"},
        {id: "issSimplesLocacao", valor: tabelaSimplesNacional.locacao.iss, area: "locacao", aliquota: "iss"},
    ]

    {/* Variáveis linhas Lucro Real */}
    const lucroRealLinhasPisCofins: objLinhaParametros[] = [
        {id: "pisCoLucroRealIndustrial", valor: tabelaLucroReal.industrial.pisCo, area: "industrial", aliquota: "pisCo"},
        {id: "pisCoLucroRealServAdquiridos", valor: tabelaLucroReal.servicos.pisCo, area: "servicos", aliquota: "pisCo"},
        {id: "pisCoLucroRealComercial", valor: tabelaLucroReal.comercial.pisCo, area: "comercial", aliquota: "pisCo"},
        {id: "pisCoLucroRealLocacao", valor: tabelaLucroReal.locacao.pisCo, area: "locacao", aliquota: "pisCo"},
    ]
    const lucroRealLinhasIpi: objLinhaParametros[] = [
        {id: "ipiLucroRealIndustrial", valor: tabelaLucroReal.industrial.ipi, area: "industrial", aliquota: "ipi"},
        {id: "ipiLucroRealServAdquiridos", valor: tabelaLucroReal.servicos.ipi, area: "servicos", aliquota: "ipi"},
        {id: "ipiLucroRealComercial", valor: tabelaLucroReal.comercial.ipi, area: "comercial", aliquota: "ipi"},
        {id: "ipiLucroRealLocacao", valor: tabelaLucroReal.locacao.ipi, area: "locacao", aliquota: "ipi"},
    ]
    const lucroRealLinhasIcms: objLinhaParametros[] = [
        {id: "icmsLucroRealIndustrial", valor: tabelaLucroReal.industrial.icms, area: "industrial", aliquota: "icms"},
        {id: "icmsLucroRealServAdquiridos", valor: tabelaLucroReal.servicos.icms, area: "servicos", aliquota: "icms"},
        {id: "icmsLucroRealComercial", valor: tabelaLucroReal.comercial.icms, area: "comercial", aliquota: "icms"},
        {id: "icmsLucroRealLocacao", valor: tabelaLucroReal.locacao.icms, area: "locacao", aliquota: "icms"},
    ]
    const lucroRealLinhasIss: objLinhaParametros[] = [
        {id: "issLucroRealIndustrial", valor: tabelaLucroReal.industrial.iss, area: "industrial", aliquota: "iss"},
        {id: "issLucroRealServAdquiridos", valor: tabelaLucroReal.servicos.iss, area: "servicos", aliquota: "iss"},
        {id: "issLucroRealComercial", valor: tabelaLucroReal.comercial.iss, area: "comercial", aliquota: "iss"},
        {id: "issLucroRealLocacao", valor: tabelaLucroReal.locacao.iss, area: "locacao", aliquota: "iss"},
    ]

    {/* Variáveis linhas Lucro Presumido */}
    const lucroPresumidoLinhasPisCofins: objLinhaParametros[] = [
        {id: "pisCoLucroPresumidoIndustrial", valor: tabelaLucroPresumido.industrial.pisCo, area: "industrial", aliquota: "pisCo"},
        {id: "pisCoLucroPresumidoServAdquiridos", valor: tabelaLucroPresumido.servicos.pisCo, area: "servicos", aliquota: "pisCo"},
        {id: "pisCoLucroPresumidoComercial", valor: tabelaLucroPresumido.comercial.pisCo, area: "comercial", aliquota: "pisCo"},
        {id: "pisCoLucroPresumidoLocacao", valor: tabelaLucroPresumido.locacao.pisCo, area: "locacao", aliquota: "pisCo"},
    ]
    const lucroPresumidoLinhasIpi: objLinhaParametros[] = [
        {id: "ipiLucroPresumidoIndustrial", valor: tabelaLucroPresumido.industrial.ipi, area: "industrial", aliquota: "ipi"},
        {id: "ipiLucroPresumidoServAdquiridos", valor: tabelaLucroPresumido.servicos.ipi, area: "servicos", aliquota: "ipi"},
        {id: "ipiLucroPresumidoComercial", valor: tabelaLucroPresumido.comercial.ipi, area: "comercial", aliquota: "ipi"},
        {id: "ipiLucroPresumidoLocacao", valor: tabelaLucroPresumido.locacao.ipi, area: "locacao", aliquota: "ipi"},
    ]
    const lucroPresumidoLinhasIcms: objLinhaParametros[] = [
        {id: "icmsLucroPresumidoIndustrial", valor: tabelaLucroPresumido.industrial.icms, area: "industrial", aliquota: "icms"},
        {id: "icmsLucroPresumidoServAdquiridos", valor: tabelaLucroPresumido.servicos.icms, area: "servicos", aliquota: "icms"},
        {id: "icmsLucroPresumidoComercial", valor: tabelaLucroPresumido.comercial.icms, area: "comercial", aliquota: "icms"},
        {id: "icmsLucroPresumidoLocacao", valor: tabelaLucroPresumido.locacao.icms, area: "locacao", aliquota: "icms"},
    ]
    const lucroPresumidoLinhasIss: objLinhaParametros[] = [
        {id: "issLucroPresumidoIndustrial", valor: tabelaLucroPresumido.industrial.iss, area: "industrial", aliquota: "iss"},
        {id: "issLucroPresumidoServAdquiridos", valor: tabelaLucroPresumido.servicos.iss, area: "servicos", aliquota: "iss"},
        {id: "issLucroPresumidoComercial", valor: tabelaLucroPresumido.comercial.iss, area: "comercial", aliquota: "iss"},
        {id: "issLucroPresumidoLocacao", valor: tabelaLucroPresumido.locacao.iss, area: "locacao", aliquota: "iss"},
    ]

    function mudarIbs(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            const objAliquotasIvaClone = {...aliquotasIva}
            objAliquotasIvaClone.ibs = valorInput
            setAliquotasIva(objAliquotasIvaClone)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            const objAliquotasIvaClone = {...aliquotasIva}
            objAliquotasIvaClone.ibs = valorInput
            setAliquotasIva(objAliquotasIvaClone)
            return 
        }
    }

    function mudarCbs(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            const objAliquotasIvaClone = {...aliquotasIva}
            objAliquotasIvaClone.cbs = valorInput
            setAliquotasIva(objAliquotasIvaClone)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            const objAliquotasIvaClone = {...aliquotasIva}
            objAliquotasIvaClone.cbs = valorInput
            setAliquotasIva(objAliquotasIvaClone)
            return 
        }
    }

    const mudarAliquotaSimplesNacional = (area: keyof objAreas, imposto: keyof objAliquotas, e: ChangeEvent<HTMLInputElement>) => {

        const valorInput = e.target.value

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if((valorInput === "") || (regexStrNum.test(valorInput))){
            setTabelaSimplesNacional((prev) => ({
                ...prev,
                [area]: {
                ...prev[area],
                [imposto]: valorInput,
                },
            }))
            return 
        }

    }

    const mudarAliquotaLucroReal = (area: keyof objAreas, imposto: keyof objAliquotas, e: ChangeEvent<HTMLInputElement>) => {

        const valorInput = e.target.value

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if((valorInput === "") || (regexStrNum.test(valorInput))){
            setTabelaLucroReal((prev) => ({
                ...prev,
                [area]: {
                ...prev[area],
                [imposto]: valorInput,
                },
            }))
            return 
        }

    }

    const mudarAliquotaLucroPresumido = (area: keyof objAreas, imposto: keyof objAliquotas, e: ChangeEvent<HTMLInputElement>) => {

        const valorInput = e.target.value

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if((valorInput === "") || (regexStrNum.test(valorInput))){
            setTabelaLucroPresumido((prev) => ({
                ...prev,
                [area]: {
                ...prev[area],
                [imposto]: valorInput,
                },
            }))
            return 
        }

    }

    useEffect(() => {
        console.log("Lucro Presumido")
        console.log(tabelaLucroPresumido)
        console.log("Lucro Real")
        console.log(tabelaLucroReal)
    }, [tabelaLucroPresumido, tabelaLucroReal])

    return (
        <div className="flex flex-col gap-6 overflow-y-scroll h-[80vh]">
            <div className="flex gap-4 items-center">
                <label htmlFor="aliquotaIbs">Alíquota IBS</label>
                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                    <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={aliquotasIva.ibs} onChange={(e) => mudarIbs(e)}/>
                    <div className=" px-1 flex items-center justify-center bg-gray-500">%</div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <label htmlFor="aliquotaCb">Alíquota CBS</label>
                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                    <input className="p-1 outline-none flex-1" type="text" id="aliquotaCbs" value={aliquotasIva.cbs} onChange={(e) => mudarCbs(e)}/>
                    <div className=" px-1 flex items-center justify-center bg-gray-500">%</div>
                </div>
            </div>

            {/* Tabela Simples Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Simples Nacional</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    {/* CABEÇALHO TABELA */}
                    {
                        cabecalhosTabelas.map(cabecalho => (
                            <div>
                                {cabecalho}
                            </div>
                        ))
                    }


                    {/* LINHA PIS-COFINS */}
                    <div>
                        PIS-COFINS
                    </div>
                    {
                        simplesNacionalLinhasPisCofins.map(linhaPisCofins => (
                            linhaPisCofins.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaPisCofins.id}`} value={linhaPisCofins.valor} onChange={(e) => mudarAliquotaSimplesNacional(linhaPisCofins.area, linhaPisCofins.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))
                    }


                    {/* LINHA IPI */}
                    <div>
                        IPI
                    </div>
                    {
                        simplesNacionalLinhasIpi.map(linhaIpi => (
                            linhaIpi.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIpi.id}`} value={linhaIpi.valor} onChange={(e) => mudarAliquotaSimplesNacional(linhaIpi.area, linhaIpi.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }


                    {/* LINHA ICMS */}
                    <div>
                        ICMS
                    </div>
                    {
                        simplesNacionalLinhasIcms.map(linhaIcms => (
                            linhaIcms.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIcms.id}`} value={linhaIcms.valor} onChange={(e) => mudarAliquotaSimplesNacional(linhaIcms.area, linhaIcms.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }
                    

                    {/* LINHA ISS */}
                    <div>
                        ISS
                    </div>
                    {
                        simplesNacionalLinhasIss.map(linhaIss => (
                            linhaIss.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIss.id}`} value={linhaIss.valor} onChange={(e) => mudarAliquotaSimplesNacional(linhaIss.area, linhaIss.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }    

                </div>
            </div>
           {/* Fim Tabela Simples Serviços Adquiridos */}




            {/* Tabela lucro Real Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Lucro Real</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    {/* CABEÇALHO TABELA */}
                    {
                        cabecalhosTabelas.map(cabecalho => (
                            <div>
                                {cabecalho}
                            </div>
                        ))
                    }


                    {/* LINHA PIS-COFINS */}
                    <div>
                        PIS-COFINS
                    </div>
                    {
                        lucroRealLinhasPisCofins.map(linhaPisCo => (
                            linhaPisCo.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaPisCo.id}`} value={linhaPisCo.valor} onChange={(e) => mudarAliquotaLucroReal(linhaPisCo.area, linhaPisCo.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }    


                    {/* LINHA IPI */}
                    <div>
                        IPI
                    </div>
                    {
                        lucroRealLinhasIpi.map(linhaIpi => (
                            linhaIpi.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIpi.id}`} value={linhaIpi.valor} onChange={(e) => mudarAliquotaLucroReal(linhaIpi.area, linhaIpi.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }    


                    {/* LINHA ICMS */}
                    <div>
                        ICMS
                    </div>
                    {
                        lucroRealLinhasIcms.map(linhaIcms => (
                            linhaIcms.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIcms.id}`} value={linhaIcms.valor} onChange={(e) => mudarAliquotaLucroReal(linhaIcms.area, linhaIcms.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }     


                    {/* LINHA ISS */}
                    <div>
                        ISS
                    </div>
                    {
                        lucroRealLinhasIss.map(linhaIss => (
                            linhaIss.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIss.id}`} value={linhaIss.valor} onChange={(e) => mudarAliquotaLucroReal(linhaIss.area, linhaIss.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }   

                </div>
            </div>
            {/* Fim Tabela Lucro Real Serviços Adquiridos */}





            {/* Tabela lucro Presumido Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Lucro Presumido</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    {/* CABEÇALHO TABELA */}
                    {
                        cabecalhosTabelas.map(cabecalho => (
                            <div>
                                {cabecalho}
                            </div>
                        ))
                    }


                    {/* LINHA PIS-COFINS */}
                    <div>
                        PIS-COFINS
                    </div>
                    {
                        lucroPresumidoLinhasPisCofins.map(linhaPisCo => (
                            linhaPisCo.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaPisCo.id}`} value={linhaPisCo.valor} onChange={(e) => mudarAliquotaLucroPresumido(linhaPisCo.area, linhaPisCo.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    }  


                    {/* LINHA IPI */}
                    <div>
                        IPI
                    </div>
                    {
                        lucroPresumidoLinhasIpi.map(linhaIpi => (
                            linhaIpi.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIpi.id}`} value={linhaIpi.valor} onChange={(e) => mudarAliquotaLucroPresumido(linhaIpi.area, linhaIpi.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    } 


                    {/* LINHA ICMS */}
                    <div>
                        ICMS
                    </div>
                    {
                        lucroPresumidoLinhasIcms.map(linhaIcms => (
                            linhaIcms.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIcms.id}`} value={linhaIcms.valor} onChange={(e) => mudarAliquotaLucroPresumido(linhaIcms.area, linhaIcms.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    } 


                    {/* LINHA ISS */}
                    <div>
                        ISS
                    </div>
                    {
                        lucroPresumidoLinhasIss.map(linhaIss => (
                            linhaIss.valor !== null ?
                            <div>
                                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                                    <input className="p-1 outline-none flex-1" type="text" id={`${linhaIss.id}`} value={linhaIss.valor} onChange={(e) => mudarAliquotaLucroPresumido(linhaIss.area, linhaIss.aliquota, e)}/>

                                </div>
                            </div>
                            : 
                            <div>

                            </div>
                        ))    
                    } 

                </div>
            </div>
            {/* Fim Tabela Lucro Presumido Serviços Adquiridos */}


        </div>
    )
}