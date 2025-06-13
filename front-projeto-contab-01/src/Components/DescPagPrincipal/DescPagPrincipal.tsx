
type Props = {
    texto: string
}


export default function DescPagPrincipal({texto}: Props){
    return (
        <div className="text-gray-400 ">
            {texto}
        </div>
    )
}