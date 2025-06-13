import "dotenv/config"
import {z} from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "prod", "test"]),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number()
})

const _env = envSchema.safeParse(process.env)

if(_env.success == false){
    console.log("invalid env variables", _env.error.format())
    throw new Error("invalid env variables")
}

// Como o throw para o código, caso continue é porque passou na validação
export const env = _env.data
