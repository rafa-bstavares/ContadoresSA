import { BotaoGeral } from "../BotaoGeral/BotaoGeral";
import xis from "../../assets/images/xisContab.svg"
import { Dispatch, SetStateAction } from "react";

type Props = {
    fnNao: () => void,
    fnSim: () => void,
    setModalPerguntaBeneficiosAberto: Dispatch<SetStateAction<boolean>>
}


export function ModalPerguntaBeneficios({fnNao, fnSim, setModalPerguntaBeneficiosAberto}: Props){


    function fecharModal(){
        setModalPerguntaBeneficiosAberto(false)
    }


    return (
        <div className="fixed left-0 top-0 right-0 h-screen bg-black/90 flex justify-center items-center">
            <div className="flex flex-col gap-6 rounded-2xl bg-fundoCinzaEscuro p-12"> 
                <div className="flex justify-end">
                    <div onClick={fecharModal} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xis} alt="fechar modal login" />
                    </div>
                </div>
                <div>
                    Deseja conferir os benefícios encontrados?
                </div>
                <div className="flex gap-2 w-full justify-center">
                    <BotaoGeral onClickFn={fnNao} principalBranco={false} text="Não" />
                    <BotaoGeral onClickFn={fnSim} principalBranco={true} text="Sim" />
                </div>
            </div>
        </div>
    )
}