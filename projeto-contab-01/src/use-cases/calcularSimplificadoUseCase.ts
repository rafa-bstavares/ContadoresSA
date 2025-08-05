import * as XLSX from 'xlsx'
import path from 'path'
import { EmpresasRepository } from "../repositories/empresas-repository"
import { AnosType, AntesReformaCategoria, Categoria, CategoriaType, DepoisReformaCategoria, LinhasCaixaType, LinhasDreType, Prisma, RegimesType, RegimeTributario } from '@prisma/client'
import { RespostaGeralRepository } from '../repositories/resposta-geral-repository'
import { RespostaCategoriasRepository } from '../repositories/resposta-categorias-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { v4 as uuidv4 } from 'uuid'
import { ErroConexaoBanco } from './errors/erro-conexao-banco'
import { RecursoNaoEncontradoErro } from './errors/recurso-nao-encontrado-erro'
import { RespostaTabelasRepository } from '../repositories/resposta-tabelas-repository'

export interface objAtividadeFinal {
    atividade: string,
    faturamentoMensal: number,
    id: number,
    cnaePrincipal: string,
    beneficio: number,
    anexo: string,
    manterBeneficio: boolean,
    prestacao: boolean
}

export interface objAtividadesAdquitidasType {
  cpfOuCnpj: string,
  faturamento: number,
  id: number,
  regimeTributario: "Simples Nacional" | "Lucro Real" | "Lucro Presumido",
  cnaePrincipal: string,
  temCreditoPisCofins: boolean,
  metodo: "Por CNPJ" | "Por Operação",
  beneficio: number,
  compoeCusto: boolean,
  operacao: string,
  manterBeneficio: boolean
}

export type impostosParametrosBodyType = {iss: number | null, icms: number | null, pisCo: number | null, ipi: number | null}

export type objParametrosEntradaBodyType = {
    industrial: impostosParametrosBodyType,
    servicos: impostosParametrosBodyType,
    comercial: impostosParametrosBodyType,
    locacao: impostosParametrosBodyType
}

export type parametrosEntrada = {
    aliquotaIbs: number,
    aliquotaCbs: number,
    aliquotaIva: number,
    tabelaSimplesNacional: objParametrosEntradaBodyType,
    tabelaLucroReal: objParametrosEntradaBodyType,
    tabelaLucroPresumido: objParametrosEntradaBodyType,
}

interface ExcelRow {
  "Subclasse": string;
  "Descrição Atividades": string;
  "Redução de"?: string;
  "Base Legal"?: string;
  "NBS?": string;
  "Descrição NBS"?: string;
}

export interface linhaTabelaNcmType {
  "BENEFÍCIO APLICADO À": string,
  "NCM": string,
  "ANEXO": string,
  "DESCRIÇÃO ANEXO": string,
  "REDUÇÃO BASE": number,
  "qtd caract": number
}

type objRespostaServicosPrestados = {
  meuRegime: "Simples Nacional", 
  cnae: number,
  anexo: string,
  aliquotaEfetiva: number,
  aliquotaDesonerada: number,
  objPercentualReparticao: {
    irpj: number;
    csll: number;
    cofins: number;
    pis: number;
    cpp: number;
    icms: number;
    iss: number;
    ipi: number;
  },
  faturamentoMensalDesonerado: number,
  valorImpostosDesonerados: number,
  valorIbsSimulacao1: number,
  valorCbsSimulacao1: number,
  valorServicoMesDepoisSimu1: number,
  valorCbsSimulacao2: number,
  valorIbsSimulacao2: number,
  valorServicoMesDepoisSimu2: number
} | {
  meuRegime: "Lucro Real" | "Lucro Presumido",
  cnae: number,
  faturamentoMensalDesonerado: number,
  valorImpostosDesonerados: number,
  novoValorServico: number
} 

export type ImoveisLocacaoObj = {
  valorAluguel: number,
  tipoAluguel: "Aluguel pago" | "Aluguel recebido",
  valorCondominio: number,
  juros: number,
  acrescimos: number,
  residencial: boolean,
  condominioEmbutido: boolean,
  tipoOutraParte: "Pessoa física" | "Pessoa jurídica",
  prazoDeterminado: boolean,
  regimeOutro: "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica",
  compoeCusto: boolean,
  quantidade: number
}

export type MoveisLocacaoObj = {
    valorLocacao: number,
    tipoAluguel: "Aluguel pago" | "Aluguel recebido" // por aqui vamos saber quem é o locador e locatário
    tipoOutraParte: "Pessoa física" | "Pessoa jurídica",
    prazoDeterminado: boolean,
    creditaPisCofins: boolean,
    comOperador: boolean,
    valorMaoObra: number,
    regimeOutro: "Lucro Real" | "Lucro Presumido" | "Simples Nacional" | "Pessoa Fisica",
    compoeCusto: boolean,
    id: number
}

export type ImoveisCompraVendaObj = {
  residencial: boolean,
  valorVendaImovel: number,
  valorAquisicao: number,
  diaAquisicao: string,
  mesAquisicao: string,
  anoAquisicao: string,
  diaVenda: string,
  mesVenda: string,
  anoVenda: string,
  tipoOperacao: "Novo" | "Usado",
  tipoImovel: "Lote" | "Imóvel",
}


type TipoOperacaoVendidoType = "Revenda" | "Indústria" | "Exportação" | "Revenda - Consumidor final fora do Estado" | "Indústria - Consumidor final fora do Estado"

export type ProdutoVendidoManualObj = {
    tipoOperacao: TipoOperacaoVendidoType,
    valorOperacao: number,
    ncm: string,
    icms: number,
    icmsSt: number,
    icmsDifal: number,
    pisCofins: number,
    ipi: number,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "Manual",
    id: number,
}


export type ProdutoVendidoXmlObj = {
    tipoOperacao: TipoOperacaoVendidoType,
    valorOperacao: number,
    ncm: string,
    valorIcms: number,
    aliqIcms: number,
    valorIcmsSt: number,
    valorIcmsDifal: number,
    valorPisCofins: number,
    valorIpi: number,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "XML",
    id: number,
}

export type ProdutoVendidoObj  = ProdutoVendidoManualObj | ProdutoVendidoXmlObj

export type MetodoAdquiridoType = "Por Operação" | "Por CNPJ"

type TipoOperacaoAdquiridoType = "Consumo" | "Insumo" | "Alimentação" | "Imobilizado" | "Revenda" | "Depreciação"

export type ProdutoAdquiridoManualObj = {
    metodo: MetodoAdquiridoType,
    tipoOperacao: TipoOperacaoAdquiridoType | "",
    valorOperacao: number,
    ncm: string,
    aliquotas: impostosParametrosBodyType,
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "Manual",
    id: number
}

export type custoDespesaType = "Custo" | "Despesa"

export type ProdutoAdquiridoXmlObj = {
    metodo: MetodoAdquiridoType,
    custoDespesa: custoDespesaType,
    valorOperacao: number,
    ncm: string,
    aliquotas: impostosParametrosBodyType,
    valores: impostosParametrosBodyType,
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    tipoInput: "XML",
    id: number
}

export type ProdutoAdquiridoObj = ProdutoAdquiridoManualObj | ProdutoAdquiridoXmlObj

interface respostaTotalType {
  servicosPrestados: objRespostaServicosPrestados[],
  servicosTomados: any[]
}

export type tiposRegime = "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "Pessoa Fisica" | ""




// Tipagens para a resposta
export type anosType = "A2026" | "A2027" | "A2028" | "A2029" | "A2030" | "A2031" | "A2032" | "A2033"

export type objAreaComprasTransicaoType = {
      ano: anosType
      valor: number,
      valorSemIva: number,
      impostos: number,
      credito: number,
      custo: number,
      porcentagemCustoEfetivo: number,
      porcentagemCargaTributaria: number
}

export type antesReformaComprasType = {
  valorAR: number,
  impostosAR: number,
  valorDesonerado: number,
  creditoAR: number, 
  custoAR: number,
  porcentagemCustoEfetivoAR: number,
  porcentagemCargaTributariaAR: number
}

export type objAreaComprasType = {
    antesReforma: antesReformaComprasType,
    depoisReforma: objAreaComprasTransicaoType[]
}

export type objAreaVendasTransicaoType = {
      ano: anosType
      valor: number,
      valorSemIva: number,
      impostos: number,
      porcentagemCargaTributaria: number
}

export type antesReformaVendasType = {
  valorAR: number,
  impostosAR: number,
  valorDesonerado: number,
  porcentagemCargaTributariaAR: number
}

export type objAreaVendasType = {
    antesReforma: antesReformaVendasType,
    depoisReforma: objAreaVendasTransicaoType[]
}

type totalComprasType = {
    comprasProdutos: objAreaComprasType,
    servicosTomados: objAreaComprasType,
    locacaoMoveis: objAreaComprasType,
    locacaoImoveis: objAreaComprasType,
    total: objAreaComprasType
}

type totalVendasType = {
    vendasProdutos: objAreaVendasType,
    servicosPrestados: objAreaVendasType,
    locacaoMoveis: objAreaVendasType,
    locacaoImoveis: objAreaVendasType,
    total: objAreaVendasType
}

type linhasDreType = {
  custoGeral: {AR: number, DR: number},
  despesas: {AR: number, DR: number},
}


export type objAntesReforma = {
    valor: number, 
    valorImpostos: number,
    valorDesonerado: number,
    porcentagemCargaTributaria: number,
    custo: number | null, 
} 

export type objDepoisReforma = {
  ano: anosType,
  valor: number,
  valorSemIva: number,
  valorImpostos: number,
  porcentagemCargaTributaria: number,
  custo: number | null
}

export type objItemFinal = {
  antesReforma: objAntesReforma,
  depoisReforma: objDepoisReforma[]
}    

 export type objDepoisReformaDreCaixa = {
  ano: anosType,
  valor: number
}

export type antesReformaDreCaixaType = {
  valor: number
}

export type linhaArDrDiferencas = {
  antesReforma: antesReformaDreCaixaType,
  depoisReforma: objDepoisReformaDreCaixa[]
} 

type tabelaDreType = {
  receitaBruta: linhaArDrDiferencas,
  deducoesTributos: linhaArDrDiferencas,
  custoGeral: linhaArDrDiferencas,
  lucroBruto: linhaArDrDiferencas,
  despesas: linhaArDrDiferencas,
  lucrosAntesIrCs: linhaArDrDiferencas,
  irCs: linhaArDrDiferencas,
  lucroLiquido: linhaArDrDiferencas
}

type tabelaCaixaType = {
  fornecedores: linhaArDrDiferencas,
  tributosCredito: linhaArDrDiferencas,
  clientes: linhaArDrDiferencas,
  tributosDebito: linhaArDrDiferencas,
  tributosRecolhidos: linhaArDrDiferencas,
  saldoCredor: linhaArDrDiferencas,
  resultado: linhaArDrDiferencas,
  irCs: linhaArDrDiferencas,
  resultadoPosIrCs: linhaArDrDiferencas,
  resultadoSobreClientes: linhaArDrDiferencas,
}

export type objRegimeType = {
    servicosPrestados: objItemFinal[],
    servicosTomados: objItemFinal[],
    locacaoBensMoveis: objItemFinal[],
    produtosVendidos: objItemFinal[],
    produtosAdquiridos: objItemFinal[],
    locacaoBensImoveis: objItemFinal[],
    compraVendaBensImoveis: objItemFinal[],
    totalCompras: totalComprasType,
    totalVendas: totalVendasType,
    dre: tabelaDreType,
    caixa: tabelaCaixaType
}


export const valorInicialObjRegime: objRegimeType = {
    servicosPrestados: [],
    servicosTomados: [],
    locacaoBensMoveis: [],
    produtosVendidos: [],
    produtosAdquiridos: [],
    locacaoBensImoveis: [],
    compraVendaBensImoveis: [],
    totalCompras: {
        comprasProdutos: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            creditoAR: 0,
            custoAR: 0, 
            porcentagemCustoEfetivoAR: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
          ]
        },
        servicosTomados: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            creditoAR: 0,
            custoAR: 0, 
            porcentagemCustoEfetivoAR: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
          ]
        },
        locacaoMoveis: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            creditoAR: 0,
            custoAR: 0, 
            porcentagemCustoEfetivoAR: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
          ]
        },
        locacaoImoveis: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            creditoAR: 0,
            custoAR: 0, 
            porcentagemCustoEfetivoAR: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
          ]
        },
        total: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            creditoAR: 0,
            custoAR: 0, 
            porcentagemCustoEfetivoAR: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, credito: 0, custo: 0, porcentagemCustoEfetivo: 0, porcentagemCargaTributaria: 0},
          ]
        },
    },
    totalVendas: {
        vendasProdutos: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
          ]
        },
        servicosPrestados: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
          ]
        },
        locacaoMoveis: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
          ]
        },
        locacaoImoveis: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
          ]
        },
        total: {
          antesReforma: {
            valorAR: 0,
            impostosAR: 0,
            valorDesonerado: 0,
            porcentagemCargaTributariaAR: 0,
          },
          depoisReforma: [
            {ano: "A2026", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2027", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2028", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2029", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2030", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2031", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2032", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
            {ano: "A2033", valor: 0, valorSemIva: 0, impostos: 0, porcentagemCargaTributaria: 0},
          ]
        },
    },
    dre: {
      receitaBruta: {antesReforma: {valor: 0}, depoisReforma: []},
      deducoesTributos: {antesReforma: {valor: 0}, depoisReforma: []},
      custoGeral: {antesReforma: {valor: 0}, depoisReforma: []},
      lucroBruto: {antesReforma: {valor: 0}, depoisReforma: []},
      despesas: {antesReforma: {valor: 0}, depoisReforma: []},
      lucrosAntesIrCs: {antesReforma: {valor: 0}, depoisReforma: []},
      irCs: {antesReforma: {valor: 0}, depoisReforma: []},
      lucroLiquido: {antesReforma: {valor: 0}, depoisReforma: []}
    },
    caixa: {
      fornecedores: {antesReforma: {valor: 0}, depoisReforma: []},
      tributosCredito: {antesReforma: {valor: 0}, depoisReforma: []},
      clientes: {antesReforma: {valor: 0}, depoisReforma: []},
      tributosDebito: {antesReforma: {valor: 0}, depoisReforma: []},
      tributosRecolhidos: {antesReforma: {valor: 0}, depoisReforma: []},
      saldoCredor: {antesReforma: {valor: 0}, depoisReforma: []},
      resultado: {antesReforma: {valor: 0}, depoisReforma: []},
      irCs: {antesReforma: {valor: 0}, depoisReforma: []},
      resultadoPosIrCs: {antesReforma: {valor: 0}, depoisReforma: []},
      resultadoSobreClientes: {antesReforma: {valor: 0}, depoisReforma: []}
    }
}


export type respostaFinalCaluloEmpresaType = {
  tipoUsuario: "Empresa",
  simplesNacional: objRegimeType,
  lucroReal: objRegimeType,
  lucroPresumido: objRegimeType,
  meuRegime: tiposRegime,
  cnpj: string
}


export type objAnoAAnoType = {
  ano: anosType,
  porcentagemCbs: number,
  porcentagemIbs: number,
  porcentagemIcmsIss: number
}



export class calcularSimplificadoUseCase{
    

    constructor(private usuarioId: string, private RespTabelasRepository: RespostaTabelasRepository, private RespGeralRepository: RespostaGeralRepository, private RespCategoriasRepository: RespostaCategoriasRepository, private EmpresaRepository: EmpresasRepository, private cnpj: string, private totalAtividades: objAtividadeFinal[], private parametrosEntrada: parametrosEntrada, private totalAtividadesAdquiridas: objAtividadesAdquitidasType[], private totalImoveisLocacao: ImoveisLocacaoObj[], private totalImoveisCompraVenda: ImoveisCompraVendaObj[], private totalMoveisLocacao: MoveisLocacaoObj[], private totalProdutosVendidos: ProdutoVendidoObj[], private totalProdutosAdquiridos: ProdutoAdquiridoObj[], private meuRegime: tiposRegime, private nomeCalculo: string){}

    async execute(){

      // buscar dados gerais da empresa

      const cnpj = this.cnpj
      console.log("cnpj: " + cnpj)
      let dadosEmpresaAtual
      try {
        dadosEmpresaAtual = await this.EmpresaRepository.buscarEmpresa(cnpj)
      }catch(err){
        throw new ErroConexaoBanco()
      }

      if(!dadosEmpresaAtual){
        throw new RecursoNaoEncontradoErro()
      }


      // Inicializando variaveis bancos de dados
      const respGeralRepo = this.RespGeralRepository
      const respCategoriasRepo = this.RespCategoriasRepository
      const respTabelasRepo = this.RespTabelasRepository

      // Criar calculo no banco de dados
      const usuarioId = this.usuarioId
      const nomeCalculo = this.nomeCalculo
      const calculoCriado = await respGeralRepo.criarCalculo(usuarioId, "Empresa", nomeCalculo)
      const calculoId = calculoCriado.id
      await respGeralRepo.criarCalculoPorEmpresa(calculoId, dadosEmpresaAtual?.id)
      


      console.log("TA VINDO NO EXECUTE")

        type linhaReparticao = {
            irpj: number;
            csll: number;
            cofins: number;
            pis: number;
            cpp: number;
            icms: number;
            iss: number;
            ipi: number;
          };

          type linhaTabela1Type  = {
            rbt12: number[],
            aliquota: number,
            valorDeduzir: number
          }

          type objAnexo = {
            anexo: string,
            tabela1: linhaTabela1Type[],
            reparticao: linhaReparticao[]
          }


          const totalAtividades = this.totalAtividades
          const totalAtividadesAdquiridas = this.totalAtividadesAdquiridas
          const totalImoveisLocacao = this.totalImoveisLocacao
          const totalImoveisCompraVenda = this.totalImoveisCompraVenda
          const totalMoveisLocacao = this.totalMoveisLocacao
          const totalProdutosAdquiridos = this.totalProdutosAdquiridos
          const totalProdutosVendidos = this.totalProdutosVendidos

          let respostaTotal: respostaTotalType = {
            servicosPrestados: [],
            servicosTomados: []
          }


          console.log("Dados empresa atual: ")
          console.log(dadosEmpresaAtual)

          const meuRegime = this.meuRegime

          const parametrosEntrada = this.parametrosEntrada
          const ibsBruto = parametrosEntrada.aliquotaIbs / 100
          const cbsBruto = parametrosEntrada.aliquotaCbs / 100
          const ivaBruto = parametrosEntrada.aliquotaIva / 100


                const anexos: objAnexo[] = [
                    {
                        anexo: "I",
                        tabela1: [
                            {
                                rbt12: [0, 180000],
                                aliquota: 0.04,
                                valorDeduzir: 0
                            },
                            {
                                rbt12: [180000, 360000],
                                aliquota: 0.073,
                                valorDeduzir: 5940
                            },
                            {
                                rbt12: [360000, 720000],
                                aliquota: 0.095,
                                valorDeduzir: 13860
                            },
                            {
                                rbt12: [720000, 1800000],
                                aliquota: 0.107,
                                valorDeduzir: 22500
                            },
                            {
                                rbt12: [1800000, 3600000],
                                aliquota: 0.143,
                                valorDeduzir: 87300
                            },
                            {
                                rbt12: [3600000, 4800000],
                                aliquota: 0.19,
                                valorDeduzir: 378000
                            }
                        ],
                        reparticao: [
                            {
                                irpj: 0.055,       // 5,50%  → 0.055
                                csll: 0.035,       // 3,50%  → 0.035
                                cofins: 0.1274,    // 12,74% → 0.1274
                                pis: 0.0276,  // 2,76%  → 0.0276
                                cpp: 0.415,        // 41,50% → 0.415
                                icms: 0.34,
                                iss: 0,
                                ipi: 0         // 34,00% → 0.34
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1274,
                                pis: 0.0276,
                                cpp: 0.415,
                                icms: 0.34,
                                iss: 0,
                                ipi: 0
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1274,
                                pis: 0.0276,
                                cpp: 0.42,         // 42,00% → 0.42
                                icms: 0.335 ,
                                iss: 0,
                                ipi: 0       // 33,50% → 0.335
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1274,
                                pis: 0.0276,
                                cpp: 0.42,
                                icms: 0.335,
                                iss: 0,
                                ipi: 0
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1274,
                                pis: 0.0276,
                                cpp: 0.42,
                                icms: 0.335,
                                iss: 0,
                                ipi: 0
                              },
                              {
                                irpj: 0.135,       // 13,50% → 0.135
                                csll: 0.1,         // 10,00% → 0.1
                                cofins: 0.2827,    // 28,27% → 0.2827
                                pis: 0.0613,  // 6,13%  → 0.0613
                                cpp: 0.421,        // 42,10% → 0.421
                                icms: 0,
                                iss: 0,
                                ipi: 0         // “–” indica ausência de valor, então usamos null
                              }
                        ]
                    },
                    {
                        anexo: "II",
                        tabela1: [
                            {
                                rbt12: [0, 180000],
                                aliquota: 0.045,
                                valorDeduzir: 0
                            },
                            {
                                rbt12: [180000, 360000],
                                aliquota: 0.078,
                                valorDeduzir: 5940
                            },
                            {
                                rbt12: [360000, 720000],
                                aliquota: 0.1,
                                valorDeduzir: 13860
                            },
                            {
                                rbt12: [720000, 1800000],
                                aliquota: 0.112,
                                valorDeduzir: 22500
                            },
                            {
                                rbt12: [1800000, 3600000],
                                aliquota: 0.147,
                                valorDeduzir: 85500
                            },
                            {
                                rbt12: [3600000, 4800000],
                                aliquota: 0.30,
                                valorDeduzir: 720000
                            }
                        ],
                        reparticao: [
                            {
                                irpj: 0.055,       // 5,50% → 0.055
                                csll: 0.035,       // 3,50% → 0.035
                                cofins: 0.1151,    // 11,51% → 0.1151
                                pis: 0.0249,  // 2,49%  → 0.0249
                                cpp: 0.375,        // 37,50% → 0.375
                                ipi: 0.075,        // 7,50%  → 0.075
                                icms: 0.32,
                                iss: 0         // 32,00% → 0.32
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1151,
                                pis: 0.0249,
                                cpp: 0.375,
                                ipi: 0.075,
                                icms: 0.32,
                                iss: 0
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1151,
                                pis: 0.0249,
                                cpp: 0.375,
                                ipi: 0.075,
                                icms: 0.32,
                                iss: 0
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1151,
                                pis: 0.0249,
                                cpp: 0.375,
                                ipi: 0.075,
                                icms: 0.32,
                                iss: 0
                              },
                              {
                                irpj: 0.055,
                                csll: 0.035,
                                cofins: 0.1151,
                                pis: 0.0249,
                                cpp: 0.375,
                                ipi: 0.075,
                                icms: 0.32,
                                iss: 0
                              },
                              {
                                irpj: 0.085,       // 8,50%  → 0.085
                                csll: 0.075,       // 7,50%  → 0.075
                                cofins: 0.2096,    // 20,96% → 0.2096
                                pis: 0.0454,  // 4,54%  → 0.0454
                                cpp: 0.235,        // 23,50% → 0.235
                                ipi: 0.35,         // 35,00% → 0.35
                                icms: 0,
                                iss: 0        // “–” indica ausência de valor, representado como null
                              }
                        ]
                    },
                    {
                        anexo: "III",
                        tabela1: [
                            {
                                rbt12: [0, 180000],
                                aliquota: 0.06,
                                valorDeduzir: 0
                            },
                            {
                                rbt12: [180000, 360000],
                                aliquota: 0.112,
                                valorDeduzir: 9360
                            },
                            {
                                rbt12: [360000, 720000],
                                aliquota: 0.135,
                                valorDeduzir: 17640
                            },
                            {
                                rbt12: [720000, 1800000],
                                aliquota: 0.16,
                                valorDeduzir: 35640
                            },
                            {
                                rbt12: [1800000, 3600000],
                                aliquota: 0.21,
                                valorDeduzir: 125640
                            },
                            {
                                rbt12: [3600000, 4800000],
                                aliquota: 0.33,
                                valorDeduzir: 648000
                            }
                        ],
                        reparticao: [
                            {
                                irpj: 0.04,        // 4,00%  → 0.04
                                csll: 0.035,       // 3,50%  → 0.035
                                cofins: 0.1282,    // 12,82% → 0.1282
                                pis: 0.0278,  // 2,78%  → 0.0278
                                cpp: 0.434,        // 43,40% → 0.434
                                iss: 0.335,
                                icms: 0,
                                ipi: 0         // 33,50% → 0.335
                              },
                              {
                                irpj: 0.04,
                                csll: 0.035,
                                cofins: 0.1405,    // 14,05% → 0.1405
                                pis: 0.0305,  // 3,05%  → 0.0305
                                cpp: 0.434,
                                iss: 0.32,
                                icms: 0,
                                ipi: 0          // 32,00% → 0.32
                              },
                              {
                                irpj: 0.04,
                                csll: 0.035,
                                cofins: 0.1364,    // 13,64% → 0.1364
                                pis: 0.0296,  // 2,96%  → 0.0296
                                cpp: 0.434,
                                iss: 0.325,
                                icms: 0,
                                ipi: 0         // 32,50% → 0.325
                              },
                              {
                                irpj: 0.04,
                                csll: 0.035,
                                cofins: 0.1364,
                                pis: 0.0296,
                                cpp: 0.434,
                                iss: 0.325,
                                icms: 0,
                                ipi: 0
                              },
                              {
                                irpj: 0.04,
                                csll: 0.035,
                                cofins: 0.1282,
                                pis: 0.0278,
                                cpp: 0.434,
                                iss: 0.335,
                                icms: 0,
                                ipi: 0
                              },
                              {
                                irpj: 0.35,        // 35,00% → 0.35
                                csll: 0.15,        // 15,00% → 0.15
                                cofins: 0.1603,    // 16,03% → 0.1603
                                pis: 0.0347,  // 3,47%  → 0.0347
                                cpp: 0.305,        // 30,50% → 0.305
                                iss: 0,
                                icms: 0,
                                ipi: 0       // “–”   → null
                              }
                        ]
                    },
                    {
                        anexo: "IV",
                        tabela1: [
                            {
                                rbt12: [0, 180000],
                                aliquota: 0.045,
                                valorDeduzir: 0
                            },
                            {
                                rbt12: [180000, 360000],
                                aliquota: 0.09,
                                valorDeduzir: 8100
                            },
                            {
                                rbt12: [360000, 720000],
                                aliquota: 0.102,
                                valorDeduzir: 12420
                            },
                            {
                                rbt12: [720000, 1800000],
                                aliquota: 0.14,
                                valorDeduzir: 39780
                            },
                            {
                                rbt12: [1800000, 3600000],
                                aliquota: 0.22,
                                valorDeduzir: 183780
                            },
                            {
                                rbt12: [3600000, 4800000],
                                aliquota: 0.33,
                                valorDeduzir: 828000
                            }
                        ],
                        reparticao: [
                            {
                                irpj: 0.188,      // 18,80% → 0.188
                                csll: 0.152,      // 15,20% → 0.152
                                cofins: 0.1767,   // 17,67% → 0.1767
                                pis: 0.0383, // 3,83%  → 0.0383
                                iss: 0.445,
                                icms: 0,
                                ipi:  0,
                                cpp: 0        // 44,50% → 0.445
                              },
                              {
                                irpj: 0.198,      // 19,80% → 0.198
                                csll: 0.152,      // 15,20% → 0.152
                                cofins: 0.2055,   // 20,55% → 0.2055
                                pis: 0.0445, // 4,45%  → 0.0445
                                iss: 0.4,
                                icms: 0,
                                ipi:  0,
                                cpp: 0          // 40,00% → 0.4
                              },
                              {
                                irpj: 0.208,      // 20,80% → 0.208
                                csll: 0.152,      // 15,20% → 0.152
                                cofins: 0.1973,   // 19,73% → 0.1973
                                pis: 0.0427, // 4,27%  → 0.0427
                                iss: 0.4,
                                icms: 0,
                                ipi:  0,
                                cpp: 0          // 40,00% → 0.4
                              },
                              {
                                irpj: 0.178,      // 17,80% → 0.178
                                csll: 0.192,      // 19,20% → 0.192
                                cofins: 0.189,    // 18,90% → 0.189
                                pis: 0.041,  // 4,10%  → 0.041
                                iss: 0.4,
                                icms: 0,
                                ipi:  0,
                                cpp: 0          // 40,00% → 0.4
                              },
                              {
                                irpj: 0.188,      // 18,80% → 0.188
                                csll: 0.192,      // 19,20% → 0.192
                                cofins: 0.1808,   // 18,08% → 0.1808
                                pis: 0.0392, // 3,92%  → 0.0392
                                iss: 0.4,
                                icms: 0,
                                ipi:  0,
                                cpp: 0          // 40,00% → 0.4
                              },
                              {
                                irpj: 0.535,      // 53,50% → 0.535
                                csll: 0.215,      // 21,50% → 0.215
                                cofins: 0.2055,   // 20,55% → 0.2055
                                pis: 0.0445, // 4,45%  → 0.0445
                                iss: 0,
                                icms: 0,
                                ipi:  0,
                                cpp: 0        // “–”    → null
                              }
                        ]
                    },
                    {
                        anexo: "V",
                        tabela1: [
                            {
                                rbt12: [0, 180000],
                                aliquota: 0.155,
                                valorDeduzir: 0
                            },
                            {
                                rbt12: [180000, 360000],
                                aliquota: 0.18,
                                valorDeduzir: 4500
                            },
                            {
                                rbt12: [360000, 720000],
                                aliquota: 0.195,
                                valorDeduzir: 9900
                            },
                            {
                                rbt12: [720000, 1800000],
                                aliquota: 0.205,
                                valorDeduzir: 17100
                            },
                            {
                                rbt12: [1800000, 3600000],
                                aliquota: 0.23,
                                valorDeduzir: 62100
                            },
                            {
                                rbt12: [3600000, 4800000],
                                aliquota: 0.305,
                                valorDeduzir: 540000
                            }
                        ],
                        reparticao: [
                            {
        
                                irpj: 0.25,       // 25,00% → 0.25
                                csll: 0.15,       // 15,00% → 0.15
                                cofins: 0.141,    // 14,10% → 0.141
                                pis: 0.0305, // 3,05%  → 0.0305
                                cpp: 0.2885,      // 28,85% → 0.2885
                                iss: 0.14,
                                icms: 0,
                                ipi: 0         // 14,00% → 0.14
                              },
                              {
                                irpj: 0.23,       // 23,00% → 0.23
                                csll: 0.15,       // 15,00% → 0.15
                                cofins: 0.141,    // 14,10% → 0.141
                                pis: 0.0305, // 3,05%  → 0.0305
                                cpp: 0.2785,      // 27,85% → 0.2785
                                iss: 0.17,
                                icms: 0,
                                ipi: 0         // 17,00% → 0.17
                              },
                              {
                                irpj: 0.24,       // 24,00% → 0.24
                                csll: 0.15,       // 15,00% → 0.15
                                cofins: 0.1492,   // 14,92% → 0.1492
                                pis: 0.0323, // 3,23%  → 0.0323
                                cpp: 0.2385,      // 23,85% → 0.2385
                                iss: 0.19,
                                icms: 0,
                                ipi: 0         // 19,00% → 0.19
                              },
                              {
                                irpj: 0.21,       // 21,00% → 0.21
                                csll: 0.15,       // 15,00% → 0.15
                                cofins: 0.1574,   // 15,74% → 0.1574
                                pis: 0.0341, // 3,41%  → 0.0341
                                cpp: 0.2385,      // 23,85% → 0.2385
                                iss: 0.21,
                                icms: 0,
                                ipi: 0         // 21,00% → 0.21
                              },
                              {
                                irpj: 0.23,       // 23,00% → 0.23
                                csll: 0.125,      // 12,50% → 0.125
                                cofins: 0.141,    // 14,10% → 0.141
                                pis: 0.0305, // 3,05%  → 0.0305
                                cpp: 0.2385,      // 23,85% → 0.2385
                                iss: 0.235,
                                icms: 0,
                                ipi: 0        // 23,50% → 0.235
                              },
                              {
                                irpj: 0.35,       // 35,00% → 0.35
                                csll: 0.155,      // 15,50% → 0.155
                                cofins: 0.1644,   // 16,44% → 0.1644
                                pis: 0.0356, // 3,56%  → 0.0356
                                cpp: 0.295,       // 29,50% → 0.295
                                iss: 0,
                                icms: 0,
                                ipi: 0         // “–”   → null (ausência de valor)
                              }
                        ]
                    }
                ]

          const arrAnos: anosType[] = ["A2026", "A2027", "A2028", "A2029", "A2030", "A2031", "A2032", "A2033"]

          type regimesChavesObjType = "simplesNacional" | "lucroReal" | "lucroPresumido"

          let respostaFinalCalculo: respostaFinalCaluloEmpresaType = {
            tipoUsuario: "Empresa",
            simplesNacional: JSON.parse(JSON.stringify(valorInicialObjRegime)),
            lucroReal: JSON.parse(JSON.stringify(valorInicialObjRegime)),
            lucroPresumido: JSON.parse(JSON.stringify(valorInicialObjRegime)),
            meuRegime,
            cnpj
          }

          const anoAano: objAnoAAnoType[] = [
            {ano: "A2027", porcentagemCbs: 0.9892, porcentagemIbs: 0.001, porcentagemIcmsIss: 1},
            {ano: "A2028", porcentagemCbs: 0.9892, porcentagemIbs: 0.001, porcentagemIcmsIss: 1},
            {ano: "A2029", porcentagemCbs: 1, porcentagemIbs: 0.1, porcentagemIcmsIss: 0.9},
            {ano: "A2030", porcentagemCbs: 1, porcentagemIbs: 0.2, porcentagemIcmsIss: 0.8},
            {ano: "A2031", porcentagemCbs: 1, porcentagemIbs: 0.3, porcentagemIcmsIss: 0.7},
            {ano: "A2032", porcentagemCbs: 1, porcentagemIbs: 0.4, porcentagemIcmsIss: 0.6},
            {ano: "A2033", porcentagemCbs: 1, porcentagemIbs: 1, porcentagemIcmsIss: 0},
          ]

          const regimes: ("Simples Nacional" | "Lucro Real" | "Lucro Presumido")[] = ["Simples Nacional", "Lucro Real", "Lucro Presumido"]

          // POR REGIME COMEÇA AQUI
          // precisa ser for...of pra usar o await dentro, o forEach n aceita
          for(const regimeAtual of regimes){ 

            // encontrar qual é o id do regime atual no banco de dados e guardar para usar mais a frente
            let regimeCamelCase: RegimesType 
            switch(regimeAtual){
              case "Simples Nacional":
                regimeCamelCase = "simplesNacional"
                break

              case "Lucro Presumido":
                regimeCamelCase = "lucroPresumido"
                break

              case "Lucro Real":
                regimeCamelCase = "lucroReal"
                break
            }
            const objRegimeAtual = await respGeralRepo.pegarIdRegimePorNome(regimeCamelCase)
            const regimeId = objRegimeAtual?.id

            // Inicializar estruturas do banco de dados Tabelas
            const estruturaDbAntesReformaCompras: Prisma.AntesReformaComprasUncheckedCreateInput[] = []
            const estruturaDbAntesReformaVendas: Prisma.AntesReformaVendasUncheckedCreateInput[] = []
            const estruturaDbAntesReformaCaixa: Prisma.AntesReformaCaixaUncheckedCreateInput[] = []
            const estruturaDbAntesReformaDre: Prisma.AntesReformaDreUncheckedCreateInput[] = []
            const estruturaDbDepoisReformaCompras: Prisma.DepoisReformaComprasUncheckedCreateInput[] = []
            const estruturaDbDepoisReformaVendas: Prisma.DepoisReformaVendasUncheckedCreateInput[] = []
            const estruturaDbDepoisReformaCaixa: Prisma.DepoisReformaCaixaUncheckedCreateInput[] = []
            const estruturaDbDepoisReformaDre: Prisma.DepoisReformaDreUncheckedCreateInput[] = []


            let chaveRegimeObjFinal: regimesChavesObjType = "simplesNacional" 

              switch(regimeAtual){
                case "Simples Nacional": 
                  chaveRegimeObjFinal = "simplesNacional"
                  break

                case "Lucro Presumido":
                  chaveRegimeObjFinal = "lucroPresumido"
                  break

                case "Lucro Real":
                  chaveRegimeObjFinal = "lucroReal"
                  break
              }

              let dreCustoGeralAR = 0
              let dreCustoGeralTransicao: {ano: anosType, custoGeralAnoVigente: number}[] = [
                {ano: "A2026", custoGeralAnoVigente: 0},
                {ano: "A2027", custoGeralAnoVigente: 0},
                {ano: "A2028", custoGeralAnoVigente: 0},
                {ano: "A2029", custoGeralAnoVigente: 0},
                {ano: "A2030", custoGeralAnoVigente: 0},
                {ano: "A2031", custoGeralAnoVigente: 0},
                {ano: "A2032", custoGeralAnoVigente: 0},
                {ano: "A2033", custoGeralAnoVigente: 0},
              ]
              let dreDespesasAR = 0
              let dreDespesasTransicao: {ano: anosType, despesaAnoVigente: number}[] = [
                {ano: "A2026", despesaAnoVigente: 0},
                {ano: "A2027", despesaAnoVigente: 0},
                {ano: "A2028", despesaAnoVigente: 0},
                {ano: "A2029", despesaAnoVigente: 0},
                {ano: "A2030", despesaAnoVigente: 0},
                {ano: "A2031", despesaAnoVigente: 0},
                {ano: "A2032", despesaAnoVigente: 0},
                {ano: "A2033", despesaAnoVigente: 0},
              ]
              let valorImpostosPermanecerTotal = 0


              async function descobrirIdCategoria(categoria: CategoriaType): Promise<Categoria | null>{
                  const objCategoria = await respCategoriasRepo.pegarIdCategoriaPorNome(categoria)
                  return objCategoria
              }

              const criarARCategoria = (dados: {
                id: string
                valor: number
                impostos: number
                desonerado: number
                porcentagemCargaTributaria: number
                calculoId: string
                regimeId: string | undefined
                categoriaId: string | undefined,
                custo: number | null
              }): Prisma.AntesReformaCategoriaUncheckedCreateInput => ({
                id: dados.id,
                calculo_id: dados.calculoId,
                regime_id: dados.regimeId || "",
                categoria_id: dados.categoriaId || "",
                valor: new Decimal(dados.valor),
                valor_impostos: new Decimal(dados.impostos),
                valor_desonerado: new Decimal(dados.desonerado),
                porcentagem_carga_tributaria: new Decimal(dados.porcentagemCargaTributaria),
                custo: dados.custo == null ? null : new Decimal(dados.custo) 
              })

              const criarDRCategoria = (dados: {
                antesReformaCategoriaId: string,
                ano: AnosType,
                valor: number,
                valorSemIva: number,
                impostos: number
                porcentagemCargaTributaria: number
                custo: number | null
              }): Prisma.DepoisReformaCategoriaUncheckedCreateInput => ({
                antes_reforma_categoria_id: dados.antesReformaCategoriaId,
                ano: dados.ano,
                valor: new Decimal(dados.valor),
                valor_sem_iva: new Decimal(dados.valorSemIva),
                valor_impostos: new Decimal(dados.impostos),
                porcentagem_carga_tributaria: new Decimal(dados.porcentagemCargaTributaria),
                custo: dados.custo == null ? null : new Decimal(dados.custo),
              })

              const criarARVendas = (dados: {
                id: string,
                calculoId: string,
                regimeId: string | undefined,
                linhaVendasId: string | undefined,
                valor: number,
                impostos: number,
                desonerado: number,
                porcentagemCargaTributaria: number 
              }): Prisma.AntesReformaVendasUncheckedCreateInput => ({    
                id: dados.id,               
                calculo_id: dados.calculoId,                  
                regime_id: dados.regimeId || "",                          
                linha_vendas_id: dados.linhaVendasId || "",
                valor_ar: new Decimal(dados.valor),                   
                impostos_ar: new Decimal(dados.impostos),                    
                valor_desonerado: new Decimal(dados.desonerado),               
                porcentagem_carga_tributaria_ar: new Decimal(dados.porcentagemCargaTributaria),
              })

              const criarDRVendas = (dados: {
                antesReformaId: string,
                ano: AnosType,
                valor: number,
                impostos: number,
                valorSemIva: number,
                porcentagemCargaTributaria: number 
              }): Prisma.DepoisReformaVendasUncheckedCreateInput => ({    
                antes_reforma_vendas_id: dados.antesReformaId,            
                ano: dados.ano,                                        
                valor: new Decimal(dados.valor),                   
                impostos: new Decimal(dados.impostos),                    
                valor_sem_iva: new Decimal(dados.valorSemIva),               
                porcentagem_carga_tributaria: new Decimal(dados.porcentagemCargaTributaria),
              })              

              const criarARCompras = (dados: {
                id: string,
                calculoId: string,
                regimeId: string | undefined,
                linhaComprasId: string | undefined,
                valor: number,
                impostos: number,
                desonerado: number,
                credito: number,
                custo: number,
                porcentagemCustoEfetivo: number,
                porcentagemCargaTributaria: number
              }): Prisma.AntesReformaComprasUncheckedCreateInput => ({
                id: dados.id,
                calculo_id: dados.calculoId,
                regime_id: dados.regimeId || "",
                linha_compras_id: dados.linhaComprasId || "",
                valor_ar: new Decimal(dados.valor),
                impostos_ar: new Decimal(dados.impostos),
                valor_desonerado: new Decimal(dados.desonerado),
                credito_ar: new Decimal(dados.credito),
                custo_ar: new Decimal(dados.custo),
                porcentagem_custo_efetivo_ar: new Decimal(dados.porcentagemCustoEfetivo),
                porcentagem_carga_tributaria_ar: new Decimal(dados.porcentagemCargaTributaria)
              })

              const criarDRCompras = (dados: {
                ano: AnosType,
                antesReformaId: string,
                valor: number,
                impostos: number,
                valorSemIva: number,
                credito: number,
                custo: number,
                porcentagemCustoEfetivo: number,
                porcentagemCargaTributaria: number
              }): Prisma.DepoisReformaComprasUncheckedCreateInput => ({
                ano: dados.ano,
                antes_reforma_compras_id: dados.antesReformaId,
                valor: new Decimal(dados.valor),
                impostos: new Decimal(dados.impostos),
                valor_sem_iva: new Decimal(dados.valorSemIva),
                credito: new Decimal(dados.credito),
                custo: new Decimal(dados.custo),
                porcentagem_custo_efetivo: new Decimal(dados.porcentagemCustoEfetivo),
                porcentagem_carga_tributaria: new Decimal(dados.porcentagemCargaTributaria),
              })       
              
              const criarARCaixa = (dados: {
                id: string,
                calculoId: string,
                regimeId: string | undefined,
                linhaCaixaId: string | undefined,
                valor: number,
              }): Prisma.AntesReformaCaixaUncheckedCreateInput => ({
                id: dados.id,
                calculo_id: dados.calculoId,
                regime_id: dados.regimeId || "",
                linha_caixa_id: dados.linhaCaixaId || "",
                valor: new Decimal(dados.valor)
              })              

              const criarDRCaixa = (dados: {
                antesReformaCaixaId: string | undefined,
                ano: AnosType,
                valor: number,
              }): Prisma.DepoisReformaCaixaUncheckedCreateInput => ({
                antes_reforma_caixa_id: dados.antesReformaCaixaId || "",
                ano: dados.ano,
                valor: new Decimal(dados.valor)
              })    
      
              const criarARDre = (dados: {
                id: string,
                calculoId: string,
                regimeId: string | undefined,
                linhaDreId: string | undefined,
                valor: number,
              }): Prisma.AntesReformaDreUncheckedCreateInput => ({
                id: dados.id,
                calculo_id: dados.calculoId,
                regime_id: dados.regimeId || "",
                linha_dre_id: dados.linhaDreId || "",
                valor: new Decimal(dados.valor)
              })              

              const criarDRDre = (dados: {
                antesReformaDreId: string | undefined,
                ano: AnosType,
                valor: number,
              }): Prisma.DepoisReformaDreUncheckedCreateInput => ({
                antes_reforma_dre_id: dados.antesReformaDreId || "",
                ano: dados.ano,
                valor: new Decimal(dados.valor)
              }) 


              // Total Atividades == Total Atividades (serviços) Prestadas
              if(totalAtividades.length > 0){
                
                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("servicosPrestados")
                const categoriaId = objCategoriaAtual?.id

                // faturamentoMensal -> Faturamento mensal da empresa (que deve ser substituido por dadosEmpresaAtual.faturamento_medio_mensal)
                // faturamentoMensalServico -> Faturamento mensal com o serviço específico que está sendo analisado no momento

                  if(regimeAtual == "Simples Nacional"){
              
                    let pisCo = 0
                    let iss = 0
                    let icms = 0
                    let ipi = 0

                    let respServicoPrestadoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }

                    console.log("COMEÇO ANÁLISE")

                    let faturamentoMensal = 0
            
                    totalAtividades.forEach(item => {
                        faturamentoMensal += item.faturamentoMensal
                    })
                    
                    const rbt12 = dadosEmpresaAtual?.faturamento_mensal_medio ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoMensal * 12
                    console.log("faturamento mensal:")
                    console.log(faturamentoMensal)
                    console.log("faturamento anual total empresa: " + rbt12)
            

            
            
                    // Análise de cada atividade
                    totalAtividades.forEach(async (item, index) => {

                        console.log("ATIVIDADE " + (index + 1))
                        console.log("CNAE: " + item.cnaePrincipal)
                        console.log("Anexo: " + item.anexo)
                        console.log("faturamento Mensal atividade: " + item.faturamentoMensal)
                        const faturamentoMensalServico = item.faturamentoMensal
                        let valorImpostosAtuais = 0
                        let valorImpostosPermanecer = 0
                        let faturamentoMensalDesonerado = 0
                        let porcentagemCargaTributariaAtual = 0
                        let valorImpostosNovos = 0
                        let valorMensalServicoAposReforma = 0
                        let porcentagemCargaTributariaAposReforma = 0
                        const anexoAtual = item.anexo
                        const dadosAnexo = anexos.find(elem => elem.anexo == anexoAtual)
                        // Pra aplicar a alíquota efetiva em cima
                        const faturamentoAnualAtividade = (item.faturamentoMensal * 12)
                              
                        const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                            return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                        })
            
                        if(faixaIndex !== undefined){
                            console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                            const faixa = dadosAnexo?.tabela1[faixaIndex]
            
                            if(faixa){
                                const valorDeduzirAtual = faixa?.valorDeduzir
                                const aliquotaAtual = faixa?.aliquota
                
                                const aliquotaEfetiva = (rbt12 * aliquotaAtual - valorDeduzirAtual) / rbt12
                                console.log("Alíquota efetiva: " + aliquotaEfetiva)
                
                                const reparticaoAtual = dadosAnexo?.reparticao[faixaIndex]
                                let porcentagemTributosExcluir = 0
                                const tributosExcluir: (keyof linhaReparticao)[] = ["iss", "cofins", "pis", "icms", "ipi"]
                                tributosExcluir.forEach(tributoExcluir => {
                                    porcentagemTributosExcluir += reparticaoAtual[tributoExcluir]
                                  if(tributoExcluir == "pis"){
                                    pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                  }
                                  if(tributoExcluir == "cofins"){
                                    pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                  }
                                  if(tributoExcluir == "icms"){
                                    icms += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                  }
                                  if(tributoExcluir == "iss"){
                                    iss += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                  }
                                  if(tributoExcluir == "ipi"){
                                    ipi += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                  }
                                })

                                let porcentagemTributosPermanecer = 0
                                const tributosPermanecer: (keyof linhaReparticao)[] = ["irpj", "csll", "cpp"]
                                tributosPermanecer.forEach(tributoPermanecer => {
                                    porcentagemTributosPermanecer += reparticaoAtual[tributoPermanecer]
                                })
                                const aliquotaEfetivaPermanecer = aliquotaEfetiva * porcentagemTributosPermanecer
                                valorImpostosPermanecer = (faturamentoMensalServico * aliquotaEfetivaPermanecer)
                                valorImpostosPermanecerTotal += valorImpostosPermanecer

                                
                                const aliquotaEfetivaDesonerada = aliquotaEfetiva * porcentagemTributosExcluir
                                console.log("Alíquota desonerada: " + aliquotaEfetivaDesonerada)
            
                                // Aqui já n faço mais em cima do valor total, mas só daquela atividade (anual como eles pediram)
                                const tributosAnuaisAntes = faturamentoAnualAtividade * aliquotaEfetiva
                                const objPercentualReparticao: any = {}
                                Object.keys(reparticaoAtual).forEach(tributo => {
                                    objPercentualReparticao[tributo] = reparticaoAtual[tributo as keyof typeof reparticaoAtual] * faturamentoAnualAtividade * aliquotaEfetiva
                                })
            
                                console.log("Percentual repartição (anual):")
                                console.log(objPercentualReparticao)
            
                                valorImpostosAtuais = (faturamentoMensalServico * aliquotaEfetivaDesonerada)

                                //preco sem os impostos "antigos"
                                faturamentoMensalDesonerado = (faturamentoMensalServico) - valorImpostosAtuais
                                porcentagemCargaTributariaAtual = valorImpostosAtuais / faturamentoMensalDesonerado
        
                                const novoFaturamentoMensalDesonerado = (faturamentoMensalServico) - ((objPercentualReparticao.iss + objPercentualReparticao.cofins + objPercentualReparticao.pis + objPercentualReparticao.icms + objPercentualReparticao.ipi) / 12)
        
                                console.log("NOVO FATURAMENTO MENSAL TESTE: ")
                                console.log(novoFaturamentoMensalDesonerado)
        
                                console.log("NOVO FATURAMENTO MENSAL TESTE 2:  ")
                                console.log(faturamentoMensalDesonerado)
        
                                console.log("faturamento mensal da atividade desonerado: " + faturamentoMensalDesonerado)
                                const valorImpostosDesonerados = (faturamentoMensalServico - faturamentoMensalDesonerado)
                                console.log("Valor dos impostos desonerados: " + valorImpostosDesonerados)

                                // populando obj resposta final
                                const objRespostaFinalAR = {
                                    valor: faturamentoMensalServico,
                                    valorImpostos: valorImpostosAtuais,
                                    valorDesonerado: faturamentoMensalDesonerado,
                                    porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                                    custo: null
                                  }
                                respServicoPrestadoAtual.antesReforma = objRespostaFinalAR

                                // criando obj atual banco de dados
                                const antesReformaId = uuidv4()
                                const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                                  id: antesReformaId,
                                  calculoId: calculoId,
                                  regimeId: regimeId,
                                  categoriaId: categoriaId,
                                  valor: faturamentoMensalServico,
                                  desonerado: faturamentoMensalDesonerado,
                                  impostos: valorImpostosAtuais,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                                  custo: null
                                })
                                estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


            
                                const valorIvaBruto = faturamentoMensalDesonerado * ivaBruto
                                const valorIbsBruto = faturamentoMensalDesonerado * ibsBruto
                                const valorCbsBruto = faturamentoMensalDesonerado * cbsBruto
            
                                if(item.anexo == "I" || item.anexo == "II"){
                                  // Se cair aqui é pq é comércio/indústria e tem tanto CNAE quanto NCM 
            
            
                                }else{

                                  // ANÁLISE DR

                                  anoAano.forEach(objAno => {


                                    if(objAno.ano == "A2026"){

                                    }else{
                                      // CALCULAR VALOR IVA
                                      let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                                      let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                                        // conferir se há redução no IVA
                                      if(item.beneficio){
                                        const reducaoIva = item.manterBeneficio ? item.beneficio : 0
                                        aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoIva)
                                        aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoIva)
                                      }
                                      const valorIbsAnoVigente = faturamentoMensalDesonerado * aliquotaIbsAnoVigente
                                      const valorCbsAnoVigente = faturamentoMensalDesonerado * aliquotaCbsAnoVigente
                                      const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                                      // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                                      const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                                      const valorIssAnoVigente = (faturamentoMensalDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                                      // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                                      const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                                      const valorIcmsAnoVigente = ((faturamentoMensalDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                                      // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                                      const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                                      const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / faturamentoMensalDesonerado
                                      const novoValorAnoVigente = faturamentoMensalDesonerado + valorImpostosAnoVigente
                                      const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                                      const objAnoVigente: objDepoisReforma = {
                                          ano: objAno.ano,
                                          valor: novoValorAnoVigente,
                                          valorSemIva: valorSemIvaAnoVigente,
                                          valorImpostos: valorImpostosAnoVigente,
                                          porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                          custo: null
                                      }
                                      respServicoPrestadoAtual.depoisReforma.push(objAnoVigente)

                                      // obj banco de dados
                                      const objDRCategoriasItemAnoVigente = criarDRCategoria({
                                        antesReformaCategoriaId: antesReformaId,
                                        ano: objAno.ano,
                                        valor: novoValorAnoVigente,
                                        valorSemIva: valorSemIvaAnoVigente,
                                        impostos: valorImpostosAnoVigente,
                                        porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                        custo: null
                                      })
                                      estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                                      const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                      const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                      if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                                        objAnoVigenteVendas[0].valor += novoValorAnoVigente
                                        objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                                        objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                                        objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoMensalDesonerado

                                        objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                                        objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                        objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                                        objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoMensalDesonerado
                                      }

                                    }
                                  })
            
                                  let reducaoIva = 0
            
                                  let aliquotaEfetivaIva = ivaBruto
                                  let aliquotaEfetivaIbs = ibsBruto
                                  let aliquotaEfetivaCbs = cbsBruto

                                  // Conferir se tem Benefício
                                  if(item.beneficio){  
                                    // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                                    reducaoIva = item.manterBeneficio ? item.beneficio : 0
                                    aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                                    aliquotaEfetivaIbs = (ibsBruto * aliquotaEfetivaIva) / ivaBruto
                                    aliquotaEfetivaCbs = (cbsBruto * aliquotaEfetivaIva) / ivaBruto
                                  }
            
            
                                  console.log("faturamentoMensalDesonerado: ")
                                  console.log(faturamentoMensalDesonerado)
                                  console.log("aliquota Efetiva IVA")
                                  console.log(aliquotaEfetivaIva)

                                  
            
                                  valorImpostosNovos = faturamentoMensalDesonerado * aliquotaEfetivaIva
                                  porcentagemCargaTributariaAposReforma = valorImpostosNovos / faturamentoMensalDesonerado

                                  const valorIbsSimulacao1 = (faturamentoMensalDesonerado * aliquotaEfetivaIbs)
                                  const valorCbsSimulacao2 = (faturamentoMensalDesonerado * aliquotaEfetivaCbs)
                                  console.log("Impostos Desonerados: " + (item.faturamentoMensal - faturamentoMensalDesonerado))
                                  console.log("Valor novo imposto - IVA (mês): " + valorImpostosNovos)
                                  console.log("Valor IBS (mês): " + valorIbsSimulacao1)
                                  console.log("Valor CBS (mês): " + valorCbsSimulacao2)
                                  valorMensalServicoAposReforma = faturamentoMensalDesonerado + valorImpostosNovos
            
                                  console.log("Valor Mensal do serviço após a reforma: " + valorMensalServicoAposReforma)
                                  console.log("Valor Anual do serviço após a reforma: " + (valorMensalServicoAposReforma * 12))
            
                                  if(valorMensalServicoAposReforma > item.faturamentoMensal){
                                    const aumentoValorFinal = (valorMensalServicoAposReforma - item.faturamentoMensal) * 100 / item.faturamentoMensal
                                    console.log("Para manter o mesmo lucro você precisará aumentar em " + aumentoValorFinal + "% o preço do produto final")
                                  }
            
        
                                  // SIMULAÇÃO 2 - cbs simples nacional = pis + cofins e ibs simples nacional = iss + icms
                                  const porcentBrutaCbsSimulacao2 = reparticaoAtual.pis + reparticaoAtual.cofins
                                  const porcentBrutaIbsSimulacao2 = reparticaoAtual.iss + reparticaoAtual.icms
        
                                  
                                  const porcentFinalCbsSimulacao2 = porcentBrutaCbsSimulacao2 * aliquotaEfetiva
                                  const porcentFinalIbsSimulacao2 = porcentBrutaIbsSimulacao2 * aliquotaEfetiva
        
                                  const valorCbsFinal = porcentFinalCbsSimulacao2 * item.faturamentoMensal
                                  const valorIbsFinal = porcentFinalIbsSimulacao2 * item.faturamentoMensal
        
                                  const valorFinalServicoSimulacao2 = faturamentoMensalDesonerado + valorCbsFinal + valorIbsFinal
        
                                  console.log("SIMULAÇÃO 2:")
                                  console.log("valor CBS: " + valorCbsFinal)
                                  console.log("valor IBS: " + valorIbsFinal)
                                  console.log("valor final do serviço: " + valorFinalServicoSimulacao2)
        
            
                                }
            
            
                            }
                        }
                        
                        /*
                        const objRespostaAtual = {
                          regimeAtual: "Simples Nacional", 
                          cnae: item.cnae,
                          anexo: item.anexo,
                          aliquotaEfetiva:,
                          aliquotaDesonerada: number,
                          objPercentualReparticao: {
                            irpj: number;
                            csll: number;
                            cofins: number;
                            pis: number;
                            cpp: number;
                            icms: number;
                            iss: number;
                            ipi: number;
                          },
                          faturamentoMensalDesonerado: number,
                          valorImpostosDesonerados: number,
                          valorIbsSimulacao1: number,
                          valorCbsSimulacao1: number,
                          valorServicoMesDepoisSimu1: number,
                          valorCbsSimulacao2: number,
                          valorIbsSimulacao2: number,
                          valorServicoMesDepoisSimu2: number
                        }*/
            
                        console.log("FIM ATIVIDADE " + (index + 1))
                        console.log("///////////////////")


                        /*const respServicoPrestadoAtual: objItemFinal = {
                          antesReforma: {
                            valor: faturamentoMensalServico,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: faturamentoMensalDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                            custo: null
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: valorMensalServicoAposReforma,
                              valorImpostos: valorImpostosNovos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAposReforma,
                              custo: null,
                            }
                          ]
                        }*/

                        respostaFinalCalculo[chaveRegimeObjFinal].servicosPrestados.push(respServicoPrestadoAtual)

                        // Somar para tabela vendas
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR += faturamentoMensalServico
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado += faturamentoMensalDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado
                        
                        // Completando linha total
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += faturamentoMensalServico
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += faturamentoMensalDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado

                    })
                  }else if(regimeAtual == 'Lucro Presumido'){

                      let respServicoPrestadoAtual: objItemFinal = {
                        antesReforma: {
                          valor: 0,
                          valorImpostos: 0,
                          valorDesonerado: 0,
                          porcentagemCargaTributaria: 0,
                          custo: null
                        },
                        depoisReforma: []
                      }

                      // Prestação de serviços lucro presumido
                      const pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                      const iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0
                      const icms = this.parametrosEntrada.tabelaLucroPresumido.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.icms / 100 : 0

                      const aliquotaDesonerada = pisCo + iss



                    totalAtividades.map(atividade => {

                      //CONFERIR REDUÇÃO IVA CNAE

                      let reducaoIva = 0

                      let aliquotaEfetivaIva = ivaBruto
                      let aliquotaEfetivaIbs = ibsBruto
                      let aliquotaEfetivaCbs = cbsBruto
                      const faturamentoMensalAtividade = atividade.faturamentoMensal
                      const valorImpostosAtuais = (faturamentoMensalAtividade * aliquotaDesonerada)

                      const faturamentoDesonerado = faturamentoMensalAtividade - valorImpostosAtuais
                      const porcentagemCargaTributariaAtual = valorImpostosAtuais / faturamentoDesonerado

                      // populando obj resposta final
                      const objServPrestadoAtualAR = {
                          valor: faturamentoMensalAtividade,
                          valorImpostos: valorImpostosAtuais,
                          valorDesonerado: faturamentoDesonerado,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                          custo: null
                        }

                        respServicoPrestadoAtual.antesReforma = objServPrestadoAtualAR

                        // criando obj atual banco de dados
                        const antesReformaId = uuidv4()
                        const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                          id: antesReformaId,
                          calculoId: calculoId,
                          regimeId: regimeId,
                          categoriaId: categoriaId,
                          valor: faturamentoMensalAtividade,
                          desonerado: faturamentoDesonerado,
                          impostos: valorImpostosAtuais,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                          custo: null
                        })
                        estruturaDbAntesReformaCategoria.push(objARCategoriaItem)



                      // ANÁLISE DR

                      anoAano.forEach(objAno => {

                        if(objAno.ano == "A2026"){

                        }else{
                          // CALCULAR VALOR IVA
                          let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                          let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            // conferir se há redução no IVA
                          if(atividade.beneficio){
                            reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                            aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoIva)
                            aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoIva)
                          }
                          const valorIbsAnoVigente = faturamentoDesonerado * aliquotaIbsAnoVigente
                          const valorCbsAnoVigente = faturamentoDesonerado * aliquotaCbsAnoVigente
                          const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                          // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                          const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                          const valorIssAnoVigente = (faturamentoDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                          // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                          const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                          const valorIcmsAnoVigente = ((faturamentoDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                          // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                          const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                          const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / faturamentoDesonerado
                          const novoValorAnoVigente = faturamentoDesonerado + valorImpostosAnoVigente
                          const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                          const objAnoVigente: objDepoisReforma = {
                              ano: objAno.ano,
                              valor: novoValorAnoVigente,
                              valorSemIva: valorSemIvaAnoVigente,
                              valorImpostos: valorImpostosAnoVigente,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                              custo: null
                          }
                          respServicoPrestadoAtual.depoisReforma.push(objAnoVigente)

                          // obj banco de dados
                          const objDRCategoriasItemAnoVigente = criarDRCategoria({
                            antesReformaCategoriaId: antesReformaId,
                            ano: objAno.ano,
                            valor: novoValorAnoVigente,
                            valorSemIva: valorSemIvaAnoVigente,
                            impostos: valorImpostosAnoVigente,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                            custo: null
                          })
                          estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                          const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                            objAnoVigenteVendas[0].valor += novoValorAnoVigente
                            objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoDesonerado

                            objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoDesonerado
                          }

                        }
                      })

                      // TIRAR DAQUI

                      // Conferir se tem benefício
                      if(atividade.beneficio){
                        // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                        reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                        aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                        aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                        aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                      }

                      const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva
                      const porcentagemCargaTributariaAposReforma = valorImpostosNovos / faturamentoDesonerado

                      const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                      const valorImpostosDesonerados = (faturamentoMensalAtividade - faturamentoDesonerado)

                      console.log("impostos desonerados: " + (faturamentoMensalAtividade - faturamentoDesonerado))

                      const valorIbs = (aliquotaEfetivaIbs * faturamentoDesonerado)
                      const valorCbs = (aliquotaEfetivaCbs * faturamentoDesonerado)

                      console.log("Valor IBS: " + valorIbs)
                      console.log("Valor CBS: " + valorCbs)

                      console.log("novo valor do serviço: " + novoValorServiço)
                      





                      /* const respServicoPrestadoAtual: objItemFinal = {
                          antesReforma: {
                            valor: faturamentoMensalAtividade,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: faturamentoDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                            custo: null
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: novoValorServiço,
                              valorImpostos: valorImpostosNovos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAposReforma,
                              custo: null,
                            }
                          ]
                        }*/
            
                        respostaFinalCalculo[chaveRegimeObjFinal].servicosPrestados.push(respServicoPrestadoAtual)

                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR += faturamentoMensalAtividade
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado += faturamentoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado   


                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += faturamentoMensalAtividade
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += faturamentoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado
                    })
                    




                  }else if(regimeAtual == 'Lucro Real'){
                      // Prestação de serviços lucro real

                      let respServicoPrestadoAtual: objItemFinal = {
                        antesReforma: {
                          valor: 0,
                          valorImpostos: 0,
                          valorDesonerado: 0,
                          porcentagemCargaTributaria: 0,
                          custo: null
                        },
                        depoisReforma: []
                      }

                      const pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                      const iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0
                      const icms = this.parametrosEntrada.tabelaLucroReal.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.icms / 100 : 0

                      const aliquotaDesonerada = pisCo + iss



                    totalAtividades.map(atividade => {

                        //CONFERIR REDUÇÃO IVA CNAE

                        let reducaoIva = 0

                        let aliquotaEfetivaIva = ivaBruto
                        let aliquotaEfetivaIbs = ibsBruto
                        let aliquotaEfetivaCbs = cbsBruto
                        const faturamentoMensalAtividade = atividade.faturamentoMensal
                        const valorImpostosAtuais = (faturamentoMensalAtividade * aliquotaDesonerada)



                      const faturamentoDesonerado = faturamentoMensalAtividade - valorImpostosAtuais
                      const porcentagemCargaTributariaAtual = valorImpostosAtuais / faturamentoDesonerado

                      // populando obj resposta final
                      const objServPrestadoAtualAR = {
                            valor: faturamentoMensalAtividade,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: faturamentoDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                            custo: null
                      }

                      respServicoPrestadoAtual.antesReforma = objServPrestadoAtualAR

                        // criando obj atual banco de dados
                        const antesReformaId = uuidv4()
                        const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                          id: antesReformaId,
                          calculoId: calculoId,
                          regimeId: regimeId,
                          categoriaId: categoriaId,
                          valor: faturamentoMensalAtividade,
                          desonerado: faturamentoDesonerado,
                          impostos: valorImpostosAtuais,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                          custo: null
                        })
                        estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                      // ANÁLISE DR

                      anoAano.forEach(objAno => {

                        if(objAno.ano == "A2026"){

                        }else{
                          // CALCULAR VALOR IVA
                          let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                          let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            // conferir se há redução no IVA
                          if(atividade.beneficio){
                            reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                            aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoIva)
                            aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoIva)
                          }
                          const valorIbsAnoVigente = faturamentoDesonerado * aliquotaIbsAnoVigente
                          const valorCbsAnoVigente = faturamentoDesonerado * aliquotaCbsAnoVigente
                          const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                          // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                          const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                          const valorIssAnoVigente = (faturamentoDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                          // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                          const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                          const valorIcmsAnoVigente = ((faturamentoDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                          // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                          const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                          const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / faturamentoDesonerado
                          const novoValorAnoVigente = faturamentoDesonerado + valorImpostosAnoVigente
                          const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                          const objAnoVigente: objDepoisReforma = {
                              ano: objAno.ano,
                              valor: novoValorAnoVigente,
                              valorSemIva: valorSemIvaAnoVigente,
                              valorImpostos: valorImpostosAnoVigente,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                              custo: null
                          }
                          respServicoPrestadoAtual.depoisReforma.push(objAnoVigente)

                          // obj banco de dados
                          const objDRCategoriasItemAnoVigente = criarDRCategoria({
                            antesReformaCategoriaId: antesReformaId,
                            ano: objAno.ano,
                            valor: novoValorAnoVigente,
                            valorSemIva: valorSemIvaAnoVigente,
                            impostos: valorImpostosAnoVigente,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                            custo: null
                          })
                          estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                          const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                            objAnoVigenteVendas[0].valor += novoValorAnoVigente
                            objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoDesonerado

                            objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / faturamentoDesonerado
                          }

                        }
                      })

                      // TIRAR DAQUI
                      
                      // Conferir se tem benefício
                      if(atividade.beneficio){
                        // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                        reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                        aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                        aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                        aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                      }

                      const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva
                      const porcentagemCargaTributariaAposReforma = valorImpostosNovos / faturamentoDesonerado

                      const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                      console.log("impostos desonerados: " + (faturamentoMensalAtividade - faturamentoDesonerado))

                      console.log("Valor IBS: " + (aliquotaEfetivaIbs * faturamentoDesonerado))
                      console.log("Valor CBS: " + (aliquotaEfetivaCbs * faturamentoDesonerado))

                      console.log("novo valor do serviço: " + novoValorServiço)
                      






                      /*const respServicoPrestadoAtual: objItemFinal = {
                          antesReforma: {
                            valor: faturamentoMensalAtividade,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: faturamentoDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAtual,
                            custo: null
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: novoValorServiço,
                              valorImpostos: valorImpostosNovos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAposReforma,
                              custo: null,
                            }
                          ]
                        }*/

                        respostaFinalCalculo[chaveRegimeObjFinal].servicosPrestados.push(respServicoPrestadoAtual)

                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR += faturamentoMensalAtividade
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado += faturamentoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado
                        
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += faturamentoMensalAtividade
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += faturamentoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado


                    })

                  }

                  // INICIALIZANDO VARIAVEIS TABELA VENDAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaVendasId = uuidv4()
                  const objLinhaVendasId = await respTabelasRepo.pegarIdVendaPorLinha("servicosPrestados")
                  const linhaVendasId = objLinhaVendasId?.id
                  // inicializar um objeto da linha tabela vendas, que tenha os valores genéricos, mas os ids já com valores finais
                  const objServicoVendasAR = criarARVendas({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.impostosAR,
                    id: antesReformaVendasId,
                    linhaVendasId: linhaVendasId,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaVendas.push(objServicoVendasAR)

                    // Depois Reforma
                  const arrDRVendasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.depoisReforma

                  arrDRVendasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objServicoVendasDR = criarDRVendas({
                      antesReformaId: antesReformaVendasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaVendas.push(objServicoVendasDR)

                  })

                    

                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }


              }


              // SERVIÇOS TOMADOS
              if(totalAtividadesAdquiridas.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("servicosTomados")
                const categoriaId = objCategoriaAtual?.id
        
                  console.log("////////////////////////")
                  console.log("Análise Serviços adquiridos")

                  let iss = this.parametrosEntrada.tabelaSimplesNacional.servicos.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.iss / 100 : 0
                  let icms = this.parametrosEntrada.tabelaSimplesNacional.servicos.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.icms / 100 : 0
                  let ipi = this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi / 100 : 0
                  let pisCo = this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo / 100 : 0
                  const ibsBruto = this.parametrosEntrada.aliquotaIbs / 100
                  const cbsBruto = this.parametrosEntrada.aliquotaCbs / 100
                  const ivaBruto = this.parametrosEntrada.aliquotaIva / 100

                  // Soma aliquotas dos parametros de entrada
                  let aliquotaDesonerada = 0

                  const operacoesReducoes: {operacao: string, reducao: number, colunaParametros: "comercio" | "industria" | "serviços" | "locação"}[] = [
                    {operacao: "Serviços Profissionais - Regulamentados", reducao: 0.3, colunaParametros: "serviços"},
                    {operacao: "Limpeza", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Publicidade e Propaganda", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Segurança", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Frete Intermunicipal", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Frete - Operação interna", reducao: 0, colunaParametros: "comercio"},
                    {operacao: "Frete - Operação Interestadual", reducao: 0, colunaParametros: "comercio"},
                    {operacao: "Seguros", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Manutenção Equipamentos ou veículos", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Licenciamento e Suporte técnico", reducao: 0, colunaParametros: "serviços"},
                    {operacao: "Despesas com viagem e hotel", reducao: 1, colunaParametros: "serviços"},
                    {operacao: "Serviços Médicos", reducao: 0.6, colunaParametros: "serviços"},
                  ]



                  totalAtividadesAdquiridas.forEach((atividade, index) => {

                    let respServicoTomadoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }

                    let valorServicoAR = 0
                    let valorImpostosAtuais = 0
                    let valorServicoDesonerado = 0
                    let porcentagemCargaTributariaAR = 0
                    let valorMensalServicoDR = 0
                    let valorImpostosNovos = 0
                    let porcentagemCargaTributariaDR = 0
                    let custoAR = 0
                    let creditoAR = 0
                    let creditoDR = 0
                    let custoDR = 0
                    let temCreditoIva = true

                      if(atividade.regimeTributario == "Simples Nacional"){
                        console.log("atividade " + (index + 1) + " é do simples nacional")
                        console.log("cnpj aonde você adquiriu serviço: ")
                        console.log(atividade.cpfOuCnpj)
                        console.log("regime Outro: ")
                        console.log(atividade.regimeTributario)
                        console.log("Operacao outro")
                        console.log(atividade.operacao)

                        //CONFERIR REDUÇÃO IVA CNAE

                        let reducaoIva = 0

                        let aliquotaEfetivaIva = ivaBruto
                        let aliquotaEfetivaIbs = ibsBruto
                        let aliquotaEfetivaCbs = cbsBruto

                        // ANÁLISE AR

                        valorServicoAR = atividade.faturamento

                        console.log("MÉTODO ATUAL:")
                        console.log(atividade.metodo)
                          // encontrar alíquota desonerada dependendo do método
                        if(atividade.metodo == "Por CNPJ"){
                          aliquotaDesonerada = iss + icms + ipi + pisCo
                        }else{
                          // método é operação, aplicar redução da operação específica nas alíquotas
                          console.log("Método: por operação")
                          // Encontrando a linha que corresponde a operação da atividade atual
                          const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)

                          if(objOperacaoAtual){
                            if(objOperacaoAtual.colunaParametros == "comercio"){
                              pisCo = this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo / 100 : 0
                              icms = this.parametrosEntrada.tabelaSimplesNacional.comercial.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.icms / 100 : 0
                              iss = this.parametrosEntrada.tabelaSimplesNacional.comercial.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.iss / 100 : 0
                              ipi = this.parametrosEntrada.tabelaSimplesNacional.comercial.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.ipi / 100 : 0
                                  console.log("eentrou comercio")
                            }else if(objOperacaoAtual.colunaParametros == "serviços"){
                              pisCo = this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo / 100 : 0
                              iss = this.parametrosEntrada.tabelaSimplesNacional.servicos.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.iss / 100 : 0
                              icms = this.parametrosEntrada.tabelaSimplesNacional.servicos.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.icms / 100 : 0
                              ipi = this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi / 100 : 0
                                  console.log("eentrou comercio")
                            }
                            aliquotaDesonerada = pisCo + icms + iss + ipi
                            console.log("aliquota desonerada utilizada objOperacaoAtual")
                            console.log(aliquotaDesonerada)
                          }else{
                            console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                          }

                          // Como a atividade (regime do outro) é do SIMPLES NACIONAL
                      
                        }

                        valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                        valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                        porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado

                        // To considerando que Serviço Tomado quando regime fornecedor é Simples Nacional tenho crédito IVA 100%
                        temCreditoIva = true


                        // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                        custoAR = valorServicoAR
                        if(regimeAtual == "Lucro Real"){
                            if(atividade.temCreditoPisCofins){
                              console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                              creditoAR = (custoAR * pisCo)
                              custoAR = custoAR - creditoAR
                            }else{
                              console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                            }
                        }

                        console.log("seu custo atual com esse serviço é: " + custoAR)

                        // NOVO CUSTO (CUSTO APÓS REFORMA)
                        custoDR = valorServicoDesonerado
                        creditoDR = valorImpostosNovos

                        console.log("Seu novo custo será: " + custoDR)

                        // Preenchendo obj resposta final
                        const objServicoTomadoAtualAR = {
                              valor: valorServicoAR,
                              valorImpostos: valorImpostosAtuais,
                              valorDesonerado: valorServicoDesonerado,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                              custo: custoAR
                            }
                        respServicoTomadoAtual.antesReforma = objServicoTomadoAtualAR

                        // criando obj atual banco de dados
                        const antesReformaId = uuidv4()
                        const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                          id: antesReformaId,
                          calculoId: calculoId,
                          regimeId: regimeId,
                          categoriaId: categoriaId,
                          valor: valorServicoAR,
                          desonerado: valorServicoDesonerado,
                          impostos: valorImpostosAtuais,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                          custo: custoAR
                        })
                        estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                        // ANÁLISE DR

                        anoAano.forEach(objAno => {
                            let custoAnoVigente = 0
                            if(objAno.ano == "A2026"){

                            }else{
                              let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                              let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs

                              if(atividade.metodo == "Por CNPJ"){                
                                // Conferir se tem benefício
                                if(atividade.beneficio){
                                  // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                                  reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                                  aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)
                                  aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                }
                              }else{
                                // método é operação, aplicar redução da operação específica nas alíquotas
                                console.log("Método: por operação")

                                // Encontrando a linha que corresponde a operação da atividade atual
                                const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)

                                if(objOperacaoAtual){
                                  // Não preciso pegar as alíquotas das tabelas corretas novamente, isso com certeza já foi feito no "if(cnpj){}else if(metodo){}" anterior na ANÁLISE AR. 
                                  reducaoIva = objOperacaoAtual.reducao
                                  aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)
                                  aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                }else{
                                  console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                                }
                                // Como a atividade (regime do outro) é do SIMPLES NACIONAL
                            
                              }

                              const valorIbsAnoVigente = valorServicoDesonerado * aliquotaIbsAnoVigente
                              const valorCbsAnoVigente = valorServicoDesonerado * aliquotaCbsAnoVigente
                              const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                              // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                              const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                              const valorIssAnoVigente = (valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                              // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                              const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                              const valorIcmsAnoVigente = ((valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)
                              
                              // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                              const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                              const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorServicoDesonerado
                              const novoValorAnoVigente = valorServicoDesonerado + valorImpostosAnoVigente
                              const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                              const creditoAnoVigente = temCreditoIva ? valorIvaAnoVigente : 0
                              custoAnoVigente = novoValorAnoVigente - creditoAnoVigente

                              const objAnoVigente: objDepoisReforma = {
                                  ano: objAno.ano,
                                  valor: novoValorAnoVigente,
                                  valorSemIva: valorSemIvaAnoVigente,
                                  valorImpostos: valorImpostosAnoVigente,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                  custo: custoAnoVigente
                              }
                              respServicoTomadoAtual.depoisReforma.push(objAnoVigente)

                              // obj banco de dados
                              const objDRCategoriasItemAnoVigente = criarDRCategoria({
                                antesReformaCategoriaId: antesReformaId,
                                ano: objAno.ano,
                                valor: novoValorAnoVigente,
                                valorSemIva: valorSemIvaAnoVigente,
                                impostos: valorImpostosAnoVigente,
                                porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                custo: custoAnoVigente
                              })
                              estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                                const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                                  objAnoVigenteCompras[0].valor += novoValorAnoVigente
                                  objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteCompras[0].credito += creditoAnoVigente
                                  objAnoVigenteCompras[0].custo += custoAnoVigente
                                  objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado

                                  objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                                  objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                                  objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                                  objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado
                                }

                            }

                              if(atividade.compoeCusto){
                                const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objCustoGeralAtual){
                                  objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                                }
                              }else{
                                const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objDespesaAtual){
                                  objDespesaAtual.despesaAnoVigente += custoAnoVigente
                                }
                              }

                        })

                        // TIRAR DAQUI (NA VDD AQUI AINDA TEM Q CONFERIR PRA PASSAR A SIMU 2 PRA DENTRO DO ANO A ANO)

                        //SIMULAÇÃO 1 (optante simples nacional, regime regular IBS/CBS)
                        console.log("Simulação 1: ")
                        console.log("faturamentoMensalDesonerado: ")
                        console.log(valorServicoDesonerado)
                        console.log("aliquota Efetiva IVA")
                        console.log(aliquotaEfetivaIva)

                        valorImpostosNovos = valorServicoDesonerado * aliquotaEfetivaIva
                        porcentagemCargaTributariaDR = valorImpostosNovos / valorServicoDesonerado
                        console.log("Impostos Desonerados: " + (valorServicoAR - valorServicoDesonerado))
                        console.log("Valor novo imposto - IVA (mês): " + valorImpostosNovos)
                        console.log("Valor IBS (mês): " + (valorServicoDesonerado * aliquotaEfetivaIbs))
                        console.log("Valor CBS (mês): " + (valorServicoDesonerado * aliquotaEfetivaCbs))
                        valorMensalServicoDR = valorServicoDesonerado + valorImpostosNovos

                        console.log("Valor Mensal do serviço após a reforma: " + valorMensalServicoDR)
                        console.log("Valor Anual do serviço após a reforma: " + (valorMensalServicoDR * 12))

                        if(valorMensalServicoDR > valorServicoAR){
                          const aumentoValorFinal = (valorMensalServicoDR - valorServicoAR) * 100 / valorServicoAR
                          console.log("Se o prestador de serviço manter o preço atual, o valor a pagar para o fornecedor aumentará em " + aumentoValorFinal + "%")
                        }





                        // SIMULAÇÃO 2
                        console.log("Simulação 2")
                        const percentualCbsServicosAdquiridos = pisCo
                        const percentualIbsServicosAdquiridos = iss + icms
                        console.log("Percentual CBS Serviços adquiridos")
                        console.log(percentualCbsServicosAdquiridos)

                        const valorCbs = atividade.faturamento * percentualCbsServicosAdquiridos
                        const valorIbs = atividade.faturamento * percentualIbsServicosAdquiridos

                        // o valor vai ficar igual, talvez retirar
                        const novoValorServiço = valorServicoDesonerado + valorCbs + valorIbs
                        console.log("ALIQUOTA DESONERADA")
                        console.log(aliquotaDesonerada)
                        console.log("ALIQUOTA ONERADA")
                        console.log(percentualCbsServicosAdquiridos + percentualIbsServicosAdquiridos)



                        console.log("valor IBS: ")
                        console.log(valorIbs)

                        
                        console.log("valor CBS: ")
                        console.log(valorCbs)

                        console.log("novo valor do serviço simulação 2: ")
                        console.log(novoValorServiço)



                      }else{

                        if(atividade.regimeTributario == "Lucro Presumido"){
                            console.log("atividade " + (index + 1) + " é do lucro presumido")
                            // LUCRO PRESUMIDO
                            let pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                            let iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0
                            let icms = this.parametrosEntrada.tabelaLucroPresumido.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.icms / 100 : 0
                            let ipi = this.parametrosEntrada.tabelaLucroPresumido.servicos.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.ipi / 100 : 0

                            let aliquotaDesonerada = 0

                            let reducaoIva = 0
            
                            let aliquotaEfetivaIva = ivaBruto 
                            let aliquotaEfetivaIbs = ibsBruto
                            let aliquotaEfetivaCbs = cbsBruto

                            // ANÁLISE AR

                            valorServicoAR = atividade.faturamento

                            // Se cair aqui é pq é serviço, tem só CNAE
                            console.log("MÉTODO ATUAL:")
                            console.log(atividade.metodo)

                              // conferindo aliquota desonerada 
                            if(atividade.metodo == "Por CNPJ"){
                              // Caso método == cnpj
                              aliquotaDesonerada = pisCo + iss + icms + ipi
                            }else{
                              // método é operação, aplicar redução da operação específica nas alíquotas

                              console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")

                              const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                              if(objOperacaoAtual){

                                if(objOperacaoAtual.colunaParametros == "comercio"){
                                  pisCo = this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo / 100 : 0
                                  iss = this.parametrosEntrada.tabelaLucroPresumido.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.iss / 100 : 0
                                  icms = this.parametrosEntrada.tabelaLucroPresumido.comercial.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.icms / 100 : 0
                                  ipi = this.parametrosEntrada.tabelaLucroPresumido.comercial.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.ipi / 100 : 0
                                console.log("eentrou comercio")
                                }else if(objOperacaoAtual.colunaParametros == "serviços"){
                                  pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                                  iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0
                                  icms = this.parametrosEntrada.tabelaLucroPresumido.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.icms / 100 : 0
                                  ipi = this.parametrosEntrada.tabelaLucroPresumido.servicos.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.ipi / 100 : 0
                                console.log("eentrou serviços")

                                }
                                aliquotaDesonerada = pisCo + iss + icms + ipi
                                console.log("aliquota desonerada utilizada objOperacaoAtual")
                                console.log(aliquotaDesonerada)
                              }else{
                                console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                              }


                            }


                            valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                            valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                            porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado

                            // To considerando que Serviço Tomado quando regime fornecedor é Lucro Presumido tenho crédito IVA 100%
                            temCreditoIva = true

                            // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                            custoAR = valorServicoAR
                            if(regimeAtual == "Lucro Real"){
                                if(atividade.temCreditoPisCofins){
                                  console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                                  creditoAR = (custoAR * 0.0925)
                                  custoAR = custoAR - creditoAR
                                }else{
                                  console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                                }
                            }

                            console.log("seu custo atual com esse serviço é: " + custoAR)

                            // NOVO CUSTO (CUSTO APÓS REFORMA)
                            // SEMPRE TEM CREDITO 100% APOS REFORMA
                            custoDR = valorServicoDesonerado
                            creditoDR = valorImpostosNovos

                            console.log("Seu novo custo será: " + custoDR)

                            // preenchendo obj resposta final
                            const objServicoTomadoAtualAR = {
                                  valor: valorServicoAR,
                                  valorImpostos: valorImpostosAtuais,
                                  valorDesonerado: valorServicoDesonerado,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                                  custo: custoAR
                                }
                            respServicoTomadoAtual.antesReforma = objServicoTomadoAtualAR

                            // criando obj atual banco de dados
                            const antesReformaId = uuidv4()
                            const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                              id: antesReformaId,
                              calculoId: calculoId,
                              regimeId: regimeId,
                              categoriaId: categoriaId,
                              valor: valorServicoAR,
                              desonerado: valorServicoDesonerado,
                              impostos: valorImpostosAtuais,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                              custo: custoAR
                            })
                            estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                            // ANÁLISE DR

                            anoAano.forEach(objAno => {
                              let custoAnoVigente = 0
                              if(objAno.ano == "A2026"){

                              }else{
                                let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                                let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                                // conferir reducoes IVA
                                if(atividade.metodo == "Por CNPJ"){
                                  // Caso método == cnpj
                                  
                                  // Conferir se tem beneficio
                                  if(atividade.beneficio){
                                    // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                                    reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                                    aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)
                                    aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                  }

                                }else{
                                  // método é operação, aplicar redução da operação específica nas alíquotas
                                  console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")
                                  const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                                  if(objOperacaoAtual){
                                    // Não preciso pegar as alíquotas das tabelas corretas novamente, isso com certeza já foi feito no "if(cnpj){}else if(metodo){}" anterior na ANÁLISE AR.
                                    reducaoIva = objOperacaoAtual.reducao

                                      aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)

                                      aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                  }else{
                                    console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                                  }
                                }

                                const valorIbsAnoVigente = valorServicoDesonerado * aliquotaIbsAnoVigente
                                const valorCbsAnoVigente = valorServicoDesonerado * aliquotaCbsAnoVigente
                                const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                                // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                                const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                                const valorIssAnoVigente = (valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                                // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                                const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                                const valorIcmsAnoVigente = ((valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                                // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                                const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                                const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorServicoDesonerado
                                const novoValorAnoVigente = valorServicoDesonerado + valorImpostosAnoVigente
                                const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                                const creditoAnoVigente = temCreditoIva ? valorIvaAnoVigente : 0
                                custoAnoVigente = novoValorAnoVigente - creditoAnoVigente

                                // obj resposta final
                                const objAnoVigente: objDepoisReforma = {
                                    ano: objAno.ano,
                                    valor: novoValorAnoVigente,
                                    valorSemIva: valorSemIvaAnoVigente,
                                    valorImpostos: valorImpostosAnoVigente,
                                    porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                    custo: custoAnoVigente
                                }
                                respServicoTomadoAtual.depoisReforma.push(objAnoVigente)

                                // obj banco de dados
                                const objDRCategoriasItemAnoVigente = criarDRCategoria({
                                  antesReformaCategoriaId: antesReformaId,
                                  ano: objAno.ano,
                                  valor: novoValorAnoVigente,
                                  valorSemIva: valorSemIvaAnoVigente,
                                  impostos: valorImpostosAnoVigente,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                  custo: custoAnoVigente
                                })
                                estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)


                                const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                                  objAnoVigenteCompras[0].valor += novoValorAnoVigente
                                  objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteCompras[0].credito += creditoAnoVigente
                                  objAnoVigenteCompras[0].custo += custoAnoVigente
                                  objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado

                                  objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                                  objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                                  objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                                  objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado
                                }



                              }

                              if(atividade.compoeCusto){
                                const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objCustoGeralAtual){
                                  objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                                }
                              }else{
                                const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objDespesaAtual){
                                  objDespesaAtual.despesaAnoVigente += custoAnoVigente
                                }
                              }

                            })





                            
                            valorImpostosNovos = valorServicoDesonerado * aliquotaEfetivaIva

                            valorMensalServicoDR = valorServicoDesonerado + valorImpostosNovos

                            porcentagemCargaTributariaDR = valorImpostosNovos / valorServicoDesonerado

                            console.log("impostos desonerados: " + (valorServicoAR - valorServicoDesonerado))

                            console.log("Valor IBS: " + (aliquotaEfetivaIbs * valorServicoDesonerado))
                            console.log("Valor CBS: " + (aliquotaEfetivaCbs * valorServicoDesonerado))

                            console.log("novo valor do serviço: " + valorMensalServicoDR)


                        }else if(atividade.regimeTributario == "Lucro Real"){
                            console.log("atividade " + (index + 1) + " é do lucro real")
                            // LUCRO REAL
                            let pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                            let iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0
                            let icms = this.parametrosEntrada.tabelaLucroReal.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.icms / 100 : 0
                            let ipi = this.parametrosEntrada.tabelaLucroReal.servicos.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.ipi / 100 : 0

                            let aliquotaDesonerada = 0 

                          
                            //CONFERIR REDUÇÃO IVA CNAE

                            let reducaoIva = 0
            
                            let aliquotaEfetivaIva = ivaBruto
                            let aliquotaEfetivaIbs = ibsBruto
                            let aliquotaEfetivaCbs = cbsBruto

                          // ANÁLISE AR

                            valorServicoAR = atividade.faturamento

                            // Se cair aqui é pq é serviço, tem só CNAE
                            console.log("MÉTODO ATUAL:")
                            console.log(atividade.metodo)
                            // definir aliquotas desoneradas
                            if(atividade.metodo == "Por CNPJ"){
                              // Caso método == cnpj
                              aliquotaDesonerada = pisCo + iss + icms + ipi
                            }else{
                              // método é operação, aplicar redução da operação específica nas alíquotas
                              console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")

                              const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                              if(objOperacaoAtual){

                                if(objOperacaoAtual.colunaParametros == "comercio"){
                                  console.log("eentrou comercio")
                                  pisCo = this.parametrosEntrada.tabelaLucroReal.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.pisCo / 100 : 0
                                  iss = this.parametrosEntrada.tabelaLucroReal.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.iss / 100 : 0
                                  icms = this.parametrosEntrada.tabelaLucroReal.comercial.icms !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.icms / 100 : 0
                                  ipi = this.parametrosEntrada.tabelaLucroReal.comercial.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.ipi / 100 : 0
                                }else if(objOperacaoAtual.colunaParametros == "serviços"){
                                  console.log("eentrou serviço")
                                  pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                                  iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0
                                  icms = this.parametrosEntrada.tabelaLucroReal.servicos.icms !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.icms / 100 : 0
                                  ipi = this.parametrosEntrada.tabelaLucroReal.servicos.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.ipi / 100 : 0
                                }
                                aliquotaDesonerada = pisCo + iss + icms + ipi

                                console.log("aliquota desonerada do objOperacao")
                                console.log(aliquotaDesonerada)
                              }else{
                                console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                              }

                            }

                            console.log("aliquota desonerada no FINAL SERVICOS TOMADOS")
                            console.log(aliquotaDesonerada)
                            valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                            valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                            porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado

                            // To considerando que Serviço Tomado quando regime fornecedor é Lucro Real tenho crédito IVA 100%
                            temCreditoIva = true

                            // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                            custoAR = valorServicoAR
                            if(regimeAtual == "Lucro Real"){
                                if(atividade.temCreditoPisCofins){
                                  console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                                  creditoAR = (custoAR * 0.0925)
                                  custoAR = custoAR - creditoAR
                                }else{
                                  console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                                }
                            }

                            console.log("seu custo atual com esse serviço é: " + custoAR)

                            // NOVO CUSTO (CUSTO APÓS REFORMA)
                            // POR ESTAR COLOCANDO O CUSTO DIRETO COMO VALOR DESONERADO, VOU ASSUMIR QUE SEMPRE TEM CREDITO 100%
                            custoDR = valorServicoDesonerado
                            creditoDR = valorImpostosNovos

                            console.log("Seu novo custo será: " + custoDR)

                            // preenchendo obj resposta final
                            const objServicoTomadoAtualAR = {
                                  valor: valorServicoAR,
                                  valorImpostos: valorImpostosAtuais,
                                  valorDesonerado: valorServicoDesonerado,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                                  custo: custoAR
                                }
                            respServicoTomadoAtual.antesReforma = objServicoTomadoAtualAR

                            // criando obj atual banco de dados
                            const antesReformaId = uuidv4()
                            const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                              id: antesReformaId,
                              calculoId: calculoId,
                              regimeId: regimeId,
                              categoriaId: categoriaId,
                              valor: valorServicoAR,
                              desonerado: valorServicoDesonerado,
                              impostos: valorImpostosAtuais,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                              custo: custoAR
                            })
                            estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                            // ANÁLISE DR

                            anoAano.forEach(objAno => {
                              let custoAnoVigente = 0

                              if(objAno.ano == 'A2026'){

                              }else{
                                let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                                let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs

                                // conferindo beneficios IVA
                                if(atividade.metodo == "Por CNPJ"){
                                  // Caso método == cnpj
                                  // Conferir se tem beneficio
                                  if(atividade.beneficio){
                                    reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                                    aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)
                                    aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                  }

                                }else{
                                  // método é operação, aplicar redução da operação específica nas alíquotas
                                  console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")

                                  const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                                  if(objOperacaoAtual){
                                      // Não preciso pegar as alíquotas das tabelas corretas novamente, isso com certeza já foi feito no "if(cnpj){}else if(metodo){}" anterior na ANÁLISE AR.
                                      reducaoIva = objOperacaoAtual.reducao
                                      aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (reducaoIva * aliquotaIbsAnoVigente)
                                      aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (reducaoIva * aliquotaCbsAnoVigente)
                                  }else{
                                    console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                                  }


                                }

                                const valorIbsAnoVigente = valorServicoDesonerado * aliquotaIbsAnoVigente
                                const valorCbsAnoVigente = valorServicoDesonerado * aliquotaCbsAnoVigente
                                const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                                // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                                const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                                const valorIssAnoVigente = (valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                                // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                                const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                                const valorIcmsAnoVigente = ((valorServicoDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                                // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                                const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                                const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorServicoDesonerado
                                const novoValorAnoVigente = valorServicoDesonerado + valorImpostosAnoVigente
                                const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                                const creditoAnoVigente = temCreditoIva ? valorIvaAnoVigente : 0
                                custoAnoVigente = novoValorAnoVigente - creditoAnoVigente

                                // obj resposta final
                                const objAnoVigente: objDepoisReforma = {
                                    ano: objAno.ano,
                                    valor: novoValorAnoVigente,
                                    valorSemIva: valorSemIvaAnoVigente,
                                    valorImpostos: valorImpostosAnoVigente,
                                    porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                    custo: custoAnoVigente
                                }
                                respServicoTomadoAtual.depoisReforma.push(objAnoVigente)

                                // obj banco de dados
                                const objDRCategoriasItemAnoVigente = criarDRCategoria({
                                  antesReformaCategoriaId: antesReformaId,
                                  ano: objAno.ano,
                                  valor: novoValorAnoVigente,
                                  valorSemIva: valorSemIvaAnoVigente,
                                  impostos: valorImpostosAnoVigente,
                                  porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                  custo: custoAnoVigente
                                })
                                estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)


                                const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                                  objAnoVigenteCompras[0].valor += novoValorAnoVigente
                                  objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteCompras[0].credito += creditoAnoVigente
                                  objAnoVigenteCompras[0].custo += custoAnoVigente
                                  objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado

                                  objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                                  objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                                  objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                                  objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorServicoDesonerado
                                }
                        
                              }

                              if(atividade.compoeCusto){
                                const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objCustoGeralAtual){
                                  objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                                }
                              }else{
                                const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                if(objDespesaAtual){
                                  objDespesaAtual.despesaAnoVigente += custoAnoVigente
                                }
                              }


                            })

                          
                          valorImpostosNovos = valorServicoDesonerado * aliquotaEfetivaIva
                          porcentagemCargaTributariaDR = valorImpostosNovos / valorServicoDesonerado

                          valorMensalServicoDR = valorServicoDesonerado + valorImpostosNovos

                          console.log("impostos desonerados: " + (valorServicoAR - valorServicoDesonerado))

                          console.log("Valor IBS: " + (aliquotaEfetivaIbs * valorServicoDesonerado))
                          console.log("Valor CBS: " + (aliquotaEfetivaCbs * valorServicoDesonerado))

                          console.log("novo valor do serviço: " + valorMensalServicoDR)

                        }


                      }



                      /*const respServicoTomadoAtual: objItemFinal = {
                          antesReforma: {
                            valor: valorServicoAR,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: valorServicoDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                            custo: custoAR
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: valorMensalServicoDR,
                              valorImpostos: valorImpostosNovos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                              custo: custoDR,
                            }
                          ]
                        }*/

                        respostaFinalCalculo[chaveRegimeObjFinal].servicosTomados.push(respServicoTomadoAtual)

                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorAR += valorServicoAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorDesonerado += valorServicoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.creditoAR += creditoAR 
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.custoAR += custoAR 
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.impostosAR /  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorDesonerado


                        // preenchendo total
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR += valorServicoAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorDesonerado += valorServicoDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR += creditoAR 
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.custoAR += custoAR 
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.impostosAR /  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorDesonerado


                        if(atividade.compoeCusto){
                          // Aqui temos um problema de nomeclatura:
                          // O que chamamos de CustoAR e custoDR é o que está saindo do meu bolso no final do dia.
                          // O que estamos chamando de custoGeral é apenas uma parte do custoAR e custoDR, a gente vai ver de tudo que a gente gastou no final do dia
                          // O que é despesa (gastos que não retornam dinheiro pra mim no futuro) e o que não é. O que não for despesa entrará nesse custoGeral
                          // Ou seja ele representa a parte que eu to gastando que retorna dinheiro pra mim no futuro.
                          console.log("ATIVIDADE COM CUSTO")
                          console.log(atividade)
                          dreCustoGeralAR += custoAR
                        }else{
                          dreDespesasAR += custoAR
                        }

                  })

                  // INICIALIZANDO VARIAVEIS TABELA COMPRAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaComprasId = uuidv4()
                  const objLinhaComprasId = await respTabelasRepo.pegarIdComprasPorLinha("servicosTomados")
                  const linhaComprasId = objLinhaComprasId?.id
                  // popular o obj que compras que vai para o banco de dados
                  const objServicoComprasAR = criarARCompras({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.impostosAR,
                    id: antesReformaComprasId,
                    linhaComprasId: linhaComprasId,
                    credito: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.creditoAR,
                    custo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.custoAR,
                    porcentagemCustoEfetivo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.porcentagemCustoEfetivoAR,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaCompras.push(objServicoComprasAR)

                    // Depois Reforma
                  const arrDRComprasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.servicosTomados.depoisReforma
                  arrDRComprasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objServicoComprasDR = criarDRCompras({
                      antesReformaId: antesReformaComprasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      credito: objAnoDRAtual.credito,
                      custo: objAnoDRAtual.custo,
                      porcentagemCustoEfetivo: objAnoDRAtual.porcentagemCustoEfetivo,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaCompras.push(objServicoComprasDR)

                  })

                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }


              }



              //LOCACAO

              if(totalImoveisLocacao.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("locacaoBensImoveis")
                const categoriaId = objCategoriaAtual?.id

                console.log("/////////////////////////////////////////////////////////////")
                console.log("Começo do calculo")
                // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
                let pfRegimeRegular = false
                /*
                CASO DE PESSOA FÍSICA
                if(regimeAtual == "Pessoa Fisica"){
                  let totalAluguelMensal = 0
                  let quantidadeImoveis = 0
                  totalImoveisLocacao.forEach(imovel => {
                    if(imovel.tipoAluguel == 'Aluguel recebido'){
                      totalAluguelMensal += imovel.valorAluguel
                      quantidadeImoveis += imovel.quantidade
                    }
                  })

                  const totalAluguelAnual = totalAluguelMensal * 12

                  if((quantidadeImoveis > 3 && totalAluguelAnual > 240000) || (totalAluguelAnual > 288000)){
                    pfRegimeRegular = true
                    console.log("o nosso cliente é pf regime regular")
                  }else{
                    console.log("o nosso cliente é pf fora do regime regular")
                  }
                }
                FIM CASO PESSOA FÍSICA
                */



                  totalImoveisLocacao.forEach((imovel, index) => {
                    let pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                    let iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                    let icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                    let ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0



                    let respImovelLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }

                    console.log("IMOVEL " + (index + 1))

                    //

                    let valorBase = 0
                    let valorImpostosAtuais = 0

                    if(imovel.condominioEmbutido){
                      // Nao destacado
                      valorBase = imovel.valorAluguel + imovel.acrescimos + imovel.juros + imovel.valorCondominio
                      console.log("Condominio não está destacado, logo o valor base é: aluguel + acrescimos + condominio")
                    }else{
                      // Destacado
                      valorBase = imovel.valorAluguel + imovel.acrescimos + imovel.juros
                      console.log("Condominio está destacado, logo o valor base é: aluguel + acrescimos") 
                    }

                    
                    console.log("Valor Base: ")
                    console.log(valorBase)

                    //DESONERAR
                    let aliquotaDesonerar = 0
                    let creditoAtual = 0
                    let creditoDR = 0
                    let temCreditoIva = false

                        //POR REGIME COMEÇA AQUI


                    if(imovel.tipoAluguel == 'Aluguel pago'){
                        // O outro que é o locador
                        if(imovel.tipoOutraParte == 'Pessoa jurídica'){
                          if(imovel.regimeOutro == 'Lucro Presumido'){
                              pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                              iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                              icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                              ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0
                          }else if(imovel.regimeOutro == 'Lucro Real'){
                              pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                              iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                              icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                              ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                          }
                          aliquotaDesonerar = pisCo + iss + icms + ipi
                          console.log("aliquota a desonerar: " + aliquotaDesonerar)
                        }
                        // Caso seja PF manterá a aliquota a desonerar como zero, logo, não haverá desoneração

                        //CRÉDITO: como eu sou o locatário:
                        //Aqui o valor base já tem que estar com redução??
                        if(regimeAtual == 'Lucro Real' && imovel.residencial == false && (imovel.regimeOutro == 'Lucro Presumido' || imovel.regimeOutro == 'Lucro Real')){
                            console.log("tem crédito atual de: ")
                            creditoAtual = valorBase * pisCo
                            console.log(creditoAtual)
                            console.log("aliquota usada para calcular o credito: " + pisCo)
                        }

                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(regimeAtual == "Lucro Presumido" || regimeAtual == 'Lucro Real' || regimeAtual == "Simples Nacional" || pfRegimeRegular){
                            temCreditoIva = true
                        }


                    }else if(imovel.tipoAluguel == 'Aluguel recebido'){
                        //Minha empresa é o locador
                        // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente
                        if(regimeAtual == 'Lucro Presumido'){
                            pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                            iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                            icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                            ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0                    
                        }else if(regimeAtual == 'Lucro Real'){
                            pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                            iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                            icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                            ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                        }
                        aliquotaDesonerar = pisCo + iss + icms + ipi

                        // CRÉDITO ATUAL (antes da reforma): como o outro é o locatário:
                        if(imovel.regimeOutro == 'Lucro Real' && imovel.residencial == false && (regimeAtual == "Lucro Presumido" || regimeAtual == "Lucro Real")){
                            console.log("tem crédito atual de: ")
                            creditoAtual = valorBase * pisCo
                            console.log(creditoAtual)
                            console.log("aliquota usada para calcular o credito: " + pisCo)
                        } 
                      
                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(imovel.regimeOutro == 'Lucro Presumido' || imovel.regimeOutro == 'Lucro Real' || imovel.regimeOutro == "Simples Nacional"){
                          temCreditoIva = true
                        }
                    }


                    // valor impostos ANTES da reforma
                    // Aqui o valor base já tem que estar com a redução??
                    valorImpostosAtuais = valorBase * aliquotaDesonerar
                    console.log("valor dos impostos atuais (a desonerar): " + valorImpostosAtuais)
                    let valorDesonerado = valorBase - valorImpostosAtuais
                    console.log("valor desonerado: " + valorDesonerado)
                    const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                    // Crédito antes reforma
                    console.log("O crédito do locatário atual é: " + creditoAtual)

                    // sempre no valor base
                    const custoAtual = valorBase - creditoAtual
                    console.log("custoAtual: " + custoAtual)

                    // Obj resposta final
                    const objImovelLocacaoAtualAR = {
                      valor: valorBase,
                      valorImpostos: valorImpostosAtuais,
                      valorDesonerado: valorDesonerado,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: imovel.tipoAluguel == "Aluguel pago" ? custoAtual : null
                    }
                    respImovelLocacaoAtual.antesReforma = objImovelLocacaoAtualAR


                    // criando obj atual banco de dados
                    const antesReformaId = uuidv4()
                    const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                      id: antesReformaId,
                      calculoId: calculoId,
                      regimeId: regimeId,
                      categoriaId: categoriaId,
                      valor: valorBase,
                      desonerado: valorDesonerado,
                      impostos: valorImpostosAtuais,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: imovel.tipoAluguel == "Aluguel pago" ? custoAtual : null
                    })
                    estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                    // ONERAR NOVOS IMPOSTOS


                    anoAano.forEach(objAno => {
                      if(objAno.ano == "A2026"){

                      }else{
                        // SIMULAÇÃO 1 (Nela usar valorBaseNovosTributosSimu1 como base, e na simu2 usar o valorDesonerado)
                        //CASO DE PESSOA FÍSICA
                        if(/*imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular && regimeAtual == "Pessoa Fisica")*/ false){

                            // Nesse caso não aplica IVA
                            objAno.porcentagemCbs = 0
                            objAno.porcentagemIbs = 0
                            let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                            let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                            const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                            const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                            // CALCULAR VALOR ISS (base é o valorBaseNovosTributosSimu1 + valorIva)
                            const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                            const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                            // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                            const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                            const valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                            const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                            const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                            const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente // Mas nesse caso como eu fiz as porcentagens do IVA receberem 0, o valor que entra aqui é o valor sem IVA
                            const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                            const objAnoVigente: objDepoisReforma = {
                                ano: objAno.ano,
                                valor: novoValorAnoVigente,
                                valorSemIva: valorSemIvaAnoVigente,
                                valorImpostos: valorImpostosAnoVigente,
                                porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                custo: null
                            }
                            respImovelLocacaoAtual.depoisReforma.push(objAnoVigente)

                        }else{

                            // CONFERIR REDUÇÃO DE BASE
                            let valorBaseNovosTributosSimu1 = valorDesonerado
                            if(imovel.residencial){
                              // quando adicionar a quantidade, caso sejam 3 imoveis na linha tem que diminuir 3x600
                              console.log("Redutor social")
                              console.log("Quanto reduziu: " + (600 * imovel.quantidade))

                              valorBaseNovosTributosSimu1 = valorDesonerado - (600 * imovel.quantidade)
                              console.log("Valor após a redução: " + valorBaseNovosTributosSimu1)
                            }

                            // CALCULAR VALOR IVA
                            const reducaoAliquota = 0.7 // redução padrão de 70%
                            let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                            let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                            aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoAliquota) // Aplicando redução padrão de alíquota
                            aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoAliquota) // Aplicando redução padrão de alíquota
                            const valorIbsAnoVigente = valorBaseNovosTributosSimu1 * aliquotaIbsAnoVigente
                            const valorCbsAnoVigente = valorBaseNovosTributosSimu1 * aliquotaCbsAnoVigente
                            const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                            // CALCULAR VALOR ISS (base é o valorBaseNovosTributosSimu1 + valorIva)
                            const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                            const valorIssAnoVigente = (valorBaseNovosTributosSimu1 + valorIvaAnoVigente) * aliquotaIssAnoVigente

                            // CALCULAR VALOR ICMS (base é valorBaseNovosTributosSimu1 + ICMS (ou seja, por dentro) + IVA)
                            const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                            const valorIcmsAnoVigente = ((valorBaseNovosTributosSimu1 + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                            // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                            const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                            const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorBaseNovosTributosSimu1
                            const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                            const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                            let custoAnoVigente = novoValorAnoVigente
                            let creditoAnoVigente = 0

                            // Calcular custo
                            // Só tem que conferir creditoIVA se for condominio embutido e quem paga não é simples nacional (esse é o único caso que eu tenho certeza se tem ou não crédito através da variavel temCreditoIva)
                            if(imovel.condominioEmbutido && !((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional") || (imovel.tipoAluguel == "Aluguel pago" && regimeAtual == "Simples Nacional"))){
                                if(temCreditoIva){
                                  creditoAnoVigente = valorIvaAnoVigente
                                  custoAnoVigente = novoValorAnoVigente - creditoAnoVigente
                                }
                            }

                            // obj resposta final
                            const objAnoVigente: objDepoisReforma = {
                                ano: objAno.ano,
                                valor: novoValorAnoVigente,
                                valorSemIva: valorSemIvaAnoVigente,
                                valorImpostos: valorImpostosAnoVigente,
                                porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                                custo: custoAnoVigente
                            }
                            respImovelLocacaoAtual.depoisReforma.push(objAnoVigente)

                            // obj banco de dados
                            const objDRCategoriasItemAnoVigente = criarDRCategoria({
                              antesReformaCategoriaId: antesReformaId,
                              ano: objAno.ano,
                              valor: novoValorAnoVigente,
                              valorSemIva: valorSemIvaAnoVigente,
                              impostos: valorImpostosAnoVigente,
                              porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                              custo: custoAnoVigente
                            })
                            estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                            if(imovel.tipoAluguel == "Aluguel pago"){
                                const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                                const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                                if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                                  objAnoVigenteCompras[0].valor += novoValorAnoVigente
                                  objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteCompras[0].credito += creditoAnoVigente
                                  objAnoVigenteCompras[0].custo += custoAnoVigente
                                  objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado

                                  objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                                  objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                  objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                                  objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                                  objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                                  objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                                  objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado
                                }

                                if(imovel.compoeCusto){
                                  const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                  if(objCustoGeralAtual){
                                    objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                                  }
                                }else{
                                  const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                                  if(objDespesaAtual){
                                    objDespesaAtual.despesaAnoVigente += custoAnoVigente
                                  }
                                }
                            }else if(imovel.tipoAluguel == "Aluguel recebido"){
                              const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                              const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                              if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                                objAnoVigenteVendas[0].valor += novoValorAnoVigente
                                objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                                objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                                objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado

                                objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                                objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                                objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                                objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado
                              }
                            }
                    

                        }

                      }
                    })


                    let valorBaseNovosTributosSimu1 = valorDesonerado
                    if(imovel.residencial){
                      // quando adicionar a quantidade, caso sejam 3 imoveis na linha tem que diminuir 3x600
                      console.log("Redutor social")
                      console.log("Quanto reduziu: " + (600 * imovel.quantidade))

                      valorBaseNovosTributosSimu1 = valorDesonerado - (600 * imovel.quantidade)
                      console.log("Valor após a redução: " + valorBaseNovosTributosSimu1)
                    }

                    let valorNovosTributos = 0
                    let valorFinalSimu1 = 0

                    // Coloquei regimeAtual == "Pessoa Fisica", pois por padrão o pfRegimeRegular é false, e aqui queremos apenas o caso onde é pessoa física e não está no regime
                    //CASO DE PESSOA FÍSICA
                    if(/*imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular && regimeAtual == "Pessoa Fisica")*/ false){
                        // locador for pf sem regime regular n tem IVA

                        // nao aplica iva 
                        console.log("como o locador desse imóvel é pesso física fora do regime regular, então não é aplicado o IVA")
                        console.log("valor final: " + valorDesonerado)
                        valorFinalSimu1 = valorDesonerado
                    }else{

                        if(imovel.tipoOutraParte == "Pessoa física"){
                            console.log("O valor de IVA calculado será custo se o destinatário (locatário) for pessoa física não optante pelo Regime Regular de IBS/CBS. Sendo a Pessoa Física optante pelo Regime Regular, o valor do IVA ficará como crédito para abatimento das operações futuras de faturamento.")
                        }

                            // pf regime regular e pj
                            const reducaoAliquota = 0.7
                            const aliquotaPadrao = 0.28
          
                            const aliquotaFinal = aliquotaPadrao - (reducaoAliquota * aliquotaPadrao)
                            console.log("aliquota Final")
                            console.log(aliquotaFinal) 
          
          
                            // AQUI ANTES EU TAVA FAZENDO A ALIQUOTA FINAL MULTIPLICAR O VALORBASE (COM OS IMPOSTOS ANTIGOS), MAS MUDEI PARA O VALOR DESONERADO, TA CERTO?
                            valorNovosTributos = valorBaseNovosTributosSimu1 * aliquotaFinal
          
                            console.log("Novos Tributos simulação 1: ")
                            console.log(valorNovosTributos)
          
          
          
                            console.log("Novos tributos simulação 2: ")
                            // Usando valorDesonerado e não valorBaseNovosTributosSimu1 porque na simulação 2 não tem redução de base por imovel em nenhuma hipótese
                            const novosTributosSimu2 = valorDesonerado * 0.0365
                            console.log(novosTributosSimu2)
          
          
                            if(imovel.condominioEmbutido){
                              // Não destacado

                              // Se quem tá pagando aluguel é do SIMPLES NACIONAL
                              if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional") || (imovel.tipoAluguel == "Aluguel pago" && regimeAtual == "Simples Nacional")){

                                // Como é simples nacional, eu não tenho certeza se tem crédito ou não então tenho que apresentar os dois casos
                                  // SIMULAÇÃO 1
                                valorFinalSimu1 = valorDesonerado + valorNovosTributos

                                // SIMULAÇÃO 2
                                const valorFinalSimu2SemCredito = valorDesonerado + novosTributosSimu2

                                if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional")){
                                  console.log("Como o outro é o locatário e simples nacional, caso ele opte por estar no regime regular, na simulação 1 ele terá crédito de " + valorNovosTributos + " e na simulaçao 2 ele terá um crédito de " + novosTributosSimu2 + ", caso ele opte por ficar fora do regime regular esses valores passarão a ser custo.")
                                }else{
                                  console.log("Como você é o locatário e simples nacional, caso você opte por estar no regime regular, na simulação 1 você terá crédito de " + valorNovosTributos + " e na simulaçao 2 você terá um crédito de " + novosTributosSimu2 + ", caso você opte por ficar fora do regime regular esses valores passarão a ser custo.")
                                }

                                console.log("Valor final simulação 1 Com Crédito: " + (valorFinalSimu1 - valorNovosTributos))
                                console.log("Valor final simulação 1 Sem Crédito: " + (valorFinalSimu1))
                                console.log("Valor final simulação 2 Com Crédito: " + (valorFinalSimu2SemCredito - novosTributosSimu2))
                                console.log("Valor final simulação 2 Sem Crédito: " + (valorFinalSimu2SemCredito))

                              }else{
                                  // SIMULAÇÃO 1
                                  console.log("Valor final simulação 1:")
                                  // To usando valorDesonerado e não valorBaseNovosTributos1 porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
                                  valorFinalSimu1 = valorDesonerado + valorNovosTributos
                                  if(temCreditoIva){
                                    console.log("Você tem direito ao crédito novo")
                                    const valorFinalSimu1ComCredito = valorFinalSimu1 - valorNovosTributos
                                    console.log("valor final simulação 1 com crédito: " + valorFinalSimu1ComCredito)
                                  }else{
                                    console.log("Você não tem direito ao crédito novo")
                                    console.log("Valor final simulação 1 sem crédito: " + valorFinalSimu1)
                                  }
              
                                  
                                    // SIMULAÇÃO 2
                                  console.log("Valor final simulação 2:")
                                    // usei valorDesonerado porque na simulaçao 2 não tem redução devido a ser residencial em nenhuma hipotese
                                  let valorFinalSimu2SemCredito = valorDesonerado + novosTributosSimu2
                                  if(temCreditoIva){
                                    console.log("Você tem direito ao crédito novo")
                                    const valorFinalSimu2ComCredito = valorFinalSimu2SemCredito - valorNovosTributos
                                    console.log("valor final simulação 1 com crédito: " + valorFinalSimu2ComCredito)
                                  }else{
                                    console.log("Você não tem direito ao crédito novo")
                                    console.log("Valor final simulação 1 sem crédito: " + valorFinalSimu2SemCredito)
                                  }
                              }
                              
          
                            }else{

                              // A diferença é que aqui não tem credito IVA em todos os casos
                              
                              console.log("Valor final simulação 1:")
                              // Somei "(600 * imovel.quantidade)" porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
                              valorFinalSimu1 = valorDesonerado + valorNovosTributos
                              console.log(valorFinalSimu1)
          
                              console.log("Valor final simulação 2:")
                              // Somei "(600 * imovel.quantidade)" porque na simulaçao 2 não tem redução em nenhuma hipotese
                              const valorFinalSimu2 = valorDesonerado + novosTributosSimu2
                              console.log(valorFinalSimu2)
          
                            }
                    }

                    const porcentagemCargaTributariaDR = valorNovosTributos / valorDesonerado
                    creditoDR = temCreditoIva ? valorNovosTributos : 0
                    const custoDR = temCreditoIva ? valorFinalSimu1 - valorNovosTributos : valorFinalSimu1


                      /*const respImovelLocacaoAtual: objItemFinal = {
                          antesReforma: {
                            valor: valorBase,
                            valorImpostos: valorImpostosAtuais,
                            valorDesonerado: valorDesonerado,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                            custo: imovel.tipoAluguel == "Aluguel pago" ? custoAtual : null
                          },
                          depoisReforma: [
                            {
                              ano: "2033",
                              valor: valorFinalSimu1,
                              valorImpostos: valorNovosTributos,
                              porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                              custo: imovel.tipoAluguel == "Aluguel pago" ? custoDR : null,
                            }
                          ]
                        }*/

                        respostaFinalCalculo[chaveRegimeObjFinal].locacaoBensImoveis.push(respImovelLocacaoAtual)

                        if(imovel.tipoAluguel == "Aluguel pago"){
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorAR += valorBase
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.creditoAR += creditoAtual
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.custoAR += custoAtual
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorAR

                          // preenchendo total
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR += valorBase
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR += creditoAtual
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.custoAR += custoAtual
                          respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorAR


                          if(imovel.compoeCusto){
                            console.log("imovel COM CUSTO")
                            console.log(imovel)
                            dreCustoGeralAR += custoAtual
                          }else{
                            dreDespesasAR += custoAtual
                          }

                        }else if(imovel.tipoAluguel == "Aluguel recebido"){
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorAR += valorBase
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorDesonerado 

                          // preenchendo total
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += valorBase
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += valorDesonerado
                          respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorDesonerado 
                        }

                  })

                  // INICIALIZANDO VARIAVEIS TABELA VENDAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaVendasId = uuidv4()
                  const objLinhaVendasId = await respTabelasRepo.pegarIdVendaPorLinha("locacaoImoveis")
                  const linhaVendasId = objLinhaVendasId?.id
                  // inicializar um objeto da linha tabela vendas, que tenha os valores genéricos, mas os ids já com valores finais
                  const objImovelLocacaoVendasAR = criarARVendas({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.impostosAR,
                    id: antesReformaVendasId,
                    linhaVendasId: linhaVendasId,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR
                  })                  

                  estruturaDbAntesReformaVendas.push(objImovelLocacaoVendasAR)

                    // Depois Reforma
                  const arrDRVendasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.depoisReforma

                  arrDRVendasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objLocacaoImoveisVendasDR = criarDRVendas({
                      antesReformaId: antesReformaVendasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaVendas.push(objLocacaoImoveisVendasDR)

                  })




                  // INICIALIZANDO VARIAVEIS TABELA COMPRAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaComprasId = uuidv4()
                  const objLinhaComprasId = await respTabelasRepo.pegarIdComprasPorLinha("locacaoImoveis")
                  const linhaComprasId = objLinhaComprasId?.id
                  // popular o obj que compras que vai para o banco de dados
                  const objImovelLocacaoComprasAR = criarARCompras({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.impostosAR,
                    id: antesReformaComprasId,
                    linhaComprasId: linhaComprasId,
                    credito: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.creditoAR,
                    custo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.custoAR,
                    porcentagemCustoEfetivo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.porcentagemCustoEfetivoAR,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaCompras.push(objImovelLocacaoComprasAR)          
                  
                    // Depois Reforma
                  const arrDRComprasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoImoveis.depoisReforma
                  arrDRComprasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objImovelLocacaoComprasDR = criarDRCompras({
                      antesReformaId: antesReformaComprasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      credito: objAnoDRAtual.credito,
                      custo: objAnoDRAtual.custo,
                      porcentagemCustoEfetivo: objAnoDRAtual.porcentagemCustoEfetivo,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaCompras.push(objImovelLocacaoComprasDR)
                  })



                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }

              }


              // COMPRA VENDA IMOVEIS

              if(totalImoveisCompraVenda.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("compraVendaBensImoveis")
                const categoriaId = objCategoriaAtual?.id

                totalImoveisCompraVenda.forEach(imovel => {

                  let respCompraVendaAtual: objItemFinal = {
                    antesReforma: {
                      valor: 0,
                      valorImpostos: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributaria: 0,
                      custo: null
                    },
                    depoisReforma: []
                  }

                  const valorDeVenda = imovel.valorVendaImovel
                  const valorDeAquisicao = imovel.valorAquisicao
                  // Repete o valor de aquisição inicialmente
                  const redutorDeAjuste = valorDeAquisicao


                // CENÁRIO ATUAL (antes da reforma)
                  let valorImpostosAtuais = 0
                  switch(regimeAtual){
                    case "Lucro Presumido":
                      valorImpostosAtuais = valorDeVenda * 3.65
                      break

                    case "Lucro Real":
                      valorImpostosAtuais = (valorDeVenda - valorDeAquisicao) * 9.25
                      break

                  }
                  console.log("valor imposto atual (antes da reforma): " + valorImpostosAtuais)
                  const valorDesonerado = valorDeVenda - valorImpostosAtuais
                  console.log("valor desonerado: " + valorDesonerado)
                  const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado
                  

                  // base de calculo == base de calculo para aplicar alíquota do IBS e CBS
                  let baseDeCalculo = valorDesonerado - redutorDeAjuste
                  console.log("base de calculo (valor de aquisição - redutor de ajuste): ")
                  console.log(baseDeCalculo)
                  
                  // redutor social
                  let redutorSocial = 0
                  if(imovel.tipoOperacao == 'Novo'){
                    if(imovel.tipoImovel == 'Lote'){
                      redutorSocial = 30000
                    }else if(imovel.tipoImovel == 'Imóvel'){
                      redutorSocial = 100000
                    }
                  }

                  console.log("redutor social: " + redutorSocial)

                  if(redutorSocial){
                    if(baseDeCalculo <= redutorSocial){
                      baseDeCalculo = 0
                    }else{
                      baseDeCalculo = baseDeCalculo - redutorSocial
                    }
                  }

                  console.log("base de calculo: " + baseDeCalculo)

                  // Encontrando alíquota final IBS e CBS
                  const reducaoAliquota = 0.5
                  const aliquotaBruta = 0.28
                  const aliquotaFinal = aliquotaBruta - (aliquotaBruta * reducaoAliquota)
                  console.log("aliquota final: ")
                  console.log(aliquotaFinal)

                  // Valores finais
                  const novosImpostos = baseDeCalculo * aliquotaFinal
                  console.log("valor novos impostos: " + novosImpostos)
                  const valorFinal = baseDeCalculo + novosImpostos
                  console.log("valor final: " + valorFinal)
                  const porcentagemCargaTributariaDR = novosImpostos / valorDesonerado

                  const objCompraVendaAtualAR = {
                      valor: valorDeVenda,
                      valorImpostos: valorImpostosAtuais,
                      valorDesonerado: valorDesonerado,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: null
                    }

                    respCompraVendaAtual.antesReforma = objCompraVendaAtualAR


                  /*const respServicoPrestadoAtual: objItemFinal = {
                    antesReforma: {
                      valor: valorDeVenda,
                      valorImpostos: valorImpostosAtuais,
                      valorDesonerado: valorDesonerado,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: null
                    },
                    depoisReforma: [
                      {
                        ano: "2033",
                        valor: valorFinal,
                        valorImpostos: novosImpostos,
                        porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                        custo: null,
                      }
                    ]
                  }*/

                  respostaFinalCalculo[chaveRegimeObjFinal].compraVendaBensImoveis.push(respCompraVendaAtual)




                })

                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }

              }





              // BENS MÓVEIS - LOCAÇÃO
              if(totalMoveisLocacao.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("locacaoBensMoveis")
                const categoriaId = objCategoriaAtual?.id                

                let pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                let iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                let icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                let ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0
                const ibsBruto = this.parametrosEntrada.aliquotaIbs / 100
                const cbsBruto = this.parametrosEntrada.aliquotaCbs / 100
                const ivaBruto = this.parametrosEntrada.aliquotaIva / 100
              

                console.log("BENS MOVEIS")
                console.log("/////////////////////////////////////////////////////////////")
                console.log("Começo do calculo")
                // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
                let pfRegimeRegular = false
                // CASO DE PESSOA FÍSICA
                /*
                if(regimeAtual == "Pessoa Fisica"){
                  let totalAluguelMensal = 0
                  totalImoveisLocacao.forEach(imovel => {
                    if(imovel.tipoAluguel == 'Aluguel recebido'){
                      totalAluguelMensal += imovel.valorAluguel
                    }
                  })
                }
                */

                  let faturamentoTotalMensal = 0
                  totalMoveisLocacao.filter(movel => movel.tipoAluguel == "Aluguel recebido").forEach(movel => {
                    faturamentoTotalMensal += movel.valorLocacao
                  })

                  const rbt12 = dadosEmpresaAtual? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12



                  totalMoveisLocacao.forEach((movel, index) => {
                    console.log("MOVEL " + (index + 1))

                    let respMoveisLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: 0,
                        valorImpostos: 0,
                        valorDesonerado: 0,
                        porcentagemCargaTributaria: 0,
                        custo: null
                      },
                      depoisReforma: []
                    }
      

                    //

                    let valorBase = movel.valorLocacao
                    console.log("Valor Base: ")
                    console.log(valorBase)

                    //DESONERAR
                    let aliquotaDesonerar = 0
                    let creditoAtual = 0
                    let creditoDR = 0
                    let temCreditoIva = false
                    let valorImpostosAtuais = 0
                    let valorImpostosPermanecer = 0
                    if(movel.tipoAluguel == 'Aluguel pago'){
                      // o locador é o OUTRO
                      if(movel.regimeOutro == "Lucro Presumido"){
                          pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0   
                      }else if(movel.regimeOutro == "Lucro Real"){
                          pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                      }else{
                          pisCo = this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo / 100 : 0
                          iss = this.parametrosEntrada.tabelaSimplesNacional.locacao.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.iss / 100 : 0
                          icms = this.parametrosEntrada.tabelaSimplesNacional.locacao.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.icms / 100 : 0
                          ipi = this.parametrosEntrada.tabelaSimplesNacional.locacao.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.ipi / 100 : 0
                      }
                      aliquotaDesonerar = pisCo + iss + icms + ipi
                      valorImpostosAtuais = valorBase * aliquotaDesonerar

                        // CRÉDITO: como eu sou o locatário:
                        if(regimeAtual == 'Lucro Real' && movel.creditaPisCofins && (movel.regimeOutro == "Lucro Presumido" || movel.regimeOutro == "Lucro Real" || movel.regimeOutro == "Simples Nacional")){
                            console.log("tem crédito atual de: ")
                            creditoAtual = valorBase * 0.0925
                            console.log(creditoAtual)
                            console.log("aliquota usada para calcular o credito: " + 0.0925)
                        } 



                        // *************************************************************
                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(regimeAtual == 'Lucro Presumido' || regimeAtual == 'Lucro Real' || regimeAtual == "Simples Nacional"){
                          temCreditoIva = true
                        }
                      

                    }else if(movel.tipoAluguel == 'Aluguel recebido'){
                        // Minha empresa é o locador
                        // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente
                        if(regimeAtual == 'Lucro Presumido'){
                            pisCo = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
                            iss = this.parametrosEntrada.tabelaLucroPresumido.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.iss / 100 : 0
                            icms = this.parametrosEntrada.tabelaLucroPresumido.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.icms / 100 : 0
                            ipi = this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.ipi / 100 : 0  
                            aliquotaDesonerar = pisCo + iss + icms + ipi 
                            if(movel.comOperador){
                              valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0)
                            }else{
                              valorImpostosAtuais = (valorBase * aliquotaDesonerar)
                            }
                        }else if(regimeAtual == 'Lucro Real'){
                            pisCo = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
                            iss = this.parametrosEntrada.tabelaLucroReal.locacao.iss !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.iss / 100 : 0
                            icms = this.parametrosEntrada.tabelaLucroReal.locacao.icms !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.icms / 100 : 0
                            ipi = this.parametrosEntrada.tabelaLucroReal.locacao.ipi !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.ipi / 100 : 0
                            aliquotaDesonerar = pisCo + iss + icms + ipi
                            if(movel.comOperador){
                              valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0)
                            }else{
                              valorImpostosAtuais = (valorBase * aliquotaDesonerar)
                            }
                        }else if(regimeAtual == "Simples Nacional"){
                            pisCo = 0
                            iss = 0
                            icms = 0
                            ipi = 0

                          // Buscar dados no anexo III
                          const dadosAnexo = anexos.find(elem => elem.anexo == "III")
                          const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                              return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                          })

                          if(faixaIndex !== undefined){
                            console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                            const faixa = dadosAnexo?.tabela1[faixaIndex]    

                            if(faixa){ 
                              if(movel.comOperador){
                                // Considerar Anexo III completo
                                const valorDeduzirAtual = faixa?.valorDeduzir
                                const aliquotaAtual = faixa?.aliquota

                                const aliquotaEfetiva = (rbt12 * aliquotaAtual - valorDeduzirAtual) / rbt12

                                const reparticaoAtual = dadosAnexo?.reparticao[faixaIndex]
                                let porcentagemTributosExcluir = 0
                                const tributosExcluir: (keyof linhaReparticao)[] = ["iss", "cofins", "pis", "icms", "ipi"]
                                tributosExcluir.forEach(tributoExcluir => {
                                    porcentagemTributosExcluir += reparticaoAtual[tributoExcluir]
                                    if(tributoExcluir == "pis"){
                                      pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "cofins"){
                                      pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "icms"){
                                      icms += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "iss"){
                                      iss += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "ipi"){
                                      ipi += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                })

                                // Calculando impostos que irão permanecer após a reforma
                                let porcentagemTributosPermanecer = 0
                                const tributosPermanecer: (keyof linhaReparticao)[] = ["irpj", "csll", "cpp"]
                                tributosPermanecer.forEach(tributoPermanecer => {
                                    porcentagemTributosPermanecer += reparticaoAtual[tributoPermanecer]
                                })
                                const aliquotaEfetivaPermanecer = aliquotaEfetiva * porcentagemTributosPermanecer
                                valorImpostosPermanecer = (valorBase * aliquotaEfetivaPermanecer)
                                valorImpostosPermanecerTotal += valorImpostosPermanecer


                                const aliquotaEfetivaDesonerada = aliquotaEfetiva * porcentagemTributosExcluir

                                valorImpostosAtuais = valorBase * aliquotaEfetivaDesonerada


                              }else{
                                // retirando o iss
                                const valorDeduzirAtual = faixa?.valorDeduzir
                                const aliquotaAtual = faixa?.aliquota

                                const aliquotaEfetiva = (rbt12 * aliquotaAtual - valorDeduzirAtual) / rbt12

                                const reparticaoAtual = dadosAnexo?.reparticao[faixaIndex]
                                let porcentagemTributosExcluir = 0
                                // PARA NÃO CONTAR A REDUÇÃO DO ISS, SÓ NÃO INCLUIR ELE NO ARRAY DE IMPOSTOS ABAIXO
                                const tributosExcluir: (keyof linhaReparticao)[] = ["cofins", "pis", "icms", "ipi"]
                                tributosExcluir.forEach(tributoExcluir => {
                                    porcentagemTributosExcluir += reparticaoAtual[tributoExcluir]
                                    if(tributoExcluir == "pis"){
                                      pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "cofins"){
                                      pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "icms"){
                                      icms += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                    if(tributoExcluir == "ipi"){
                                      ipi += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                    }
                                })

                                // Calculando impostos que irão permanecer após a reforma
                                let porcentagemTributosPermanecer = 0
                                const tributosPermanecer: (keyof linhaReparticao)[] = ["irpj", "csll", "cpp"]
                                tributosPermanecer.forEach(tributoPermanecer => {
                                    porcentagemTributosPermanecer += reparticaoAtual[tributoPermanecer]
                                })
                                const aliquotaEfetivaPermanecer = aliquotaEfetiva * porcentagemTributosPermanecer
                                valorImpostosPermanecer = (valorBase * aliquotaEfetivaPermanecer)
                                valorImpostosPermanecerTotal += valorImpostosPermanecer


                                const aliquotaEfetivaDesonerada = aliquotaEfetiva * porcentagemTributosExcluir

                                valorImpostosAtuais = valorBase * aliquotaEfetivaDesonerada
                              }
                            }else{
                              console.log("Não está encontrando faixa")
                            }

                          }else{
                            console.log("faixa index está undefined")
                          }
                        }

                        // CRÉDITO: como o outro é o locatário:
                        if(movel.regimeOutro == 'Lucro Real' && movel.creditaPisCofins && (regimeAtual == "Lucro Presumido" || regimeAtual == "Lucro Real" || regimeAtual == "Simples Nacional")){
                            console.log("tem crédito atual de: ")
                            creditoAtual = valorBase * 0.0925
                            console.log(creditoAtual)
                            console.log("aliquota usada para calcular o credito: " + 0.0925)
                        } 



                        // *************************************************************
                        //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                        // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                        if(movel.regimeOutro == 'Lucro Presumido' || movel.regimeOutro == 'Lucro Real' || movel.regimeOutro == "Simples Nacional"){
                          temCreditoIva = true
                        }
                    }


                    // valor impostos ANTES da reforma
                    // Aqui o valor base já tem que estar com a redução??

                    console.log("valor dos impostos atuais (a desonerar): " + valorImpostosAtuais)
                    let valorDesonerado = valorBase - valorImpostosAtuais
                    console.log("valor desonerado: " + valorDesonerado)
                    const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                    // Crédito antes reforma
                    console.log("O crédito do locatário atual é: " + creditoAtual)

                    // sempre no valor base
                    const custoAR = valorBase - creditoAtual
                    console.log("custoAtual: " + custoAR)

                    // obj resposta final
                    const objMoveisLocacaoAtualAR = {
                        valor: valorBase,
                        valorImpostos: valorImpostosAtuais,
                        valorDesonerado: valorDesonerado,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                        custo: movel.tipoAluguel == "Aluguel pago" ? custoAR : null
                      }

                    respMoveisLocacaoAtual.antesReforma = objMoveisLocacaoAtualAR

                    // criando obj atual banco de dados
                    const antesReformaId = uuidv4()
                    const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                      id: antesReformaId,
                      calculoId: calculoId,
                      regimeId: regimeId,
                      categoriaId: categoriaId,
                      valor: valorBase,
                      desonerado: valorDesonerado,
                      impostos: valorImpostosAtuais,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: movel.tipoAluguel == "Aluguel pago" ? custoAR : null
                    })
                    estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                    // ONERAR NOVOS IMPOSTOS

                    anoAano.forEach(objAno => {
                        // CALCULAR VALOR IVA
                        let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                        let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                        const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                        const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                        const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                        // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                        const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                        const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                        // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                        const aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                        const valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                        // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                        const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                        const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                        const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                        const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                        const creditoAnoVigente = (temCreditoIva ? valorIvaAnoVigente : 0)
                        const custoAnoVigente = novoValorAnoVigente - creditoAnoVigente

                        // obj resposta final
                        const objAnoVigente: objDepoisReforma = {
                            ano: objAno.ano,
                            valor: novoValorAnoVigente,
                            valorSemIva: valorSemIvaAnoVigente,
                            valorImpostos: valorImpostosAnoVigente,
                            porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                            custo: movel.tipoAluguel == "Aluguel pago" ? custoAnoVigente : null
                        }
                        respMoveisLocacaoAtual.depoisReforma.push(objAnoVigente)

                        // obj banco de dados
                        const objDRCategoriasItemAnoVigente = criarDRCategoria({
                          antesReformaCategoriaId: antesReformaId,
                          ano: objAno.ano,
                          valor: novoValorAnoVigente,
                          valorSemIva: valorSemIvaAnoVigente,
                          impostos: valorImpostosAnoVigente,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                          custo: movel.tipoAluguel == "Aluguel pago" ? custoAnoVigente : null
                        })
                        estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)


                        if(movel.tipoAluguel == "Aluguel pago"){
                          const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                            objAnoVigenteCompras[0].valor += novoValorAnoVigente
                            objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteCompras[0].credito += creditoAnoVigente
                            objAnoVigenteCompras[0].custo += custoAnoVigente
                            objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                            objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado

                            objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                            objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                            objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                            objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado
                          }

                            if(movel.compoeCusto){
                              const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                              if(objCustoGeralAtual){
                                objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                              }
                            }else{
                              const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                              if(objDespesaAtual){
                                objDespesaAtual.despesaAnoVigente += custoAnoVigente
                              }
                            }
                  
                        }else if(movel.tipoAluguel == "Aluguel recebido"){
                          const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                          const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                          if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                            objAnoVigenteVendas[0].valor += novoValorAnoVigente
                            objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado

                            objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                            objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                            objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                            objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado
                          }
                        }
                

                    })

                    let baseIva = valorDesonerado
                    const aliquotaIva = 0.28
                    const valorImpostosNovos = baseIva * aliquotaIva
                    const novoValorTotal = valorDesonerado + valorImpostosNovos
                    const porcentagemCargaTributariaDR = valorImpostosNovos / valorDesonerado

                    creditoDR = temCreditoIva ? valorImpostosNovos : 0
                    const custoDR = temCreditoIva ? valorDesonerado : novoValorTotal




                    /*const respMoveisLocacaoAtual: objItemFinal = {
                      antesReforma: {
                        valor: valorBase,
                        valorImpostos: valorImpostosAtuais,
                        valorDesonerado: valorDesonerado,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                        custo: movel.tipoAluguel == "Aluguel pago" ? custoAR : null
                      },
                      depoisReforma: [
                        {
                          ano: "2033",
                          valor: novoValorTotal,
                          valorImpostos: valorImpostosNovos,
                          porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                          custo: movel.tipoAluguel == "Aluguel pago" ? custoDR : null,
                        }
                      ]
                    }*/

                    respostaFinalCalculo[chaveRegimeObjFinal].locacaoBensMoveis.push(respMoveisLocacaoAtual)


                    if(movel.tipoAluguel == "Aluguel pago"){
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorAR += valorBase
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.creditoAR += creditoAtual
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.custoAR += custoAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorAR

                        //preenchendo total
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR += valorBase
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR += creditoAtual
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.custoAR += custoAR
                        respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorAR

                        if(movel.compoeCusto){
                          console.log("Movel COM CUSTO")
                          console.log(movel)
                          dreCustoGeralAR += custoAR
                        }else{
                          dreDespesasAR += custoAR
                        }

                    }else if(movel.tipoAluguel == "Aluguel recebido"){
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorAR += valorBase
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorDesonerado

                        //preenchendo total
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += valorBase
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += valorDesonerado
                        respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorDesonerado
                    }

                  })

                  // INICIALIZANDO VARIAVEIS TABELA VENDAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaVendasId = uuidv4()
                  const objLinhaVendasId = await respTabelasRepo.pegarIdVendaPorLinha("locacaoMoveis")
                  const linhaVendasId = objLinhaVendasId?.id
                  // inicializar um objeto da linha tabela vendas, que tenha os valores genéricos, mas os ids já com valores finais
                  const objMovelLocacaoVendasAR = criarARVendas({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.impostosAR,
                    id: antesReformaVendasId,
                    linhaVendasId: linhaVendasId,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaVendas.push(objMovelLocacaoVendasAR)

                    // Depois Reforma
                  const arrDRVendasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.depoisReforma

                  arrDRVendasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objLocacaoMoveisVendasDR = criarDRVendas({
                      antesReformaId: antesReformaVendasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaVendas.push(objLocacaoMoveisVendasDR)

                  })




                  // INICIALIZANDO VARIAVEIS TABELA COMPRAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaComprasId = uuidv4()
                  const objLinhaComprasId = await respTabelasRepo.pegarIdComprasPorLinha("locacaoMoveis")
                  const linhaComprasId = objLinhaComprasId?.id
                  // popular o obj que compras que vai para o banco de dados
                  const objMovelLocacaoComprasAR = criarARCompras({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.impostosAR,
                    id: antesReformaComprasId,
                    linhaComprasId: linhaComprasId,
                    credito: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.creditoAR,
                    custo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.custoAR,
                    porcentagemCustoEfetivo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.porcentagemCustoEfetivoAR,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaCompras.push(objMovelLocacaoComprasAR)   

                    // Depois Reforma
                  const arrDRComprasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.locacaoMoveis.depoisReforma
                  arrDRComprasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objMovelLocacaoComprasDR = criarDRCompras({
                      antesReformaId: antesReformaComprasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      credito: objAnoDRAtual.credito,
                      custo: objAnoDRAtual.custo,
                      porcentagemCustoEfetivo: objAnoDRAtual.porcentagemCustoEfetivo,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaCompras.push(objMovelLocacaoComprasDR)
                  })



                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }


              }



              // Produtos

              // PRODUTOS VENDIDOS
              console.log("Total Produtos Vendidos")
              console.log(totalProdutosVendidos)
              if(totalProdutosVendidos.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []


                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("produtosVendidos")
                const categoriaId = objCategoriaAtual?.id                

                const ibsBruto = this.parametrosEntrada.aliquotaIbs / 100
                const cbsBruto = this.parametrosEntrada.aliquotaCbs / 100
                const ivaBruto = this.parametrosEntrada.aliquotaIva / 100

                let faturamentoTotalMensal = 0
                totalProdutosVendidos.forEach(produto => {
                  faturamentoTotalMensal += produto.valorOperacao
                })

                const rbt12 = dadosEmpresaAtual ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12

                console.log("PRODUTOS VENDIDOS CALCULADOS NO SEGUINTE REGIME:")
                console.log(regimeAtual)
                console.log(totalProdutosVendidos)

                totalProdutosVendidos.forEach(produtoVendido => {



                  console.log("produtoVendido preco")
                  console.log(produtoVendido.valorOperacao)
                  console.log("REGIME ATUAL:")
                  console.log(regimeAtual)
                  console.log("chave do obj segundo o regime:")
                  console.log(chaveRegimeObjFinal)
                  console.log("arr de produtos vendidos desse regime, como está: (como é apenas um deveria estar vazio):")
                  console.log(respostaFinalCalculo[chaveRegimeObjFinal].produtosVendidos)


                  let pisCo = 0
                  let icms = 0
                  let icmsDifal = 0
                  let icmsSt = 0
                  let iss = 0
                  let ipi = 0

                  let respProdutosVendidosAtual: objItemFinal = {
                    antesReforma: {
                      valor: 0,
                      valorImpostos: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributaria: 0,
                      custo: null
                    },
                    depoisReforma: []
                  }

                  let valorBase = produtoVendido.valorOperacao
                  console.log("Valor Base: ")
                  console.log(valorBase)

                  let aliquotaDesonerar = 0
                  let creditoAtual = 0
                  let temCreditoIva = false
                  let valorImpostosAtuais = 0
                  let valorImpostosPermanecer = 0

                  // IMPOSTOS ATUAIS (ANTES DA REFORMA) ***************************************************************************************************************

                  // Produtos num geral, sempre olhados pelo regime do VENDEDOR, como nesse caso o cliente que está usando nosso sistema é o vendedor:
                  if(regimeAtual == "Simples Nacional"){

                    // zera os parametros de entrada
                    pisCo = 0
                    icms = 0
                    iss = 0
                    ipi = 0

                    if(produtoVendido.tipoOperacao == "Indústria" || produtoVendido.tipoOperacao == "Indústria - Consumidor final fora do Estado"){
                      // Buscar dados no anexo II
                      const dadosAnexo = anexos.find(elem => elem.anexo == "II")
                      const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                          return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                      })

                      if(faixaIndex !== undefined){
                        console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                        const faixa = dadosAnexo?.tabela1[faixaIndex]    

                        if(faixa){

                            const valorDeduzirAtual = faixa?.valorDeduzir
                            const aliquotaAtual = faixa?.aliquota

                            const aliquotaEfetiva = (rbt12 * aliquotaAtual - valorDeduzirAtual) / rbt12

                            const reparticaoAtual = dadosAnexo?.reparticao[faixaIndex]
                            let porcentagemTributosExcluir = 0
                            const tributosExcluir: (keyof linhaReparticao)[] = ["iss", "cofins", "pis", "icms", "ipi"]
                            tributosExcluir.forEach(tributoExcluir => {
                                porcentagemTributosExcluir += reparticaoAtual[tributoExcluir]
                                if(tributoExcluir == "pis"){
                                  pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "cofins"){
                                  pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "icms"){
                                  icms += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "iss"){
                                  iss += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "ipi"){
                                  ipi += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                            })

                            // Calculando impostos que irão permanecer
                            let porcentagemTributosPermanecer = 0
                            const tributosPermanecer: (keyof linhaReparticao)[] = ["irpj", "csll", "cpp"]
                            tributosPermanecer.forEach(tributoPermanecer => {
                                porcentagemTributosPermanecer += reparticaoAtual[tributoPermanecer]
                            })
                            const aliquotaEfetivaPermanecer = aliquotaEfetiva * porcentagemTributosPermanecer
                            valorImpostosPermanecer = (valorBase * aliquotaEfetivaPermanecer)
                            valorImpostosPermanecerTotal += valorImpostosPermanecer
                  

                            const aliquotaEfetivaDesonerada = aliquotaEfetiva * porcentagemTributosExcluir

                            valorImpostosAtuais = (valorBase * aliquotaEfetivaDesonerada)
              
                            console.log("aliquota a desonerar: " + aliquotaEfetivaDesonerada)
                        }else{
                          console.log("Não está encontrando faixa")
                        }

                      }else{
                        console.log("faixa index está undefined")
                      }   
                    }else if(produtoVendido.tipoOperacao == "Revenda" || produtoVendido.tipoOperacao == "Revenda - Consumidor final fora do Estado"){
                      // Buscar dados no anexo I

                      console.log("rbt12: " + rbt12)
                      const dadosAnexo = anexos.find(elem => elem.anexo == "I")
                      const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                          return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                      })

                      if(faixaIndex !== undefined){
                        console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                        const faixa = dadosAnexo?.tabela1[faixaIndex]    

                        if(faixa){

                            const valorDeduzirAtual = faixa?.valorDeduzir
                            const aliquotaAtual = faixa?.aliquota

                            const aliquotaEfetiva = (rbt12 * aliquotaAtual - valorDeduzirAtual) / rbt12

                            const reparticaoAtual = dadosAnexo?.reparticao[faixaIndex]
                            let porcentagemTributosExcluir = 0
                            const tributosExcluir: (keyof linhaReparticao)[] = ["iss", "cofins", "pis", "icms", "ipi"]
                            tributosExcluir.forEach(tributoExcluir => {
                                porcentagemTributosExcluir += reparticaoAtual[tributoExcluir]
                                if(tributoExcluir == "pis"){
                                  pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "cofins"){
                                  pisCo += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "icms"){
                                  icms += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "iss"){
                                  iss += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                                if(tributoExcluir == "ipi"){
                                  ipi += aliquotaEfetiva * reparticaoAtual[tributoExcluir]
                                }
                            })

                            
                            // Calculando impostos que irão permanecer
                            let porcentagemTributosPermanecer = 0
                            const tributosPermanecer: (keyof linhaReparticao)[] = ["irpj", "csll", "cpp"]
                            tributosPermanecer.forEach(tributoPermanecer => {
                                porcentagemTributosPermanecer += reparticaoAtual[tributoPermanecer]
                            })
                            const aliquotaEfetivaPermanecer = aliquotaEfetiva * porcentagemTributosPermanecer
                            valorImpostosPermanecer = (valorBase * aliquotaEfetivaPermanecer)
                            valorImpostosPermanecerTotal += valorImpostosPermanecer


                            const aliquotaEfetivaDesonerada = aliquotaEfetiva * porcentagemTributosExcluir

                            console.log("Regime Atual: " + regimeAtual)
                            console.log("aliquotaEfetiva: " + aliquotaEfetiva)
                            console.log("porcentagemTributosExcluir: " + porcentagemTributosExcluir)

                            valorImpostosAtuais = (valorBase * aliquotaEfetivaDesonerada)

                            console.log("aliquota a desonerar: " + aliquotaEfetivaDesonerada)
                        }else{
                          console.log("Não está encontrando faixa")
                        }

                      }else{
                        console.log("faixa index está undefined")
                      }              
                    }else if(produtoVendido.tipoOperacao == "Exportação"){
                      // Não tem impostos atuais, como lá no início o impostosAtuais foi setado como 0, é só não fazer nada
                    }




                  }else{
                    if(produtoVendido.tipoInput == "Manual"){
                      // independente de ser real ou presumido, o icms vem sempre dos inputs
                      let aliquotaDesonerar = 0
                      icms = (produtoVendido.icms / 100)
                      ipi = (produtoVendido.ipi / 100)
                      aliquotaDesonerar = icms + icmsDifal + icmsSt
                      console.log("aliquota a desonerar: " + aliquotaDesonerar)
                      valorImpostosAtuais = valorBase * aliquotaDesonerar

                      // Já o pisCofins vai depender se a minha empresa de fato é do msm regime que está sendo simulado agora
                      if(regimeAtual == "Lucro Real"){
                        if(meuRegime == "Lucro Real"){
                          // O regime simulado atual é lucro real e minha empresa é do lucro real
                          pisCo = produtoVendido.pisCofins
                        }else{
                          pisCo = parametrosEntrada.tabelaLucroReal.comercial.pisCo ? (parametrosEntrada.tabelaLucroReal.comercial.pisCo / 100) : 0
                        }
                      }else if(regimeAtual == "Lucro Presumido"){
                        if(meuRegime == "Lucro Presumido"){
                          // o regime simulado é presumido e minha empresa é do presumido
                          pisCo = produtoVendido.pisCofins
                        }else{
                          pisCo = parametrosEntrada.tabelaLucroPresumido.comercial.pisCo ? (parametrosEntrada.tabelaLucroPresumido.comercial.pisCo) : 0
                        }
                      }
                    }else if(produtoVendido.tipoInput == "XML"){
                      // Sempre que for XML, eu pego o icms e ipi pelo valor direto do XML, não pelas alíquotas. Como nesse caso, não atualizo alíquotas, no ano a ano, sempre que for 
                      // XML eu pego pela alíquota do ICMS do XML tambem.

                      const valorIcms = produtoVendido.valorIcms + produtoVendido.valorIcmsDifal + produtoVendido.valorIcmsSt 
                      const valorIpi = produtoVendido.valorIpi

                      if(regimeAtual == meuRegime){
                        // pegar do XML (no caso os inputs estão preenchidos com os valores do XML)
                        valorImpostosAtuais = valorIcms + valorIpi + produtoVendido.valorPisCofins

                      }else{
                        // Preciso pegar da tabela do Real ou Presumido]
                        // Antes descubro qual a coluna correta a conferir a partir do tipoOperacao
                        let colunaTabela: "comercial" | "industrial" | "exportacao"
                        switch(produtoVendido.tipoOperacao){
                          case "Revenda - Consumidor final fora do Estado":
                            colunaTabela = "comercial"
                            break
                          case "Revenda":
                            colunaTabela = "comercial"
                            break
                          case "Indústria":
                            colunaTabela = "industrial"
                            break
                          case "Indústria - Consumidor final fora do Estado":
                            colunaTabela = "industrial"
                            break 
                          case "Exportação":
                            colunaTabela = "exportacao"
                            break
                        }
                        if(colunaTabela == "exportacao"){
                          valorImpostosAtuais = 0
                        }else{
                          if(regimeAtual == "Lucro Presumido"){
                            // pegar alíquotas da tabela do Lucro Presumido
                            const tabelaLucroPresumido = parametrosEntrada.tabelaLucroPresumido
                            pisCo = tabelaLucroPresumido[colunaTabela].pisCo ?? 0
                            iss = tabelaLucroPresumido[colunaTabela].iss ?? 0
                          }else if(regimeAtual == "Lucro Real"){
                            // pegar alíquotas da tabela do Lucro Real 
                            const tabelaLucroReal = parametrosEntrada.tabelaLucroReal
                            pisCo = tabelaLucroReal[colunaTabela].pisCo ?? 0
                            iss = tabelaLucroReal[colunaTabela].iss ?? 0
                          }
                          aliquotaDesonerar = pisCo + iss
                          valorImpostosAtuais = (valorBase * aliquotaDesonerar) + valorIcms + valorIpi
                        }
                      }
                    }


                  }


                  console.log("valor dos impostos atuais (antes da reforma): " + valorImpostosAtuais)

                  let valorDesonerado = valorBase - valorImpostosAtuais
                  const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                  console.log("Valor Desonerado: " + valorDesonerado)


                  // obj resultado final
                  const objProdutoVendidoAtualAR = {
                    valor: valorBase,
                    valorImpostos: valorImpostosAtuais,
                    valorDesonerado: valorDesonerado,
                    porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                    custo: null
                  }
                  respProdutosVendidosAtual.antesReforma = objProdutoVendidoAtualAR          
                  
                  // criando obj atual banco de dados
                  const antesReformaId = uuidv4()
                  const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                    id: antesReformaId,
                    calculoId: calculoId,
                    regimeId: regimeId,
                    categoriaId: categoriaId,
                    valor: valorBase,
                    desonerado: valorDesonerado,
                    impostos: valorImpostosAtuais,
                    porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                    custo: null
                  })
                  estruturaDbAntesReformaCategoria.push(objARCategoriaItem)                  


                  // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


                  // IMPOSTOS NOVOS ******************************************************************************************************************************************
                  let reducaoIva = 0
                  let aliquotaIva = ivaBruto + cbsBruto

                  anoAano.forEach(objAno => {
                      // CALCULAR VALOR IVA
                      let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                      let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                      if(produtoVendido.beneficio){
                        // Se vier um numero maior que zero
                        reducaoIva = produtoVendido.manterBeneficio ? produtoVendido.beneficio : 0
                      }else{
                        // se vier zero ou qualquer tipo de null, undefined...
                        reducaoIva = 0
                      }
                      aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoIva)
                      aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoIva)
                      const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                      const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                      const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                      // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                      const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                      const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                      // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                      let aliquotaIcmsAnoVigente = 0
                      let valorIcmsAnoVigente = 0
                      if(produtoVendido.tipoInput == "XML"){
                        aliquotaIcmsAnoVigente = produtoVendido.aliqIcms * objAno.porcentagemIcmsIss
                      }else{
                        aliquotaIcmsAnoVigente = (icms + icmsSt + icmsDifal) * objAno.porcentagemIcmsIss
                      }
                      valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)

                      // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                      const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                      const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                      const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                      const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente

                      // obj resultado final
                      const objAnoVigente: objDepoisReforma = {
                          ano: objAno.ano,
                          valor: novoValorAnoVigente,
                          valorSemIva: valorSemIvaAnoVigente,
                          valorImpostos: valorImpostosAnoVigente,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                          custo: null
                      }
                      respProdutosVendidosAtual.depoisReforma.push(objAnoVigente)

                      // obj banco de dados
                      const objDRCategoriasItemAnoVigente = criarDRCategoria({
                        antesReformaCategoriaId: antesReformaId,
                        ano: objAno.ano,
                        valor: novoValorAnoVigente,
                        valorSemIva: valorSemIvaAnoVigente,
                        impostos: valorImpostosAnoVigente,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                        custo: null
                      })
                      estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)                      

                      const objAnoVigenteVendas = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                      const objAnoVigenteVendasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                      if((objAnoVigenteVendas.length > 0) && (objAnoVigenteVendasTotal.length > 0)){
                        objAnoVigenteVendas[0].valor += novoValorAnoVigente
                        objAnoVigenteVendas[0].valorSemIva += valorSemIvaAnoVigente
                        objAnoVigenteVendas[0].impostos += valorImpostosAnoVigente
                        objAnoVigenteVendas[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado

                        objAnoVigenteVendasTotal[0].valor += novoValorAnoVigente
                        objAnoVigenteVendasTotal[0].valorSemIva += valorSemIvaAnoVigente
                        objAnoVigenteVendasTotal[0].impostos += valorImpostosAnoVigente
                        objAnoVigenteVendasTotal[0].porcentagemCargaTributaria = objAnoVigenteVendas[0].impostos / valorDesonerado
                      }

                  })


                  if(produtoVendido.beneficio){
                    // Se vier um numero maior que zero
                    reducaoIva = produtoVendido.manterBeneficio ? produtoVendido.beneficio : 0
                  }else{
                    // se vier zero ou qualquer tipo de null, undefined...
                    reducaoIva = 0
                  }

                  console.log("Reducao IVA: " + reducaoIva)

                  aliquotaIva = aliquotaIva - (aliquotaIva * reducaoIva)

                  const novosImpostos = valorDesonerado * aliquotaIva
                  console.log("Novos impostos: " + novosImpostos)
                  const porcentagemCargaTributariaDR = novosImpostos / valorDesonerado


                  const novoValorProduto = valorDesonerado + novosImpostos
                  console.log("Novo valor do produto: " + novoValorProduto)


                  /*const respServicoPrestadoAtual: objItemFinal = {
                    antesReforma: {
                      valor: valorBase,
                      valorImpostos: valorImpostosAtuais,
                      valorDesonerado: valorDesonerado,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: null
                    },
                    depoisReforma: [
                      {
                        ano: "2033",
                        valor: novoValorProduto,
                        valorImpostos: novosImpostos,
                        porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                        custo: null
                      }
                    ]
                  }*/

                  console.log("No regime " + regimeAtual + " o push foi feitoOOOOOOOOOOOOOOOOOOOOOO com o seguinte objeto:")
                  console.log(respProdutosVendidosAtual)
                  respostaFinalCalculo[chaveRegimeObjFinal].produtosVendidos.push(respProdutosVendidosAtual)   
                  
                  
                  console.log("arr do Simples Nacional SEMPRE")
                  console.log(respostaFinalCalculo.simplesNacional.produtosVendidos)

                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorAR += valorBase
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorDesonerado += valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorDesonerado
     
                  // preenchendo total
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR += valorBase
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado += valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorDesonerado
                })

                // Atualizando os valores da estrutura linha produtos tabela vendas que será enviada pro banco de dados
                  // Antes Reforma
                const antesReformaVendasId = uuidv4()
                const objLinhaVendasId = await respTabelasRepo.pegarIdVendaPorLinha("vendasProdutos")
                const linhaVendasId = objLinhaVendasId?.id
                // popular o obj que vai para a estrutura da tabela vendas banco de dados
                const objProdutoVendasAR = criarARVendas({
                  calculoId,
                  regimeId,
                  valor: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorAR,
                  desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorDesonerado,
                  impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.impostosAR,
                  id: antesReformaVendasId,
                  linhaVendasId: linhaVendasId,
                  porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.porcentagemCargaTributariaAR
                })
                console.log("produto Vendido AR add na estrutura que vai pro banco:")
                console.log(objProdutoVendasAR)

                // adicionar o obj da linha atual atualizado acima na estrutura que será enviada para o banco
                estruturaDbAntesReformaVendas.push(objProdutoVendasAR)
                console.log("estrutura AR Db depos de adicionar:")
                console.log(estruturaDbAntesReformaVendas)

                  // Depois Reforma
                const arrDRVendasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.depoisReforma

                arrDRVendasCategoriaAtual.forEach((objAnoDRAtual) => {
                  const objProdutoVendasDR = criarDRVendas({
                    antesReformaId: antesReformaVendasId,
                    ano: objAnoDRAtual.ano,
                    impostos: objAnoDRAtual.impostos,
                    valor: objAnoDRAtual.valor,
                    valorSemIva: objAnoDRAtual.valorSemIva,
                    porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                  })
                  estruturaDbDepoisReformaVendas.push(objProdutoVendasDR)
                })


                // add respostas categorias no banco de dados
                if(calculoId && regimeId && categoriaId){
                  try {
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }catch(err){
                    console.log("ERRO DO BANCO DE DAAAAADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS:")
                    console.log(err)
                  }
                }else{
                  console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                }

              }

              console.log("Estrutura banco de dados AR Vendas após produtos vendidos terminar de executar")
              console.log(estruturaDbAntesReformaVendas)
              





              // PRODUTOS ADQUIRIDOS
              if(totalProdutosAdquiridos.length > 0){

                // estruturas que serão enviadas para o banco de dados para salvar, com os dados já organizados como as tabelas esperam
                const estruturaDbAntesReformaCategoria: Prisma.AntesReformaCategoriaUncheckedCreateInput[] = []
                const estruturaDbDepoisReformaCategoria: Prisma.DepoisReformaCategoriaUncheckedCreateInput[] = []

                // Descobrir o ID da categoria atual
                const objCategoriaAtual = await descobrirIdCategoria("produtosAdquiridos")
                const categoriaId = objCategoriaAtual?.id

                let faturamentoTotalMensal = 0
                totalProdutosAdquiridos.forEach(produto => {
                  faturamentoTotalMensal += produto.valorOperacao
                })


                const rbt12 = dadosEmpresaAtual ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12

                console.log("TEM PRODUTOS ADQURIDOS")
                console.log(totalProdutosAdquiridos)

                totalProdutosAdquiridos.forEach(produtoAdquirido => {

                  let respProdutoAdquiridoAtual: objItemFinal = {
                    antesReforma: {
                      valor: 0,
                      valorImpostos: 0,
                      valorDesonerado: 0,
                      porcentagemCargaTributaria: 0,
                      custo: null
                    },
                    depoisReforma: []
                  }              

                  let valorBase = produtoAdquirido.valorOperacao
                  // variavel para valor com credito antes da reforma. O calculo em si do crédito deve ser feito para cada caso de forma única pois o icms para simples não 
                  // é o mesmo para lucro real, por exemplo. E até dentro dos casos do simples também é diferente, caso pegue do anexo I a alíquota será diferente de caso 
                  // pegue do anexo II
                  let valorComCreditoAtual = produtoAdquirido.valorOperacao
                  console.log("Valor Base: ")
                  console.log(valorBase)


                  let aliquotaDesonerar = 0
                  let creditoAtual = 0
                  let custoAR = 0
                  let temCreditoIva = false
                  let valorImpostosAtuais = 0

                  // IMPOSTOS ATUAIS (ANTES DA REFORMA) ***************************************************************************************************************

                  // Produtos num geral, sempre olhados pelo regime do VENDEDOR, como nesse caso o cliente que está usando nosso sistema é o comprador, o outro é o vendedor:
                  if(produtoAdquirido.regimeTributarioOutro == "Simples Nacional"){

                    if(produtoAdquirido.fornecedorIndustrial){
                      // Pegar parametros da coluna industrial
                      aliquotaDesonerar = ((produtoAdquirido.aliquotas.icms !== null ? produtoAdquirido.aliquotas.icms / 100 : 0) + (produtoAdquirido.aliquotas.ipi !== null ? produtoAdquirido.aliquotas.ipi / 100 : 0) + (produtoAdquirido.aliquotas.pisCo !== null ? produtoAdquirido.aliquotas.pisCo / 100 : 0))
                    }else{
                      // Caso não industrial pegar parametros da coluna comercial
                      aliquotaDesonerar = ((produtoAdquirido.aliquotas.icms !== null ? produtoAdquirido.aliquotas.icms / 100 : 0) + (produtoAdquirido.aliquotas.pisCo !== null ? produtoAdquirido.aliquotas.pisCo / 100 : 0))
                    }

                    valorImpostosAtuais = valorBase * aliquotaDesonerar

                  }else{
                    if(produtoAdquirido.tipoInput == "XML"){
                      valorImpostosAtuais = (produtoAdquirido.valores.icms ? produtoAdquirido.valores.icms : 0) + (produtoAdquirido.valores.ipi ? produtoAdquirido.valores.ipi : 0) + (produtoAdquirido.valores.iss ? produtoAdquirido.valores.iss : 0) + (produtoAdquirido.valores.pisCo ? produtoAdquirido.valores.pisCo : 0)
                    }else{
                      // Tanto Lucro Real quanto Lucro Presumido tem que calcular os impostos atuais através dos parametros de entrada, então pode ser a mesma coisa
                      const aliquotaDesonerar = (produtoAdquirido.aliquotas.icms !== null ? produtoAdquirido.aliquotas.icms / 100 : 0) + (produtoAdquirido.aliquotas.pisCo !== null ? produtoAdquirido.aliquotas.pisCo / 100 : 0) + (produtoAdquirido.aliquotas.ipi !== null ? produtoAdquirido.aliquotas.ipi / 100 : 0) 
                      console.log("aliquota a desonerar: " + aliquotaDesonerar)
                      valorImpostosAtuais = valorBase * aliquotaDesonerar
                    }
                  }

                  // CRÉDITO ATUAL 
                  const aliquotaIcms = produtoAdquirido.aliquotas.icms !== null ? (produtoAdquirido.aliquotas.icms / 100) : 0 
                  const aliquotaPisCofins = produtoAdquirido.aliquotas.pisCo !== null ? (produtoAdquirido.aliquotas.pisCo / 100) : 0 
                  const aliquotaIpi = produtoAdquirido.aliquotas.ipi !== null ? (produtoAdquirido.aliquotas.ipi / 100) : 0 
                  const aliquotaIss = produtoAdquirido.aliquotas.iss !== null ? (produtoAdquirido.aliquotas.iss / 100) : 0 

                  creditoAtual = (produtoAdquirido.creditoIcms ? valorBase * aliquotaIcms : 0) + (produtoAdquirido.creditoPisCofins ? valorBase * aliquotaPisCofins : 0) + (produtoAdquirido.creditoIpi ? valorBase * aliquotaIpi : 0)
                  custoAR = valorBase - creditoAtual

                  let valorDesonerado = valorBase - valorImpostosAtuais
                  const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

                  console.log("Valor Desonerado: " + valorDesonerado)

                  // obj resultado final
                  const objProdutoAdquiridoAtualAR = {
                    valor: valorBase,
                    valorImpostos: valorImpostosAtuais,
                    valorDesonerado: valorDesonerado,
                    porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                    custo: custoAR
                  }
                  respProdutoAdquiridoAtual.antesReforma = objProdutoAdquiridoAtualAR

                  // criando obj atual banco de dados
                  const antesReformaId = uuidv4()
                  const objARCategoriaItem: Prisma.AntesReformaCategoriaUncheckedCreateInput = criarARCategoria({
                    id: antesReformaId,
                    calculoId: calculoId,
                    regimeId: regimeId,
                    categoriaId: categoriaId,
                    valor: valorBase,
                    desonerado: valorDesonerado,
                    impostos: valorImpostosAtuais,
                    porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                    custo: custoAR
                  })
                  estruturaDbAntesReformaCategoria.push(objARCategoriaItem)


                  // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


                  // IMPOSTOS NOVOS ******************************************************************************************************************************************

                  const icms = produtoAdquirido.aliquotas.icms !== null ? (produtoAdquirido.aliquotas.icms / 100) : 0
                  const iss = 0
                  let reducaoIva = 0
                  anoAano.forEach(objAno => {
                      // CALCULAR VALOR IVA
                      let aliquotaIbsAnoVigente = ibsBruto * objAno.porcentagemIbs
                      let aliquotaCbsAnoVigente = cbsBruto * objAno.porcentagemCbs
                      if(produtoAdquirido.beneficio){
                        // Se vier um numero maior que zero
                        reducaoIva = produtoAdquirido.manterBeneficio ? produtoAdquirido.beneficio : 0
                      }else{
                        // se vier zero ou qualquer tipo de null, undefined...
                        reducaoIva = 0
                      }
                      aliquotaIbsAnoVigente = aliquotaIbsAnoVigente - (aliquotaIbsAnoVigente * reducaoIva)
                      aliquotaCbsAnoVigente = aliquotaCbsAnoVigente - (aliquotaCbsAnoVigente * reducaoIva)
                      const valorIbsAnoVigente = valorDesonerado * aliquotaIbsAnoVigente
                      const valorCbsAnoVigente = valorDesonerado * aliquotaCbsAnoVigente
                      const valorIvaAnoVigente = valorIbsAnoVigente + valorCbsAnoVigente

                      // CALCULAR VALOR ISS (base é o valorDesonerado + valorIva)
                      const aliquotaIssAnoVigente = iss * objAno.porcentagemIcmsIss
                      const valorIssAnoVigente = (valorDesonerado + valorIvaAnoVigente) * aliquotaIssAnoVigente

                      // CALCULAR VALOR ICMS (base é valorDesonerado + ICMS (ou seja, por dentro) + IVA)
                      let aliquotaIcmsAnoVigente
                      let valorIcmsAnoVigente
                      if(produtoAdquirido.tipoInput == "XML"){
                        aliquotaIcmsAnoVigente = (produtoAdquirido.aliquotas.icms || 0) * objAno.porcentagemIcmsIss
                        valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)
                      }else{
                        aliquotaIcmsAnoVigente = icms * objAno.porcentagemIcmsIss
                        valorIcmsAnoVigente = ((valorDesonerado + valorIvaAnoVigente) * aliquotaIcmsAnoVigente) / (1 - aliquotaIcmsAnoVigente)
                      }


                      // VALORES FINAIS E CONSTRUÇÃO DO OBJETO DO ANO
                      const valorImpostosAnoVigente = valorIvaAnoVigente + valorIssAnoVigente + valorIcmsAnoVigente
                      const porcentagemCargaTributariaAnoVigente = valorImpostosAnoVigente / valorDesonerado
                      const novoValorAnoVigente = valorDesonerado + valorImpostosAnoVigente
                      const valorSemIvaAnoVigente = novoValorAnoVigente - valorIvaAnoVigente
                      const creditoAnoVigente = (produtoAdquirido.creditoIcms ? valorIcmsAnoVigente : 0)
                      let custoAnoVigente = novoValorAnoVigente - creditoAnoVigente

                      // obj resultado final
                      const objAnoVigente: objDepoisReforma = {
                          ano: objAno.ano,
                          valor: novoValorAnoVigente,
                          valorSemIva: valorSemIvaAnoVigente,
                          valorImpostos: valorImpostosAnoVigente,
                          porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                          custo: custoAnoVigente
                      }
                      respProdutoAdquiridoAtual.depoisReforma.push(objAnoVigente)

                      // obj banco de dados
                      const objDRCategoriasItemAnoVigente = criarDRCategoria({
                        antesReformaCategoriaId: antesReformaId,
                        ano: objAno.ano,
                        valor: novoValorAnoVigente,
                        valorSemIva: valorSemIvaAnoVigente,
                        impostos: valorImpostosAnoVigente,
                        porcentagemCargaTributaria: porcentagemCargaTributariaAnoVigente,
                        custo: custoAnoVigente
                      })
                      estruturaDbDepoisReformaCategoria.push(objDRCategoriasItemAnoVigente)

                      const objAnoVigenteCompras = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)
                      const objAnoVigenteComprasTotal = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(objAnoMapeado => objAnoMapeado.ano == objAno.ano)

                      if((objAnoVigenteCompras.length > 0) && (objAnoVigenteComprasTotal.length > 0)){
                        objAnoVigenteCompras[0].valor += novoValorAnoVigente
                        objAnoVigenteCompras[0].valorSemIva += valorSemIvaAnoVigente
                        objAnoVigenteCompras[0].impostos += valorImpostosAnoVigente
                        objAnoVigenteCompras[0].credito += creditoAnoVigente
                        objAnoVigenteCompras[0].custo += custoAnoVigente
                        objAnoVigenteCompras[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                        objAnoVigenteCompras[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado

                        objAnoVigenteComprasTotal[0].valor += novoValorAnoVigente
                        objAnoVigenteComprasTotal[0].valorSemIva += valorSemIvaAnoVigente
                        objAnoVigenteComprasTotal[0].impostos += valorImpostosAnoVigente
                        objAnoVigenteComprasTotal[0].credito += creditoAnoVigente
                        objAnoVigenteComprasTotal[0].custo += custoAnoVigente
                        objAnoVigenteComprasTotal[0].porcentagemCustoEfetivo = objAnoVigenteCompras[0].custo / objAnoVigenteCompras[0].valor
                        objAnoVigenteComprasTotal[0].porcentagemCargaTributaria = objAnoVigenteCompras[0].impostos / valorDesonerado
                      }

                      if(produtoAdquirido.tipoInput == "Manual"){
                        if(produtoAdquirido.tipoOperacao == "Revenda" || produtoAdquirido.tipoOperacao == "Insumo"){
                          const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                          if(objCustoGeralAtual){
                            objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                          }
                        }else{
                          const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                          if(objDespesaAtual){
                            objDespesaAtual.despesaAnoVigente += custoAnoVigente
                          }
                        }
                      }else{
                        if(produtoAdquirido.custoDespesa == "Custo"){
                          const objCustoGeralAtual = dreCustoGeralTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                          if(objCustoGeralAtual){
                            objCustoGeralAtual.custoGeralAnoVigente += custoAnoVigente
                          }
                        }else{
                          const objDespesaAtual = dreDespesasTransicao.find(objAnoCusto => objAnoCusto.ano == objAno.ano)
                          if(objDespesaAtual){
                            objDespesaAtual.despesaAnoVigente += custoAnoVigente
                          }
                        }
                      }

                  })


                  let aliquotaIva = 0.28
                  
                  if(produtoAdquirido.beneficio){
                    // Se vier um numero maior que zero
                    reducaoIva = produtoAdquirido.manterBeneficio ? produtoAdquirido.beneficio : 0
                  }else{
                    // se vier zero ou qualquer tipo de null, undefined...
                    reducaoIva = 0
                  }

                  console.log("Reducao IVA: " + reducaoIva)

                  aliquotaIva = aliquotaIva - (aliquotaIva * reducaoIva)

                  const novosImpostos = valorDesonerado * aliquotaIva
                  console.log("Novos impostos: " + novosImpostos)

                  const porcentagemCargaTributariaDR = novosImpostos / valorDesonerado

                  const novoValorProduto = valorDesonerado + novosImpostos
                  console.log("Novo valor do produto: " + novoValorProduto)


                  /*const respServicoPrestadoAtual: objItemFinal = {
                    antesReforma: {
                      valor: valorBase,
                      valorImpostos: valorImpostosAtuais,
                      valorDesonerado: valorDesonerado,
                      porcentagemCargaTributaria: porcentagemCargaTributariaAR,
                      custo: custoAR
                    },
                    depoisReforma: [
                      {
                        ano: "2033",
                        valor: novoValorProduto,
                        valorImpostos: novosImpostos,
                        porcentagemCargaTributaria: porcentagemCargaTributariaDR,
                        custo: null
                      }
                    ]
                  }*/

                  respostaFinalCalculo[chaveRegimeObjFinal].produtosAdquiridos.push(respProdutoAdquiridoAtual)              

                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorAR += valorBase
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorDesonerado += valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.creditoAR += creditoAtual
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.custoAR += custoAR
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorAR

                  // preencher total
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR += valorBase
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorDesonerado += valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCargaTributariaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.impostosAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorDesonerado
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR += creditoAtual
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.custoAR += custoAR
                  respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCustoEfetivoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.custoAR / respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorAR

                  if(produtoAdquirido.tipoInput == "Manual"){
                    if(produtoAdquirido.tipoOperacao == "Revenda" || produtoAdquirido.tipoOperacao == "Insumo"){
                      dreCustoGeralAR += custoAR
                    }else{
                      dreDespesasAR += custoAR
                    }
                  }else{
                    if(produtoAdquirido.custoDespesa == "Custo"){
                      dreCustoGeralAR += custoAR
                    }else{
                      dreDespesasAR += custoAR
                    }
                  }
        
                })

                  // INICIALIZANDO VARIAVEIS TABELA COMPRAS BANCO DE DADOS
                    // Antes Reforma
                  const antesReformaComprasId = uuidv4()
                  const objLinhaComprasId = await respTabelasRepo.pegarIdComprasPorLinha("comprasProdutos")
                  const linhaComprasId = objLinhaComprasId?.id
                  // popular o obj que compras que vai para o banco de dados
                  const objprodutoComprasAR = criarARCompras({
                    calculoId,
                    regimeId,
                    valor: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorAR,
                    desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.valorDesonerado,
                    impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.impostosAR,
                    id: antesReformaComprasId,
                    linhaComprasId: linhaComprasId,
                    credito: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.creditoAR,
                    custo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.custoAR,
                    porcentagemCustoEfetivo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.porcentagemCustoEfetivoAR,
                    porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.antesReforma.porcentagemCargaTributariaAR
                  })

                  estruturaDbAntesReformaCompras.push(objprodutoComprasAR)   

                    // Depois Reforma
                  const arrDRComprasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.comprasProdutos.depoisReforma
                  arrDRComprasCategoriaAtual.forEach((objAnoDRAtual) => {
                    const objProdutoComprasDR = criarDRCompras({
                      antesReformaId: antesReformaComprasId,
                      ano: objAnoDRAtual.ano,
                      impostos: objAnoDRAtual.impostos,
                      valor: objAnoDRAtual.valor,
                      valorSemIva: objAnoDRAtual.valorSemIva,
                      credito: objAnoDRAtual.credito,
                      custo: objAnoDRAtual.custo,
                      porcentagemCustoEfetivo: objAnoDRAtual.porcentagemCustoEfetivo,
                      porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                    })
                    estruturaDbDepoisReformaCompras.push(objProdutoComprasDR)
                  })
        
                  // add respostas no banco de dados
                  if(calculoId && regimeId && categoriaId){
                    const addARBanco = await respCategoriasRepo.criarARCategoria(estruturaDbAntesReformaCategoria)
                    const addDRBanco = await respCategoriasRepo.criarDRCategoria(estruturaDbDepoisReformaCategoria)
                  }else{
                    console.log("Não foi possivel salvar no banco de dados por problemas com os ID's")
                  }        
        
              }

              console.log("Estrutura banco de dados AR Vendas após produtos COMPRASS terminar de executar")
              console.log(estruturaDbAntesReformaVendas)

              // No final de tudo realizo a soma de colunas para fazer a tabela da DRE
              
              // TABELAS ANTES DA REFORMA (AR)
                
                // ***** TABELA CAIXA AR *****
                  const tabelaCaixa = respostaFinalCalculo[chaveRegimeObjFinal].caixa
                  // Fornecedores
                //preenchendo fornecedoresAR
              tabelaCaixa.fornecedores.antesReforma.valor = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR  
              
                  // Tributos Crédito
              const tributosCreditoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR
              tabelaCaixa.tributosCredito.antesReforma.valor = tributosCreditoAR

                  // Clientes
              const valorVendaAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR
              tabelaCaixa.clientes.antesReforma.valor = valorVendaAR

                  // Tributos Débito
              const tributosDebitoAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR
              tabelaCaixa.tributosDebito.antesReforma.valor = tributosDebitoAR

                

                // ***** TABELA DRE AR *****

                  // Receita Bruta
              respostaFinalCalculo[chaveRegimeObjFinal].dre.receitaBruta.antesReforma.valor = valorVendaAR

                  // Deduções Tributos
              let deducoesTributosAR = 0
              if(regimeAtual == "Simples Nacional"){
                  deducoesTributosAR = valorImpostosPermanecerTotal + tributosDebitoAR // tributosDébitoAR é a soma de todos os impostos excluídos das operções de VENDA
              }else if(regimeAtual == "Lucro Presumido" || regimeAtual == "Lucro Real"){
                  deducoesTributosAR = tributosDebitoAR - tributosCreditoAR
              }

                  // Custo Geral
              respostaFinalCalculo[chaveRegimeObjFinal].dre.custoGeral.antesReforma.valor = dreCustoGeralAR

                  // Lucro Bruto
              const lucroBrutoAR = valorVendaAR - deducoesTributosAR - dreCustoGeralAR
              respostaFinalCalculo[chaveRegimeObjFinal].dre.lucroBruto.antesReforma.valor = lucroBrutoAR

                // Lucro Antes IRCS
              const lucroAntesIrCsAR = valorVendaAR - deducoesTributosAR - dreCustoGeralAR - dreDespesasAR
              respostaFinalCalculo[chaveRegimeObjFinal].dre.lucrosAntesIrCs.antesReforma.valor = lucroAntesIrCsAR

                // IR/CS
              let irCsAR = 0
                  
              if(regimeAtual == "Lucro Real"){
                  // AR
                  if(lucroAntesIrCsAR > 0){
                    const valor1 = lucroAntesIrCsAR * 0.24
                    const adicional = lucroAntesIrCsAR > 20000 ? (lucroAntesIrCsAR - 20000) * 0.1 : 0

                    irCsAR = valor1 + adicional

                  }else{
                    irCsAR = 0
                  }

              }else if(regimeAtual == "Lucro Presumido"){
                  const valorTotalServicosPrestadosAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR
                  const valorDesoneradoServicosPrestados = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorDesonerado

                  const valorTotalLocacaoMoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorAR
                  const valorTotalLocacaoImoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorAR
                  const valorTotalLocacaoAR = valorTotalLocacaoImoveisAR + valorTotalLocacaoMoveisAR

                  const valorDesoneradoLocacaoMoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorDesonerado
                  const valorDesoneradoLocacaoImoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorDesonerado
                  const valorDesoneradoLocacaoAR = valorDesoneradoLocacaoImoveisAR + valorDesoneradoLocacaoMoveisAR

                  const valorTotalProdutosVendidosAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorAR
                  const valorDesoneradoProdutosVendidos = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorDesonerado

                  const arrCalculoIrCs: {valorAR: number, valorDesonerado: number, aliquota: number, aliquotaIrpjCsll: number}[] = [
                    {valorAR: valorTotalServicosPrestadosAR, valorDesonerado: valorDesoneradoServicosPrestados, aliquota: 0.32, aliquotaIrpjCsll: 0.0768 },
                    {valorAR: valorTotalLocacaoAR, valorDesonerado: valorDesoneradoLocacaoAR, aliquota: 0.32, aliquotaIrpjCsll: 0.0768 },
                    {valorAR: valorTotalProdutosVendidosAR, valorDesonerado: valorDesoneradoProdutosVendidos, aliquota: 0.08, aliquotaIrpjCsll: 0.0228 },
                  ]

                  arrCalculoIrCs.forEach(item => {
                      const valor1 = item.valorAR * item.aliquota
                      const adicional = valor1 > 20000 ? ((valor1 - 20000) * 0.1) : 0
                      const irpjCsll = item.valorAR * item.aliquotaIrpjCsll
                      const irCsARAtual = irpjCsll + adicional
                      irCsAR += irCsARAtual

                  })

              }else{
                  irCsAR = 0
              }
              respostaFinalCalculo[chaveRegimeObjFinal].dre.irCs.antesReforma.valor = irCsAR

                // Lucro Líquido
              const lucroLiquidoAR = lucroAntesIrCsAR - irCsAR
              respostaFinalCalculo[chaveRegimeObjFinal].dre.lucroLiquido.antesReforma.valor = lucroLiquidoAR
                

              // ***** CONTINUANDO A TABELA CAIXA AR... *****

                // tributos recolhidos
              const tributosRecolhidosAR = ((tributosDebitoAR - tributosCreditoAR) > 0 ? (tributosDebitoAR - tributosCreditoAR) : 0)
              tabelaCaixa.tributosRecolhidos.antesReforma.valor = tributosRecolhidosAR

                // Saldo Credor
              const saldoCredorAR = ((tributosCreditoAR - tributosDebitoAR) > 0 ? (tributosCreditoAR - tributosDebitoAR) : 0)
              tabelaCaixa.saldoCredor.antesReforma.valor = saldoCredorAR

                // Resultado
              const resultadoCaixaAR = tabelaCaixa.clientes.antesReforma.valor - tabelaCaixa.fornecedores.antesReforma.valor + tabelaCaixa.tributosCredito.antesReforma.valor - tabelaCaixa.tributosDebito.antesReforma.valor
              tabelaCaixa.resultado.antesReforma.valor = resultadoCaixaAR

                // Resultado Sobre Clientes
              const resultadoSobreClientesAR = tabelaCaixa.clientes.antesReforma.valor ? (resultadoCaixaAR / tabelaCaixa.clientes.antesReforma.valor) : 0
              tabelaCaixa.resultadoSobreClientes.antesReforma.valor = resultadoSobreClientesAR

                // Resultado Pos Ir/Cs
              const resultadoPosIrCsAR = resultadoCaixaAR - irCsAR
              tabelaCaixa.resultadoPosIrCs.antesReforma.valor = resultadoPosIrCsAR

              // TABELAS TRANSIÇÃO (DR)
              arrAnos.forEach(anoAtual => {
                  
                // ***** TABELA CAIXA TRANSIÇÃO *****
                const tabelaComprasTotalAnoAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma.filter(item => item.ano == anoAtual)
                const tabelaVendasTotalAnoAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma.filter(item => item.ano == anoAtual)

                // fornecedores
                const objLinhaFornecedoresAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: tabelaComprasTotalAnoAtual[0].valor}
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.fornecedores.depoisReforma.push(objLinhaFornecedoresAnoAtual)

                // tributos crédito
                const objLinhaTributosCreditoAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: tabelaComprasTotalAnoAtual[0].credito}
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.tributosCredito.depoisReforma.push(objLinhaTributosCreditoAnoAtual)
                // antigo tributosCreditoDR
                const tributosCreditoAtual = objLinhaTributosCreditoAnoAtual.valor

                // Clientes
                const objLinhaClientesAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: tabelaVendasTotalAnoAtual[0].valor}
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.clientes.depoisReforma.push(objLinhaClientesAnoAtual)
                //antigo valorVendaDR
                const valorVendaAtual = objLinhaClientesAnoAtual.valor

                // tributos Debito
                const objLinhaTributosDebitoAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: tabelaVendasTotalAnoAtual[0].impostos}
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.tributosDebito.depoisReforma.push(objLinhaTributosDebitoAnoAtual)
                // antigo tributosDebitoDR
                let tributosDebitoAtual = objLinhaTributosDebitoAnoAtual.valor
                    
                

                // ***** TABELA DRE TRANSIÇÃO *****

                  // Receita Bruta (valores de cada ano sem o IVA, apenas com os impostos remanescentes na transição)
                const valorVendaSemIvaAtual = tabelaVendasTotalAnoAtual[0].valorSemIva
                const objLinhaReceitaBrutaAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: valorVendaSemIvaAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].dre.receitaBruta.depoisReforma.push(objLinhaReceitaBrutaAnoAtual)

                  //Deduções Tributos
                const objLinhaDeducoesTributosAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: 0}
                if(regimeAtual == "Simples Nacional"){
                    objLinhaDeducoesTributosAnoAtual.valor = valorImpostosPermanecerTotal
                }else if(regimeAtual == "Lucro Presumido" || regimeAtual == "Lucro Real"){
                    objLinhaDeducoesTributosAnoAtual.valor = 0
                }
                respostaFinalCalculo[chaveRegimeObjFinal].dre.deducoesTributos.depoisReforma.push(objLinhaDeducoesTributosAnoAtual)
                // antigo deducoesTributosDR
                const deducoesTributosAtual = objLinhaDeducoesTributosAnoAtual.valor

                  //Custo Geral
                const objCustoGeralAtual = dreCustoGeralTransicao.find(item => item.ano == anoAtual)
                let dreCustoGeralAtual = 0
                if(objCustoGeralAtual){
                  const objLinhaCustoGeralAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: objCustoGeralAtual.custoGeralAnoVigente}
                  respostaFinalCalculo[chaveRegimeObjFinal].dre.custoGeral.depoisReforma.push(objLinhaCustoGeralAnoAtual)
                  //  antigo dreCustoGeralDR
                  dreCustoGeralAtual = objLinhaCustoGeralAnoAtual.valor
                }
                

                  // Despesas
                const objDespesasAtual = dreDespesasTransicao.find(item => item.ano == anoAtual)
                let dreDespesasAtual = 0
                if(objDespesasAtual){
                  const objLinhaDespesasAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: objDespesasAtual.despesaAnoVigente}
                  respostaFinalCalculo[chaveRegimeObjFinal].dre.despesas.depoisReforma.push(objLinhaDespesasAnoAtual)
                  //  antigo dreDespesasDR
                  dreDespesasAtual = objLinhaDespesasAnoAtual.valor
                }


                  //  Lucro Bruto
                const objLinhaLucroBrutoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: valorVendaSemIvaAtual - deducoesTributosAtual - dreCustoGeralAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].dre.lucroBruto.depoisReforma.push(objLinhaLucroBrutoAtual)

                  // Lucro Antes IR/CS (Lucro Antes IR/CS = Receita Bruta - Deduções Tributos - Custo Mercadoria - Despesas)
                  // antigo lucroAntesIrCsDR
                const lucroAntesIrCsAtual = valorVendaSemIvaAtual - deducoesTributosAtual - dreCustoGeralAtual - dreDespesasAtual
                const objLinhaLucroAntesIrCsAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: lucroAntesIrCsAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].dre.lucrosAntesIrCs.depoisReforma.push(objLinhaLucroAntesIrCsAnoAtual)


                  // IR/CS
                  //antigo irCsDR
                let irCsAtual = 0
                    
                if(regimeAtual == "Lucro Real"){
                    // DR
                    if(lucroAntesIrCsAtual > 0){
                      const valor1 = lucroAntesIrCsAtual * 0.24
                      const adicional = lucroAntesIrCsAtual > 20000 ? (lucroAntesIrCsAtual - 20000) * 0.1 : 0

                      irCsAtual = valor1 + adicional

                    }else{
                      irCsAtual = 0
                    }

                }else if(regimeAtual == "Lucro Presumido"){
                    const valorTotalServicosPrestadosAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.antesReforma.valorAR
                    const valorSemIvaServicosPrestados = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.servicosPrestados.depoisReforma.find(item => item.ano == anoAtual)?.valorSemIva

                    const valorTotalLocacaoMoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.antesReforma.valorAR
                    const valorTotalLocacaoImoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.antesReforma.valorAR
                    const valorTotalLocacaoAR = valorTotalLocacaoImoveisAR + valorTotalLocacaoMoveisAR

                    const valorSemIvaLocacaoMoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoMoveis.depoisReforma.find(item => item.ano == anoAtual)?.valorSemIva
                    const valorSemIvaLocacaoImoveisAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.locacaoImoveis.depoisReforma.find(item => item.ano == anoAtual)?.valorSemIva
                    const valorSemIvaLocacaoAR = (valorSemIvaLocacaoImoveisAR ? valorSemIvaLocacaoImoveisAR : 0) + (valorSemIvaLocacaoMoveisAR ? valorSemIvaLocacaoMoveisAR : 0)

                    const valorTotalProdutosVendidosAR = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.antesReforma.valorAR
                    const valorSemIvaProdutosVendidos = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.vendasProdutos.depoisReforma.find(item => item.ano == anoAtual)?.valorSemIva

                    const arrCalculoIrCs: {valorAR: number, valorDesonerado: number, aliquota: number, aliquotaIrpjCsll: number}[] = [
                      {valorAR: valorTotalServicosPrestadosAR, valorDesonerado: valorSemIvaServicosPrestados ? valorSemIvaServicosPrestados : 0 , aliquota: 0.32, aliquotaIrpjCsll: 0.0768 },
                      {valorAR: valorTotalLocacaoAR, valorDesonerado: valorSemIvaLocacaoAR, aliquota: 0.32, aliquotaIrpjCsll: 0.0768 },
                      {valorAR: valorTotalProdutosVendidosAR, valorDesonerado: valorSemIvaProdutosVendidos ? valorSemIvaProdutosVendidos : 0, aliquota: 0.08, aliquotaIrpjCsll: 0.0228 },
                    ]

                    arrCalculoIrCs.forEach(item => {
                        const valor1Desonerado = item.valorDesonerado * item.aliquota
                        const adicionalDR = valor1Desonerado > 20000 ? ((valor1Desonerado - 20000) * 0.1) : 0
                        const irpjCsllDR = item.valorDesonerado * item.aliquotaIrpjCsll
                        const irCsAtualPorArea = irpjCsllDR + adicionalDR
                        irCsAtual += irCsAtualPorArea
                    })

                }else{
                    irCsAtual = 0
                }
                const objLinhaIrCsAnoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: irCsAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].dre.irCs.depoisReforma.push(objLinhaIrCsAnoAtual)
            

                  // Lucro Líquido
                  // antigo lucroLiquidoDR
                const lucroLiquidoAtual = lucroAntesIrCsAtual - irCsAtual
                const objLinhaLucroLiquidoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: lucroLiquidoAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].dre.lucroLiquido.depoisReforma.push(objLinhaLucroLiquidoAtual)


                // ***** CONTINUANDO TABELA CAIXA DR... *****

                //Todas as contas com tributosDebitoDR preciso fazer depois de terminar a DRE, pois em caso de simples nacional, preciso somar o valor do deducoesTributosDR ao tributoDebitoDr
            
                if(regimeAtual == "Simples Nacional"){ 
                    tributosDebitoAtual += deducoesTributosAtual
                    const objFinalAnoAtualTributosDebito = respostaFinalCalculo[chaveRegimeObjFinal].caixa.tributosDebito.depoisReforma.find(item => item.ano == anoAtual)
                    if(objFinalAnoAtualTributosDebito){
                      objFinalAnoAtualTributosDebito.valor = tributosDebitoAtual
                    }
                }


                  // Tributos Recolhidos
                const tributosRecolhidosAtual = ((tributosDebitoAtual - tributosCreditoAtual) > 0 ? (tributosDebitoAtual - tributosCreditoAtual) : 0)
                const objLinhaTributosRecolhidosAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: tributosRecolhidosAtual} 
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.tributosRecolhidos.depoisReforma.push(objLinhaTributosRecolhidosAtual)

                  //Saldo Credor
                const saldoCredorAtual = ((tributosCreditoAtual - tributosDebitoAtual) > 0 ? (tributosCreditoAtual - tributosDebitoAtual) : 0)
                const objLinhaSaldoCredorAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: saldoCredorAtual}
                respostaFinalCalculo[chaveRegimeObjFinal].caixa.saldoCredor.depoisReforma.push(objLinhaSaldoCredorAtual)


                  // Resultado 
                const clientesAnoAtual = tabelaCaixa.clientes.depoisReforma.find(item => item.ano == anoAtual) 
                const fornecedoresAnoAtual = tabelaCaixa.fornecedores.depoisReforma.find(item => item.ano == anoAtual) 
                const tributosCreditoAnoAtual = tabelaCaixa.tributosCredito.depoisReforma.find(item => item.ano == anoAtual) 
                const tributosDebitoAnoAtual = tabelaCaixa.tributosDebito.depoisReforma.find(item => item.ano == anoAtual) 

                const resultadoCaixaAtual = (clientesAnoAtual ? clientesAnoAtual.valor : 0) - (fornecedoresAnoAtual ? fornecedoresAnoAtual.valor : 0) + (tributosCreditoAnoAtual ? tributosCreditoAnoAtual.valor : 0) - (tributosDebitoAnoAtual ? tributosDebitoAnoAtual.valor : 0)
                const objLinhaResultadoAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: resultadoCaixaAtual}
                tabelaCaixa.resultado.depoisReforma.push(objLinhaResultadoAtual)

                  // Resultado Sobre Clientes
                const resultadoSobreClientesAtual = (clientesAnoAtual ? (clientesAnoAtual.valor ? (resultadoCaixaAtual / clientesAnoAtual.valor) : 0) : 0)
                const objLinhaResultadoSobreClientesAtual: objDepoisReformaDreCaixa = {ano: anoAtual, valor: resultadoSobreClientesAtual}
                tabelaCaixa.resultadoSobreClientes.depoisReforma.push(objLinhaResultadoSobreClientesAtual)

                  //Resultado Pos Ircs
                const resultadoPosIrCsAtual = resultadoCaixaAtual - irCsAtual
                const objLinhaResultadoPosIrCs: objDepoisReformaDreCaixa = {ano: anoAtual, valor: resultadoPosIrCsAtual}
                tabelaCaixa.resultadoPosIrCs.depoisReforma.push(objLinhaResultadoPosIrCs)

              })

              // Antes de passar para o próximo regime, preciso salvar as tabelas do regime atual no banco de dados

              // TABELA VENDAS
                // Antes Reforma
              // Antes de salvar preciso popular a linha "total" que vai para o banco de dados
              const antesReformaVendasId = uuidv4()
              const objLinhaVendasId = await respTabelasRepo.pegarIdVendaPorLinha("total")
              const linhaVendasId = objLinhaVendasId?.id
              // popular o obj que vai para a estrutura da tabela vendas banco de dados
              const objTotalVendasAR = criarARVendas({
                calculoId,
                regimeId,
                valor: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorAR,
                desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.valorDesonerado,
                impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.impostosAR,
                id: antesReformaVendasId,
                linhaVendasId: linhaVendasId,
                porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.antesReforma.porcentagemCargaTributariaAR
              })
              // adicionar o obj da linha total atualizado acima na estrutura que será enviada para o banco
              estruturaDbAntesReformaVendas.push(objTotalVendasAR)    
              // Salvando de fato no banco
              await respTabelasRepo.salvarTabelaVendasAR(estruturaDbAntesReformaVendas)

                // Depois Reforma
              const arrDRVendasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalVendas.total.depoisReforma
              arrDRVendasCategoriaAtual.forEach((objAnoDRAtual) => {
                const objTotalVendasDR = criarDRVendas({
                  // pegando o antesReformaVendasId do total antes reforma calculado logo acima
                  antesReformaId: antesReformaVendasId,
                  ano: objAnoDRAtual.ano,
                  impostos: objAnoDRAtual.impostos,
                  valor: objAnoDRAtual.valor,
                  valorSemIva: objAnoDRAtual.valorSemIva,
                  porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                })
                estruturaDbDepoisReformaVendas.push(objTotalVendasDR)
              })
              // Salvando de fato no banco
              await respTabelasRepo.salvarTabelaVendasDR(estruturaDbDepoisReformaVendas)


              // TABELA COMPRAS
                // Antes Reforma
              // Antes de salvar preciso popular a linha "total" que vai para o banco de dados
              const antesReformaComprasId = uuidv4()
              const objLinhaComprasId = await respTabelasRepo.pegarIdComprasPorLinha("total")
              const linhaComprasId = objLinhaComprasId?.id
              // popular o obj que compras que vai para o banco de dados
              const objTotalComprasAR = criarARCompras({
                calculoId,
                regimeId,
                valor: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorAR,
                desonerado: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.valorDesonerado,
                impostos: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.impostosAR,
                id: antesReformaComprasId,
                linhaComprasId: linhaComprasId,
                credito: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.creditoAR,
                custo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.custoAR,
                porcentagemCustoEfetivo: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCustoEfetivoAR,
                porcentagemCargaTributaria: respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.antesReforma.porcentagemCargaTributariaAR
              })
              // adicionar o obj da linha total atualizado acima na estrutura que será enviada para o banco
              estruturaDbAntesReformaCompras.push(objTotalComprasAR)    
              // Salvando de fato no banco
              await respTabelasRepo.salvarTabelaComprasAR(estruturaDbAntesReformaCompras)

                // Depois Reforma
              const arrDRComprasCategoriaAtual = respostaFinalCalculo[chaveRegimeObjFinal].totalCompras.total.depoisReforma
              arrDRComprasCategoriaAtual.forEach((objAnoDRAtual) => {
                const objTotalComprasDR = criarDRCompras({
                  antesReformaId: antesReformaComprasId,
                  ano: objAnoDRAtual.ano,
                  impostos: objAnoDRAtual.impostos,
                  valor: objAnoDRAtual.valor,
                  valorSemIva: objAnoDRAtual.valorSemIva,
                  credito: objAnoDRAtual.credito,
                  custo: objAnoDRAtual.custo,
                  porcentagemCustoEfetivo: objAnoDRAtual.porcentagemCustoEfetivo,
                  porcentagemCargaTributaria: objAnoDRAtual.porcentagemCargaTributaria
                })
                estruturaDbDepoisReformaCompras.push(objTotalComprasDR)
              })
              // Salvando de fato no banco
              await respTabelasRepo.salvarTabelaComprasDR(estruturaDbDepoisReformaCompras)


              // Colocando TABELA CAIXA no banco de dados
              const objCaixa = respostaFinalCalculo[chaveRegimeObjFinal].caixa
              for(const [linhaCaixaAtual, valorLinha] of Object.entries(objCaixa)){
                  // Antes Reforma
                // Como eu tenho certeza que as propriedades do obj da tabela caixa são exatamente iguais os possiveis valores da coluna linha_caixa, eu forço isso no TypeScript com o "as LinhasCaixaType"
                const objIdLinhaCaixaAtual = await respTabelasRepo.pegarIdCaixaPorLinha(linhaCaixaAtual as LinhasCaixaType) 
                const idLinhaCaixaAtual = objIdLinhaCaixaAtual?.id
                const antesReformaCaixaId = uuidv4()
                // popular o obj que vai para a estrutura que vai pro banco de dados
                const objCaixaLinhaAtualAR = criarARCaixa({
                  calculoId,
                  regimeId,
                  id: antesReformaCaixaId,
                  linhaCaixaId: idLinhaCaixaAtual,
                  valor: valorLinha.antesReforma.valor
                })
                estruturaDbAntesReformaCaixa.push(objCaixaLinhaAtualAR)

                  // Depois Reforma
                // Como aqui estamos iterando em cada linha da tabela caixa, cada linha tem um depoisReforma, que é um array de objetos DR, vamos chegar nesse valor, para iterar em cima dele para adicionarmos cada um desses objetos na tabela DepoisReformaCaixax
                const arrDRCaixaLinhaAtual = valorLinha.depoisReforma
                arrDRCaixaLinhaAtual.forEach((objAnoDRAtual) => {
                  // Aqui já temos cada obj DR, pra cada um queremos fazer um objeto com a função criarDRCaixa que já está pronto pra ser enviado ao banco
                  const objCaixaLinhaAtualDR = criarDRCaixa({
                    antesReformaCaixaId,
                    ano: objAnoDRAtual.ano,
                    valor: objAnoDRAtual.valor
                  })
                  estruturaDbDepoisReformaCaixa.push(objCaixaLinhaAtualDR)
                })
              }

              // Salvando de fato no banco
              try{
                await respTabelasRepo.salvarTabelaCaixaAR(estruturaDbAntesReformaCaixa)
                await respTabelasRepo.salvarTabelaCaixaDR(estruturaDbDepoisReformaCaixa)
              }catch(err){
                console.log("ERRO NO SALVAMENTO DA TABELA CAIXA")
                console.log(err)
              }


              // Colocando TABELA DRE no banco de dados
              const objDre = respostaFinalCalculo[chaveRegimeObjFinal].dre
              for(const [linhaDreAtual, valorLinha] of Object.entries(objDre)){
                  // Antes Reforma
                // Como eu tenho certeza que as propriedades do obj da tabela caixa são exatamente iguais os possiveis valores da coluna linha_caixa, eu forço isso no TypeScript com o "as LinhasCaixaType"
                const objIdLinhaDreAtual = await respTabelasRepo.pegarIdDrePorLinha(linhaDreAtual as LinhasDreType)
                const idLinhaDreAtual = objIdLinhaDreAtual?.id
                const antesReformaDreId = uuidv4()
                // popular o obj que vai pra estrutura que vai pro banco de dados
                const objDreLinhaAtualAR = criarARDre({
                  calculoId,
                  regimeId,
                  id: antesReformaDreId,
                  linhaDreId: idLinhaDreAtual,
                  valor: valorLinha.antesReforma.valor
                })
                estruturaDbAntesReformaDre.push(objDreLinhaAtualAR)

                  // Depois Reforma
                const arrDRDreLinhaAtual = valorLinha.depoisReforma
                arrDRDreLinhaAtual.forEach((objAnoDRAtual) => {
                  const objDreLinhaAtualDR = criarDRDre({
                    antesReformaDreId,
                    ano: objAnoDRAtual.ano,
                    valor: objAnoDRAtual.valor
                  })
                  estruturaDbDepoisReformaDre.push(objDreLinhaAtualDR)

                })
              }
              // Salvando de fato no banco
              try{
                await respTabelasRepo.salvarTabelaDreAR(estruturaDbAntesReformaDre)
                await respTabelasRepo.salvarTabelaDreDR(estruturaDbDepoisReformaDre)
              }catch(err){
                console.log("Erro no salvamento da TABELA DRE")
                console.log(err)
              }


          }

          


          return respostaFinalCalculo


    }

}