import { NumericFormat, NumberFormatValues } from 'react-number-format';

type Props = {
    stateValor: string,
    onValueChange: (values: NumberFormatValues) => void
}

export function InputFinanceiro({stateValor, onValueChange}: Props){
    return (
            <NumericFormat
                value={stateValor}
                onValueChange={onValueChange}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                className="outline-none rounded-md border-2 border-solid border-gray-300 p-2"
            />
    )
}