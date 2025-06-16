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
    anexo: string
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
  operacao: string
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
    id: number
}

type MetodoAdquiridoType = "Por Operação" | "Por CNPJ"

type TipoOperacaoAdquiridoType = "Consumo" | "Insumo" | "Alimentação" | "Imobilizado" | "Revenda"

export interface ProdutoAdquiridoObj {
    metodo: MetodoAdquiridoType,
    tipoOperacao: TipoOperacaoAdquiridoType | "",
    valorOperacao: number,
    ncm: string,
    icms: number,
    creditoIcms: boolean,
    pisCofins: number,
    creditoPisCofins: boolean,
    ipi: number,
    creditoIpi: boolean,
    cnpjFornecedor: string,
    regimeTributarioOutro: string,
    fornecedorIndustrial: boolean,
    beneficio: number,
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

          // Total Atividades == Total Atividades (serviços) Prestadas
          if(totalAtividades.length > 0){

              if(meuRegime == "Simples Nacional"){
                console.log("COMEÇO ANÁLISE")

        
                
                let faturamentoMensal = 0
        
                totalAtividades.forEach(item => {
                    faturamentoMensal += item.faturamentoMensal
                })
                
                const rbt12 = faturamentoMensal * 12
                console.log("faturamento mensal:")
                console.log(faturamentoMensal)
                console.log("faturamento anual total empresa: " + rbt12)
        

        
        
                // Análise de cada atividade
                totalAtividades.forEach(async (item, index) => {
                    console.log("ATIVIDADE " + (index + 1))
                    console.log("CNAE: " + item.cnaePrincipal)
                    console.log("Anexo: " + item.anexo)
                    console.log("faturamento Mensal atividade: " + item.faturamentoMensal)
        
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
        
                            //preco sem os impostos "antigos"
                            const faturamentoMensalDesonerado = (item.faturamentoMensal) - (item.faturamentoMensal * aliquotaEfetivaDesonerada)
    
                            const novoFaturamentoMensalDesonerado = (item.faturamentoMensal) - ((objPercentualReparticao.iss + objPercentualReparticao.cofins + objPercentualReparticao.pis + objPercentualReparticao.icms + objPercentualReparticao.ipi) / 12)
    
                            console.log("NOVO FATURAMENTO MENSAL TESTE: ")
                            console.log(novoFaturamentoMensalDesonerado)
    
                            console.log("NOVO FATURAMENTO MENSAL TESTE 2:  ")
                            console.log(faturamentoMensalDesonerado)
    
                            console.log("faturamento mensal da atividade desonerado: " + faturamentoMensalDesonerado)
                            const valorImpostosDesonerados = (item.faturamentoMensal - faturamentoMensalDesonerado)
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
                                reducaoIva = item.beneficio
                                aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                                aliquotaEfetivaIbs = (ibsBruto * aliquotaEfetivaIva) / ivaBruto
                                aliquotaEfetivaCbs = (cbsBruto * aliquotaEfetivaIva) / ivaBruto
                              }
        
        
                              console.log("faturamentoMensalDesonerado: ")
                              console.log(faturamentoMensalDesonerado)
                              console.log("aliquota Efetiva IVA")
                              console.log(aliquotaEfetivaIva)

                               
        
                              const valorImpostosNovos = faturamentoMensalDesonerado * aliquotaEfetivaIva

                              const valorIbsSimulacao1 = (faturamentoMensalDesonerado * aliquotaEfetivaIbs)
                              const valorCbsSimulacao2 = (faturamentoMensalDesonerado * aliquotaEfetivaCbs)
                              console.log("Impostos Desonerados: " + (item.faturamentoMensal - faturamentoMensalDesonerado))
                              console.log("Valor novo imposto - IVA (mês): " + valorImpostosNovos)
                              console.log("Valor IBS (mês): " + valorIbsSimulacao1)
                              console.log("Valor CBS (mês): " + valorCbsSimulacao2)
                              const valorMensalServicoAposReforma = faturamentoMensalDesonerado + valorImpostosNovos
        
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

                    // Conferir se tem benefício
                    if(atividade.beneficio){
                      // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                      reducaoIva = atividade.beneficio
                      aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                      aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                      aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                    }

                  const faturamentoDesonerado = atividade.faturamentoMensal - (atividade.faturamentoMensal * aliquotaDesonerada)
                  const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva

                  const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                  const valorImpostosDesonerados = (atividade.faturamentoMensal - faturamentoDesonerado)

                  console.log("impostos desonerados: " + (atividade.faturamentoMensal - faturamentoDesonerado))

                  const valorIbs = (aliquotaEfetivaIbs * faturamentoDesonerado)
                  const valorCbs = (aliquotaEfetivaCbs * faturamentoDesonerado)

                  console.log("Valor IBS: " + valorIbs)
                  console.log("Valor CBS: " + valorCbs)

                  console.log("novo valor do serviço: " + novoValorServiço)

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

                    // Conferir se tem benefício
                    if(atividade.beneficio){
                      // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                      reducaoIva = atividade.beneficio
                      aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                      aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                      aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                    }

                  const faturamentoDesonerado = atividade.faturamentoMensal - (atividade.faturamentoMensal * aliquotaDesonerada)
                  const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva

                  const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                  console.log("impostos desonerados: " + (atividade.faturamentoMensal - faturamentoDesonerado))

                  console.log("Valor IBS: " + (aliquotaEfetivaIbs * faturamentoDesonerado))
                  console.log("Valor CBS: " + (aliquotaEfetivaCbs * faturamentoDesonerado))

                  console.log("novo valor do serviço: " + novoValorServiço)

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
                  if(atividade.regimeTributario == "Simples Nacional"){
                    console.log("atividade " + (index + 1) + " é do simples nacional")
                    console.log("cnpj aonde você adquiriu serviço: ")
                    console.log(atividade.cpfOuCnpj)
                    console.log("regime Outro: ")
                    console.log(atividade.regimeTributario)
                    console.log("Operacao outro")
                    console.log(atividade.operacao)

                    let faturamentoDesonerado

                    console.log("Preço do serviço sem impostos: " + faturamentoDesonerado)

                    




                    //CONFERIR REDUÇÃO IVA CNAE

                    let reducaoIva = 0

                    let aliquotaEfetivaIva = ivaBruto
                    let aliquotaEfetivaIbs = ibsBruto
                    let aliquotaEfetivaCbs = cbsBruto

                    console.log("MÉTODO ATUAL:")
                    console.log(atividade.metodo)
                    if(atividade.metodo == "Por CNPJ"){

                      aliquotaDesonerada = iss + icms + ipi + pisCo

                      faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)
                      // Caso método == cnpj
                      
                      // Conferir se tem benefício
                      if(atividade.beneficio){
                        // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                        reducaoIva = atividade.beneficio
                        aliquotaEfetivaIva = aliquotaEfetivaIva - (reducaoIva * aliquotaEfetivaIva)
                        aliquotaEfetivaIbs = aliquotaEfetivaIbs - (reducaoIva * aliquotaEfetivaIbs)
                        aliquotaEfetivaCbs = aliquotaEfetivaCbs - (reducaoIva * aliquotaEfetivaCbs)
                      }


                    }else{
                      // método é operação, aplicar redução da operação específica nas alíquotas

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
                          const pisCofinsComercio = this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.pisCo : 0
                          const icmsComercio = this.parametrosEntrada.tabelaSimplesNacional.comercial.icms !== null ? this.parametrosEntrada.tabelaSimplesNacional.comercial.icms : 0
                          aliquotaDesonerada = pisCofinsComercio + icmsComercio
                              console.log("eentrou comercio")
                        }else if(objOperacaoAtual.colunaParametros == "serviços"){
                          const pisCofinsServico = this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.pisCo : 0
                          const issServico = this.parametrosEntrada.tabelaSimplesNacional.servicos.iss !== null ? this.parametrosEntrada.tabelaSimplesNacional.servicos.iss : 0
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
                      
                      



                      faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)




                      console.log("MÉTODO É OPERAÇAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO")







                    }



                    //SIMULAÇÃO 1 (optante simples nacional, regime regular IBS/CBS)
                    console.log("Simulação 1: ")
                    console.log("faturamentoMensalDesonerado: ")
                    console.log(faturamentoDesonerado)
                    console.log("aliquota Efetiva IVA")
                    console.log(aliquotaEfetivaIva)

                    const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva
                    console.log("Impostos Desonerados: " + (atividade.faturamento - faturamentoDesonerado))
                    console.log("Valor novo imposto - IVA (mês): " + valorImpostosNovos)
                    console.log("Valor IBS (mês): " + (faturamentoDesonerado * aliquotaEfetivaIbs))
                    console.log("Valor CBS (mês): " + (faturamentoDesonerado * aliquotaEfetivaCbs))
                    const valorMensalServicoAposReforma = faturamentoDesonerado + valorImpostosNovos

                    console.log("Valor Mensal do serviço após a reforma: " + valorMensalServicoAposReforma)
                    console.log("Valor Anual do serviço após a reforma: " + (valorMensalServicoAposReforma * 12))

                    if(valorMensalServicoAposReforma > atividade.faturamento){
                      const aumentoValorFinal = (valorMensalServicoAposReforma - atividade.faturamento) * 100 / atividade.faturamento
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
                    const novoValorServiço = faturamentoDesonerado + valorCbs + valorIbs
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
                    let custoAtual = atividade.faturamento
                    if(meuRegime == "Lucro Real"){
                        if(atividade.temCreditoPisCofins){
                          console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                          custoAtual = custoAtual - (custoAtual * 0.0925)
                        }else{
                          console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                        }
                    }

                    console.log("seu custo atual com esse serviço é: " + custoAtual)

                    // NOVO CUSTO (CUSTO APÓS REFORMA)
                    const novoCusto = faturamentoDesonerado

                    console.log("Seu novo custo será: " + novoCusto
                    )



                  }else{

                    if(atividade.regimeTributario == "Lucro Presumido"){
                        console.log("atividade " + (index + 1) + " é do lucro presumido")
                      // LUCRO PRESUMIDO
                          const pisCo = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo / 100 : 0
                          const iss = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss / 100 : 0

                          let aliquotaDesonerada = 0
                          let faturamentoDesonerado

                        
                          //CONFERIR REDUÇÃO IVA CNAE

                          let reducaoIva = 0
          
                          let aliquotaEfetivaIva = ivaBruto 
                          let aliquotaEfetivaIbs = ibsBruto
                          let aliquotaEfetivaCbs = cbsBruto

                          // Se cair aqui é pq é serviço, tem só CNAE
                          console.log("MÉTODO ATUAL:")
                          console.log(atividade.metodo)
                          if(atividade.metodo == "Por CNPJ"){
                            // Caso método == cnpj
                            
                            aliquotaDesonerada = pisCo + iss
                            faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)
                            
                            // Conferir se tem beneficio
                            if(atividade.beneficio){
                              // Se tiver benefício, ajustar os valores, se não tiver, deixar como foi setado antes
                              reducaoIva = atividade.beneficio
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
                                const pisCofinsComercio = this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.pisCo : 0
                                const issComercio = this.parametrosEntrada.tabelaLucroPresumido.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.comercial.iss : 0
                              console.log("eentrou comercio")
                                aliquotaDesonerada = pisCofinsComercio + issComercio
                              }else if(objOperacaoAtual.colunaParametros == "serviços"){
                                const pisCofinsServico = this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.pisCo : 0
                                const issServico = this.parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroPresumido.servicos.iss : 0
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

                        faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)
                        
                        const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva

                        const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                        console.log("impostos desonerados: " + (atividade.faturamento - faturamentoDesonerado))

                        console.log("Valor IBS: " + (aliquotaEfetivaIbs * faturamentoDesonerado))
                        console.log("Valor CBS: " + (aliquotaEfetivaCbs * faturamentoDesonerado))

                        console.log("novo valor do serviço: " + novoValorServiço)


                        // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                        let custoAtual = atividade.faturamento
                        if(meuRegime == "Lucro Real"){
                            if(atividade.temCreditoPisCofins){
                              console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                              custoAtual = custoAtual - (custoAtual * 0.0925)
                            }else{
                              console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                            }
                        }

                        console.log("seu custo atual com esse serviço é: " + custoAtual)

                        // NOVO CUSTO (CUSTO APÓS REFORMA)
                        const novoCusto = faturamentoDesonerado

                        console.log("Seu novo custo será: " + novoCusto
                        )

                    }else if(atividade.regimeTributario == "Lucro Real"){
                        console.log("atividade " + (index + 1) + " é do lucro real")
                        // LUCRO REAL
                        const pisCo = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo / 100 : 0
                        const iss = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss / 100 : 0

                        let aliquotaDesonerada = 0
                        let faturamentoDesonerado 

                      
                        //CONFERIR REDUÇÃO IVA CNAE

                        let reducaoIva = 0
        
                        let aliquotaEfetivaIva = ivaBruto
                        let aliquotaEfetivaIbs = ibsBruto
                        let aliquotaEfetivaCbs = cbsBruto

                        // Se cair aqui é pq é serviço, tem só CNAE
                        console.log("MÉTODO ATUAL:")
                        console.log(atividade.metodo)
                        if(atividade.metodo == "Por CNPJ"){
                          // Caso método == cnpj

                          aliquotaDesonerada = pisCo + iss
                          faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)

                          // Conferir se tem beneficio
                          if(atividade.beneficio){
                            reducaoIva = atividade.beneficio
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
                              const pisCofinsComercio = this.parametrosEntrada.tabelaLucroReal.comercial.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.pisCo : 0
                              const issComercio = this.parametrosEntrada.tabelaLucroReal.comercial.iss !== null ? this.parametrosEntrada.tabelaLucroReal.comercial.iss : 0
                              aliquotaDesonerada = pisCofinsComercio + issComercio
                            }else if(objOperacaoAtual.colunaParametros == "serviços"){
                              console.log("eentrou serviço")
                              const pisCofinsServico = this.parametrosEntrada.tabelaLucroReal.servicos.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.pisCo : 0
                              const issServico = this.parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? this.parametrosEntrada.tabelaLucroReal.servicos.iss : 0
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
                      faturamentoDesonerado = atividade.faturamento - (atividade.faturamento * aliquotaDesonerada)
                      
                      const valorImpostosNovos = faturamentoDesonerado * aliquotaEfetivaIva

                      const novoValorServiço = faturamentoDesonerado + valorImpostosNovos

                      console.log("impostos desonerados: " + (atividade.faturamento - faturamentoDesonerado))

                      console.log("Valor IBS: " + (aliquotaEfetivaIbs * faturamentoDesonerado))
                      console.log("Valor CBS: " + (aliquotaEfetivaCbs * faturamentoDesonerado))

                      console.log("novo valor do serviço: " + novoValorServiço)



                      // CUSTO ATUAL (CUSTO ANTES DA REFORMA)
                      let custoAtual = atividade.faturamento
                      if(meuRegime == "Lucro Real"){
                          if(atividade.temCreditoPisCofins){
                            console.log("Nosso cliente é do lucro real e tem credito pis cofins")
                            custoAtual = custoAtual - (custoAtual * 0.0925)
                          }else{
                            console.log("Nosso cliente é do lucro real mas NÃO tem crédito pis cofins")
                          }
                      }

                      console.log("seu custo atual com esse serviço é: " + custoAtual)

                      // NOVO CUSTO (CUSTO APÓS REFORMA)
                      const novoCusto = faturamentoDesonerado

                      console.log("Seu novo custo será: " + novoCusto
                      )

                    }


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

                let valorBase

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
                const valorImpostosAtuais = valorBase * aliquotaDesonerar
                console.log("valor dos impostos atuais (a desonerar): " + valorImpostosAtuais)
                let valorDesonerado = valorBase - valorImpostosAtuais
                console.log("valor desonerado: " + valorDesonerado)

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

                // Coloquei meuRegime == "Pessoa Fisica", pois por padrão o pfRegimeRegular é false, e aqui queremos apenas o caso onde é pessoa física e não está no regime
                if(imovel.tipoAluguel == "Aluguel recebido" && (!pfRegimeRegular && meuRegime == "Pessoa Fisica")){
                    // locador for pf sem regime regular n tem IVA

                    // nao aplica iva 
                    console.log("como o locador desse imóvel é pesso física fora do regime regular, então não é aplicado o IVA")
                    console.log("valor final: " + valorDesonerado)
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
                        const valorNovosTributos = valorBaseNovosTributosSimu1 * aliquotaFinal
      
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
                            const valorFinalSimu1SemCredito = valorDesonerado + valorNovosTributos
                            if((imovel.tipoAluguel == 'Aluguel recebido' && imovel.regimeOutro == "Simples Nacional")){
                              console.log("Como o outro é o locatário e simples nacional, caso ele opte por estar no regime regular, na simulação 1 ele terá crédito de " + valorNovosTributos + " e na simulaçao 2 ele terá um crédito de " + novosTributosSimu2 + ", caso ele opte por ficar fora do regime regular esses valores passarão a ser custo.")
                            }else{
                              console.log("Como você é o locatário e simples nacional, caso você opte por estar no regime regular, na simulação 1 você terá crédito de " + valorNovosTributos + " e na simulaçao 2 você terá um crédito de " + novosTributosSimu2 + ", caso você opte por ficar fora do regime regular esses valores passarão a ser custo.")
                            }

                            console.log("Valor final simulação 1 Com Crédito: " + (valorFinalSimu1SemCredito - valorNovosTributos))
                            console.log("Valor final simulação 1 Sem Crédito: " + (valorFinalSimu1SemCredito))
                            console.log("Valor final simulação 2 Com Crédito: " + (valorFinalSimu2SemCredito - novosTributosSimu2))
                            console.log("Valor final simulação 2 Sem Crédito: " + (valorFinalSimu2SemCredito))

                          }else{
                              // SIMULAÇÃO 1
                              console.log("Valor final simulação 1:")
                              // Somei "(600 * imovel.quantidade)" porque não tem que considerar a redução para o valor final, somente para chegar no valor dos novosTributos
                              const valorFinalSimu1SemCredito = valorDesonerado + valorNovosTributos
                              if(temCreditoIva){
                                console.log("Você tem direito ao crédito novo")
                                const valorFinalSimu1ComCredito = valorFinalSimu1SemCredito - valorNovosTributos
                                console.log("valor final simulação 1 com crédito: " + valorFinalSimu1ComCredito)
                              }else{
                                console.log("Você não tem direito ao crédito novo")
                                console.log("Valor final simulação 1 sem crédito: " + valorFinalSimu1SemCredito)
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
                          const valorFinalSimu1 = valorDesonerado + valorNovosTributos
                          console.log(valorFinalSimu1)
      
                          console.log("Valor final simulação 2:")
                          // Somei "(600 * imovel.quantidade)" porque na simulaçao 2 não tem redução em nenhuma hipotese
                          const valorFinalSimu2 = valorDesonerado + novosTributosSimu2
                          console.log(valorFinalSimu2)
      
                        }
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
              let valorImpostoAtual = 0
              switch(meuRegime){
                case "Lucro Presumido":
                  valorImpostoAtual = valorDeVenda * 3.65
                  break

                case "Lucro Real":
                  valorImpostoAtual = (valorDeVenda - valorDeAquisicao) * 9.25
                  break

              }
              console.log("valor imposto atual (antes da reforma): " + valorImpostoAtual)
              const valorDesonerado = valorDeVenda - valorImpostoAtual
              console.log("valor desonerado: " + valorDesonerado)

              
            

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


            })
          }





          // BENS MÓVEIS - LOCAÇÃO
          if(totalMoveisLocacao.length > 0){
            const pisCoLucroPresumidoLocacao = this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroPresumido.locacao.pisCo : 0
            const pisCoLucroRealLocacao = this.parametrosEntrada.tabelaLucroReal.locacao.pisCo !== null ? this.parametrosEntrada.tabelaLucroReal.locacao.pisCo : 0
            const pisCoSimplesLocacao = this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo !== null ? this.parametrosEntrada.tabelaSimplesNacional.locacao.pisCo : 0

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
                let temCreditoIva = false
                let valorImpostosAtuais = 0
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
                  

                }else if(movel.tipoAluguel == 'Aluguel recebido'){
                    // Minha empresa é o locador
                    // Conferir se eu sou PF ou PJ, como ainda não coloquei a opção de eu ser PF, vai como se todos fossem PJ inicialmente
                    if(meuRegime == 'Lucro Presumido'){
                      aliquotaDesonerar = pisCoLucroPresumidoLocacao
                      if(movel.comOperador){
                        valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroPresumido.servicos.iss !== null ? parametrosEntrada.tabelaLucroPresumido.servicos.iss : 0)
                      }else{
                        valorImpostosAtuais = (valorBase * aliquotaDesonerar)
                      }
                    }else if(meuRegime == 'Lucro Real'){
                        aliquotaDesonerar = pisCoLucroRealLocacao
                        if(movel.comOperador){
                          valorImpostosAtuais = (valorBase * aliquotaDesonerar) + movel.valorMaoObra * (parametrosEntrada.tabelaLucroReal.servicos.iss !== null ? parametrosEntrada.tabelaLucroReal.servicos.iss : 0)
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
                            const aliquotaDesonerar = faixa?.aliquota
                            valorImpostosAtuais = valorBase * aliquotaDesonerar
                          }else{
                            // retirando o iss
                            const aliquotaDesonerar = faixa.aliquota - (dadosAnexo.reparticao[faixaIndex].iss * (faixa.aliquota))
                            valorImpostosAtuais = valorBase * aliquotaDesonerar
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

                // Crédito antes reforma
                console.log("O crédito do locatário atual é: " + creditoAtual)

                // sempre no valor base
                const custoAtual = valorBase - creditoAtual
                console.log("custoAtual: " + custoAtual)


                // ONERAR NOVOS IMPOSTOS

                let baseIva = valorDesonerado
                const aliquotaIva = 0.28
                const valorNovosImpostos = baseIva * aliquotaIva
                const novoValorTotal = valorDesonerado + valorNovosImpostos


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

              // IMPOSTOS ATUAIS (ANTES DA REFORMA) ***************************************************************************************************************

              // Produtos num geral, sempre olhados pelo regime do VENDEDOR, como nesse caso o cliente que está usando nosso sistema é o vendedor:
              if(meuRegime == "Simples Nacional"){
                if(produtoVendido.tipoOperacao == "Revenda" || produtoVendido.tipoOperacao == "Revenda - Consumidor final fora do Estado"){
                  // Buscar dados no anexo II
                  const dadosAnexo = anexos.find(elem => elem.anexo == "II")
                  const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                      return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                  })

                  if(faixaIndex !== undefined){
                    console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                    const faixa = dadosAnexo?.tabela1[faixaIndex]    

                    if(faixa){
                        const aliquotaDesonerar = faixa.aliquota
                        console.log("aliquota a desonerar: " + aliquotaDesonerar)
                        valorImpostosAtuais = valorBase * aliquotaDesonerar
                    }else{
                      console.log("Não está encontrando faixa")
                    }

                  }else{
                    console.log("faixa index está undefined")
                  }   
                }else if(produtoVendido.tipoOperacao == "Indústria" || produtoVendido.tipoOperacao == "Indústria - Consumidor final fora do Estado"){
                  // Buscar dados no anexo I
                  const dadosAnexo = anexos.find(elem => elem.anexo == "I")
                  const faixaIndex = dadosAnexo?.tabela1.findIndex(elem => {
                      return rbt12 > elem.rbt12[0] && rbt12 < elem.rbt12[1]
                  })

                  if(faixaIndex !== undefined){
                    console.log("Faixa na qual se encontra: " + (faixaIndex + 1))
                    const faixa = dadosAnexo?.tabela1[faixaIndex]    

                    if(faixa){
                        const aliquotaDesonerar = faixa.aliquota
                        console.log("aliquota a desonerar: " + aliquotaDesonerar)
                        valorImpostosAtuais = valorBase * aliquotaDesonerar
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
                const aliquotaDesonerar = produtoVendido.icms + produtoVendido.icmsDifal + produtoVendido.icmsSt + produtoVendido.ipi
                console.log("aliquota a desonerar: " + aliquotaDesonerar)

                valorImpostosAtuais = valorBase * aliquotaDesonerar

              }

              console.log("valor dos impostos atuais (antes da reforma): " + valorImpostosAtuais)

              let valorDesonerado = valorBase - valorImpostosAtuais

              console.log("Valor Desonerado: " + valorDesonerado)

              // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


              // IMPOSTOS NOVOS ******************************************************************************************************************************************
              let reducaoIva = 0
              let aliquotaIva = 0.28

              if(produtoVendido.beneficio){
                // Se vier um numero maior que zero
                reducaoIva = produtoVendido.beneficio
              }else{
                // se vier zero ou qualquer tipo de null, undefined...
                reducaoIva = 0
              }

              console.log("Reducao IVA: " + reducaoIva)

              aliquotaIva = aliquotaIva - (aliquotaIva * reducaoIva)

              const novosImpostos = valorDesonerado * aliquotaIva
              console.log("Novos impostos: " + novosImpostos)


              const novoValorProduto = valorDesonerado + novosImpostos
              console.log("Novo valor do produto: " + novoValorProduto)



            })


          }





          // PRODUTOS ADQUIRIDOS
          if(totalProdutosAdquiridos.length > 0){
            let faturamentoTotalMensal = 0
            totalProdutosAdquiridos.forEach(produto => {
              faturamentoTotalMensal += produto.valorOperacao
            })

            const rbt12 = dadosEmpresaAtual ? Number(dadosEmpresaAtual.faturamento_mensal_medio) * 12 : faturamentoTotalMensal * 12

            console.log("TEM PRODUTOS VENDIDOS")
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
              let temCreditoIva = false
              let valorImpostosAtuais = 0

              // IMPOSTOS ATUAIS (ANTES DA REFORMA) ***************************************************************************************************************

              // Produtos num geral, sempre olhados pelo regime do VENDEDOR, como nesse caso o cliente que está usando nosso sistema é o comprador, o outro é o vendedor:
              if(produtoAdquirido.regimeTributarioOutro == "Simples Nacional"){

                if(produtoAdquirido.fornecedorIndustrial){
                  // Pegar parametros da coluna industrial
                  aliquotaDesonerar = (produtoAdquirido.icms  + produtoAdquirido.ipi + produtoAdquirido.pisCofins)
                }else{
                  // Caso não industrial pegar parametros da coluna comercial
                  aliquotaDesonerar = (produtoAdquirido.icms + produtoAdquirido.pisCofins)
                }

                valorImpostosAtuais = valorBase * aliquotaDesonerar

              }else{
                // Tanto Lucro Real quanto Lucro Presumido tem que calcular os impostos atuais através dos parametros de entrada, então pode ser a mesma coisa
                const aliquotaDesonerar = produtoAdquirido.icms + produtoAdquirido.pisCofins + produtoAdquirido.ipi 
                console.log("aliquota a desonerar: " + aliquotaDesonerar)
                valorImpostosAtuais = valorBase * aliquotaDesonerar

              }

              let valorDesonerado = valorBase - valorImpostosAtuais

              console.log("Valor Desonerado: " + valorDesonerado)

              // FIM DOS IMPOSTOS ATUAIS *******************************************************************************************************************************************


              // IMPOSTOS NOVOS ******************************************************************************************************************************************
              let reducaoIva = 0
              let aliquotaIva = 0.28
              
              if(produtoAdquirido.beneficio){
                // Se vier um numero maior que zero
                reducaoIva = produtoAdquirido.beneficio
              }else{
                // se vier zero ou qualquer tipo de null, undefined...
                reducaoIva = 0
              }

              console.log("Reducao IVA: " + reducaoIva)

              aliquotaIva = aliquotaIva - (aliquotaIva * reducaoIva)

              const novosImpostos = valorDesonerado * aliquotaIva
              console.log("Novos impostos: " + novosImpostos)


              const novoValorProduto = valorDesonerado + novosImpostos
              console.log("Novo valor do produto: " + novoValorProduto)



            })
          }



    }

}