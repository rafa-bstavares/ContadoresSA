

export class RecursoNaoEncontradoErro extends Error {
    constructor(){
        super("Recurso não encontrado")
    }
}