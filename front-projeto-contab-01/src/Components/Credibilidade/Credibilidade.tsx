import { useEffect, useRef, useState } from "react"
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SlideParceiros from "../SlideParceiros/SlideParceiros";
import TitulosPagPrincipal from "../TitulosPagPrincipal/TitulosPagPrincipal";


gsap.registerPlugin(ScrollTrigger);

export default function Credibilidade(){

    const [numClientes, setNumClientes] = useState<number>(0)
    const [numExperiencia, setNumExperiencia] = useState<number>(0)
    const [numParceiros, setNumParceiros] = useState<number>(0)
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
                setNumClientes(0)
                setNumExperiencia(0)
                setNumParceiros(0)
                setAtivarAnimacao(false)
            }
        })

    }, [])


    useEffect(() => {
        setTimeout(() => {
            const numMaxClientes = 100

            if(ativarAnimacao){
                if(numClientes < numMaxClientes){
                    setNumClientes(numClientes + 1)
                }
            }
        }, 15)
    }, [numClientes, ativarAnimacao])

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
    


    return (
        <div className="py-paddingYSecoesPagPrincipal px-paddingXSecoesPagPrincipal">
            
            <div className="mb-24">
                <TitulosPagPrincipal alinhamento="start" texto="Parceiros" />
            </div>
            <div ref={containerRef} className="flex w-full justify-center mb-40">
                <div className="flex flex-col px-12 p gap-2 flex-1 border-x-2 border-solid border-fundoCinzaEscuro">
                    <div className="text-6xl textoGradiente">
                        {numClientes}+
                    </div>
                    <div className="text-xl">
                        clientes satisfeitos
                    </div>
                </div>
                <div className="flex flex-col px-12 p gap-2 flex-1">
                    <div className="text-6xl textoGradiente">
                        {numParceiros}+
                    </div>
                    <div className="text-xl">
                        parceiros que confiam
                    </div>
                </div>
                <div className="flex flex-col px-12 p gap-2 flex-1 border-l-2 border-solid border-fundoCinzaEscuro">
                    <div className="text-6xl textoGradiente">
                        {numExperiencia}+
                    </div>
                    <div className="text-xl">
                        anos no mercado
                    </div>
                </div>
            </div>

            <div>
                <SlideParceiros/>
            </div>


        </div>
    )
}