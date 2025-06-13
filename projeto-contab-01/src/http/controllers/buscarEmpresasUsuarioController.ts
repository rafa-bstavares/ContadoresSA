

import { FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod"
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";
import { BuscarEmpresaUseCase } from "../../use-cases/buscarEmpresaUseCase";
import { pegarEmpresasUsuarioUseCase } from "../../use-cases/pegarEmpresasUsuario";
import { PrismaCnaesRepository } from "../../repositories/prisma/prisma-cnaes-repository";

export async function buscarEmpresasUsuarioController(request: FastifyRequest, reply: FastifyReply){

        // retorna obj empresas com cnaes

        try{
            const empresaRepo = new PrismaEmpresaRepository
            const cnaesRepo = new PrismaCnaesRepository

            const buscarEmpresa = new pegarEmpresasUsuarioUseCase(empresaRepo, cnaesRepo)

            const empresaComCnaes = await buscarEmpresa.execute({
                userId: request.user.sub
            })

            console.log(empresaComCnaes)

            if(empresaComCnaes){
                reply.status(200).send({success: true, data: empresaComCnaes, error: null})
            }else{
                reply.status(404).send({success: false, data: null, error: {code: 404, message: "CNPJ não encontrado"}})
            }

        }catch(err){
            reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
        }





}