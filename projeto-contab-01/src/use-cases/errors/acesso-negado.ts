
export class AcessoNegadoErro extends Error{
    constructor(){
        super("Acesso negado ao recurso")
    }
}