
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react"
import { beneficiosPorNcmType } from "../ModalConferirBeneficios/ModalConferirBeneficios"
import { ContextoProduto } from "../../Contextos/ContextoProduto/ContextoProduto"
import { ToggleButton } from "../ToggleButton/ToggleButton"

type Props = {
    index: number, 
    linhaBeneficio: beneficiosPorNcmType,
    beneficiosPorNcm: beneficiosPorNcmType[],
    setBeneficiosPorNcm: Dispatch<SetStateAction<beneficiosPorNcmType[]>>
}


export function ItemBeneficioNcm({index, linhaBeneficio, beneficiosPorNcm, setBeneficiosPorNcm}: Props){


    const [beneficioAtual, setBeneficioAtual] = useState<string>(linhaBeneficio.reducao.toString().replace(".", ","))
    const [aliquotaIvaAtual, setAliquotaIvaAtual] = useState<number>(linhaBeneficio.aliquotaIva)
    const [manterBeneficioAtual, setManterBeneficioAtual] = useState<boolean>(linhaBeneficio.manter)

    const {setTotalProdutosAdquiridos, setTotalProdutosVendidos, totalProdutosAdquiridos, totalProdutosVendidos} = useContext(ContextoProduto)


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


    function mudarBeneficioFn(e: ChangeEvent<HTMLInputElement>, item: beneficiosPorNcmType){
        // O retornaInputPorcentagem sempre retorna uma string no formato brasileiro de porcentagem, ou seja, o único caracter possível além de números é vírgula
        let inputTratado = retornaInputPorcentagemTratado(e)

        // Mudar valor na tela do modal
        setBeneficioAtual(inputTratado ? inputTratado : "")


        // Só preciso trocar a vírgula por ponto para passar pra number
        inputTratado = inputTratado?.replace(",", ".")


        // Alterar os Arrays que vão para o backend
        if(item.origem == "Produto Adquirido"){          
            const totalProdutosAdquiridosClone = [...totalProdutosAdquiridos]
            const idxEditar = totalProdutosAdquiridosClone.findIndex(produtosAdquiridosClone => produtosAdquiridosClone.id == item.id)
            if(idxEditar > -1){
                totalProdutosAdquiridos[idxEditar].beneficio = Number(inputTratado)
                // Mudar a aliquota IVA
                const novoValorAliquotaIVA = 0.28 - (Number(inputTratado) * 0.28)
                setAliquotaIvaAtual(novoValorAliquotaIVA)
            }

            setTotalProdutosAdquiridos(totalProdutosAdquiridosClone)

        }else if(item.origem == "Produto Vendido"){
            const totalProdutosVendidosClone = [...totalProdutosVendidos]
            const idxEditar = totalProdutosVendidosClone.findIndex(produtosVendidosClone => produtosVendidosClone.id == item.id)
            if(idxEditar > -1){
                totalProdutosVendidos[idxEditar].beneficio = Number(inputTratado)
                // Mudar a aliquota IVA
                const novoValorAliquotaIVA = 0.28 - (Number(inputTratado) * 0.28)
                setAliquotaIvaAtual(novoValorAliquotaIVA)
            }
            setTotalProdutosVendidos(totalProdutosVendidosClone)
        }

        // Alterar o beneficio Por Ncm só pra garantir
            const beneficiosPorNcmClone = [...beneficiosPorNcm]
            const idxIdBeneficios = beneficiosPorNcmClone.findIndex(elem => elem.id == item.id)
            if(idxIdBeneficios > -1){
                beneficiosPorNcm[idxIdBeneficios].reducao = Number(inputTratado)
            }
            setBeneficiosPorNcm(beneficiosPorNcmClone)
    }

    function retornarValorPorcentagem(num: number){
        return (num * 100).toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " %"
    }

    function mudarManterBeneficio(item: beneficiosPorNcmType){
        // Alterar os Arrays que vão para o backend
        if(item.origem == "Produto Adquirido"){          
            const totalProdutosAdquiridosClone = [...totalProdutosAdquiridos]
            const idxEditar = totalProdutosAdquiridosClone.findIndex(produtosAdquiridosClone => produtosAdquiridosClone.id == item.id)
            if(idxEditar > -1){
                // Mudar manter beneficio tela modal
                setManterBeneficioAtual(!manterBeneficioAtual)

                //mudar manter beneficio que vai pro backend
                totalProdutosAdquiridos[idxEditar].manterBeneficio = !manterBeneficioAtual
            }

            setTotalProdutosAdquiridos(totalProdutosAdquiridosClone)

        }else if(item.origem == "Produto Vendido"){
            const totalProdutosVendidosClone = [...totalProdutosVendidos]
            const idxEditar = totalProdutosVendidosClone.findIndex(produtosVendidosClone => produtosVendidosClone.id == item.id)
            if(idxEditar > -1){
                // Mudar manter beneficio tela modal
                setManterBeneficioAtual(!manterBeneficioAtual)

                //mudar manter beneficio que vai pro backend
                totalProdutosVendidos[idxEditar].manterBeneficio = !manterBeneficioAtual
            }
            setTotalProdutosVendidos(totalProdutosVendidosClone)
        }
    }


    return (
        <div className={`grid grid-cols-[100px_300px_repeat(3,_100px)] gap-10 items-center rounded-2xl p-4 ${index % 2 == 0? "bg-fundoPreto" : ""}`}>
            <div>{linhaBeneficio.ncm}</div>
            <div>{linhaBeneficio.descricaoAnexo}</div>
            <div className="flex flex-col">
                <input
                value={beneficioAtual}
                onChange={(e) => mudarBeneficioFn(e, linhaBeneficio)}
                inputMode="numeric"
                pattern="\d*"
                className="flex flex-col border-gray-300 border-solid border-2 rounded-md p-2 w-[100px]"
                /> 
            </div>
            <div>{retornarValorPorcentagem(aliquotaIvaAtual)}</div>
            <div>
                <ToggleButton onChangeFn={() => mudarManterBeneficio(linhaBeneficio)} valor={manterBeneficioAtual} texto=""/>
            </div>
        </div>
    )
}