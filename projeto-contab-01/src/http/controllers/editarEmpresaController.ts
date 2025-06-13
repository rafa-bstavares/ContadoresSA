import { FastifyRequest, FastifyReply } from "fastify";
import {z} from "zod"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository";
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";
import { UsuarioJaCadastrouEmpresa } from "../../use-cases/errors/usuario-ja-cadastrou-empresa";
import { PrismaCnaesRepository } from "../../repositories/prisma/prisma-cnaes-repository";
import { EditarEmpresasUseCase } from "../../use-cases/editarEmpresaUseCase";
import { EdicaoImpossibilitadaErro } from "../../use-cases/errors/edicao-impossibilitada-recurso-existe";

export async function editarEmpresaController(request: FastifyRequest, reply: FastifyReply) {

    // retorna só obj empresas, sem cnaes


    type EmpresaType = { 
        id: string 
        usuario_id: string 
        cnpj: string
        nome_fantasia: string | null 
        razao_social: string | null 
        uf: string | null 
        cnae_principal: string | null 
        cnae_secundario: string | null 
        descricao_atividade_principal: string | null         
        regularidade: boolean | null 
        regime_tributario: "SIMPLES_NACIONAL" | "LUCRO_REAL" | "LUCRO_PRESUMIDO"
    } | null

    const bodySchema = z.object({
        cnpj: z.string().length(14),
        folha: z.string(),
        faturamento_mensal_medio: z.string(),
        cnaes: z.array(z.string()),
        nome_fantasia: z.string().optional(), 
        uf: z.string().optional(),              
        regime_tributario: z.enum(["SIMPLES_NACIONAL", "LUCRO_REAL", "LUCRO_PRESUMIDO"]),
        id: z.string()
    })

    const body = bodySchema.parse(request.body)
    let empresaEditada: {success: boolean} | null = null

    console.log("BODY RECEBIDO EDITAR EMPRESA: ")
    console.log(body)

    try{
            
        const userRepo = new PrismaUserRepository
        const empresaRepo = new PrismaEmpresaRepository
        const cnaesRepo = new PrismaCnaesRepository

        //Aqui no futuro vamos usar o JWT e o userRepo para descobri através do token qual o id do usuário que está enviando
        const usuario_id = request.user.sub

        const editarEmpresa = new EditarEmpresasUseCase(userRepo, empresaRepo, cnaesRepo)
        empresaEditada = await editarEmpresa.execute(body, usuario_id)

        if(empresaEditada){
            return reply.status(200).send({success: true, data: null, error: null})
        }else{
            return reply.status(500).send({success: false, data: null, error: {code: 500, message: "Erro desconhecido, por favor, tente novamente"}})
        }



    }catch(err){

        if(err instanceof EdicaoImpossibilitadaErro){
            return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }

        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }


} 