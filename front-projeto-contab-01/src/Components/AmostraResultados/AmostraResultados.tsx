import DescPagPrincipal from "../DescPagPrincipal/DescPagPrincipal";
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal";
import mockupTras from "../../assets/images/mockupTras.png"
import mockupFrente from "../../assets/images/mockupFrente.png"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral";
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";


gsap.registerPlugin(ScrollTrigger);



export default function AmostraResultados(){

    const containerRef = useRef<HTMLDivElement>(null)
    const celular1Ref = useRef<HTMLDivElement>(null)
    const celular2Ref = useRef<HTMLDivElement>(null)


    useGSAP(() => {
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",

        })

        gsap.to(celular1Ref.current, {
            rotate: 0,     
            transform: "translate(0%, 0%)",          // final da rotação
            ease: "power1.out",          // sem easing, para scrub ficar linear
            scrollTrigger: {
                trigger: containerRef.current,  // ponto de referência
                start:   "top 90%",   // quando o topo do container atingir 90% da viewport
                end:     "top 40%", // quando o bottom do container atingir o bottom da viewport
                scrub:   2,        // vincula progresso da animação ao scroll
            },
        });

        gsap.to(celular2Ref.current, {
            rotate: 0, 
            transform: "translate(-20%, 0%)",            // final da rotação
            ease: "power1.out",          // sem easing, para scrub ficar linear
            scrollTrigger: {
                trigger: containerRef.current,  // ponto de referência
                start:   "top 90%",   // quando o topo do container atingir 90% da viewport
                end:     "top 40%", // quando o bottom do container atingir o bottom da viewport
                scrub:   2,        // vincula progresso da animação ao scroll
            },
        });
    }, [])



    return (
        <div ref={containerRef} className="flex pb-paddingYSecoesPagPrincipal px-paddingXSecoesPagPrincipal">
            <div className="flex-1 flex flex-col justify-center gap-4 ">
                <div className="w-2/3">
                    <TitulosPagPrincipal alinhamento="start" texto="Resultados como você nunca viu"/>
                </div>
                <div className="w-4/5">
                    <DescPagPrincipal texto="Nossa resposta consegue satisfazer do mais prático ao mais detalhista, com diversos gráficos e textos dispostos de maneira estratégica para você entender tudo sobre os impactos da reforma tributária no seu negócio!"/>
                </div>
                <div className="w-2/3 mt-12">
                    <BotaoGeral onClickFn={() => {}} principalBranco={true} text="Ver Planos" tamanhoGrande={true}/>
                </div>
                
            </div>
            <div className="flex-1">
                <div className="flex relative h-full w-full">
                    <div ref={celular1Ref} className=" w-1/2 h-[70vh] right-1/2 bottom-0 -rotate-60 translate-x-[-180%] translate-y-[50%]">
                        <img className="h-auto w-full object-cover" src={mockupTras} alt="mockup iphone" />
                    </div>
                    <div ref={celular2Ref} className=" z-10 w-1/2 h-[70vh] left-1/2 bottom-0 rotate-60 translate-x-180%] translate-y-[50%]">
                        <img className="h-auto w-full object-cover" src={mockupFrente} alt="mockup iphone" />
                    </div>
                </div>
            </div>

        </div>
    )
}