import fastify from "fastify"
import { createUserController } from "./http/controllers/createUserController"
import { xmlExampleFunction } from "./xmlExampleFunction"
import { descricaoPorNcm } from "./descricaoPorNcm"
import { appRoutes } from "./http/routes"
import { ZodError } from "zod"
import { env } from "./env"
import cors from '@fastify/cors';
import fastifyJwt from "@fastify/jwt"
import fastifyMultipart from "@fastify/multipart"

export const app = fastify()

app.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost'], // ajuste conforme a URL do seu front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // cabeçalhos permitidos
  });

app.register(fastifyMultipart);

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(appRoutes)
app.setErrorHandler((error, request, reply) => {
    if(error instanceof ZodError){
        return reply.status(400).send({message: "Validation error", issues: error.format()})
    }

    if(env.NODE_ENV !== "prod"){
        console.error(error)
    }else{
        // here we should do a log for an external tool like Datadog, newrelic, sentry
    }
    return reply.status(500).send("Internal Server Error")
})

