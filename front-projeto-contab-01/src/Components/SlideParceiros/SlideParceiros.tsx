import iconeRocha from "../../assets/images/rocharochaLogo.svg"
import iconeJaguar from "../../assets/images/jaguarLogo.png"
import iconeZapping from "../../assets/images/zappingLogo.png"
import iconeBrasilPrice from "../../assets/images/BrasilPriceLogo.png"
import iconePetCont from "../../assets/images/petContLogo.png"
import iconeIdvl from "../../assets/images/idvlLogo.png"



type itemAtualType = {
    icone: string
}

export default function SlideParceiros(){


    const arraySlide: itemAtualType[] = [
        {icone: iconeRocha},
        {icone: iconeJaguar},
        {icone: iconeZapping},
        {icone: iconeBrasilPrice},
        {icone: iconePetCont},
        {icone: iconeIdvl},
    ]



    return (
        <div className="overflow-hidden w-screen relative z-20 opacity-60">
            <div className="inline-flex whitespace-nowrap animate-slideInfinito">
            {
                [...arraySlide, ...arraySlide].map(item => {
                    return (
                    <div className="flex items-center gap-2 px-12 py-2 rounded-md mx-2 text-white">
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