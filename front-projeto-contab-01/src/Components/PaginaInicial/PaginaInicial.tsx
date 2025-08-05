import BackgroundLights from "../BackgroundLights/BackgroundLights"
import { FlipCredibilidade } from "../FlipCredibilidade/FlipCredibilidade"
import RainbowBackground from "../RainbowBackground.tsx/RainbowBackground"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SlideInfinito from "../SlideInfinito/SlideInfinito"
import { CredibilidadeEstatico } from "../CredibilidadeEstatico/CredibilidadeEstatico"
import { BarraLateral } from "../BarraLateral/BarraLateral"
import { Menu } from "../Menu/Menu"
import { cn } from "../../utils/cn"
import AmostraResultados from "../AmostraResultados/AmostraResultados"
import Beneficios from "../Beneficios/Beneficios"
import Credibilidade from "../Credibilidade/Credibilidade"
import Credibilidade2 from "../Credibilidade2/Credibilidade2"
import { useContext, useEffect } from "react"
import { ContextoLogin } from "../../Contextos/ContextoLogin/ContextoLogin"
import ModalLogin from "../ModalLogin/ModalLogin"
import { ContextoUsuario } from "../../Contextos/ContextoUsuario/ContextoUsuario"
import { redirect } from "react-router-dom"
import BeneficiosEmColunas from "../BeneficiosEmColunas/BeneficiosEmColunas"


export function PaginaInicial(){

    const textoLinha1 = "Tudo sobre a reforma"
    const textoLinha2 = "tributária em um só lugar"
    
    const {abrirModalLogin} = useContext(ContextoLogin)
    const {usuarioLogado} = useContext(ContextoLogin)

    
    gsap.registerPlugin(useGSAP)


    useGSAP(() => {
        let textAnimation1 = gsap.timeline()
        textAnimation1.from('.text1', {
         y: 100,
        })

        let textAnimation2 = gsap.timeline()
        textAnimation2.from('.text2', {
            delay: 0.3,
         y: 100,
        })

    }) 



    return (
        <div className="transition-bg relative flex flex-col items-start  w-full min-h-[100vh] justify-center bg-premiumBg text-white">
            {/*
            <div className={`absolute h-screen top-0 left-0 right-0 overflow-hidden opacity-60 -index-1`}
                    style={
                            {
                            "--aurora":
                                "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
                            "--dark-gradient":
                                "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
                            "--white-gradient":
                                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
                
                            "--blue-300": "#93c5fd",
                            "--blue-400": "#60a5fa",
                            "--blue-500": "#3b82f6",
                            "--indigo-300": "#a5b4fc",
                            "--violet-200": "#ddd6fe",
                            "--black": "#000",
                            "--white": "#fff",
                            "--transparent": "transparent",
                            } as React.CSSProperties
                        }>

                        <div
                            //   I'm sorry but this is what peak developer performance looks like // trigger warning
                            className={cn(
                            `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,
                                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
                            )}
                        ></div>
                        
            </div>
            */}
            <Menu/>

            <div className='flex w-full text-white'>
                <div className=" w-[60px]">
                    {/* Precisei fazer outra div para colocar só o "absolute", pois se colocasse o absolute na div acima ela não ia conseguir receber por padrão o "self-stretch" do align-items e não acompanharia o tamanho da pagina */}
                    <div className="absolute">
                        <BarraLateral modoBranco={false}/>
                    </div>
                </div>
                <div className='flex-1 min-h-[100vh] rounded-tl-2xl overflow-hidden'>
                
                    <div className="relative min-h-[100vh] w-full flex flex-col items-center justify-between font-fontePrincipal [background-color:hsla(0,0%,7%,1)] [background-image:radial-gradient(at_48%_44%,hsla(24,0%,18%,1)_0px,transparent_50%),radial-gradient(at_79%_0%,hsla(189,0%,7%,1)_0px,transparent_50%),radial-gradient(at_0%_50%,hsla(350,0%,7%,1)_0px,transparent_50%),radial-gradient(at_86%_45%,hsla(340,0%,18%,1)_0px,transparent_50%),radial-gradient(at_0%_100%,hsla(16,0%,7%,1)_0px,transparent_50%),radial-gradient(at_80%_100%,hsla(240,0%,7%,1)_0px,transparent_50%),radial-gradient(at_0%_0%,hsla(343,0%,7%,1)_0px,transparent_50%)]">
                        {/*<div className="flex justify-center items-center text-8xl h-[100vh] w-2/3 text-center">
                            Tudo sobre a reforma tributária em um só lugar
                        </div>*/}
                        <div className="w-full flex flex-col items-center">
                                    

                                    <div className="text-8xl text-center w-2/3 mt-[15vh] mb-12 flex flex-col items-center "> 
                                        {/*Tudo sobre a <span className="textoGradiente">reforma tributária</span> em um só lugar*/}
                                        <div className="overflow-hidden flex lg:justify-start justify-center">{/* SEM O FLEX A ANIMAÇÃO N FUNCIONA */}
                                            <div className="text1">
                                                Tudo sobre a <span className="textoGradiente">Reforma</span>
                                            </div>
                                        </div>
                                        <div className=" overflow-hidden flex lg:justify-start justify-center">
                                            <div className="text2">
                                                <span className="textoGradiente"> Tributária</span> em um só lugar
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex gap-4 mb-28">
                                        <button className={`px-4 py-2 rounded-md border-2 border-solid border-white bg-white text-black cursor-pointer w-[20vw]`}>
                                            Simulador
                                        </button>
                                        <button className={`px-4 py-2 rounded-md border-2 border-solid border-white bg-fundoCinzaEscuro text-white cursor-pointer w-[20vw]`}>
                                            Explorar
                                        </button>
                                    </div>
                        </div>



                        <div className=" mb-[calc(7vh+180px)] self-start ml-12">
                            <SlideInfinito/>
                        </div>
                        <div className="absolute left-0 right-0 bottom-0 h-[10vh] bg-gradient-to-b from-transparent to-premiumBg">

                        </div>
                    </div>

                    <AmostraResultados/>

                    <BeneficiosEmColunas/>

                    <Credibilidade2/>

                </div>
            </div>
            {
                abrirModalLogin &&
                <ModalLogin/>
            }
        </div>
    )
}