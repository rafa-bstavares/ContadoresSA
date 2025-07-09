import { ContextoConfiguracoes } from "../../Contextos/ContextoConfiguracoes/ContextoConfiguracoes"
import { ContextoParametrosOpcionais } from "../../Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais"
import { useContext, useEffect, useState } from "react"
import xisConfig from "../../assets/images/xisContab.svg"
import { ParametrosEntrada } from "../ParametrosEntrada/ParametrosEntrada"
import { Comp2 } from "../Comp2.tsx/Comp2"
import { ContextoErro } from "../../Contextos/ContextoErro/ContextoErro"


export function Configuracoes(){

    type ObjOpcao = {
        nome: string,
        ativo: boolean,
        componente: React.ReactElement
    }

    const {setConfigAberta} = useContext(ContextoConfiguracoes)
    const {aliquotasIva} = useContext(ContextoParametrosOpcionais)
    const {setTemErro, setTextoErro} = useContext(ContextoErro)

    const opcoesConfigIniciais = [
        {
            nome: "Parâmetros de entrada",
            ativo: true,
            componente: <ParametrosEntrada/>
        },
        {
            nome: "Segunda opção",
            ativo: false,
            componente: <Comp2/>
        }
    ]

    const [opcoesConfig, setOpcoesConfig] = useState<ObjOpcao[]>(opcoesConfigIniciais)

    function fecharConfig(){
        setConfigAberta(false)
    }

    function escolheuOpcao(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        let novoArrConfig: ObjOpcao[] = []

        const itemAtivo = opcoesConfig.find(item => item.ativo === true)
        if(itemAtivo?.nome == "Parâmetros de entrada"){
            if(aliquotasIva.cbs == "" || aliquotasIva.ibs == ""){
                console.log("Todos os parâmetros precisam estar preenchidos")
                setTemErro(true)
                setTextoErro("Todos os parâmetros precisam estar preenchidos")
                return 
            }
        }

        opcoesConfig.map(item => {
            let novoObjAtual = {nome: item.nome, ativo: item.ativo, componente: item.componente}

            // Se eu clicar em outro tenho que desmarcar o atual
            if(item.ativo == true && e.currentTarget.textContent !== item.nome){
                novoObjAtual.ativo = false
            }

            // Se eu clicar em alguém que não estava selecionado tenho que selecionar
            if(item.nome == e.currentTarget.textContent && item.ativo == false){
                novoObjAtual.ativo = true
            }

            novoArrConfig.push(novoObjAtual)

            return item
        })

        setOpcoesConfig(novoArrConfig)

    }

    useEffect(() => {
        console.log(opcoesConfig)
    }, [opcoesConfig])

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/90 flex justify-center items-center [font-family:'Manrope',sans-serif]">
            <div className=" flex flex-col w-1/2 h-[90vh]  rounded-2xl
                border border-[#ffffff22]
                ring-1 ring-[#FFDD00]/30
                shadow-[0_0_40px_#FFDD0055]
                bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,_#695c0095,_rgb(18,18,18)_80%)]
                backdrop-blur-2xl relative p-4">
                <div className="flex justify-end h-6 ">
                    <div onClick={fecharConfig} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xisConfig} alt="fechar"/>
                    </div>
                </div>

                <div className="flex w-full flex-1">
                    <div className="w-1/5 h-[90vh]">
                        {
                            opcoesConfig.map(item => <div onClick={(e) => {escolheuOpcao(e)}} className={`p-2 text-sm text-white rounded-md cursor-pointer ${item.ativo ? "bg-[#46410a]" : "hover:bg-[#2f2d18]"}`}>{item.nome}</div>)
                        }
                    </div>
                    <div className="w-full h-[90vh] pt-4 pl-4">
                        {
                            opcoesConfig.map(item => {

                                if(item.ativo){
                                    return <div className="text-white">{item.componente}</div>
                                }

                            })
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}