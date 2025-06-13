export function InputReais({
  value,
  onChange,
}: {
  value: string;
  onChange: (valorNumerico: number) => void;
}) {
  const formatarReais = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (!apenasNumeros) return "";

    const formatado = parseInt(apenasNumeros, 10).toLocaleString("pt-BR");
    return formatado;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, "");
    const numero = parseInt(apenasNumeros, 10);

    if (!isNaN(numero)) {
      onChange(numero)
    } else {
      onChange(0)
    }
  };

  return (
    <input
      inputMode="numeric"
      pattern="\d*"
      value={formatarReais(value)}
      onChange={handleChange}
      className="outline-none border-2 border-solid border-white rounded-md px-4 py-2 w-full"
    />
  );
}