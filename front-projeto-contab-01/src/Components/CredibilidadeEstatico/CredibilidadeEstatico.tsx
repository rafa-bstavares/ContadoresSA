



export function CredibilidadeEstatico(){


    const textos = [
        '+300 clientes satisfeitos',
        '+100 parceiros',
        '+1M faturados',
      ]



    return (
        <div className="flex gap-4">
            {
                textos.map(item => {
                    return (
                        <div className="text-white text-3xl rounded-md border-solid border-2 border-fundoCinzaEscuro bg-fundoPreto px-4 py-8">
                            {item}
                        </div>
                    )
                })
            }      
        </div>
    )
}