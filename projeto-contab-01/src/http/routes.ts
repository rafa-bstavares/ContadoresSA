import { FastifyInstance } from "fastify";
import { createUserController } from "./controllers/createUserController";
import { xmlExampleFunction } from "../xmlExampleFunction";
import { descricaoPorNcm } from "../descricaoPorNcm";
import XLSX from "xlsx";
import { FastifyRequest, FastifyReply } from "fastify";
import { buscarEmpresaController } from "./controllers/buscarEmpresaController";
import { criarEmpresaController } from "./controllers/criarEmpresaController";
import { calcularSimplificadoController } from "./controllers/calcularSimplificadoController";
import { autenticarUsuarioController } from "./controllers/autenticacaoUsuarioController";
import { pegarDadosUsuarioController } from "./controllers/pegarDadosUsuarioController";
import { verifyJWT } from "./middlewares/verify-jwt";
import { buscarEmpresasUsuarioController } from "./controllers/buscarEmpresasUsuarioController";
import { confereTokenController } from "./controllers/confereTokenController";
import { editarEmpresaController } from "./controllers/editarEmpresaController";
import { beneficiosController } from "./controllers/beneficiosController";
import { xmlProdutosVendidosController } from "./controllers/xmlProdutosVendidosController";
import { xmlProdutosAdquiridosController } from "./controllers/xmlProdutosAdquiridosController";


export async function appRoutes(app: FastifyInstance){

    app.post("/users", createUserController)

    app.get("/meusDados", {onRequest: [verifyJWT]}, pegarDadosUsuarioController)
    app.get("/minhasEmpresas", {onRequest: [verifyJWT]}, buscarEmpresasUsuarioController)
    app.get("/confereToken", {onRequest: [verifyJWT]}, confereTokenController)

    //app.get("/xmlCalc", xmlExampleFunction)

    //app.get("/metadata", descricaoPorNcm)

    app.post("/criarEmpresa", {onRequest: [verifyJWT]}, criarEmpresaController)
    app.post("/editarEmpresa", {onRequest: [verifyJWT]}, editarEmpresaController)

    app.post("/encontrarBeneficios", {onRequest: [verifyJWT]}, beneficiosController)

    app.post("/calcularDiagnosticoSimplificado", {onRequest: [verifyJWT]}, calcularSimplificadoController)

    app.post("/buscarEmpresa", buscarEmpresaController)

    app.post("/autenticar", autenticarUsuarioController)

    app.post("/xmlProdutosVendidos", xmlProdutosVendidosController)
    app.post("/xmlProdutosAdquiridos", xmlProdutosAdquiridosController)

    app.get("/lerXlsx", (request: FastifyRequest, reply: FastifyReply) => {

 

        const tabelas = XLSX.readFile("src/xlsx/IMPACTOS RT PILOTO FELIPE.xlsx")
        const anexoPorCnae = tabelas.Sheets["CNAE SIMPLES NACIONAL"]  
        const anexoPorCnaeFinal = XLSX.utils.sheet_to_json(anexoPorCnae)


        console.log(anexoPorCnaeFinal)

        return reply.status(200).send()
    })

}