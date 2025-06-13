import { useContext, useState } from "react"
import iconeSimulador from "../../assets/images/iconeSimulador.svg"
import iconeSeta from "../../assets/images/setaBranca.svg"
import { Link } from "react-router-dom"
import { ContextoConfiguracoes } from "../../Contextos/ContextoConfiguracoes/ContextoConfiguracoes"
import configImg from "../../assets/images/configImg.svg"
import dadosImg from "../../assets/images/usuarioIcone.svg"
import { ContextoLogin } from "../../Contextos/ContextoLogin/ContextoLogin"
import { useNavigate } from "react-router-dom"



type Props = {
    modoBranco: boolean
}

export function BarraLateral({modoBranco}: Props){

    const [barraAberta, setBarraAberta] = useState<boolean>(false)
    const [dropMeusDados, setDropMeusDados] = useState<boolean>(false)
    const {configAberta, setConfigAberta} = useContext(ContextoConfiguracoes)
    const {usuarioLogado, setUsuarioLogado } = useContext(ContextoLogin)


    const navigate = useNavigate()


    function cliqueConfig(){
        setConfigAberta(!configAberta)
    }

    function cliqueMeusDados(){
        setBarraAberta(true)
        setDropMeusDados(!dropMeusDados)

    }

    function abreFechaBarraLateral(){
        setBarraAberta(!barraAberta)
        if(dropMeusDados){
            setDropMeusDados(false)
        }
    }

    {
        /*
        IMPORTANTE!!!!!!!!!!!!!!
        A largura do menu é composta por: "largura dos icones (28px atualmente)" + "padding no menu (p-4, 16px atualmente)"

        Caso queira mudar a largura do menu, no componente <PaginaPricipal/> tem que alterar a largura também da div que envolve o componente <BarraLateral/> que atualmente é:
        largura do wrapper do componente: w-[60px] (28px + 16px + 16px), sendo os 2 16 px os paddings de cada lado
         
        */
    }


    function cliqueSair(){
        localStorage.setItem("authToken", "")
        setUsuarioLogado(false)
        navigate("/")
    }


    function fecharBarraLateral(){
        setBarraAberta(false)
    }


    return (


        
        <div className={`flex fixed h-screen z-40 pt-20 ${modoBranco ? "bg-white" : "bg-premiumBg"}`}>
            <div className={`flex flex-col gap-6 p-4 overflow-hidden rounded-[30px]`}>
                <div>
                    <img onClick={abreFechaBarraLateral} className={` cursor-pointer h-7 object-cover mb-4 ${barraAberta ? "rotate-180" : "rotate-0"} transition duration-700 ease-in-out`} src={iconeSeta} alt="seta abre fecha menu lateral" />
                </div>

                <Link to="/Perfil">
                    <div className="cursor-pointer flex" onClick={fecharBarraLateral}>

                        <div className="w-[28px]">
                            <img className="w-full object-cover" src={iconeSimulador} alt="icone Simulador" />
                        </div>
                        <div className={`${barraAberta? "w-[10vw] pl-2" : "w-0 pl-0"} overflow-hidden transition-[width,padding-left] duration-700 ease-in-out`}>
                            Simulador
                        </div>
                    </div>
                </Link>

                
                <div className="cursor-pointer flex-col" >
                    <div className="flex" onClick={cliqueMeusDados}>
                        <div className="w-[28px]">
                            <img className="w-full object-cover" src={dadosImg} alt="configurações" />
                        </div>
                        <div className={`${barraAberta? "w-[10vw] pl-2" : "w-0 pl-0"} overflow-hidden transition-[width,padding-left] duration-700 ease-in-out text-nowrap`}>
                            Meus Dados
                        </div>
                    </div>
                    <div
                    className={`
                        grid
                        transition-all duration-500 ease-in-out
                        ${dropMeusDados ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${barraAberta? "w-[10vw] pl-2" : "w-0 pl-0"} overflow-hidden transition-[width,padding-left] duration-700 ease-in-out
                    `}
                    >
                        <div className="overflow-hidden">
                            <div className="pl-[28px] py-4">
                                <Link to="/Perfil/MinhasEmpresas">
                                    <div onClick={fecharBarraLateral} className="p-2 hover:bg-fundoPreto rounded-xl text-nowrap">Minhas Empresas</div>
                                </Link>
                                <Link to="/Perfil/DadosPessoais">
                                    <div onClick={fecharBarraLateral} className="p-2 hover:bg-fundoPreto rounded-xl text-nowrap">Dados Pessoais</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                
                <div className="cursor-pointer flex" onClick={cliqueConfig}>
                    <div className="w-[28px]">
                        <img className="w-full object-cover" src={configImg} alt="configurações" />
                    </div>
                    <div className={`${barraAberta? "w-[10vw] pl-2" : "w-0 pl-0"} overflow-hidden transition-[width,padding-left] duration-700 ease-in-out`}>
                        Configurações
                    </div>
                </div>


                {
                    usuarioLogado && 
                    <div className="cursor-pointer flex" onClick={cliqueSair}>
                        <div className={`${barraAberta? "w-[6vw] px-4 py-2" : "w-0 pl-0"} flex justify-center items-center overflow-hidden transition-[width,padding] duration-700 ease-in-out  rounded-md text-white bg-red-500`}>
                            Sair
                        </div>
                    </div>
                }





            </div>

        </div>
    )
}