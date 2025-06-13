import { ChangeEvent, useEffect, useState, useContext } from 'react'
import { ContextoConfiguracoes } from './Contextos/ContextoConfiguracoes/ContextoConfiguracoes';
import { PrimeiroPasso } from './Components/PrimeiroPasso/PrimeiroPasso';
import { SegundoPasso } from './Components/SegundoPasso/SegundoPasso';
import { Menu } from './Components/Menu/Menu';
import { Configuracoes } from './Components/Configuracoes/Configuracoes';
import { ContextoErro } from './Contextos/ContextoErro/ContextoErro';
import { ModalErro } from './Components/ModalErro/ModalErro';
import { ContextoGeral } from './Contextos/ContextoGeral/ContextoGeral';
import { BotaoGeral } from './Components/BotaoGeral/BotaoGeral';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BarraLateral } from './Components/BarraLateral/BarraLateral';
import { cn } from './utils/cn';
import { ContextoLogin } from './Contextos/ContextoLogin/ContextoLogin';


export const baseUrl = "http://localhost:3333"


function App() {




  const {configAberta} = useContext(ContextoConfiguracoes)
  const {temErro} = useContext(ContextoErro)

  const endpointAtual = useLocation()

  const endpointCalculadora = endpointAtual.pathname === "/Calculadora"

  const {setUsuarioLogado} = useContext(ContextoLogin)

  const navigate = useNavigate()


  useEffect(() => {
    fetch(baseUrl + "/confereToken", {
      headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
    }).then(res => res.json()).then(data => {
      console.log("Resposta confere token")
      console.log(data)
      if(data.success){
        console.log("token correto")
        setUsuarioLogado(true) 
        navigate("/Perfil")
      }else{
        console.log("token incorreto")
        navigate("/")
      }
    })
  }, [])


  return (
    <>
    
      <Outlet/>

      {
        configAberta &&
        <Configuracoes/>
      }
      {
        temErro &&
        <ModalErro/>
      }



    </>
  )
}

export default App
