import { useEffect, useRef, useState } from "react"
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal";
import SlideParceirosVertical from "../SlideParceirosVertical/SlideParceirosVertical";


gsap.registerPlugin(ScrollTrigger);

export default function Credibilidade2(){

    const [numHoras, setNumHoras] = useState<number>(4000)
    const [numExperiencia, setNumExperiencia] = useState<number>(0)
    const [numParceiros, setNumParceiros] = useState<number>(0)
    const [numCenarios, setNumCenarios] = useState<number>(0)
    const [ativarAnimacao, setAtivarAnimacao] = useState<boolean>(false)

    const containerRef = useRef<HTMLDivElement>(null);
    

    useGSAP(() => {

        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 90%",
            onEnter: () => {
                setAtivarAnimacao(true)
            },
            onLeaveBack: () => {
                setNumHoras(4000)
                setNumExperiencia(0)
                setNumParceiros(0)
                setNumCenarios(0)
                setAtivarAnimacao(false)
            }
        })

    }, [])


    useEffect(() => {
        setTimeout(() => {
            const numMaxHoras = 5000

            if(ativarAnimacao){
                if(numHoras < numMaxHoras){
                    setNumHoras(numHoras + 1)
                }
            }
        }, 1)
    }, [numHoras, ativarAnimacao])

    useEffect(() => {
        setTimeout(() => {
            const numMaxExperiencia = 30

            if(ativarAnimacao){
                if(numExperiencia < numMaxExperiencia){
                    setNumExperiencia(numExperiencia + 1)
                }
            }
        }, 45)
    }, [numExperiencia, ativarAnimacao])

    useEffect(() => {
        setTimeout(() => {
            const numMaxParceiros = 50

            if(ativarAnimacao){
                if(numParceiros < numMaxParceiros){
                    setNumParceiros(numParceiros + 1)
                }
            }
        }, 30)
    }, [numParceiros, ativarAnimacao])

    useEffect(() => {
        setTimeout(() => {
            const numMaxCenarios = 35

            if(ativarAnimacao){
                if(numCenarios < numMaxCenarios){
                    setNumCenarios(numCenarios + 1)
                }
            }
        }, 45)
    }, [numCenarios, ativarAnimacao])


    return (
        <div className="pb-paddingYSecoesPagPrincipal px-paddingXSecoesPagPrincipal">

            <div  className="flex">
                {/* Nesse cara o flex-1 não está funcionando */}
                <div className="flex items-center gap-24 w-1/2">
                    <div ref={containerRef} className="grid grid-cols-[auto_auto] gap-12">
                        <div className="flex flex-col px-12 p gap-2  border-l-2 border-solid border-fundoCinzaEscuro my-12">
                            <div className="text-7xl textoGradiente">
                                {numHoras}+
                            </div>
                            <div className="text-xl">
                                Horas aplicadas
                            </div>
                        </div>
                        <div className="flex flex-col px-12 p gap-2  border-l-2 border-solid border-fundoCinzaEscuro my-12">
                            <div className="text-7xl textoGradiente">
                                {numParceiros}+
                            </div>
                            <div className="text-xl">
                                parceiros que confiam
                            </div>
                        </div>
                        <div className="flex flex-col px-12 p gap-2  border-l-2 border-solid border-fundoCinzaEscuro">
                            <div className="text-7xl textoGradiente">
                                {numExperiencia}+
                            </div>
                            <div className="text-xl">
                                anos no mercado
                            </div>
                        </div>
                        <div className="flex flex-col px-12 p gap-2  border-l-2 border-solid border-fundoCinzaEscuro">
                            <div className="text-7xl textoGradiente">
                                {numCenarios}Mi+
                            </div>
                            <div className="text-xl">
                                Cenários simulados
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center">
                    <SlideParceirosVertical/>
                </div>

            </div>
        </div>
    )
}