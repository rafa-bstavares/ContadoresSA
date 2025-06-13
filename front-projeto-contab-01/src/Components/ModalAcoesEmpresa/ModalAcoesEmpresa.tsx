import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { empresasType } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import xis from "../../assets/images/xisContab.svg"
import setaSeletor from "../../assets/images/setaSeletor2.svg"
import { InputReais } from "../InputReais/InputReais"
import { ufTypes } from "../../Contextos/ContextoUsuario/ContextoUsuario"

type Props = {
    modo: "Adicionar" | "Editar",
    valoresIniciais: null | empresasType,
    textoBotao: "Adicionar" | "Salvar",
    fnFinal: (cnpj: string, nome: string, uf: ufTypes, regime: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO", folha: number, faturamento_mensal_medio: number, idEmpresa: string ) => void,
    setModalAberto: Dispatch<SetStateAction<boolean>>
}




export function ModalAcoesEmpresa({fnFinal, modo, textoBotao, valoresIniciais, setModalAberto}: Props){

    const [inputCnpjModal, setInputCnpjModal] = useState<string>(valoresIniciais ? valoresIniciais.cnpj : "")
    const [inputNomeModal, setInputNomeModal] = useState<string>(valoresIniciais ? valoresIniciais.nome_fantasia ? valoresIniciais.nome_fantasia : "" : "")
    const [inputRazaoSocialModal, setInputRazaoSocialModal] = useState<string>(valoresIniciais ? valoresIniciais.razao_social ? valoresIniciais.razao_social : "" : "")
    const [inputFolhaModal, setInputFolhaModal] = useState<number>(valoresIniciais ? valoresIniciais.folha : 0)
    const [inputFaturamentoModal, setInputFaturamentoModal] = useState<number>(valoresIniciais ? valoresIniciais.faturamento_mensal_medio : 0)
    const [inputRegimeModal, setInputRegimeModal] = useState<"SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO">(valoresIniciais ? valoresIniciais.regime_tributario : "SIMPLES_NACIONAL")
    const [regimeTela, setRegimeTela] = useState<"Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "">()
    const [inputUf, setInputUf] = useState<ufTypes>(valoresIniciais ? (valoresIniciais.uf ? valoresIniciais.uf : "") : "")
    const [regimeAberto, setRegimeAberto] = useState<boolean>(false)
    const [ufAberto, setUfAberto] = useState<boolean>(false)

    const ufs: ufTypes[] = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
        "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
        "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ]

    type objOpRegime = {label: "Simples Nacional" | "Lucro Real" | "Lucro Presumido", valor: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO"}

    const regimeOpcoes: objOpRegime[] = [
        { label: "Simples Nacional", valor: "SIMPLES_NACIONAL" },
        { label: "Lucro Real",      valor: "LUCRO_REAL"     },
        { label: "Lucro Presumido", valor: "LUCRO_PRESUMIDO"}
    ]


    function fecharModal(){
        setModalAberto(false)
    }


    useEffect(() => {
        if(valoresIniciais){
            switch(valoresIniciais.regime_tributario){
                case "LUCRO_PRESUMIDO":
                    setRegimeTela("Lucro Presumido")
                    break
                
                case "LUCRO_REAL":
                    setRegimeTela("Lucro Real")
                    break
                
                case "SIMPLES_NACIONAL":
                    setRegimeTela("Simples Nacional")
                    break
            }
        }
    }, [])


    return (
        <div className="fixed left-0 top-0 right-0 h-screen bg-black/90 flex justify-center items-center">
            <div className="flex flex-col gap-6 rounded-2xl bg-fundoCinzaEscuro p-12"> 
                <div className="flex justify-end">
                    <div onClick={fecharModal} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xis} alt="fechar modal login" />
                    </div>
                </div>
                <div className="mb-4">
                    <TitulosPagPrincipal alinhamento="start" texto={`${modo == "Adicionar" ? "Adicionar Empresa" : "Editar Empresa"}`} />
                </div>
                <div className="flex flex-col">
                    <div>
                        CNPJ:
                    </div>
                    <input value={inputCnpjModal} onChange={(e) => setInputCnpjModal(e.target.value)} id="cnpjIn" type="number" placeholder='CNPJ ou CPF' className={`outline-none border-2 border-solid rounded-md px-4 py-2  w-full`}/>
                </div>

                <div className="flex flex-col ">
                    <div>
                        Nome Fantasia:
                    </div>
                    <input value={inputNomeModal} onChange={(e) => setInputNomeModal(e.target.value)} id="nomeIn" type="string" placeholder='Nome da Empresa' className={`outline-none border-2 border-solid rounded-md px-4 py-2  w-full `}/>
                </div>

                <div className="flex flex-col ">
                    <div>
                        UF
                    </div>
                    <div className="border-solid border-2 border-white  rounded-md" onClick={() => setUfAberto(!ufAberto)}>
                        <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                            <div>
                                {
                                    (inputUf || "Escolha")
                                }
                            </div>
                            <div
                                className={`
                                ${ufAberto ? "rotate-180" : "rotate-0"}
                                transition-all ease-linear duration-500
                                `}
                            >
                                <img
                                src={setaSeletor}
                                alt="seta-seletor"
                                className="w-4 h-4"
                                />
                            </div>
                        </div>
                        <div className={`grid transition-all duration-500 ease-in-out ${ufAberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="max-h-[30vh] overflow-y-auto">
                                <div className="flex flex-col">
                                    {ufs.map(uf => (
                                        <div
                                        key={uf}
                                        className="py-2 px-4 cursor-pointer rounded-md hover:bg-fundoPreto"
                                        onClick={() => {
                                            setInputUf(uf)
                                            setRegimeAberto(false)
                                        }}
                                        >
                                        {uf}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> 

                </div>

                
                <div className="flex flex-col ">
                    <div>
                        Regime Tributário
                    </div>
                    <div className="border-solid border-2 border-white  rounded-md" onClick={() => setRegimeAberto(!regimeAberto)}>
                        <div className="flex justify-between items-center px-4 py-2 cursor-pointer">
                            <div>
                                {
                                    (regimeTela || "Escolha")
                                }
                            </div>
                            <div
                                className={`
                                ${regimeAberto ? "rotate-180" : "rotate-0"}
                                transition-all ease-linear duration-500
                                `}
                            >
                                <img
                                src={setaSeletor}
                                alt="seta-seletor"
                                className="w-4 h-4"
                                />
                            </div>
                        </div>
                        <div className={`grid transition-all duration-500 ease-in-out ${regimeAberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className="overflow-hidden">
                                <div className="flex flex-col">
                                    {regimeOpcoes.map(opt => (
                                        <div
                                        key={opt.label}
                                        className="py-2 px-4 cursor-pointer rounded-md hover:bg-fundoPreto"
                                        onClick={() => {
                                            setInputRegimeModal(opt.valor)
                                            setRegimeTela(opt.label)
                                            setRegimeAberto(false)
                                        }}
                                        >
                                        {opt.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col ">
                    <div>
                        Folha:
                    </div>
                    <InputReais onChange={(num) => setInputFolhaModal(num)} value={inputFolhaModal.toString()} />
                </div>


                <div className="flex flex-col ">
                    <div>
                        Faturamento Médio Mensal:
                    </div>
                    <InputReais onChange={(num) => setInputFaturamentoModal(num)} value={inputFaturamentoModal.toString()} />
                </div>


                <BotaoGeral onClickFn={() => fnFinal(inputCnpjModal, inputNomeModal, inputUf, inputRegimeModal, inputFolhaModal, inputFaturamentoModal, valoresIniciais? valoresIniciais.id : "")} principalBranco={true} text={textoBotao} />



            </div>
        </div>
    )
}