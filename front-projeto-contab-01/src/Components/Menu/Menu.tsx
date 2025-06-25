import { useContext, useEffect } from "react"
import logo from "../../assets/images/priceTaxLogo.png"
import { BotaoGeral } from "../BotaoGeral/BotaoGeral"
import { ContextoLogin } from "../../Contextos/ContextoLogin/ContextoLogin"
import { Link } from "react-router-dom"



export function Menu(){


    const {usuarioLogado, setAbrirModalLogin, abrirModalLogin} = useContext(ContextoLogin)


    function abrirModalLoginFn(){
        console.log("clicouuu")
        setAbrirModalLogin(true)
    }


    useEffect(() => {
        console.log("abrirModalLogin:")
        console.log(abrirModalLogin)
    }, [abrirModalLogin])



    
    return (
        <div className="h-[7vh]  w-full flex justify-between items-center px-20 relative z-20 ">
            <Link to={"/"} className="h-[80%] flex gap-4 items-center cursor-pointer">
                <img className="object-cover h-full w-auto" src={logo} alt="logotipo contadores sa" />
            </Link>

            {/*<div className="h-full flex justify-center items-center gap-12" >
                {
                    objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf !== "" && objMinhaEmpresaOuPessoaAtual.meuRegime !== "" &&
                    <div className="h-[90%] p-2 rounded-md bg-black/50 flex flex-col text-white text-sm">
                        <div>
                            Meu regime: {objMinhaEmpresaOuPessoaAtual.meuRegime}
                        </div>
                        <div>
                            {
                                objMinhaEmpresaOuPessoaAtual.meuRegime == "Pessoa Fisica"? 
                                    <div>
                                        CPF: {objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf}
                                    </div>
                                    :
                                    <div>
                                        CNPJ: {objMinhaEmpresaOuPessoaAtual.meuCnpjouCpf}
                                    </div>
                            }
                        </div>
                    </div>
                }
            </div>*/}
            <div className="flex gap-8">
                {
                    !usuarioLogado && 
                    <div className="flex gap-2">
                        <BotaoGeral onClickFn={() => {}} principalBranco={true} text="Cadastro"/>
                        <BotaoGeral onClickFn={abrirModalLoginFn} principalBranco={false} text="Entrar" />
                    </div>
                }
            </div>
        </div>
    )
}