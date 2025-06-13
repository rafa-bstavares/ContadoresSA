import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(
    request: FastifyRequest,
    reply: FastifyReply
){

    try{
        // busca automaticamente o token no cabecalho da requisicao e verifica se é válido. Se não for válido ele ativa erro sozinho e não continua o código
        await request.jwtVerify()
    }catch(err){
        console.log(err)
        return reply.status(401).send({success: false, data: null, error: {code: 401, message: "Usuário não autorizado"}})
    }

}