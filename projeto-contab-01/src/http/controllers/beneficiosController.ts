import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { infosEmpresaSchema, objAtividadeAdquirida, ProdutoAdquiridoObj, ProdutoVendidoObj, TipoOperacaoVendidoType } from "./calcularSimplificadoController";
import { BeneficiosUseCase } from "../../use-cases/beneficiosUseCase";

export const beneficiosBodySchema = z.object({
    beneficiosPorCnae: z.object({
        totalAtividadesAdquiridas: z.array(objAtividadeAdquirida),
        totalAtividadesPrestadas: z.array(infosEmpresaSchema)
    }),
    beneficiosPorNcm: z.object({
        totalProdutosVendidos: z.array(ProdutoVendidoObj),
        totalProdutosAdquiridos: z.array(ProdutoAdquiridoObj)
    })
})


export async function beneficiosController(request: FastifyRequest, reply: FastifyReply){

    const body = beneficiosBodySchema.parse(request.body)

    console.log("Body do Beneficios")
    console.log(body)


    const encontrarBeneficios = new BeneficiosUseCase()

    try{
        const finalBeneficios = await encontrarBeneficios.execute(body)

        return reply.status(200).send({success: true, data: finalBeneficios, error: null})

    }catch(err){
        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }



}