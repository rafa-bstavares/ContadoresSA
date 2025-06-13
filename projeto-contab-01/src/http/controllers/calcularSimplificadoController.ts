import { FastifyReply, FastifyRequest } from "fastify";
import { calcularSimplificadoUseCase } from "../../use-cases/calcularSimplificadoUseCase";
import {nullable, z} from "zod"
import { RegimeTributario } from "@prisma/client";
import { PrismaEmpresaRepository } from "../../repositories/prisma/prisma-empresas-repository";



export const infosEmpresaSchema = z.object({
    atividade: z.string(),
    faturamentoMensal: z.number(),
    id: z.number(),
    cnaePrincipal: z.string(),
    beneficio: z.number(),
    anexo: z.string()
    })

export const objAtividadeAdquirida = z.object({
    cpfOuCnpj: z.string(),
    faturamento: z.number(),
    id: z.number(),
    regimeTributario: z.enum(["Simples Nacional", "Lucro Real", "Lucro Presumido"]),
    cnaePrincipal: z.string(),
    temCreditoPisCofins: z.boolean(),
    metodo: z.enum(["Por CNPJ", "Por Operação"]),
    beneficio: z.number(),
    operacao: z.string()
})

const objTotalMoveisLocacao = z.object({
    valorLocacao: z.number(),
    tipoAluguel: z.enum(["Aluguel pago", "Aluguel recebido"]),
    tipoOutraParte: z.enum(["Pessoa física", "Pessoa jurídica"]),
    prazoDeterminado: z.boolean(),
    creditaPisCofins: z.boolean(),
    comOperador: z.boolean(),
    valorMaoObra: z.number(),
    regimeOutro: z.enum(["Lucro Real", "Lucro Presumido", "Simples Nacional", "Pessoa Fisica"]),
    id: z.number()
})

export const objTotalImoveisLocacao = z.object({
    valorAluguel: z.number(),
    tipoAluguel: z.enum(["Aluguel pago", "Aluguel recebido"]),
    valorCondominio: z.number(),
    juros: z.number(),
    acrescimos: z.number(),
    residencial: z.boolean(),
    condominioEmbutido: z.boolean(),
    tipoOutraParte: z.enum(["Pessoa física", "Pessoa jurídica"]),
    prazoDeterminado: z.boolean(),
    regimeOutro: z.enum(["Lucro Real", "Lucro Presumido", "Simples Nacional", "Pessoa Fisica"]),
    quantidade: z.number()
})

export const objTotalImoveisCompraVenda = z.object({
    residencial: z.boolean(),
    valorVendaImovel: z.number(),
    valorAquisicao: z.number(),
    diaAquisicao: z.string(),
    mesAquisicao: z.string(),
    anoAquisicao: z.string(),
    diaVenda: z.string(),
    mesVenda: z.string(),
    anoVenda: z.string(),
    tipoOperacao: z.enum(["Novo", "Usado"]),
    tipoImovel: z.enum(["Lote", "Imóvel"]),
})

export const TipoOperacaoVendidoType = z.enum(["Revenda", "Indústria", "Exportação", "Revenda - Consumidor final fora do Estado", "Indústria - Consumidor final fora do Estado"])

export const ProdutoVendidoObj = z.object({
    tipoOperacao: TipoOperacaoVendidoType,
    valorOperacao: z.number(),
    ncm: z.string(),
    icms: z.number(),
    icmsSt: z.number(),
    icmsDifal: z.number(),
    pisCofins: z.number(),
    ipi: z.number(),
    beneficio: z.number(),
    id: z.number()
})

export const MetodoAdquiridoType = z.enum(["Por Operação", "Por CNPJ" ])

export const TipoOperacaoAdquiridoType = z.enum(["Consumo", "Insumo", "Alimentação", "Imobilizado", "Revenda"])

export const ProdutoAdquiridoObj = z.object({
    metodo: MetodoAdquiridoType,
    tipoOperacao: z.union([TipoOperacaoAdquiridoType, z.literal("")]),
    valorOperacao: z.number(),
    ncm: z.string(),
    icms: z.number(),
    creditoIcms: z.boolean(),
    pis: z.number(),
    cofins: z.number(),
    creditoPisCofins: z.boolean(),
    ipi: z.number(),
    creditoIpi: z.boolean(),
    cnpjFornecedor: z.string(),
    regimeTributarioOutro: z.string(),
    fornecedorIndustrial: z.boolean(),
    beneficio: z.number(),
    id: z.number()
})



export const bodySchema = z.object({
    cpfOuCnpj: z.string(),
    folha: z.string(),
    meuRegime: z.enum(["Simples Nacional", "Lucro Real", "Lucro Presumido", "Pessoa Fisica"]),
    totalAtividadesPrestadas: z.array(infosEmpresaSchema),
    parametrosEntrada: z.object({
        aliquotaIbs: z.number(), 
        aliquotaCbs: z.number(), 
        aliquotaIva: z.number(),                    
        ipiSimplesServAdquiridos: z.number(),
        issSimplesServAdquiridos: z.number(),
        pisCoSimplesServAdquiridos: z.number(),
        icmsSimplesServAdquiridos: z.number(),
        icmsSimplesComercial: z.number(),
        icmsSimplesIndustrial: z.number(),
        ipiSimplesIndustria: z.number(),
        pisCoSimplesComercio: z.number(),
        pisCoSimplesIndustria: z.number(),
        pisCoLucroRealIndustrial: z.number(),
        pisCoLucroRealServAdquiridos: z.number(),
        pisCoLucroRealComercial: z.number(),
        issLucroRealIndustrial: z.number(),
        issLucroRealServAdquiridos: z.number(),
        issLucroRealComercial: z.number(),
        pisCoLucroPresumidoIndustrial: z.number(),
        pisCoLucroPresumidoServAdquiridos: z.number(),
        pisCoLucroPresumidoComercial: z.number(),
        issLucroPresumidoIndustrial: z.number(),
        issLucroPresumidoServAdquiridos: z.number(),
        issLucroPresumidoComercial: z.number(),
        pisCoLucroPresumidoLocacao: z.number(),
        pisCoLucroRealLocacao: z.number(),
        pisCoSimplesLocacao: z.number(),
    }),
    totalAtividadesAdquiridas: z.array(objAtividadeAdquirida),
    totalImoveisLocacao: z.array(objTotalImoveisLocacao),
    totalImoveisCompraVenda: z.array(objTotalImoveisCompraVenda),
    totalMoveisLocacao: z.array(objTotalMoveisLocacao),
    totalProdutosVendidos: z.array(ProdutoVendidoObj),
    totalProdutosAdquiridos: z.array(ProdutoAdquiridoObj),
})




export async function calcularSimplificadoController(request: FastifyRequest, reply: FastifyReply){

    const body = bodySchema.parse(request.body)

    console.log("BODY")
    console.log(request.body)

    try{

        const empresaRepo = new PrismaEmpresaRepository

        const calcularSimplificado = new calcularSimplificadoUseCase(empresaRepo, body.cpfOuCnpj, body.totalAtividadesPrestadas, body.parametrosEntrada, body.totalAtividadesAdquiridas, body.totalImoveisLocacao, body.totalImoveisCompraVenda, body.totalMoveisLocacao, body.totalProdutosVendidos, body.totalProdutosAdquiridos, body.meuRegime)

        try{
            await calcularSimplificado.execute()
            return reply.status(200).send({message: "Foi"})
        }catch(err){
            return reply.status(500).send("Erro")
        }




    }catch(err){
        console.log(err)
    }

}