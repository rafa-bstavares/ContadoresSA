import { FastifyReply, FastifyRequest } from "fastify";
import { XmlProdutosAdquiridosUseCase } from "../../use-cases/xmlProdutosAdquiridosUseCase";
import { z } from "zod";


export async function xmlProdutosAdquiridosController(request: FastifyRequest, reply: FastifyReply){

    const parts = request.parts()
    const tratarEParsearXml = new XmlProdutosAdquiridosUseCase()

    try{
        const resultado = await tratarEParsearXml.execute(parts)
        return reply.send({success: true, data: resultado, error: null})
    }catch(err){
        console.error("Erro ao processar XML:", err)
        return reply.status(500).send({ success: false, data: null, error: "Erro ao processar o XML" })
    }



}