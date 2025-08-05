

export class ErroConexaoBanco extends Error {
    constructor(){
        super("Houve um erro na conexão com o banco de dados")
    }
}