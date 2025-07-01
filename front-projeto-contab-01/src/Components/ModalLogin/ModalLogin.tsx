import { useContext, useState } from "react"
import { ContextoLogin } from "../../Contextos/ContextoLogin/ContextoLogin"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import xis from "../../assets/images/xisContab.svg"
import { baseUrl } from "../../App"
import { useNavigate } from "react-router-dom"


export default function ModalLogin(){

    const [email, setEmail] = useState<string>("")
    const [senha, setSenha] = useState<string>("")

    const navigate = useNavigate()

    const {setAbrirModalLogin, setUsuarioLogado} = useContext(ContextoLogin)

    function fazerLogin(email: string, senha: string){

        fetch(baseUrl + "/autenticar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email, 
                senha
            })
        }).then(res => res.json()).then(data => {
            if(data.success){
                setAbrirModalLogin(false)
                setUsuarioLogado(true)
                localStorage.setItem("authToken", data.token)
                navigate("/Perfil")

            }
        })

    }   


    function fecharModalLogin(){
        setAbrirModalLogin(false)
    }


    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-black/90">
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#FFDD0055] rounded-full blur-3xl opacity-30 z-0"></div>
            <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-[#FFDD0055] rounded-full blur-3xl opacity-20 z-0"></div>

            <div className="
                relative z-10
                flex flex-col justify-center
                px-20 py-10
                w-[30vw]
                rounded-2xl
                border border-[#ffffff22]
                ring-1 ring-[#FFDD00]/30
                shadow-[0_0_40px_#FFDD0055]
                bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,_#695c0095,_rgb(18,18,18)_80%)]
                backdrop-blur-2xl
                text-white
            ">

                <div className="flex justify-between items-center mb-10">
                    <div className="text-3xl font-bold text-white">Login</div>
                    <div onClick={fecharModalLogin} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xis} alt="fechar modal login" />
                    </div>
                </div>


                <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-gray-200">Email:</label>
                    <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="text"
                    className="outline-none border-2 border-solid border-gray-300 bg-transparent text-white rounded-md px-4 py-2 w-full"
                    />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="senha" className="text-gray-200">Senha:</label>
                    <input
                    onChange={(e) => setSenha(e.target.value)}
                    id="senha"
                    type="password"
                    className="outline-none border-2 border-solid border-gray-300 bg-transparent text-white rounded-md px-4 py-2 w-full"
                    />
                </div>
                    <BotaoGeral principalBranco={true} text="Entrar" onClickFn={() => fazerLogin(email, senha)} />
                </div>
            </div>
        </div>

        /*<div className="fixed flex flex-col justify-center items-center top-0 right-0 h-screen left-0 rounded-xl bg-black/90 z-50">
            <div className="flex flex-col justify-center px-20 py-10 [background-image:linear-gradient(35deg,#FFDD00,2%,#121212,95%,#FFDD00)] border-2 border-solid border-fundoCinzaEscuro rounded-2xl w-[30vw] overflow-hidden">
                <div className="flex justify-between mb-10">
                    <div className="text-3xl">
                        Login
                    </div>
                    <div onClick={fecharModalLogin} className="w-6 h-6 cursor-pointer">
                        <img className="w-full h-full object-cover" src={xis} alt="fechar modal login" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email:</label>
                        <input onChange={(e) => setEmail(e.target.value)} id="email" type="text" className={`outline-none border-2 border-solid border-white rounded-md px-4 py-2 w-full `}/>
                    </div>
                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="senha">Senha:</label>
                        <input onChange={(e) => setSenha(e.target.value)} id="senha" type="password" className={`outline-none border-2 border-solid border-white rounded-md px-4 py-2 w-full `}/>
                    </div>
                    <BotaoGeral principalBranco={true} text="Entrar" onClickFn={() => fazerLogin(email, senha)}/>
                </div>
            </div>

        </div>*/
    )
}