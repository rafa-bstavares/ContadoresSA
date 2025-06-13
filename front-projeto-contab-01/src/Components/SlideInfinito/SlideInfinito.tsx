import iconeSimulador from "../../assets/images/iconeSimulador.svg"
import iconeEnsino from "../../assets/images/iconeEnsino.svg"
import iconeIa from "../../assets/images/iconeIA.svg"
import iconeLeis from "../../assets/images/iconeLeis.svg"
import iconePodcast from "../../assets/images/iconePodcast.svg"
import iconeDivulgacao from "../../assets/images/iconeDivulgacao.svg"


type itemAtualType = {
    icone: string,
    texto: string
}



export default function SlideInfinito(){

    const arraySlide: itemAtualType[] = [
        {icone: iconeSimulador, texto: "Simulador de Impactos"},
        {icone: iconeEnsino, texto: "Plataforma de ensino"},
        {icone: iconeIa, texto: "I.A Especialista em Reforma Tributária"},
        {icone: iconeLeis, texto: "Artigos e Legislação facilitada"},
        {icone: iconePodcast, texto: "Podcasts e Rede Organica de Aprendizado"},
        {icone: iconeDivulgacao, texto: "Canal para obtenção e divulgação de serviços"},
    ]



    return (
        <div className="overflow-hidden w-screen relative z-20 opacity-60">
            <div className="inline-flex whitespace-nowrap animate-slideInfinito">
            {
                [...arraySlide, ...arraySlide].map(item => {
                    return (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-md mx-2 bg-fundoCinzaEscuro text-white">
                        <div className="h-4 w-4">
                            <img className="object-cover h-full w-full" src={item.icone} alt={`Icone ${item.texto}`} />
                        </div>
                        <div className="text-lg">
                            {item.texto}
                        </div>
                    </div>
                    )
                })
            }
            </div>
        </div>
    )
}