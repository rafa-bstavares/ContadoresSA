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
        <div className="fixed flex flex-col justify-center items-center top-0 right-0 h-screen left-0 rounded-xl bg-black/90 z-50">
            <div className="flex flex-col justify-center px-20 py-10 bg-fundoCinzaEscuro rounded-2xl w-[30vw]">
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

        </div>
    )
}