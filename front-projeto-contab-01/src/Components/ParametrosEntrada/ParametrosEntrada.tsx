import { ChangeEvent, useContext } from "react"
import { ContextoParametrosOpcionais } from "../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais"


export function ParametrosEntrada(){

    const {
        aliquotaCbs,
        aliquotaIbs,
        setAliquotaCbs,
        setAliquotaIbs,
        icmsSimplesServAdquiridos,
        issSimplesServAdquiridos, 
        pisCoSimplesServAdquiridos, 
        ipiSimplesServAdquiridos, 
        setIcmsSimplesServAdquiridos, 
        setIpiSimplesServAdquiridos, 
        setIssSimplesServAdquiridos, 
        setPisCoSimplesServAdquiridos, 
        icmsSimplesComercial, 
        icmsSimplesIndustrial, 
        ipiSimplesIndustria, 
        pisCoSimplesComercio, 
        pisCoSimplesIndustria, 
        setIcmsSimplesComercial, 
        setIcmsSimplesIndustrial, 
        setIpiSimplesIndustria, 
        setPisCoSimplesComercio, 
        setPisCoSimplesIndustria,
        issLucroRealComercial,
        issLucroRealIndustrial,
        issLucroRealServAdquiridos,
        pisCoLucroRealComercial,
        pisCoLucroRealIndustrial,
        pisCoLucroRealServAdquiridos,
        setIssLucroRealComercial,
        setIssLucroRealIndustrial,
        setIssLucroRealServAdquiridos,
        setPisCoLucroRealComercial,
        setPisCoLucroRealIndustrial,
        setPisCoLucroRealServAdquiridos,

        issLucroPresumidoComercial,
        issLucroPresumidoIndustrial,
        issLucroPresumidoServAdquiridos,
        pisCoLucroPresumidoComercial,
        pisCoLucroPresumidoIndustrial,
        pisCoLucroPresumidoServAdquiridos,
        setIssLucroPresumidoComercial,
        setIssLucroPresumidoIndustrial,
        setIssLucroPresumidoServAdquiridos,
        setPisCoLucroPresumidoComercial,
        setPisCoLucroPresumidoIndustrial,
        setPisCoLucroPresumidoServAdquiridos,

        pisCoLucroPresumidoLocacao,
        pisCoLucroRealLocacao,
        pisCoSimplesLocacao,
        setPisCoLucroPresumidoLocacao,
        setPisCoLucroRealLocacao,
        setPisCoSimplesLocacao
    } = useContext(ContextoParametrosOpcionais)


    function mudarIbs(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setAliquotaIbs(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setAliquotaIbs(valorInput)
            return 
        }
    }

    function mudarCbs(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setAliquotaIbs(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setAliquotaIbs(valorInput)
            return 
        }
    }

    function mudarIpiSimplesServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIpiSimplesServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIpiSimplesServAdquiridos(valorInput)
            return 
        }
    }

    function mudarIcmsSimplesServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcmsSimplesServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIcmsSimplesServAdquiridos(valorInput)
            return 
        }
    }

    function mudarIssSimplesServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssSimplesServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssSimplesServAdquiridos(valorInput)
            return 
        }
    }

    function mudarpisCoSimplesServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoSimplesServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoSimplesServAdquiridos(valorInput)
            return 
        }
    }

    function mudarpisCoSimplesIndustria(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoSimplesIndustria(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoSimplesIndustria(valorInput)
            return 
        }
    }

    function mudarpisCoSimplesComercio(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoSimplesComercio(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoSimplesComercio(valorInput)
            return 
        }
    }

    function mudarpisCoSimplesLocacao(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoSimplesLocacao(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoSimplesLocacao(valorInput)
            return 
        }
    }

    function mudarIpiSimplesIndustria(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIpiSimplesIndustria(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIpiSimplesIndustria(valorInput)
            return 
        }
    }

    function mudarIcmsSimplesIndustria(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcmsSimplesIndustrial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIcmsSimplesIndustrial(valorInput)
            return 
        }
    }
    
    function mudarIcmsSimplesComercio(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIcmsSimplesComercial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIcmsSimplesComercial(valorInput)
            return 
        }
    }

    function mudarpisCoLucroRealComercial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroRealComercial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroRealComercial(valorInput)
            return 
        }
    }

    function mudarpisCoLucroRealLocacao(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroRealLocacao(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroRealLocacao(valorInput)
            return 
        }
    }

    function mudarpisCoLucroRealIndustrial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroRealIndustrial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroRealIndustrial(valorInput)
            return 
        }
    }

    function mudarpisCoLucroRealServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroRealServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroRealServAdquiridos(valorInput)
            return 
        }
    }

    function mudarIssLucroRealIndustrial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroRealIndustrial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroRealIndustrial(valorInput)
            return 
        }
    }

    function mudarIssLucroRealComercial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroRealComercial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroRealComercial(valorInput)
            return 
        }
    }

    function mudarIssLucroRealServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroRealServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroRealServAdquiridos(valorInput)
            return 
        }
    }

    function mudarpisCoLucroPresumidoComercial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroPresumidoComercial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroPresumidoComercial(valorInput)
            return 
        }
    }

    function mudarpisCoLucroPresumidoLocacao(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroPresumidoLocacao(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroPresumidoLocacao(valorInput)
            return 
        }
    }

    function mudarpisCoLucroPresumidoIndustrial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroPresumidoIndustrial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroPresumidoIndustrial(valorInput)
            return 
        }
    }

    function mudarpisCoLucroPresumidoServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setPisCoLucroPresumidoServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setPisCoLucroPresumidoServAdquiridos(valorInput)
            return 
        }
    }


    function mudarIssLucroPresumidoIndustrial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroPresumidoIndustrial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroPresumidoIndustrial(valorInput)
            return 
        }
    }

    function mudarIssLucroPresumidoComercial(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroPresumidoComercial(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroPresumidoComercial(valorInput)
            return 
        }
    }

    function mudarIssLucroPresumidoServAdquiridos(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value

        if(valorInput === ""){
            setIssLucroPresumidoServAdquiridos(valorInput)
            return 
        }

        const regexStrNum = /^\d*(?:[.,]\d*)?$/

        if(regexStrNum.test(valorInput)){
            setIssLucroPresumidoServAdquiridos(valorInput)
            return 
        }
    }

    return (
        <div className="flex flex-col gap-6 overflow-y-scroll h-[80vh]">
            <div className="flex gap-4 items-center">
                <label htmlFor="aliquotaIbs">Alíquota IBS</label>
                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                    <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={aliquotaIbs} onChange={(e) => mudarIbs(e)}/>
                    <div className=" px-1 flex items-center justify-center bg-gray-500">%</div>
                </div>
            </div>
            <div className="flex gap-4 items-center">
                <label htmlFor="aliquotaCb">Alíquota CBS</label>
                <div className="border-solid border-2 border-gray-500 rounded-md flex">
                    <input className="p-1 outline-none flex-1" type="text" id="aliquotaCbs" value={aliquotaCbs} onChange={(e) => mudarCbs(e)}/>
                    <div className=" px-1 flex items-center justify-center bg-gray-500">%</div>
                </div>
            </div>

            {/* Tabela Simples Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Simples Nacional</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    <div>   

                    </div>
                    <div>
                        Industrial
                    </div>
                    <div>
                        Serviços
                    </div>
                    <div>
                        Comercial
                    </div>
                    <div>
                        Locação
                    </div>

                    <div>
                        PIS-COFINS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoSimplesIndustrial" value={pisCoSimplesIndustria} onChange={(e) => mudarpisCoSimplesIndustria(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoSimplesServAdquiridos" value={pisCoSimplesServAdquiridos} onChange={(e) => mudarpisCoSimplesServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoSimplesComercial" value={pisCoSimplesComercio} onChange={(e) => mudarpisCoSimplesComercio(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoSimplesComercial" value={pisCoSimplesLocacao} onChange={(e) => mudarpisCoSimplesLocacao(e)}/>

                        </div>
                    </div>


                    <div>
                        IPI
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="ipiSimplesIndustrial" value={ipiSimplesIndustria} onChange={(e) => mudarIpiSimplesIndustria(e)}/>

                        </div>
                    </div>
                    <div>

                        {/*<div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={ipiSimplesServAdquiridos} onChange={(e) => mudarIpiSimplesServAdquiridos(e)}/>

                        </div>*/}
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>







                    {/*<div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={pisCoSimplesServAdquiridos} onChange={(e) => mudarpisCoSimplesServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={icmsSimplesServAdquiridos} onChange={(e) => mudarIcmsSimplesServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={issSimplesServAdquiridos} onChange={(e) => mudarIssSimplesServAdquiridos(e)}/>

                        </div>
                    </div>*/}





                    <div>
                        ICMS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="icmsSimplesIndustria" value={icmsSimplesIndustrial} onChange={(e) => mudarIcmsSimplesIndustria(e)}/>

                        </div>
                    </div>
                    <div>

                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="icmsSimplesComercio" value={icmsSimplesComercial} onChange={(e) => mudarIcmsSimplesComercio(e)}/>

                        </div>
                    </div>
                    <div>

                    </div>
                    

                    <div>
                        ISS
                    </div>
                    <div>

                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={issSimplesServAdquiridos} onChange={(e) => mudarIssSimplesServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>

                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
           {/* Fim Tabela Simples Serviços Adquiridos */}




            {/* Tabela lucro Real Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Lucro Real</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    <div>   

                    </div>
                    <div>
                        Industrial
                    </div>
                    <div>
                        Serviços
                    </div>
                    <div>
                        Comercial
                    </div>
                    <div>
                        Locação
                    </div>

                    <div>
                        PIS-COFINS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroRealIndustrial" value={pisCoLucroRealIndustrial} onChange={(e) => mudarpisCoLucroRealIndustrial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroRealServAdquiridos" value={pisCoLucroRealServAdquiridos} onChange={(e) => mudarpisCoLucroRealServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroRealComercial" value={pisCoLucroRealComercial} onChange={(e) => mudarpisCoLucroRealComercial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroRealComercial" value={pisCoLucroRealLocacao} onChange={(e) => mudarpisCoLucroRealLocacao(e)}/>

                        </div>
                    </div>

                    <div>
                        IPI
                    </div>
                    <div>

                    </div>
                    <div>

                        {/*<div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={ipiSimplesServAdquiridos} onChange={(e) => mudarIpiSimplesServAdquiridos(e)}/>

                        </div>*/}
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>







                    {/*<div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={pisCoSimplesServAdquiridos} onChange={(e) => mudarpisCoSimplesServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={icmsSimplesServAdquiridos} onChange={(e) => mudarIcmsSimplesServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={issSimplesServAdquiridos} onChange={(e) => mudarIssSimplesServAdquiridos(e)}/>

                        </div>
                    </div>*/}





                    <div>
                        ICMS
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>    



                    <div>
                        ISS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroRealIndustrial" value={issLucroRealIndustrial} onChange={(e) => mudarIssLucroRealIndustrial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroRealServAdquiridos" value={issLucroRealServAdquiridos} onChange={(e) => mudarIssLucroRealServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroRealComercial" value={issLucroRealComercial} onChange={(e) => mudarIssLucroRealComercial(e)}/>

                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            {/* Fim Tabela Lucro Real Serviços Adquiridos */}





            {/* Tabela lucro Presumido Serviços Adquiridos */}
            <div className="flex flex-col gap-2 pt-8 w-[90%]">
                <div className="font-bold">Alíquotas padrões utilizadas nas aquisições de empresas do Lucro Presumido</div>
                <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-md p-2">
                    <div>   

                    </div>
                    <div>
                        Industrial
                    </div>
                    <div>
                        Serviços
                    </div>
                    <div>
                        Comercial
                    </div>
                    <div>
                        Locação
                    </div>


                    <div>
                        PIS-COFINS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroPresumidoIndustrial" value={pisCoLucroPresumidoIndustrial} onChange={(e) => mudarpisCoLucroPresumidoIndustrial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroPresumidoServAdquiridos" value={pisCoLucroPresumidoServAdquiridos} onChange={(e) => mudarpisCoLucroPresumidoServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroPresumidoComercial" value={pisCoLucroPresumidoComercial} onChange={(e) => mudarpisCoLucroPresumidoComercial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="pisCoLucroPresumidoComercial" value={pisCoLucroPresumidoLocacao} onChange={(e) => mudarpisCoLucroPresumidoLocacao(e)}/>

                        </div>
                    </div>


                    <div>
                        IPI
                    </div>
                    <div>

                    </div>
                    <div>

                        {/*<div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={ipiSimplesServAdquiridos} onChange={(e) => mudarIpiSimplesServAdquiridos(e)}/>

                        </div>*/}
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>






                    {/*<div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={pisCoSimplesServAdquiridos} onChange={(e) => mudarpisCoSimplesServAdquiridos(e)}/>
                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={icmsSimplesServAdquiridos} onChange={(e) => mudarIcmsSimplesServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="aliquotaIbs" value={issSimplesServAdquiridos} onChange={(e) => mudarIssSimplesServAdquiridos(e)}/>

                        </div>
                    </div>*/}





                    <div>
                        ICMS
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                    <div>

                    </div>


                    <div>
                        ISS
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroPresumidoIndustrial" value={issLucroPresumidoIndustrial} onChange={(e) => mudarIssLucroPresumidoIndustrial(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroPresumidoServAdquiridos" value={issLucroPresumidoServAdquiridos} onChange={(e) => mudarIssLucroPresumidoServAdquiridos(e)}/>

                        </div>
                    </div>
                    <div>
                        <div className="border-solid border-2 border-gray-500 rounded-md flex">
                            <input className="p-1 outline-none flex-1" type="text" id="issLucroPresumidoComercial" value={issLucroPresumidoComercial} onChange={(e) => mudarIssLucroPresumidoComercial(e)}/>

                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
            {/* Fim Tabela Lucro Presumido Serviços Adquiridos */}


        </div>
    )
}