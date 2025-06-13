import { useMemo, CSSProperties } from "react"
import {cn} from "../../utils/cn"



export default function RainbowBackground(){
        return (
            <div className="h-[100vh] w-[100vw] bg-fundoPreto relative">
                <div className="absolute left-1/2 top-0 h-[100vh] w-0 opacity-20 rotate-10 animate-[slide_10s_linear_infinite] bg-purple-500 [box-shadow:-130px_0_80px_40px_white,-50px_0_50px_25px_#121212,0_0_50px_25px_white,50px_0_50px_25px_#121212,130px_0_80px_20px_white]"></div>
                {/* Máscara branca horizontal*/}
                <div
                    className="absolute bottom-0 left-0 w-screen h-0"
                    style={{ boxShadow: '0 0 50vh 40vh #121212' }}
                />

                {/* Máscara branca vertical */}
                <div
                    className="absolute bottom-0 left-0 w-0 h-screen"
                    style={{ boxShadow: '0 0 35vw 25vw #121212' }}
                />
            </div>
        )
}