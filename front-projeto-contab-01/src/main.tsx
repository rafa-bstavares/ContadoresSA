import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ParametrosOpcionaisProvider } from './Contextos/ContextoParametrosOpcionais/ContextoParametrosOpcionais.tsx' 
import { ConfiguracoesProvider } from './Contextos/ContextoConfiguracoes/ContextoConfiguracoes.tsx'
import { ErroProvider } from './Contextos/ContextoErro/ContextoErro.tsx'
import { GeralProvider } from './Contextos/ContextoGeral/ContextoGeral.tsx'
import { ImoveisProvider } from './Contextos/ContextoImoveis/ContextoImoveis.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Perfil } from './Components/Perfil/Perfil.tsx'
import { PaginaInicial } from './Components/PaginaInicial/PaginaInicial.tsx'
import { LoginProvider } from './Contextos/ContextoLogin/ContextoLogin.tsx'
import { UsuarioProvider } from './Contextos/ContextoUsuario/ContextoUsuario.tsx'
import { Calculadora } from './Components/Calculadora/Calculadora.tsx'
import  { DadosPessoais } from './Components/DadosPessoais/DadosPessoais.tsx'
import { MinhasEmpresas } from './Components/MinhasEmpresas/MinhasEmpresas.tsx'
import { MoveisProvider } from './Contextos/ContextoMoveis/ContextoMoveis.tsx'
import { ProdutoProvider } from './Contextos/ContextoProduto/ContextoProduto.tsx'
import { ResultadoSimulador } from './Components/ResultadoSimulador/ResultadoSimulador.tsx'
import { ResultadoSimuladorProvider } from './Contextos/ContextoResultadoSimulador/ContextoResultadoSimulador.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ParametrosOpcionaisProvider>
      <ConfiguracoesProvider>
      <ErroProvider>
      <GeralProvider>
      <ImoveisProvider>
      <LoginProvider>
      <UsuarioProvider>
      <MoveisProvider>
      <ProdutoProvider>
      <ResultadoSimuladorProvider>
        <Routes>
          <Route path='/' element={<App/>}>
            <Route path='/Perfil/' element={<Perfil/>}>
              <Route path='/Perfil/TirarAqui' element={<Calculadora/>}></Route>
              <Route path='/Perfil/DadosPessoais' element={<DadosPessoais/>}></Route>
              <Route path='/Perfil/MinhasEmpresas' element={<MinhasEmpresas/>}></Route>
              <Route path='/Perfil/' element={<ResultadoSimulador/>} ></Route>
            </Route>
            <Route path='/' element={<PaginaInicial/>}></Route>
          </Route>
        </Routes>
      </ResultadoSimuladorProvider>
      </ProdutoProvider>
      </MoveisProvider>
      </UsuarioProvider>
      </LoginProvider>
      </ImoveisProvider>
      </GeralProvider>
      </ErroProvider>
      </ConfiguracoesProvider>
      </ParametrosOpcionaisProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
