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
        anexo: z.string(),
        manterBeneficio: z.boolean(),
        prestacao: z.boolean()
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
    compoeCusto: z.boolean(),
    operacao: z.string(),
    manterBeneficio: z.boolean()
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
    compoeCusto: z.boolean(),
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
    compoeCusto: z.boolean(),
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
    manterBeneficio: z.boolean(),
    descricaoAnexo: z.string(),
    id: z.number()
})

export const MetodoAdquiridoType = z.enum(["Por Operação", "Por CNPJ" ])

export const TipoOperacaoAdquiridoType = z.enum(["Consumo", "Insumo", "Alimentação", "Imobilizado", "Revenda"])

export const aliquotasParametrosBodyType = z.object({
    iss: z.union([z.number(), z.null()]), 
    icms: z.union([z.number(), z.null()]), 
    pisCo: z.union([z.number(), z.null()]), 
    ipi: z.union([z.number(), z.null()])
})

export const ProdutoAdquiridoObj = z.object({
    metodo: MetodoAdquiridoType,
    tipoOperacao: z.union([TipoOperacaoAdquiridoType, z.literal("")]),
    valorOperacao: z.number(),
    ncm: z.string(),
    aliquotas: aliquotasParametrosBodyType,
    creditoIcms: z.boolean(),
    creditoPisCofins: z.boolean(),
    creditoIpi: z.boolean(),
    cnpjFornecedor: z.string(),
    regimeTributarioOutro: z.string(),
    fornecedorIndustrial: z.boolean(),
    beneficio: z.number(),
    manterBeneficio: z.boolean(),
    descricaoAnexo: z.string(),
    id: z.number()
})



export const objParametrosEntradaBodyType = z.object({
    industrial: aliquotasParametrosBodyType,
    servicos: aliquotasParametrosBodyType,
    comercial: aliquotasParametrosBodyType,
    locacao: aliquotasParametrosBodyType
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
        tabelaSimplesNacional: objParametrosEntradaBodyType,
        tabelaLucroReal: objParametrosEntradaBodyType,
        tabelaLucroPresumido: objParametrosEntradaBodyType,
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
            const respostaCalculo = await calcularSimplificado.execute()
            return reply.status(200).send({success: true, data: respostaCalculo, error: null})
        }catch(err){
            return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
            
        }




    }catch(err){
        console.log(err)
        return reply.status(500).send({success: false, data: null, error: {code: 500, message: err}})
    }

}