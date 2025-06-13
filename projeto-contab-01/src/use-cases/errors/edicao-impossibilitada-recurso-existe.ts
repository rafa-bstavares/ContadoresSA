export class EdicaoImpossibilitadaErro extends Error{

    constructor(){
        super("Você já tem outra empresa com esse CNPJ ou nome. Por favor, tente outro.")
    }

}