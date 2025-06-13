import { FastifyRequest, FastifyReply } from "fastify";
import {z} from "zod"
import { PrismaUserRepository } from "../../repositories/prisma/prisma-users-repository";
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";
import { CriarEmpresasUseCase } from "../../use-cases/criarEmpresasUseCase";
import { UsuarioJaCadastrouEmpresa } from "../../use-cases/errors/usuario-ja-cadastrou-empresa";
import { PrismaCnaesRepository } from "../../repositories/prisma/prisma-cnaes-repository";

export async function criarEmpresaController(request: FastifyRequest, reply: FastifyReply) {

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
        razao_social: z.string().optional(),
        uf: z.string().optional(),             
        cnae_principal: z.string().optional(), 
        cnae_secundario: z.string().optional(), 
        descricao_atividade_principal: z.string().optional(), 
        regularidade: z.boolean().optional(), 
        regime_tributario: z.enum(["SIMPLES_NACIONAL", "LUCRO_REAL", "LUCRO_PRESUMIDO"])
    })

    const body = bodySchema.parse(request.body)
    let empresaCriada: EmpresaType = null

    console.log("BODY RECEBIDO CRIAR EMPRESA: ")
    console.log(body)

    try{
            
        const userRepo = new PrismaUserRepository
        const empresaRepo = new PrismaEmpresaRepository
        const cnaesRepo = new PrismaCnaesRepository

        //Aqui no futuro vamos usar o JWT e o userRepo para descobri através do token qual o id do usuário que está enviando
        const usuario_id = request.user.sub

        const criarEmpresa = new CriarEmpresasUseCase(userRepo, empresaRepo, cnaesRepo)
        empresaCriada = await criarEmpresa.execute(body, usuario_id)



    }catch(err){

        if(err instanceof UsuarioJaCadastrouEmpresa){
            return reply.status(400).send({success: false, data: null, error: {code: 400, message: err.message}})
        }

        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }


    return reply.status(200).send({success: true, data: empresaCriada, error: null})



} 