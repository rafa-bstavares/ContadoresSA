

export class recursoNaoEncontradoErro extends Error {
    constructor(){
        super("Recurso não encontrado")
    }
}