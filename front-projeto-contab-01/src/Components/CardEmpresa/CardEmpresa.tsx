import { Dispatch, SetStateAction, useEffect, useState } from "react"
import iconeEmpresa from "../../assets/images/iconeEmpresa.svg"
import { empresasType } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"

type Props = {
    item: empresasType,
    setModoModal: Dispatch<SetStateAction<"Adicionar" | "Editar">>,
    setValoresIniciais: Dispatch<SetStateAction<null | empresasType>>,
    setModalAberto: Dispatch<SetStateAction<boolean>>
}

export function CardEmpresa({item, setModoModal, setValoresIniciais, setModalAberto}: Props){

    const [regimeTratado, setRegimeTratado] = useState<"Simples Nacional" | "Lucro Real" | "Lucro Presumido">()
    const [verMaisAberto, setVerMaisAberto] = useState<boolean>(false)


    useEffect(() => {
        switch(item.regime_tributario){
            case "LUCRO_PRESUMIDO":
                setRegimeTratado("Lucro Presumido")
                break
            
            case "LUCRO_REAL":
                setRegimeTratado("Lucro Real")
                break
            
            case "SIMPLES_NACIONAL":
                setRegimeTratado("Simples Nacional")
                break
        }
    })


    function cliqueBotaoDetalhes(){
        setVerMaisAberto(!verMaisAberto)
    }

    function EditarFn(){
        setModalAberto(true)
        setModoModal("Editar")
        setValoresIniciais(item)
    }

    return (
        <div className="flex flex-col gap-6 p-6 rounded-2xl border-2 border-solid border-white bg-fundoCinzaEscuro w-[23vw]">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                    <div className="w-6">
                        <img className="w-full h-auto object-cover" src={iconeEmpresa} alt="icone empresa" />
                    </div>
                    <div className="text-2xl font-bold">
                        {item.nome_fantasia ? item.nome_fantasia : "Nome Empresa"}
                    </div>
                </div>
                <div>
                    <BotaoGeral principalBranco={true} text="Editar" onClickFn={EditarFn}/>
                </div>
            </div>
            <div>
                <span className="text-xl">CNPJ:</span> {item.cnpj}
            </div>
            <div>
                <span className="text-xl">Regime Tributário:</span> {regimeTratado}
            </div>
            {
                (item.cnaes.length > 0 || item.razao_social || item.regularidade !== undefined || item.uf || item.folha) && 
                <div>
                    <div className={`grid ${verMaisAberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} transition-all duration-500 ease-in-out`}>
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-6">
                                
                                {
                                    (item.cnaes.length > 0) && 
                                    <div className="flex gap-2 items-center flex-wrap">
                                        <span className="text-xl">CNAES: </span>
                                        {
                                            item.cnaes.map(cnae => (
                                                <div>
                                                    {cnae}
                                                </div>
                                            ))
                                        }
                                    </div> 
                                }

                                {
                                    (item.folha !== undefined) &&
                                    <div>
                                        <span className="text-xl">Folha de Pagamento:</span> {item.folha} 
                                    </div>
                                }

                                {
                                    item.razao_social &&
                                    <div>
                                        <span className="text-xl">Razão Social:</span> {item.razao_social}
                                    </div>
                                }

                                {
                                    (item.regularidade !== undefined) && 
                                    <div>
                                        <span className="text-xl">Regular:</span> {item.regularidade ? "Sim" : "Não"}
                                    </div>
                                }

                                {
                                    item.uf &&
                                    <div>
                                        <span className="text-xl">UF:</span> {item.uf}
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <BotaoGeral principalBranco={false} text={`${verMaisAberto ? "Ver Menos" : "Ver Mais"}`} onClickFn={cliqueBotaoDetalhes}/>
                    </div>
                </div>
            }
        </div>
    )
}