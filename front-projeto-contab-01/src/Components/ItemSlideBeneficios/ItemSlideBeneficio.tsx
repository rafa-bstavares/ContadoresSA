import { useEffect, useRef, useState } from "react"
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
    beneficio: {
        icone: string,
        titulo: string,
        desc: string
    },
    index: number,
    emColunas: boolean
}

gsap.registerPlugin(ScrollTrigger);

export default function ItemSlideBeneficios({beneficio, index, emColunas}: Props){

    const [translateY, setTranslateY] = useState<string>("50%")
    const [opacity, setOpacity] = useState<string>("0")


      const containerRef = useRef<HTMLDivElement>(null);


      useGSAP(() => {
            const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",     // quando a base do elemento chegar a 90% da viewport
            onEnter: () => {
                    const delay = emColunas ? 0 : index * 200

                    setTimeout(() => {
                        setTranslateY("0%")
                        setOpacity("100")
                    }, delay)
            },
            onLeaveBack: () => {
                    setTranslateY("50%")
                    setOpacity("0")
            },
            // se não precisar desfazer, comente o onLeaveBack
            });


      }, [])


    return(
            <div ref={containerRef} style={{transform: `translateY(${translateY})`}} className={`flex transition-all duration-500 ease-in-out  opacity-${opacity} ${emColunas? "" : index == 0 ? "mr-[25px]" : "mx-[25px]"} flex-col items-start px-8 py-12 w-[25vw] rounded-md bg-fundoCinzaEscuro border-2 border-solid border-white`}>
                <div className="p-4 mb-12 border-solid border-white bg-fundoPreto border-1 rounded-md">
                    <img className="w-6 h-auto object-cover" src={beneficio.icone} alt="" />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="text-3xl">
                        {beneficio.titulo}
                    </div>
                    <div className="text-gray-400 ">
                        {beneficio.desc}
                    </div>
                </div>
            </div>
    )
}