

export class UsuarioJaCadastrouEmpresa extends Error {
    constructor(){
        super("Empresa já cadastradada por esse usuário")
    }
}