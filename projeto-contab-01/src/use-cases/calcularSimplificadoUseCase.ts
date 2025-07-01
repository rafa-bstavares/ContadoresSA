import * as XLSX from 'xlsx';
import path from 'path';
import { EmpresasRepository } from "../repositories/empresas-repository";
import { RegimeTributario } from '@prisma/client';

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

export type aliquotasParametrosBodyType = {iss: number | null, icms: number | null, pisCo: number | null, ipi: number | null}

export type objParametrosEntradaBodyType = {
    industrial: aliquotasParametrosBodyType,
    servicos: aliquotasParametrosBodyType,
    comercial: aliquotasParametrosBodyType,
    locacao: aliquotasParametrosBodyType
}

interface parametrosEntrada {
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

interface ImoveisLocacaoObj {
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

interface MoveisLocacaoObj {
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

interface ImoveisCompraVendaObj {
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

export interface ProdutoVendidoObj {
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
    id: number
}

type MetodoAdquiridoType = "Por Operação" | "Por CNPJ"

type TipoOperacaoAdquiridoType = "Consumo" | "Insumo" | "Alimentação" | "Imobilizado" | "Revenda"

export interface ProdutoAdquiridoObj {
    metodo: MetodoAdquiridoType,
    tipoOperacao: TipoOperacaoAdquiridoType | "",
    valorOperacao: number,
    ncm: string,
    aliquotas: aliquotasParametrosBodyType,
    creditoIcms: boolean,
    creditoPisCofins: boolean,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
    manterBeneficio: boolean,
    descricaoAnexo: string,
    id: number
}

interface respostaTotalType {
  servicosPrestados: objRespostaServicosPrestados[],
  servicosTomados: any[]
}

type tiposRegime = "Simples Nacional" | "Lucro Real" | "Lucro Presumido" | "Pessoa Fisica" | ""

export class calcularSimplificadoUseCase{

    

    constructor( private EmpresaRepository: EmpresasRepository, private cpfOuCnpj: string, private totalAtividades: objAtividadeFinal[], private parametrosEntrada: parametrosEntrada, private totalAtividadesAdquiridas: objAtividadesAdquitidasType[], private totalImoveisLocacao: ImoveisLocacaoObj[], private totalImoveisCompraVenda: ImoveisCompraVendaObj[], private totalMoveisLocacao: MoveisLocacaoObj[], private totalProdutosVendidos: ProdutoVendidoObj[], private totalProdutosAdquiridos: ProdutoAdquiridoObj[], private meuRegime: tiposRegime){}

    async execute(){

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


          const cnpj = this.cpfOuCnpj
          console.log("cnpj: " + cnpj)
  
          const dadosEmpresaAtual = await this.EmpresaRepository.buscarEmpresa(cnpj)

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


          type objAreaComprasType = {
              valorAR: number,
              impostosAR: number,
              valorDesonerado: number,
              creditoAR: number, 
              custoAR: number,
              porcentagemCustoEfetivoAR: number,
              porcentagemCargaTributariaAR: number,
              valorDR: number,
              impostosDR: number,
              creditoDR: number,
              custoDR: number,
              porcentagemCustoEfetivoDR: number,
              porcentagemCargaTributariaDR: number,
          }

          type objAreaVendasType = {
              valorAR: number,
              impostosAR: number,
              valorDesonerado: number,
              porcentagemCargaTributariaAR: number,
              valorDR: number,
              impostosDR: number,
              porcentagemCargaTributariaDR: number,
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


          type objAntesReforma = {
              valor: number, 
              valorImpostos: number,
              valorDesonerado: number,
              porcentagemCargaTributaria: number,
              custo: number | null, 
          } 
          
          type objDepoisReforma = {
             ano: string,
             valor: number,
             valorImpostos: number,
             porcentagemCargaTributaria: number,
             custo: number | null
          }

          type objItemFinal = {
            antesReforma: objAntesReforma,
            depoisReforma: objDepoisReforma[]
          }    
          
          type linhaArDrDiferencas = {AR: number, DR: number, diferencaReais: number, diferencaPercentual: number}

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

          type objRespostaFinalType = {
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

          let respostaFinalCalculo: objRespostaFinalType = {
              servicosPrestados: [],
              servicosTomados: [],
              locacaoBensMoveis: [],
              produtosVendidos: [],
              produtosAdquiridos: [],
              locacaoBensImoveis: [],
              compraVendaBensImoveis: [],
              totalCompras: {
                  comprasProdutos: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    creditoAR: 0,
                    custoAR: 0, 
                    porcentagemCustoEfetivoAR: 0,
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    creditoDR: 0,
                    custoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  servicosTomados: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    creditoAR: 0,
                    custoAR: 0, 
                    porcentagemCargaTributariaAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    creditoDR: 0,
                    custoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoMoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    creditoAR: 0,
                    custoAR: 0, 
                    porcentagemCargaTributariaAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    creditoDR: 0,
                    custoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoImoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    creditoAR: 0,
                    custoAR: 0, 
                    porcentagemCargaTributariaAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    creditoDR: 0,
                    custoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  total: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0,
                    creditoAR: 0,
                    custoAR: 0, 
                    porcentagemCargaTributariaAR: 0,
                    porcentagemCustoEfetivoAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    creditoDR: 0,
                    custoDR: 0,
                    porcentagemCustoEfetivoDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
              },
              totalVendas: {
                  vendasProdutos: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  servicosPrestados: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoMoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  locacaoImoveis: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
                  total: {
                    valorAR: 0,
                    impostosAR: 0,
                    valorDesonerado: 0, 
                    porcentagemCargaTributariaAR: 0,
                    valorDR: 0,
                    impostosDR: 0,
                    porcentagemCargaTributariaDR: 0,   
                  },
              },
              dre: {
                receitaBruta: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                deducoesTributos: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                custoGeral: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucroBruto: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                despesas: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucrosAntesIrCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                irCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                lucroLiquido: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
              },
              caixa: {
                fornecedores: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosCredito: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                clientes: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosDebito: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                tributosRecolhidos: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                saldoCredor: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultado: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                irCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultadoPosIrCs: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
                resultadoSobreClientes: {AR: 0, DR: 0, diferencaReais: 0, diferencaPercentual: 0},
              }
          }      


          let dreCustoGeralAR = 0
          let dreCustoGeralDR = 0
          let dreDespesasAR = 0
          let dreDespesasDR = 0
          let valorImpostosPermanecerTotal = 0


          // Total Atividades == Total Atividades (serviços) Prestadas
          if(totalAtividades.length > 0){

            // faturamentoMensal -> Faturamento mensal da empresa (que deve ser substituido por dadosEmpresaAtual.faturamento_medio_mensal)
            // faturamentoMensalServico -> Faturamento mensal com o serviço específico que está sendo analisado no momento

              if(meuRegime == "Simples Nacional"){
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
        
                            const valorIvaBruto = faturamentoMensalDesonerado * ivaBruto
                            const valorIbsBruto = faturamentoMensalDesonerado * ibsBruto
                            const valorCbsBruto = faturamentoMensalDesonerado * cbsBruto
        
                            if(item.anexo == "I" || item.anexo == "II"){
                              // Se cair aqui é pq é comércio/indústria e tem tanto CNAE quanto NCM 
        
        
                            }else{
        
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
                      meuRegime: "Simples Nacional", 
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

                    const respServicoPrestadoAtual: objItemFinal = {
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
                    }

                    respostaFinalCalculo.servicosPrestados.push(respServicoPrestadoAtual)

                    // Somar para tabela vendas
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorAR += faturamentoMensalServico
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado += faturamentoMensalDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDR += valorMensalServicoAposReforma
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado   
                    
                    // Completando linha total
                    respostaFinalCalculo.totalVendas.total.valorAR += faturamentoMensalServico
                    respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.total.valorDesonerado += faturamentoMensalDesonerado
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.total.valorDR += valorMensalServicoAposReforma
                    respostaFinalCalculo.totalVendas.total.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado        

                })
              }else if(meuRegime == 'Lucro Presumido'){
                  // Prestação de serviços lucro presumido
                  const pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                  const iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0

                  const aliquotaDesonerada = pisCo + iss



                totalAtividades.map(atividade => {

                  //CONFERIR REDUÇÃO IVA CNAE

                  let reducaoIva = 0

                  let aliquotaEfetivaIva = ivaBruto
                  let aliquotaEfetivaIbs = ibsBruto
                  let aliquotaEfetivaCbs = cbsBruto
                  const faturamentoMensalAtividade = atividade.faturamentoMensal
                  const valorImpostosAtuais = (faturamentoMensalAtividade * aliquotaDesonerada)

                  // Conferir se tem benefício
                  if(atividade.beneficio){
                    // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                    reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                    aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                    aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                    aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                  }


                  const faturamentoDesonerado = faturamentoMensalAtividade - valorImpostosAtuais
                  const porcentagemCargaTributariaAtual = valorImpostosAtuais / faturamentoDesonerado

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

                   const respServicoPrestadoAtual: objItemFinal = {
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
                    }
        
                    respostaFinalCalculo.servicosPrestados.push(respServicoPrestadoAtual)

                    respostaFinalCalculo.totalVendas.servicosPrestados.valorAR += faturamentoMensalAtividade
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado += faturamentoDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDR += novoValorServiço
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado      


                    respostaFinalCalculo.totalVendas.total.valorAR += faturamentoMensalAtividade
                    respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.total.valorDesonerado += faturamentoDesonerado
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.total.valorDR += novoValorServiço
                    respostaFinalCalculo.totalVendas.total.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado 
                })
                




              }else if(meuRegime == 'Lucro Real'){
                  // Prestação de serviços lucro real

                  const pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                  const iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0

                  const aliquotaDesonerada = pisCo + iss



                totalAtividades.map(atividade => {

                    //CONFERIR REDUÇÃO IVA CNAE

                    let reducaoIva = 0

                    let aliquotaEfetivaIva = ivaBruto
                    let aliquotaEfetivaIbs = ibsBruto
                    let aliquotaEfetivaCbs = cbsBruto
                    const faturamentoMensalAtividade = atividade.faturamentoMensal
                    const valorImpostosAtuais = (faturamentoMensalAtividade * aliquotaDesonerada)

                    // Conferir se tem benefício
                    if(atividade.beneficio){
                      // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                      reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                      aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                      aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                      aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                    }

                  const faturamentoDesonerado = faturamentoMensalAtividade - valorImpostosAtuais
                  const porcentagemCargaTributariaAtual = valorImpostosAtuais / faturamentoDesonerado

                  const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva
                  const porcentagemCargaTributariaAposReforma = valorImpostosNovos / faturamentoDesonerado

                  const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                  console.log("impostos desonerados: " + (faturamentoMensalAtividade - faturamentoDesonerado))

                  console.log("Valor IBS: " + (aliquotaEfetivaIbs * faturamentoDesonerado))
                  console.log("Valor CBS: " + (aliquotaEfetivaCbs * faturamentoDesonerado))

                  console.log("novo valor do serviço: " + novoValorServiço)

                   const respServicoPrestadoAtual: objItemFinal = {
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
                    }

                    respostaFinalCalculo.servicosPrestados.push(respServicoPrestadoAtual)

                    respostaFinalCalculo.totalVendas.servicosPrestados.valorAR += faturamentoMensalAtividade
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado += faturamentoDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.servicosPrestados.valorDR += novoValorServiço
                    respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.servicosPrestados.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado     
                    
                    respostaFinalCalculo.totalVendas.total.valorAR += faturamentoMensalAtividade
                    respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalVendas.total.valorDesonerado += faturamentoDesonerado
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosAR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado
                    respostaFinalCalculo.totalVendas.total.valorDR += novoValorServiço
                    respostaFinalCalculo.totalVendas.total.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.servicosPrestados.impostosDR / respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado  


                })

              }
          }


          // SERVIÇOS TOMADOS
          if(totalAtividadesAdquiridas.length > 0){
              console.log("////////////////////////")
              console.log("Análise Serviços adquiridos")

              const iss = this.parametrosEntrada.tabelaSimplesNacional.servicos.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.iss / 100 : 0
              const icms = this.parametrosEntrada.tabelaSimplesNacional.servicos.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.icms / 100 : 0
              const ipi = this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.ipi / 100 : 0
              const pisCo = this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo / 100 : 0
              const ibsBruto = this.parametrosEntrada.aliquotaIbs / 100
              const cbsBruto = this.parametrosEntrada.aliquotaCbs / 100
              const ivaBruto = this.parametrosEntrada.aliquotaIva / 100

              // Soma aliquotas dos parametros de entrada
              let aliquotaDesonerada = 0



              totalAtividadesAdquiridas.forEach((atividade, index) => {

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

                    valorServicoAR = atividade.faturamento

                    console.log("MÉTODO ATUAL:")
                    console.log(atividade.metodo)
                    if(atividade.metodo == "Por CNPJ"){

                      aliquotaDesonerada = iss + icms + ipi + pisCo

                      valorServicoDesonerado = valorServicoAR - (valorServicoAR * aliquotaDesonerada)
                      // Caso método == cnpj
                      
                      // Conferir se tem benefício
                      if(atividade.beneficio){
                        // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                        reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                        aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                        aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                        aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                      }



                    }else{
                      // método é operação, aplicar redução da operação específica nas alíquotas
                      console.log("Método: por operação")

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

                      // Encontrando a linha que corresponde a operação da atividade atual
                      const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)

                      if(objOperacaoAtual){

                        if(objOperacaoAtual.colunaParametros == "comercio"){
                          const pisCofinsComercio = this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo / 100 : 0
                          const icmsComercio = this.parametrosEntrada.tabelaSimplesNacional.comercial.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.icms / 100 : 0
                          aliquotaDesonerada = pisCofinsComercio + icmsComercio
                              console.log("eentrou comercio")
                        }else if(objOperacaoAtual.colunaParametros == "serviços"){
                          const pisCofinsServico = this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo / 100 : 0
                          const issServico = this.parametrosEntrada.tabelaSimplesNacional.servicos.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.iss / 100 : 0
                              console.log("eentrou comercio")
                          aliquotaDesonerada = pisCofinsServico + issServico
                        }

                        console.log("aliquota desonerada utilizada objOperacaoAtual")
                        console.log(aliquotaDesonerada)


                        reducaoIva = objOperacaoAtual.reducao

                          aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)

                          aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)

                          aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                      }else{
                        console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                      }


                      // Como a atividade (regime do outro) é do SIMPLES NACIONAL
                      
                  
                    }

                    valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                    valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                    porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado

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


                    // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                    custoAR = valorServicoAR
                    if(meuRegime == "Lucro Real"){
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
                    custoDR = valorServicoDesonerado
                    creditoDR = valorImpostosNovos

                    console.log("Seu novo custo será: " + custoDR
                    )



                  }else{

                    if(atividade.regimeTributario == "Lucro Presumido"){
                        console.log("atividade " + (index + 1) + " é do lucro presumido")
                        // LUCRO PRESUMIDO
                        const pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                        const iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0

                        let aliquotaDesonerada = 0

                      
                        //CONFERIR REDUÇÃO IVA CNAE

                        let reducaoIva = 0
        
                        let aliquotaEfetivaIva = ivaBruto 
                        let aliquotaEfetivaIbs = ibsBruto
                        let aliquotaEfetivaCbs = cbsBruto
                        valorServicoAR = atividade.faturamento

                        // Se cair aqui é pq é serviço, tem só CNAE
                        console.log("MÉTODO ATUAL:")
                        console.log(atividade.metodo)
                        if(atividade.metodo == "Por CNPJ"){
                          // Caso método == cnpj
                          
                          aliquotaDesonerada = pisCo + iss
                          valorServicoDesonerado = valorServicoAR - (valorServicoAR * aliquotaDesonerada)
                          
                          // Conferir se tem beneficio
                          if(atividade.beneficio){
                            // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                            reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                            aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                            aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                            aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                          }

                        }else{
                          // método é operação, aplicar redução da operação específica nas alíquotas

                          console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")

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

                          const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                          if(objOperacaoAtual){



                            if(objOperacaoAtual.colunaParametros == "comercio"){
                              const pisCofinsComercio = this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo / 100 : 0
                              const issComercio = this.parametrosEntrada.tabelaLucroPresumido.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.iss / 100 : 0
                            console.log("eentrou comercio")
                              aliquotaDesonerada = pisCofinsComercio + issComercio
                            }else if(objOperacaoAtual.colunaParametros == "serviços"){
                              const pisCofinsServico = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                              const issServico = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0
                            console.log("eentrou comercio")
                              aliquotaDesonerada = pisCofinsServico + issServico
                            }

                            console.log("aliquota desonerada utilizada objOperacaoAtual")
                            console.log(aliquotaDesonerada)

                            reducaoIva = objOperacaoAtual.reducao

                              aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)

                              aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)

                              aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                          }else{
                            console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                          }


                        }


                        valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                        valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                        porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado
                        
                        valorImpostosNovos = valorServicoDesonerado * aliquotaEfetivaIva

                        valorMensalServicoDR = valorServicoDesonerado + valorImpostosNovos

                        porcentagemCargaTributariaDR = valorImpostosNovos / valorServicoDesonerado

                        console.log("impostos desonerados: " + (valorServicoAR - valorServicoDesonerado))

                        console.log("Valor IBS: " + (aliquotaEfetivaIbs * valorServicoDesonerado))
                        console.log("Valor CBS: " + (aliquotaEfetivaCbs * valorServicoDesonerado))

                        console.log("novo valor do serviço: " + valorMensalServicoDR)


                        // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                        custoAR = valorServicoAR
                        if(meuRegime == "Lucro Real"){
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

                        console.log("Seu novo custo será: " + custoDR
                        )

                    }else if(atividade.regimeTributario == "Lucro Real"){
                        console.log("atividade " + (index + 1) + " é do lucro real")
                        // LUCRO REAL
                        const pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                        const iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0

                        let aliquotaDesonerada = 0 

                      
                        //CONFERIR REDUÇÃO IVA CNAE

                        let reducaoIva = 0
        
                        let aliquotaEfetivaIva = ivaBruto
                        let aliquotaEfetivaIbs = ibsBruto
                        let aliquotaEfetivaCbs = cbsBruto
                        valorServicoAR = atividade.faturamento

                        // Se cair aqui é pq é serviço, tem só CNAE
                        console.log("MÉTODO ATUAL:")
                        console.log(atividade.metodo)
                        if(atividade.metodo == "Por CNPJ"){
                          // Caso método == cnpj

                          aliquotaDesonerada = pisCo + iss
                          valorServicoDesonerado = valorServicoAR - (valorServicoAR * aliquotaDesonerada)

                          // Conferir se tem beneficio
                          if(atividade.beneficio){
                            reducaoIva = atividade.manterBeneficio ? atividade.beneficio : 0
                            aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                            aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                            aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                          }

                        }else{
                          // método é operação, aplicar redução da operação específica nas alíquotas

                          console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")


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

                          const objOperacaoAtual = operacoesReducoes.find(item => item.operacao == atividade.operacao)
                          if(objOperacaoAtual){

                            if(objOperacaoAtual.colunaParametros == "comercio"){
                              console.log("eentrou comercio")
                              const pisCofinsComercio = this.parametrosEntrada.tabelaLucroReal.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.pisCo / 100 : 0
                              const issComercio = this.parametrosEntrada.tabelaLucroReal.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.iss / 100 : 0
                              aliquotaDesonerada = pisCofinsComercio + issComercio
                            }else if(objOperacaoAtual.colunaParametros == "serviços"){
                              console.log("eentrou serviço")
                              const pisCofinsServico = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                              const issServico = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0
                              aliquotaDesonerada = pisCofinsServico + issServico
                            }

                            console.log("aliquota desonerada do objOperacao")
                            console.log(aliquotaDesonerada)


                            reducaoIva = objOperacaoAtual.reducao

                              aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)

                              aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)

                              aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                          }else{
                            console.log("Não foi encontrado operação com o nome enviado pelo frontend")
                          }


                        }

                      console.log("aliquota desonerada no FINAL SERVICOS TOMADOS")
                      console.log(aliquotaDesonerada)
                      valorImpostosAtuais = (valorServicoAR * aliquotaDesonerada)
                      valorServicoDesonerado = valorServicoAR - valorImpostosAtuais
                      porcentagemCargaTributariaAR = valorImpostosAtuais / valorServicoDesonerado
                      
                      valorImpostosNovos = valorServicoDesonerado * aliquotaEfetivaIva
                      porcentagemCargaTributariaDR = valorImpostosNovos / valorServicoDesonerado

                      valorMensalServicoDR = valorServicoDesonerado + valorImpostosNovos

                      console.log("impostos desonerados: " + (valorServicoAR - valorServicoDesonerado))

                      console.log("Valor IBS: " + (aliquotaEfetivaIbs * valorServicoDesonerado))
                      console.log("Valor CBS: " + (aliquotaEfetivaCbs * valorServicoDesonerado))

                      console.log("novo valor do serviço: " + valorMensalServicoDR)



                      // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                      custoAR = valorServicoAR
                      if(meuRegime == "Lucro Real"){
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

                      console.log("Seu novo custo será: " + custoDR
                      )

                    }


                  }

                   const respServicoPrestadoAtual: objItemFinal = {
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
                    }

                    respostaFinalCalculo.servicosTomados.push(respServicoPrestadoAtual)

                    respostaFinalCalculo.totalCompras.servicosTomados.valorAR += valorServicoAR
                    respostaFinalCalculo.totalCompras.servicosTomados.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalCompras.servicosTomados.valorDesonerado += valorServicoDesonerado
                    respostaFinalCalculo.totalCompras.servicosTomados.creditoAR += creditoAR 
                    respostaFinalCalculo.totalCompras.servicosTomados.custoAR += custoAR 
                    respostaFinalCalculo.totalCompras.servicosTomados.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.servicosTomados.custoAR / respostaFinalCalculo.totalCompras.servicosTomados.valorAR
                    respostaFinalCalculo.totalCompras.servicosTomados.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.servicosTomados.impostosAR /  respostaFinalCalculo.totalCompras.servicosTomados.valorDesonerado
                    respostaFinalCalculo.totalCompras.servicosTomados.valorDR += valorMensalServicoDR
                    respostaFinalCalculo.totalCompras.servicosTomados.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalCompras.servicosTomados.creditoDR += creditoDR
                    respostaFinalCalculo.totalCompras.servicosTomados.custoDR += custoDR
                    respostaFinalCalculo.totalCompras.servicosTomados.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.servicosTomados.custoDR / respostaFinalCalculo.totalCompras.servicosTomados.valorDR
                    respostaFinalCalculo.totalCompras.servicosTomados.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.servicosTomados.impostosDR / respostaFinalCalculo.totalCompras.servicosTomados.valorDesonerado

                    // preenchendo total
                    respostaFinalCalculo.totalCompras.total.valorAR += valorServicoAR
                    respostaFinalCalculo.totalCompras.total.impostosAR += valorImpostosAtuais
                    respostaFinalCalculo.totalCompras.total.valorDesonerado += valorServicoDesonerado
                    respostaFinalCalculo.totalCompras.total.creditoAR += creditoAR 
                    respostaFinalCalculo.totalCompras.total.custoAR += custoAR 
                    respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.servicosTomados.custoAR / respostaFinalCalculo.totalCompras.servicosTomados.valorAR
                    respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.servicosTomados.impostosAR /  respostaFinalCalculo.totalCompras.servicosTomados.valorDesonerado
                    respostaFinalCalculo.totalCompras.total.valorDR += valorMensalServicoDR
                    respostaFinalCalculo.totalCompras.total.impostosDR += valorImpostosNovos
                    respostaFinalCalculo.totalCompras.total.creditoDR += creditoDR
                    respostaFinalCalculo.totalCompras.total.custoDR += custoDR
                    respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.servicosTomados.custoDR / respostaFinalCalculo.totalCompras.servicosTomados.valorDR
                    respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.servicosTomados.impostosDR / respostaFinalCalculo.totalCompras.servicosTomados.valorDesonerado


                    if(atividade.compoeCusto){
                      // Aqui temos um problema de nomeclatura:
                      // O que chamamos de CustoAR e custoDR é o que está saindo do meu bolso no final do dia.
                      // O que estamos chamando de custoGeral é apenas uma parte do custoAR e custoDR, a gente vai ver de tudo que a gente gastou no final do dia
                      // O que é despesa (gastos que não retornam dinheiro pra mim no futuro) e o que não é. O que não for despesa entrará nesse custoGeral
                      // Ou seja ele representa a parte que eu to gastando que retorna dinheiro pra mim no futuro.
                      console.log("ATIVIDADE COM CUSTO")
                      console.log(atividade)
                      dreCustoGeralAR += custoAR
                      dreCustoGeralDR += custoDR
                    }else{
                      dreDespesasAR += custoAR
                      dreDespesasDR += custoDR
                    }

              })

          }



          //LOCACAO

          if(totalImoveisLocacao.length > 0){
            console.log("/////////////////////////////////////////////////////////////")
            console.log("Começo do calculo")
            // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
            let pfRegimeRegular = false
            if(meuRegime == "Pessoa Fisica"){
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




              totalImoveisLocacao.forEach((imovel, index) => {
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
                if(imovel.tipoAluguel == 'Aluguel pago'){
                    // O outro que é o locador
                    if(imovel.tipoOutraParte == 'Pessoa jurídica'){
                      if(imovel.regimeOutro == 'Lucro Presumido'){
                          aliquotaDesonerar = 0.0365
                          console.log("aliquota a desonerar: " + aliquotaDesonerar)
                      }else if(imovel.regimeOutro == 'Lucro Real'){
                          aliquotaDesonerar = 0.0925
                          console.log("aliquota a desonerar: " + aliquotaDesonerar)
                      }
                    }
                    // Caso seja PF manterá a aliquota a desonerar como zero, logo, não haverá desoneração

                    //CRÉDITO: como eu sou o locatário:
                    //Aqui o valor base já tem que estar com redução??
                    if(meuRegime == 'Lucro Real' && imovel.residencial == false && (imovel.regimeOutro == 'Lucro Presumido' || imovel.regimeOutro == 'Lucro Real')){
                        console.log("tem crédito atual de: ")
                        creditoAtual = valorBase * 0.0925
                        console.log(creditoAtual)
                        console.log("aliquota usada para calcular o credito: " + 0.0925)
                    }

                    // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                    if(meuRegime == "Lucro Presumido" || meuRegime == 'Lucro Real' || meuRegime == "Simples Nacional" || pfRegimeRegular){
                        temCreditoIva = true
                    }


                }else if(imovel.tipoAluguel == 'Aluguel recebido'){
                    //Minha empresa é o locador
                    // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente
                    if(meuRegime == 'Lucro Presumido'){
                      aliquotaDesonerar = 0.0365
                    }else if(meuRegime == 'Lucro Real'){
                        aliquotaDesonerar = 0.0925
                    }

                    // CRÉDITO ATUAL (antes da reforma): como o outro é o locatário:
                    if(imovel.regimeOutro == 'Lucro Real' && imovel.residencial == false && (meuRegime == "Lucro Presumido" || meuRegime == "Lucro Real")){
                        console.log("tem crédito atual de: ")
                        creditoAtual = valorBase * 0.0925
                        console.log(creditoAtual)
                        console.log("aliquota usada para calcular o credito: " + 0.0925)
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


                // ONERAR NOVOS IMPOSTOS
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

                // Coloquei meuRegime == "Pessoa Fisica", pois por padrão o pfRegimeRegular é false, e aqui queremos apenas o caso onde é pessoa física e não está no regime
                if(imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular && meuRegime == "Pessoa Fisica")){
                    // locador for pf sem regime regular n tem IVA

                    // nao aplica iva 
                    console.log("como o locador desse imóvel é pesso física fora do regime regular, então não é aplicado o IVA")
                    console.log("valor final: " + valorDesonerado)
                    valorFinalSimu1 = valorDesonerado
                }else{

                    if(imovel.tipoOutraParte == "Pessoa física"){
                        console.log("O valor de IVA calculado será custo se o destinatário (locatário) for pessoa física não optante pelo Regime Regular de IBS/CBS. Sendo a Pessoa Física optante pelo Regime Regular, o valor do IVA ficará como crédito para abatimento das operações futuras de faturamento.")
                    }

                        // pf regime regular 
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
                        // Somei "(600 * imovel.quantidade)" porque na simulação 2 não tem redução em nenhuma hipótese
                        const novosTributosSimu2 = valorDesonerado * 0.0365
                        console.log(novosTributosSimu2)
      
      
                        if(imovel.condominioEmbutido){
                          // Não destacado

                          if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional") || (imovel.tipoAluguel == "Aluguel pago" && meuRegime == "Simples Nacional")){

                            // Como é simples nacional, eu não tenho certeza se tem crédito ou não então tenho que apresentar os dois casos
                            const valorFinalSimu2SemCredito = valorDesonerado + novosTributosSimu2

                              // SIMULAÇÃO 1
                            valorFinalSimu1 = valorDesonerado + valorNovosTributos
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
                              // Somei "(600 * imovel.quantidade)" porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
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
                                // Somei "(600 * imovel.quantidade)" porque na simulaçao 2 não tem redução em nenhuma hipotese
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


                   const respServicoPrestadoAtual: objItemFinal = {
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
                    }

                    respostaFinalCalculo.locacaoBensImoveis.push(respServicoPrestadoAtual)

                    if(imovel.tipoAluguel == "Aluguel pago"){
                      respostaFinalCalculo.totalCompras.locacaoImoveis.valorAR += valorBase
                      respostaFinalCalculo.totalCompras.locacaoImoveis.impostosAR += valorImpostosAtuais
                      respostaFinalCalculo.totalCompras.locacaoImoveis.valorDesonerado += valorDesonerado
                      respostaFinalCalculo.totalCompras.locacaoImoveis.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.locacaoImoveis.impostosAR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDesonerado
                      respostaFinalCalculo.totalCompras.locacaoImoveis.creditoAR += creditoAtual
                      respostaFinalCalculo.totalCompras.locacaoImoveis.custoAR += custoAtual
                      respostaFinalCalculo.totalCompras.locacaoImoveis.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.locacaoImoveis.custoAR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorAR
                      respostaFinalCalculo.totalCompras.locacaoImoveis.valorDR += valorFinalSimu1
                      respostaFinalCalculo.totalCompras.locacaoImoveis.impostosDR += valorNovosTributos
                      respostaFinalCalculo.totalCompras.locacaoImoveis.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.locacaoImoveis.impostosDR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDesonerado
                      respostaFinalCalculo.totalCompras.locacaoImoveis.creditoDR += creditoDR
                      respostaFinalCalculo.totalCompras.locacaoImoveis.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.locacaoImoveis.custoDR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDR
                      respostaFinalCalculo.totalCompras.locacaoImoveis.custoDR += custoDR

                      // preenchendo total
                      respostaFinalCalculo.totalCompras.total.valorAR += valorBase
                      respostaFinalCalculo.totalCompras.total.impostosAR += valorImpostosAtuais
                      respostaFinalCalculo.totalCompras.total.valorDesonerado += valorDesonerado
                      respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.locacaoImoveis.impostosAR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDesonerado
                      respostaFinalCalculo.totalCompras.total.creditoAR += creditoAtual
                      respostaFinalCalculo.totalCompras.total.custoAR += custoAtual
                      respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.locacaoImoveis.custoAR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorAR
                      respostaFinalCalculo.totalCompras.total.valorDR += valorFinalSimu1
                      respostaFinalCalculo.totalCompras.total.impostosDR += valorNovosTributos
                      respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.locacaoImoveis.impostosDR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDesonerado
                      respostaFinalCalculo.totalCompras.total.creditoDR += creditoDR
                      respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.locacaoImoveis.custoDR / respostaFinalCalculo.totalCompras.locacaoImoveis.valorDR
                      respostaFinalCalculo.totalCompras.total.custoDR += custoDR

                      if(imovel.compoeCusto){
                        console.log("imovel COM CUSTO")
                        console.log(imovel)
                        dreCustoGeralAR += custoAtual
                        dreCustoGeralDR += custoDR
                      }else{
                        dreDespesasAR += custoAtual
                        dreDespesasDR += custoDR
                      }

                    }else if(imovel.tipoAluguel == "Aluguel recebido"){
                      respostaFinalCalculo.totalVendas.locacaoImoveis.valorAR += valorBase
                      respostaFinalCalculo.totalVendas.locacaoImoveis.impostosAR += valorImpostosAtuais
                      respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado += valorDesonerado
                      respostaFinalCalculo.totalVendas.locacaoImoveis.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.locacaoImoveis.impostosAR / respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado 
                      respostaFinalCalculo.totalVendas.locacaoImoveis.valorDR += valorFinalSimu1
                      respostaFinalCalculo.totalVendas.locacaoImoveis.impostosDR += valorNovosTributos
                      respostaFinalCalculo.totalVendas.locacaoImoveis.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.locacaoImoveis.impostosDR / respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado

                      // preenchendo total
                      respostaFinalCalculo.totalVendas.total.valorAR += valorBase
                      respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
                      respostaFinalCalculo.totalVendas.total.valorDesonerado += valorDesonerado
                      respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.locacaoImoveis.impostosAR / respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado 
                      respostaFinalCalculo.totalVendas.total.valorDR += valorFinalSimu1
                      respostaFinalCalculo.totalVendas.total.impostosDR += valorNovosTributos
                      respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.locacaoImoveis.impostosDR / respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado
                    }


              })
          }


          // COMPRA VENDA IMOVEIS

          if(totalImoveisCompraVenda.length > 0){
            totalImoveisCompraVenda.forEach(imovel => {

              const valorDeVenda = imovel.valorVendaImovel
              const valorDeAquisicao = imovel.valorAquisicao
              // Repete o valor de aquisição inicialmente
              const redutorDeAjuste = valorDeAquisicao


            // CENÁRIO ATUAL (antes da reforma)
              let valorImpostosAtuais = 0
              switch(meuRegime){
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


              const respServicoPrestadoAtual: objItemFinal = {
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
              }

              respostaFinalCalculo.compraVendaBensImoveis.push(respServicoPrestadoAtual)




            })
          }





          // BENS MÓVEIS - LOCAÇÃO
          if(totalMoveisLocacao.length > 0){
            const pisCoLucroPresumidoLocacao = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo / 100 : 0
            const pisCoLucroRealLocacao = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo / 100 : 0
            const pisCoSimplesLocacao = this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo / 100 : 0

            console.log("piscofins lucroPresumido era pra ser 3,65%")
            console.log(pisCoLucroPresumidoLocacao)
            console.log("piscofins lucroReal era pra ser 9,25%")
            console.log(pisCoLucroRealLocacao)
            console.log("piscofins Simples era pra ser 3,3%")
            console.log(pisCoSimplesLocacao)

            console.log("BENS MOVEIS")
            console.log("/////////////////////////////////////////////////////////////")
            console.log("Começo do calculo")
            // Se meu cliente for Pessoa Fisica, conferir se ele é regime regular
            let pfRegimeRegular = false
            if(meuRegime == "Pessoa Fisica"){
              let totalAluguelMensal = 0
              totalImoveisLocacao.forEach(imovel => {
                if(imovel.tipoAluguel == 'Aluguel recebido'){
                  totalAluguelMensal += imovel.valorAluguel
                }
              })
            }

              let faturamentoTotalMensal = 0
              totalMoveisLocacao.filter(movel => movel.tipoAluguel == "Aluguel recebido").forEach(movel => {
                faturamentoTotalMensal += movel.valorLocacao
              })

              const rbt12 = dadosEmpresaAtual? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12



              totalMoveisLocacao.forEach((movel, index) => {
                console.log("MOVEL " + (index + 1))

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
                      aliquotaDesonerar = pisCoLucroPresumidoLocacao
                      valorImpostosAtuais = valorBase * aliquotaDesonerar
                  }else if(movel.regimeOutro == "Lucro Real"){
                      aliquotaDesonerar = pisCoLucroRealLocacao
                      valorImpostosAtuais = valorBase * aliquotaDesonerar
                  }else{
                      aliquotaDesonerar = pisCoSimplesLocacao
                      valorImpostosAtuais = valorBase * aliquotaDesonerar
                  }

                    // CRÉDITO: como eu sou o locatário:
                    if(meuRegime == 'Lucro Real' && movel.creditaPisCofins && (movel.regimeOutro == "Lucro Presumido" || movel.regimeOutro == "Lucro Real" || movel.regimeOutro == "Simples Nacional")){
                        console.log("tem crédito atual de: ")
                        creditoAtual = valorBase * 0.0925
                        console.log(creditoAtual)
                        console.log("aliquota usada para calcular o credito: " + 0.0925)
                    } 



                    // *************************************************************
                    //CRÉDITO NOVO (sempre olhamos para o locatário) - falta adicionar ou pf-regime regular
                    // Nós não sabemos se o simples (mesmo sendo nosso cliente) vai ser regime regular ou não, logo vamos colocar que tem crédito por padrao, mas na hora de apresentar os resultados, precisamos falar que ele terá crédito se ele optar, caso não será um custo
                    if(meuRegime == 'Lucro Presumido' || meuRegime == 'Lucro Real' || meuRegime == "Simples Nacional"){
                      temCreditoIva = true
                    }
                  

                }else if(movel.tipoAluguel == 'Aluguel recebido'){
                    // Minha empresa é o locador
                    // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente
                    if(meuRegime == 'Lucro Presumido'){
                      aliquotaDesonerar = pisCoLucroPresumidoLocacao
                      if(movel.comOperador){
                        valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0)
                      }else{
                        valorImpostosAtuais = (valorBase * aliquotaDesonerar)
                      }
                    }else if(meuRegime == 'Lucro Real'){
                        aliquotaDesonerar = pisCoLucroRealLocacao
                        if(movel.comOperador){
                          valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0)
                        }else{
                          valorImpostosAtuais = (valorBase * aliquotaDesonerar)
                        }
                    }else if(meuRegime == "Simples Nacional"){

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
                    if(movel.regimeOutro == 'Lucro Real' && movel.creditaPisCofins && (meuRegime == "Lucro Presumido" || meuRegime == "Lucro Real" || meuRegime == "Simples Nacional")){
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



                // ONERAR NOVOS IMPOSTOS

                let baseIva = valorDesonerado
                const aliquotaIva = 0.28
                const valorImpostosNovos = baseIva * aliquotaIva
                const novoValorTotal = valorDesonerado + valorImpostosNovos
                const porcentagemCargaTributariaDR = valorImpostosNovos / valorDesonerado
                creditoDR = temCreditoIva ? valorImpostosNovos : 0
                const custoDR = temCreditoIva ? valorDesonerado : novoValorTotal


              const respServicoPrestadoAtual: objItemFinal = {
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
              }

              respostaFinalCalculo.locacaoBensMoveis.push(respServicoPrestadoAtual)


              if(movel.tipoAluguel == "Aluguel pago"){
                  respostaFinalCalculo.totalCompras.locacaoMoveis.valorAR += valorBase
                  respostaFinalCalculo.totalCompras.locacaoMoveis.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo.totalCompras.locacaoMoveis.valorDesonerado += valorDesonerado
                  respostaFinalCalculo.totalCompras.locacaoMoveis.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.locacaoMoveis.impostosAR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDesonerado
                  respostaFinalCalculo.totalCompras.locacaoMoveis.creditoAR += creditoAtual
                  respostaFinalCalculo.totalCompras.locacaoMoveis.custoAR += custoAR
                  respostaFinalCalculo.totalCompras.locacaoMoveis.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.locacaoMoveis.custoAR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorAR
                  respostaFinalCalculo.totalCompras.locacaoMoveis.valorDR += novoValorTotal
                  respostaFinalCalculo.totalCompras.locacaoMoveis.impostosDR += valorImpostosNovos
                  respostaFinalCalculo.totalCompras.locacaoMoveis.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.locacaoMoveis.impostosDR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDesonerado 
                  respostaFinalCalculo.totalCompras.locacaoMoveis.creditoDR += creditoDR
                  respostaFinalCalculo.totalCompras.locacaoMoveis.custoDR += custoDR
                  respostaFinalCalculo.totalCompras.locacaoMoveis.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.locacaoMoveis.custoDR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDR

                  //preenchendo total
                  respostaFinalCalculo.totalCompras.total.valorAR += valorBase
                  respostaFinalCalculo.totalCompras.total.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo.totalCompras.total.valorDesonerado += valorDesonerado
                  respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.locacaoMoveis.impostosAR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDesonerado
                  respostaFinalCalculo.totalCompras.total.creditoAR += creditoAtual
                  respostaFinalCalculo.totalCompras.total.custoAR += custoAR
                  respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.locacaoMoveis.custoAR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorAR
                  respostaFinalCalculo.totalCompras.total.valorDR += novoValorTotal
                  respostaFinalCalculo.totalCompras.total.impostosDR += valorImpostosNovos
                  respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.locacaoMoveis.impostosDR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDesonerado 
                  respostaFinalCalculo.totalCompras.total.creditoDR += creditoDR
                  respostaFinalCalculo.totalCompras.total.custoDR += custoDR
                  respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.locacaoMoveis.custoDR / respostaFinalCalculo.totalCompras.locacaoMoveis.valorDR

                  if(movel.compoeCusto){
                    console.log("Movel COM CUSTO")
                    console.log(movel)
                    dreCustoGeralAR += custoAR
                    dreCustoGeralDR += custoDR
                  }else{
                    dreDespesasAR += custoAR
                    dreDespesasDR += custoDR
                  }

              }else if(movel.tipoAluguel == "Aluguel recebido"){
                  respostaFinalCalculo.totalVendas.locacaoMoveis.valorAR += valorBase
                  respostaFinalCalculo.totalVendas.locacaoMoveis.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado += valorDesonerado
                  respostaFinalCalculo.totalVendas.locacaoMoveis.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.locacaoMoveis.impostosAR / respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado
                  respostaFinalCalculo.totalVendas.locacaoMoveis.valorDR += novoValorTotal
                  respostaFinalCalculo.totalVendas.locacaoMoveis.impostosDR += valorImpostosNovos
                  respostaFinalCalculo.totalVendas.locacaoMoveis.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.locacaoMoveis.impostosDR / respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado

                  //preenchendo total
                  respostaFinalCalculo.totalVendas.total.valorAR += valorBase
                  respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
                  respostaFinalCalculo.totalVendas.total.valorDesonerado += valorDesonerado
                  respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.locacaoMoveis.impostosAR / respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado
                  respostaFinalCalculo.totalVendas.total.valorDR += novoValorTotal
                  respostaFinalCalculo.totalVendas.total.impostosDR += valorImpostosNovos
                  respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.locacaoMoveis.impostosDR / respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado
              }

              })
          }



          // Produtos

          // PRODUTOS VENDIDOS
          if(totalProdutosVendidos.length > 0){

            let faturamentoTotalMensal = 0
            totalProdutosVendidos.forEach(produto => {
              faturamentoTotalMensal += produto.valorOperacao
            })

            const rbt12 = dadosEmpresaAtual ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12

            console.log("TEM PRODUTOS VENDIDOS")
            console.log(totalProdutosVendidos)

            totalProdutosVendidos.forEach(produtoVendido => {

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
              if(meuRegime == "Simples Nacional"){
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
                }else if(produtoVendido.tipoOperacao == "Exportação"){
                  // Não tem impostos atuais, como lá no início o impostosAtuais foi setado como 0, é só não fazer nada
                }




              }else{
                // Tanto Lucro Real quanto Lucro Presumido tem que calcular os impostos atuais através dos parametros de entrada, então pode ser a mesma coisa
                const aliquotaDesonerar = (produtoVendido.icms / 100) + (produtoVendido.icmsDifal / 100) + (produtoVendido.icmsSt / 100) + (produtoVendido.ipi / 100)
                console.log("aliquota a desonerar: " + aliquotaDesonerar)

                valorImpostosAtuais = valorBase * aliquotaDesonerar

              }

              console.log("valor dos impostos atuais (antes da reforma): " + valorImpostosAtuais)

              let valorDesonerado = valorBase - valorImpostosAtuais
              const porcentagemCargaTributariaAR = valorImpostosAtuais / valorDesonerado

              console.log("Valor Desonerado: " + valorDesonerado)


              // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


              // IMPOSTOS NOVOS ******************************************************************************************************************************************
              let reducaoIva = 0
              let aliquotaIva = 0.28

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


              const respServicoPrestadoAtual: objItemFinal = {
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
              }

              respostaFinalCalculo.produtosVendidos.push(respServicoPrestadoAtual)              

              respostaFinalCalculo.totalVendas.vendasProdutos.valorAR += valorBase
              respostaFinalCalculo.totalVendas.vendasProdutos.impostosAR += valorImpostosAtuais
              respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado += valorDesonerado
              respostaFinalCalculo.totalVendas.vendasProdutos.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.vendasProdutos.impostosAR / respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado
              respostaFinalCalculo.totalVendas.vendasProdutos.valorDR += novoValorProduto
              respostaFinalCalculo.totalVendas.vendasProdutos.impostosDR += novosImpostos
              respostaFinalCalculo.totalVendas.vendasProdutos.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.vendasProdutos.impostosDR / respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado    
              
              // preenchendo total
              respostaFinalCalculo.totalVendas.total.valorAR += valorBase
              respostaFinalCalculo.totalVendas.total.impostosAR += valorImpostosAtuais
              respostaFinalCalculo.totalVendas.total.valorDesonerado += valorDesonerado
              respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalVendas.vendasProdutos.impostosAR / respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado
              respostaFinalCalculo.totalVendas.total.valorDR += novoValorProduto
              respostaFinalCalculo.totalVendas.total.impostosDR += novosImpostos
              respostaFinalCalculo.totalVendas.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalVendas.vendasProdutos.impostosDR / respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado 

            })


          }





          // PRODUTOS ADQUIRIDOS
          if(totalProdutosAdquiridos.length > 0){
            let faturamentoTotalMensal = 0
            totalProdutosAdquiridos.forEach(produto => {
              faturamentoTotalMensal += produto.valorOperacao
            })

            const rbt12 = dadosEmpresaAtual ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12

            console.log("TEM PRODUTOS ADQURIDOS")
            console.log(totalProdutosAdquiridos)

            totalProdutosAdquiridos.forEach(produtoAdquirido => {

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
                // Tanto Lucro Real quanto Lucro Presumido tem que calcular os impostos atuais através dos parametros de entrada, então pode ser a mesma coisa
                const aliquotaDesonerar = (produtoAdquirido.aliquotas.icms !== null ? produtoAdquirido.aliquotas.icms / 100 : 0) + (produtoAdquirido.aliquotas.pisCo !== null ? produtoAdquirido.aliquotas.pisCo / 100 : 0) + (produtoAdquirido.aliquotas.ipi !== null ? produtoAdquirido.aliquotas.ipi / 100 : 0) 
                console.log("aliquota a desonerar: " + aliquotaDesonerar)
                valorImpostosAtuais = valorBase * aliquotaDesonerar
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

              // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


              // IMPOSTOS NOVOS ******************************************************************************************************************************************
              let reducaoIva = 0
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

              const respServicoPrestadoAtual: objItemFinal = {
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
              }

              respostaFinalCalculo.produtosAdquiridos.push(respServicoPrestadoAtual)              

              respostaFinalCalculo.totalCompras.comprasProdutos.valorAR += valorBase
              respostaFinalCalculo.totalCompras.comprasProdutos.impostosAR += valorImpostosAtuais
              respostaFinalCalculo.totalCompras.comprasProdutos.valorDesonerado += valorDesonerado
              respostaFinalCalculo.totalCompras.comprasProdutos.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.comprasProdutos.impostosAR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDesonerado
              respostaFinalCalculo.totalCompras.comprasProdutos.creditoAR += creditoAtual
              respostaFinalCalculo.totalCompras.comprasProdutos.custoAR += custoAR
              respostaFinalCalculo.totalCompras.comprasProdutos.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.comprasProdutos.custoAR / respostaFinalCalculo.totalCompras.comprasProdutos.valorAR
              respostaFinalCalculo.totalCompras.comprasProdutos.valorDR += novoValorProduto
              respostaFinalCalculo.totalCompras.comprasProdutos.impostosDR += novosImpostos
              respostaFinalCalculo.totalCompras.comprasProdutos.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.comprasProdutos.impostosDR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDesonerado
              respostaFinalCalculo.totalCompras.comprasProdutos.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.comprasProdutos.custoDR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDR

              // preencher total
              respostaFinalCalculo.totalCompras.total.valorAR += valorBase
              respostaFinalCalculo.totalCompras.total.impostosAR += valorImpostosAtuais
              respostaFinalCalculo.totalCompras.total.valorDesonerado += valorDesonerado
              respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaAR = respostaFinalCalculo.totalCompras.comprasProdutos.impostosAR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDesonerado
              respostaFinalCalculo.totalCompras.total.creditoAR += creditoAtual
              respostaFinalCalculo.totalCompras.total.custoAR += custoAR
              respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoAR = respostaFinalCalculo.totalCompras.comprasProdutos.custoAR / respostaFinalCalculo.totalCompras.comprasProdutos.valorAR
              respostaFinalCalculo.totalCompras.total.valorDR += novoValorProduto
              respostaFinalCalculo.totalCompras.total.impostosDR += novosImpostos
              respostaFinalCalculo.totalCompras.total.porcentagemCargaTributariaDR = respostaFinalCalculo.totalCompras.comprasProdutos.impostosDR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDesonerado
              respostaFinalCalculo.totalCompras.total.porcentagemCustoEfetivoDR = respostaFinalCalculo.totalCompras.comprasProdutos.custoDR / respostaFinalCalculo.totalCompras.comprasProdutos.valorDR

              if(produtoAdquirido.tipoOperacao == "Revenda" || produtoAdquirido.tipoOperacao == "Insumo"){
                dreCustoGeralAR += custoAR
                dreCustoGeralDR += 0
              }else{
                dreDespesasAR += custoAR
                dreDespesasDR += 0
              }
      

            })
          }



          // No final de tudo realizo a soma de colunas para fazer a tabela da DRE
          
          // TABELA CAIXA
            
              // Fornecedores
          const valorCompraAR = Object.values(respostaFinalCalculo.totalCompras).reduce((soma, area) => {
              return soma + area.valorAR;
          }, 0)
          
          const valorCompraDR = Object.values(respostaFinalCalculo.totalCompras).reduce((soma, area) => {
              return soma + area.valorDR;
          }, 0)

          const diferencaCompras = valorCompraDR - valorCompraAR

              // Tributos Crédito
          const tributosCreditoAR = Object.values(respostaFinalCalculo.totalCompras).reduce((soma, area) => {
            return soma + area.creditoAR
          }, 0) 

          const tributosCreditoDR = Object.values(respostaFinalCalculo.totalCompras).reduce((soma, area) => {
            return soma + area.creditoDR
          }, 0) 

          const diferencaTributosCredito = tributosCreditoDR - tributosCreditoAR

              // Clientes
          const valorVendaAR = Object.values(respostaFinalCalculo.totalVendas).reduce((soma, area) => {
              return soma + area.valorAR;
          }, 0)
        
          const valorVendaDR = Object.values(respostaFinalCalculo.totalVendas).reduce((soma, area) => {
              return soma + area.valorDR;
          }, 0)

          const diferencaVendas = valorVendaDR - valorVendaAR

              // Tributos Débito
          const tributosDebitoAR = Object.values(respostaFinalCalculo.totalVendas).reduce((soma, area) => {
              return soma + area.impostosAR
          }, 0) 

          let tributosDebitoDR = Object.values(respostaFinalCalculo.totalVendas).reduce((soma, area) => {
            return soma + area.impostosDR
          }, 0)


          // TABELA DRE

              // Receita Bruta
          const valorVendaDesonerado = Object.values(respostaFinalCalculo.totalVendas).reduce((soma, area) => {
              return soma + area.valorDesonerado;
          }, 0)

          const diferencaReceitaBruta = valorVendaDesonerado - valorVendaAR

            // Deduções Tributos
          let deducoesTributosAR = 0
          let deducoesTributosDR = 0

          if(meuRegime == "Simples Nacional"){
              deducoesTributosAR = valorImpostosPermanecerTotal + tributosDebitoAR // tributosDébitoAR é a soma de todos os impostos excluídos das operções de VENDA
              deducoesTributosDR = valorImpostosPermanecerTotal
          }else if(meuRegime == "Lucro Presumido" || meuRegime == "Lucro Real"){
              deducoesTributosAR = tributosDebitoAR - tributosCreditoAR
              deducoesTributosDR = 0
          }

          const diferencaDeducoesTributos = deducoesTributosDR - deducoesTributosAR

          
              // Custo Geral
          const diferencaReaisCustoDre = dreCustoGeralDR - dreCustoGeralAR
          const diferencaReaisDespesasDre = dreDespesasDR - dreDespesasAR

              // Lucro Bruto
          const lucroBrutoAR = valorVendaAR - deducoesTributosAR - dreCustoGeralAR
          const lucroBrutoDR = valorVendaDesonerado - deducoesTributosDR - dreCustoGeralDR
          const diferencaLucroBruto = lucroBrutoDR - lucroBrutoAR

              // Lucro Antes IR/CS (Lucro Antes IR/CS = Receita Bruta - Deduções Tributos - Custo Mercadoria - Despesas)
          const lucroAntesIrCsAR = valorVendaAR - deducoesTributosAR - dreCustoGeralAR - dreDespesasAR
          const lucroAntesIrCsDR = valorVendaDesonerado - deducoesTributosDR - dreCustoGeralDR - dreDespesasDR
          const diferencaLucroAntesIrCs = lucroAntesIrCsDR - lucroAntesIrCsAR

              // IR/CS
          let irCsAR = 0
          let irCsDR = 0
              
          if(meuRegime == "Lucro Real"){
              // AR
              if(lucroAntesIrCsAR > 0){
                const valor1 = lucroAntesIrCsAR * 0.24
                const adicional = lucroAntesIrCsAR > 20000 ? (lucroAntesIrCsAR - 20000) * 0.1 : 0

                irCsAR = valor1 + adicional

              }else{
                irCsAR = 0
              }

              // DR
              if(lucroAntesIrCsDR > 0){
                const valor1 = lucroAntesIrCsDR * 0.24
                const adicional = lucroAntesIrCsDR > 20000 ? (lucroAntesIrCsDR - 20000) * 0.1 : 0

                irCsDR = valor1 + adicional

              }else{
                irCsDR = 0
              }

          }else if(meuRegime == "Lucro Presumido"){
              const valorTotalServicosPrestadosAR = respostaFinalCalculo.totalVendas.servicosPrestados.valorAR
              const valorDesoneradoServicosPrestados = respostaFinalCalculo.totalVendas.servicosPrestados.valorDesonerado

              const valorTotalLocacaoMoveisAR = respostaFinalCalculo.totalVendas.locacaoMoveis.valorAR
              const valorTotalLocacaoImoveisAR = respostaFinalCalculo.totalVendas.locacaoImoveis.valorAR
              const valorTotalLocacaoAR = valorTotalLocacaoImoveisAR + valorTotalLocacaoMoveisAR

              const valorDesoneradoLocacaoMoveisAR = respostaFinalCalculo.totalVendas.locacaoMoveis.valorDesonerado
              const valorDesoneradoLocacaoImoveisAR = respostaFinalCalculo.totalVendas.locacaoImoveis.valorDesonerado
              const valorDesoneradoLocacaoAR = valorDesoneradoLocacaoImoveisAR + valorDesoneradoLocacaoMoveisAR

              const valorTotalProdutosVendidosAR = respostaFinalCalculo.totalVendas.vendasProdutos.valorAR
              const valorDesoneradoProdutosVendidos = respostaFinalCalculo.totalVendas.vendasProdutos.valorDesonerado

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

                  const valor1Desonerado = item.valorDesonerado * item.aliquota
                  const adicionalDR = valor1Desonerado > 20000 ? ((valor1Desonerado - 20000) * 0.1) : 0
                  const irpjCsllDR = item.valorDesonerado * item.aliquotaIrpjCsll
                  const irCsDRAtual = irpjCsllDR + adicionalDR
                  irCsDR += irCsDRAtual

              })



          }else{
              irCsAR = 0
              irCsDR = 0
          }

          const diferencaIrCs = irCsDR - irCsAR


              // Lucro Líquido
          const lucroLiquidoAR = lucroAntesIrCsAR - irCsAR
          const lucroLiquidoDR = lucroAntesIrCsDR - irCsDR
          const diferencaLucroLiquido = lucroLiquidoDR - lucroLiquidoAR
          const diferencaPercentualLucroLiquido = lucroLiquidoAR ? (diferencaLucroLiquido / lucroLiquidoAR) : 0
  

          const tabelaDre: tabelaDreType = {
              receitaBruta: {AR: valorVendaAR, DR: valorVendaDesonerado, diferencaReais: diferencaReceitaBruta, diferencaPercentual: valorVendaAR ? (diferencaReceitaBruta / valorVendaAR) : 0},
              deducoesTributos: {AR: deducoesTributosAR, DR: deducoesTributosDR, diferencaReais: diferencaDeducoesTributos, diferencaPercentual: deducoesTributosAR ? diferencaDeducoesTributos / deducoesTributosAR : 0},
              custoGeral: {AR: dreCustoGeralAR, DR: dreCustoGeralDR, diferencaReais: diferencaReaisCustoDre, diferencaPercentual: dreCustoGeralAR ? (diferencaReaisCustoDre / dreCustoGeralAR) : 0},
              lucroBruto: {AR: lucroBrutoAR, DR: lucroBrutoDR, diferencaReais: diferencaLucroBruto, diferencaPercentual: lucroBrutoAR ? (diferencaLucroBruto / lucroBrutoAR) : 0},
              despesas: {AR: dreDespesasAR, DR: dreDespesasDR, diferencaReais: diferencaReaisDespesasDre, diferencaPercentual: dreDespesasAR ? diferencaReaisDespesasDre / dreDespesasAR : 0},
              lucrosAntesIrCs: {AR: lucroAntesIrCsAR, DR: lucroAntesIrCsDR, diferencaReais: diferencaLucroAntesIrCs, diferencaPercentual: lucroAntesIrCsAR ? (diferencaLucroAntesIrCs / lucroAntesIrCsAR) : 0},
              irCs: {AR: irCsAR, DR: irCsDR, diferencaReais: diferencaIrCs, diferencaPercentual: irCsAR ? (diferencaIrCs / irCsAR) : 0},
              lucroLiquido: {AR: lucroLiquidoAR, DR: lucroLiquidoDR, diferencaReais: diferencaLucroLiquido, diferencaPercentual: diferencaPercentualLucroLiquido}
          }

          respostaFinalCalculo.dre = tabelaDre


          // CONTINUANDO TABELA CAIXA...

          //Todas as contas com tributosDebitoDR preciso fazer depois de terminar a DRE, pois em caso de simples nacional, preciso somar o valor do deducoesTributosDR ao tributoDebitoDr
      
          if(meuRegime == "Simples Nacional"){
              tributosDebitoDR += deducoesTributosDR
          }

          const diferencaTributosDebito = tributosDebitoDR - tributosDebitoAR

              // Tributos Recolhidos
          const tributosRecolhidosAR = ((tributosDebitoAR - tributosCreditoAR) > 0 ? (tributosDebitoAR - tributosCreditoAR) : 0)
          const tributosRecolhidosDR = ((tributosDebitoDR - tributosCreditoDR) > 0 ? (tributosDebitoDR - tributosCreditoDR) : 0)
          
              // Saldo Credor
          const saldoCredorAR = ((tributosCreditoAR - tributosDebitoAR) > 0 ? (tributosCreditoAR - tributosDebitoAR) : 0)
          const saldoCredorDR = ((tributosCreditoDR - tributosDebitoDR) > 0 ? (tributosCreditoDR - tributosDebitoDR) : 0)
  
              // Contrução da tabela Caixa Sem Resultados
          const caixa = {
              fornecedores: {AR: valorCompraAR, DR: valorCompraDR, diferencaReais: diferencaCompras, diferencaPercentual: valorCompraAR ? diferencaCompras / valorCompraAR : 0},
              tributosCredito: {AR: tributosCreditoAR, DR: tributosCreditoDR, diferencaReais: diferencaTributosCredito, diferencaPercentual: tributosCreditoAR ? diferencaTributosCredito / tributosCreditoAR : 0},
              clientes: {AR: valorVendaAR, DR: valorVendaDR, diferencaReais: diferencaVendas, diferencaPercentual: valorVendaAR ? diferencaVendas / valorVendaAR : 0},
              tributosDebito: {AR: tributosDebitoAR, DR: tributosDebitoDR, diferencaReais: diferencaTributosDebito, diferencaPercentual: tributosDebitoAR ? diferencaTributosDebito / tributosDebitoAR : 0},
              tributosRecolhidos: {AR: tributosRecolhidosAR, DR: tributosRecolhidosDR, diferencaReais: tributosRecolhidosDR - tributosRecolhidosAR, diferencaPercentual: tributosRecolhidosAR ? (tributosRecolhidosDR - tributosRecolhidosAR) / tributosRecolhidosAR : 0},
              saldoCredor: {AR: saldoCredorAR, DR: saldoCredorDR, diferencaReais: saldoCredorDR - saldoCredorAR, diferencaPercentual: saldoCredorAR ? (saldoCredorDR - saldoCredorAR) / saldoCredorAR : 0},
          }

            // Construindo tabela Caixa Com Resultados
          const resultadoCaixaAR = caixa.clientes.AR - caixa.fornecedores.AR + caixa.tributosCredito.AR - caixa.tributosDebito.AR
          const resultadoCaixaDR = caixa.clientes.DR - caixa.fornecedores.DR + caixa.tributosCredito.DR - caixa.tributosDebito.DR
          const resultadoCaixaDiferenca = resultadoCaixaDR - resultadoCaixaAR
          const resultadoCaixaDiferencaPercentual = resultadoCaixaAR ? (resultadoCaixaDiferenca / resultadoCaixaAR) : 0 
          const resultadoSobreClientesAR = caixa.clientes.AR ? (resultadoCaixaAR / caixa.clientes.AR) : 0
          const resultadoSobreClientesDR = caixa.clientes.DR ? (resultadoCaixaDR / caixa.clientes.DR) : 0

          const resultadoPosIrCsAR = resultadoCaixaAR - irCsAR
          const resultadoPosIrCsDR = resultadoCaixaDR - irCsDR
          const diferencaResultadoPosIrCs = resultadoPosIrCsDR - resultadoPosIrCsAR
          const diferencaPercentualResultadoPosIrCs = resultadoPosIrCsAR ? (diferencaResultadoPosIrCs / resultadoPosIrCsAR) : 0

          const caixaComResultado: tabelaCaixaType = {
              ...caixa,
              resultado: {
                  AR: resultadoCaixaAR,
                  DR: resultadoCaixaDR,
                  diferencaReais: resultadoCaixaDiferenca,
                  diferencaPercentual: resultadoCaixaDiferencaPercentual
              },
              irCs: {
                AR: irCsAR,
                DR: irCsDR,
                diferencaReais: diferencaIrCs,
                diferencaPercentual: irCsAR ? (diferencaIrCs / irCsAR) : 0
              },
              resultadoPosIrCs: {
                AR: resultadoPosIrCsAR,
                DR: resultadoPosIrCsDR,
                diferencaReais: diferencaResultadoPosIrCs,
                diferencaPercentual: diferencaPercentualResultadoPosIrCs
              },
              resultadoSobreClientes: {
                  AR: resultadoSobreClientesAR,
                  DR: resultadoSobreClientesDR,
                  diferencaReais: resultadoSobreClientesDR - resultadoSobreClientesAR,
                  diferencaPercentual: (resultadoSobreClientesDR - resultadoSobreClientesAR) / resultadoSobreClientesAR
              }
          }

          respostaFinalCalculo.caixa = caixaComResultado




          


          return respostaFinalCalculo


    }

}