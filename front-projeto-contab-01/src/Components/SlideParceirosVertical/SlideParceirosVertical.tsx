import iconeRocha from "../../assets/images/rocharochaLogo.svg"
import iconeJaguar from "../../assets/images/jaguarLogo.png"
import iconeZapping from "../../assets/images/zappingLogo.png"
import iconeBrasilPrice from "../../assets/images/BrasilPriceLogo.png"
import iconePetCont from "../../assets/images/petContLogo.png"
import iconeIdvl from "../../assets/images/idvlLogo.png"



type itemAtualType = {
    icone: string
}

export default function SlideParceirosVertical(){


    const arraySlide: itemAtualType[] = [
        {icone: iconeRocha},
        {icone: iconeJaguar},
        {icone: iconeZapping},
        {icone: iconeBrasilPrice},
        {icone: iconePetCont},
        {icone: iconeIdvl},
    ]



    return (
        <div className="overflow-hidden w-screen relative z-20 opacity-60 h-[50vh]">
            <div className="absolute left-0 right-0 top-0 h-[10%] bg-gradient-to-b from-premiumBg to-transparent z-20"></div>
            <div className="absolute left-0 right-0 bottom-0 h-[10%] bg-gradient-to-t from-premiumBg to-transparent z-20"></div>
            <div className="inline-flex flex-col whitespace-nowrap animate-slideInfinitoVertical">
            {
                [...arraySlide, ...arraySlide].map(item => {
                    return (
                    <div className="flex items-center gap-2 px-12 py-2 my-6 rounded-md mx-2 text-white">
                        <div className="w-56 h-auto">
                            <img className="object-cover h-full w-full filter brightness-0 invert" src={item.icone} alt={`Icone empresa parceira`} />
                        </div>
                    </div>
                    )
                })
            }
            </div>
            <div className="inline-flex flex-col whitespace-nowrap animate-slideInfinitoVerticalContrario">
                {
                    [...arraySlide, ...arraySlide].reverse().map(item => {
                        return (
                        <div className="flex items-center gap-2 my-6 px-12 py-2 rounded-md mx-2 text-white">
                            <div className="w-56 h-auto">
                                <img className="object-cover h-full w-full filter brightness-0 invert" src={item.icone} alt={`Icone empresa parceira`} />
                            </div>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}