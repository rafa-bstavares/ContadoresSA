
type Props = {
    alinhamento: "center" | "start",
    texto: string
}

export default function TitulosPagPrincipal({alinhamento, texto}: Props){
    return (
        <div className={`text-${alinhamento} text-5xl`}>
            {texto}
        </div>  
    )
}