import { BotaoGeral } from "../BotaoGeral/BotaoGeral";



export function Incorporacao(){
    return (
            <div className="">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-3xl mb-2">
                            Incorporação
                        </div>
                        <div>
                            <BotaoGeral onClickFn={() => {}} principalBranco={true} text="Adicionar Novo Imóvel (Locação)"/>
                        </div>
                    </div>
                </div>

            </div>
    )
}