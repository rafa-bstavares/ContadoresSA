
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { beneficiosPorCnaeType } from "../ModalConferirBeneficios/ModalConferirBeneficios"
import { objAtividadeFinal, objAtividadesAdquitidasType } from "../SegundoPasso/SegundoPasso"
import { ToggleButton } from "../ToggleButton/ToggleButton"

type Props = {
    index: number, 
    linhaBeneficio: beneficiosPorCnaeType,
    totalAtividadesPrestadas: objAtividadeFinal[],
    setTotalAtividadesPrestadas: Dispatch<SetStateAction<objAtividadeFinal[]>>,
    totalAtividadesAdquiridas: objAtividadesAdquitidasType[],
    setTotalAtividadesAdquiridas: Dispatch<SetStateAction<objAtividadesAdquitidasType[]>>,
    beneficiosPorCnae: beneficiosPorCnaeType[],
    setBeneficiosPorCnae: Dispatch<SetStateAction<beneficiosPorCnaeType[]>>
}


export function ItemBeneficioCnae({index, linhaBeneficio, beneficiosPorCnae, setBeneficiosPorCnae, setTotalAtividadesAdquiridas, setTotalAtividadesPrestadas, totalAtividadesAdquiridas, totalAtividadesPrestadas}: Props){


    const [beneficioAtual, setBeneficioAtual] = useState<string>(linhaBeneficio.reducao.toString().replace(".", ","))
    const [aliquotaIvaAtual, setAliquotaIvaAtual] = useState<number>(linhaBeneficio.aliquotaIva)
    const [manterBeneficioAtual, setManterBeneficioAtual] = useState<boolean>(linhaBeneficio.manter)

    function retornaInputPorcentagemTratado(e: ChangeEvent<HTMLInputElement>){
        const valorInput = e.target.value
        console.log("valor do input")
        console.log(valorInput)

        if(valorInput === ""){
            return "0"
        }

        const arrSeparadoVirgula = valorInput.split(",")
        console.log("arr separado pela virgula")
        console.log(arrSeparadoVirgula)

        const temVirgula = valorInput.split("").some(carac => carac == ",")

        console.log("tem virgula")
        console.log(temVirgula)

        //conferir se antes da virgula é só zero
        if(arrSeparadoVirgula[0].split("").every(carac => carac == "0")){
            if(temVirgula){
                return ("0," + arrSeparadoVirgula[1])
            }else{
                return "0"
            }

        }

        // Sem considerar casos de apenas zero antes da virgula

        // Se ta aqui é porque já não é só zero antes da virgula
        // Para o zero não ficar na frente no numero. Não ficar: 012, mas ficar: 12. Aqui só ativa se o valor antes da virgula tiver mais de um digito e se o primeiro desses digitos for zero
        if(arrSeparadoVirgula[0].length > 1 && arrSeparadoVirgula[0][0] == "0"){
            return (arrSeparadoVirgula[0].slice(1, 3) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
        }

        const regexStrNum = /^\d*(,\d*)?$/
        // qualquer valor que não cair nas excessoes anteriores
        if(regexStrNum.test(valorInput)){
            return (arrSeparadoVirgula[0].slice(0, 2) + (temVirgula ? "," : "") + (arrSeparadoVirgula[1] ? arrSeparadoVirgula[1] : ""))
        }
    }


    function mudarBeneficioFn(e: ChangeEvent<HTMLInputElement>, item: beneficiosPorCnaeType){
        // O retornaInputPorcentagem sempre retorna uma string no formato brasileiro de porcentagem, ou seja, o único caracter possível além de números é vírgula
        let inputTratado = retornaInputPorcentagemTratado(e)

        setBeneficioAtual(inputTratado ? inputTratado : "")


        // Só preciso trocar a vírgula por ponto para passar pra number
        inputTratado = inputTratado?.replace(",", ".")


        // Alterar os Arrays que vão para o backend
        if(item.origem == "Servico Adquirido"){          
            const totalAtividadesAdquiridasClone = [...totalAtividadesAdquiridas]
            const idxEditar = totalAtividadesAdquiridasClone.findIndex(atividadeClone => atividadeClone.id == item.id)
            if(idxEditar > -1){
                totalAtividadesAdquiridas[idxEditar].beneficio = Number(inputTratado)
                // Mudar a aliquota IVA
                const novoValorAliquotaIVA = 0.28 - (Number(inputTratado) * 0.28)
                setAliquotaIvaAtual(novoValorAliquotaIVA)
            }



            setTotalAtividadesAdquiridas(totalAtividadesAdquiridasClone)

        }else if(item.origem == "Servico Prestado"){
            const totalAtividadesPrestadasClone = [...totalAtividadesPrestadas]
            const idxEditar = totalAtividadesPrestadasClone.findIndex(atividadeClone => atividadeClone.id == item.id)
            if(idxEditar > -1){
                totalAtividadesPrestadas[idxEditar].beneficio = Number(inputTratado)
                // Mudar a aliquota IVA
                const novoValorAliquotaIVA = 0.28 - (Number(inputTratado) * 0.28)
                setAliquotaIvaAtual(novoValorAliquotaIVA)
            }
            setTotalAtividadesPrestadas(totalAtividadesPrestadasClone)
        }

        // Alterar o beneficio Por Cnae só pra garantir
            const beneficiosPorCnaeClone = [...beneficiosPorCnae]
            const idxIdBeneficios = beneficiosPorCnaeClone.findIndex(elem => elem.id == item.id)
            if(idxIdBeneficios > -1){
                beneficiosPorCnae[idxIdBeneficios].reducao = Number(inputTratado)
            }
            setBeneficiosPorCnae(beneficiosPorCnaeClone)
    }

    function retornarValorPorcentagem(num: number){
        return (num * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"
    }

    function mudarManterBeneficio(item: beneficiosPorCnaeType){
        // Alterar os Arrays que vão para o backend
        if(item.origem == "Servico Adquirido"){          
            const totalAtividadesAdquiridosClone = [...totalAtividadesAdquiridas]
            const idxEditar = totalAtividadesAdquiridosClone.findIndex(atividadesAdquiridosClone => atividadesAdquiridosClone.id == item.id)
            if(idxEditar > -1){
                // Mudar manter beneficio tela modal
                setManterBeneficioAtual(!manterBeneficioAtual)

                //mudar manter beneficio que vai pro backend
                totalAtividadesAdquiridas[idxEditar].manterBeneficio = !manterBeneficioAtual

                // Será que n preciso mudar o beneficiosPorCnae tb?

            }

            setTotalAtividadesAdquiridas(totalAtividadesAdquiridosClone)

        }else if(item.origem == "Servico Prestado"){
            const totalAtividadesPrestadasClone = [...totalAtividadesPrestadas]
            const idxEditar = totalAtividadesPrestadasClone.findIndex(atividadesPrestadasClone => atividadesPrestadasClone.id == item.id)
            if(idxEditar > -1){
                // Mudar manter beneficio tela modal
                setManterBeneficioAtual(!manterBeneficioAtual)

                //mudar manter beneficio que vai pro backend
                totalAtividadesPrestadas[idxEditar].manterBeneficio = !manterBeneficioAtual
            }
            setTotalAtividadesPrestadas(totalAtividadesPrestadasClone)
        }
    }

    return (
        <div className={`grid grid-cols-[100px_300px_repeat(3,_100px)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
            <div>{linhaBeneficio.cnae}</div>
            <div>{linhaBeneficio.descricao}</div>
            <div className="flex flex-col">
                <input
                value={beneficioAtual}
                onChange={(e) => mudarBeneficioFn(e, linhaBeneficio)}
                inputMode="numeric"
                pattern="\d*"
                className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2"
                /> 
            </div>
            <div>{retornarValorPorcentagem(aliquotaIvaAtual)}</div>
            <div>
                <ToggleButton onChangeFn={() => mudarManterBeneficio(linhaBeneficio)} valor={manterBeneficioAtual} texto=""/>
            </div>
        </div>
    )
}