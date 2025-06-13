import { FastifyReply, FastifyRequest } from "fastify";

export async function confereTokenController(request: FastifyRequest, reply: FastifyReply){

    return reply.status(200).send({success: true, data: null, error: null})


}