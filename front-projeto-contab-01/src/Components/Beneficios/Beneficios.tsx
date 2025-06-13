import { useEffect, useState } from "react"
import iconeSimulador from "../../assets/images/iconeSimulador.svg"
import iconeEnsino from "../../assets/images/iconeEnsino.svg"
import iconeIa from "../../assets/images/iconeIA.svg"
import iconeLeis from "../../assets/images/iconeLeis.svg"
import iconePodcast from "../../assets/images/iconePodcast.svg"
import iconeDivulgacao from "../../assets/images/iconeDivulgacao.svg"
import seta from "../../assets/images/setaBranca.svg"
import ItemSlideBeneficios from "../ItemSlideBeneficios/ItemSlideBeneficio"
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal"

export default function Beneficios(){
    type objBeneficiosType = {
        icone: string,
        titulo: string,
        desc: string
    }


    const [slideIndex, setSlideIndex] = useState<number>(0)
    const [mLeft, setMLeft] = useState<string>("0")
    const [setaEsqDesativada, setSetaEsqDesativada] = useState<boolean>(true)
    const [setaDirDesativada, setSetaDirDesativada] = useState<boolean>(false)


    const arrBeneficios: objBeneficiosType[] = [
        {icone: iconeSimulador, titulo: "Simulador de Impactos", desc: "Entenda de forma prática como a Reforma Tributária afetará seu negócio, não é uma mera substituição de impostos, é uma nova forma de trabalhar as mudanças impactam regras e processos fiscais, contábeis, financeiros, comerciais, jurídicos e logísticos."},
        {icone: iconeEnsino, titulo: "Plataforma de ensino", desc: "Mais de 60 aulas gravadas com conteúdos práticos a respeito da Reforma Tributária e Lei Complementar 214/2025, além de webinars e grupo de estudo para atualizações a respeito do tema, atendendo tanto a Contadores, quanto Empresários."},
        {icone: iconeIa, titulo: "I.A Especialista", desc: "A Ivana é a Inteligência Artificial especialista em Reforma Tributária da Contadores SA, com interação junto a Lei 214/2025, entendimento das regras de custo, precificação, margem, ajuste de carga tributária e conhecimento aplicado sobre a transição de 2026 e 2033.  Mais de duas mil consultas já feitas."},
        {icone: iconeLeis, titulo: "Legislação Facilitada – LC 214/2025", desc: "A Lei Complementar 214/2025 apresentada de forma estruturada e navegável, com apoio da nossa Inteligência Artificial para facilitar a consulta, compreensão dos dispositivos e identificação dos pontos mais relevantes da Reforma Tributária — sem complicações."},
        {icone: iconePodcast, titulo: "Podcasts - Conversas que transformam", desc: "Bate-papos com contadores, empresários e consultores que estão vivendo, na prática, os desafios e as oportunidades antes e durante a Reforma Tributária. Descubra como eles estão se posicionando, adaptando estratégias e encarando as mudanças do cenário contábil brasileiro."},
    ]
    

  const naTela = 3;
  const maxIndex = arrBeneficios.length - naTela

  function beneficiosSlideFn(direcao: "direita" | "esquerda") {
    console.log("aitvou fn")
    if (direcao === "direita") {
      setSlideIndex((prev) => Math.min(prev + 1, maxIndex))
    } else {
      setSlideIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  useEffect(() => {
    console.log(slideIndex)
    setMLeft( `calc(-${slideIndex * 25}vw - ${slideIndex * 50}px)`)

    if(slideIndex == 0){
      setSetaEsqDesativada(true)
    }else{
      setSetaEsqDesativada(false)
    }

    if(slideIndex == arrBeneficios.length - naTela){
      setSetaDirDesativada(true)
    }else{
      setSetaDirDesativada(false)
    }

  }, [slideIndex])



    return (
        <div className="py-paddingYSecoesPagPrincipal px-paddingXSecoesPagPrincipal">

            <div className="mb-24">
              <TitulosPagPrincipal alinhamento="start" texto="Benefícios" />
            </div>

            <div className="inline-flex mb-12">    
                <div className={`flex transition-all duration-500 ease-in-out`} style={{ marginLeft: mLeft }}>
                    {
                        arrBeneficios.map((beneficio, index) => {
                            return (
                                <ItemSlideBeneficios emColunas={false} beneficio={beneficio} index={index} />
                            )
                        })
                    }
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <div onClick={() => {beneficiosSlideFn("esquerda")}} className={`p-4 ${setaEsqDesativada ? "bg-premiumBg border-gray-400" : "bg-fundoCinzaEscuro border-white hover:animate-pulsar"} group rounded-md border-solid border-2  cursor-pointer`}>
                  <img className={`h-4 w-auto object-cover rotate-180 ${setaEsqDesativada ? "" : "group-hover:animate-quicar2"} `} src={seta} alt="seta esquerda" />
                </div>
                <div onClick={() => {beneficiosSlideFn("direita")}} className={`p-4 ${setaDirDesativada ? "bg-premiumBg border-gray-400" : "bg-fundoCinzaEscuro border-white hover:animate-pulsar"} group  bg-fundoCinzaEscuro rounded-md border-solid border-2 cursor-pointer`}>
                  <img className={`h-4  w-auto ${setaDirDesativada ? "" : "group-hover:animate-quicar"} object-cover`} src={seta} alt="seta direita" />
                </div>
            </div>


        </div>
    )
}