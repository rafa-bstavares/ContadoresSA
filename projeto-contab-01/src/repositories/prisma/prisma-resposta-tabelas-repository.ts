import { AntesReformaCaixa, AntesReformaCompras, AntesReformaDre, AntesReformaVendas, CaixaLinha, ComprasLinha, DepoisReformaCaixa, DepoisReformaCompras, DepoisReformaDre, DepoisReformaVendas, DreLinha, LinhasCaixaType, LinhasDreType, LinhasTotalCompras, LinhasTotalVendas, Prisma, VendasLinha } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { RespostaTabelasRepository } from "../resposta-tabelas-repository";


export class PrismaRespostaTabelasRepository implements RespostaTabelasRepository {

    // TABELA VENDAS
    async pegarIdVendaPorLinha(linhaVenda: LinhasTotalVendas): Promise<VendasLinha | null> {
        const objLinhaVenda = await prisma.vendasLinha.findUnique({
            where: {
                linha_vendas: linhaVenda
            }
        })
        return objLinhaVenda
    }

    async salvarTabelaVendasAR(valoresVendasAR: Prisma.AntesReformaVendasUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.antesReformaVendas.createMany({
            data: valoresVendasAR
        })
        return objContagemSalvos
    }

    async salvarTabelaVendasDR(valoresVendasDR: Prisma.DepoisReformaVendasUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.depoisReformaVendas.createMany({
            data: valoresVendasDR
        })
        return objContagemSalvos
    }

    // Pega os NOMES (não os valores) das linhas que a tabela vendas deve ter, que estão salvos na tabela LinhasVendas
    async pegarLinhasVendas(): Promise<VendasLinha[]> {
        const arrLinhasVendas = await prisma.vendasLinha.findMany()
        return arrLinhasVendas
    }

    async pegarARLinhaVendasCalculoAtual(calculoId: string, regimeId: string, linhaVendasId: string): Promise<AntesReformaVendas | null> {
        const objARLinhaVenda = await prisma.antesReformaVendas.findFirst({
            where: {
                calculo_id: calculoId,
                regime_id: regimeId,
                linha_vendas_id: linhaVendasId
            }
        })
        return objARLinhaVenda
    }

    async pegarDRLinhaVendasCalculoAtual(antesReformaVendasId: string): Promise<DepoisReformaVendas[]> {
        const arrDRLinhaVenda = await prisma.depoisReformaVendas.findMany({
            where: {
                antes_reforma_vendas_id: antesReformaVendasId
            }
        })
        return arrDRLinhaVenda
    }

    
    // TABELA COMPRAS
    async pegarIdComprasPorLinha(linhaCompras: LinhasTotalCompras): Promise<ComprasLinha | null> {
        const objLinhaCompra = await prisma.comprasLinha.findUnique({
            where: {
                linha_compras: linhaCompras
            }
        })
        return objLinhaCompra
    }

    async salvarTabelaComprasAR(valoresComprasAR: Prisma.AntesReformaComprasUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.antesReformaCompras.createMany({
            data: valoresComprasAR
        })
        return objContagemSalvos
    }

    async salvarTabelaComprasDR(valoresComprasDR: Prisma.DepoisReformaComprasUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.depoisReformaCompras.createMany({
            data: valoresComprasDR
        })
        return objContagemSalvos
    }

    // Pega os NOMES (não os valores) das linhas que a tabela compras deve ter, que estão salvos na tabela LinhasCompras   
    async pegarLinhasCompras(): Promise<ComprasLinha[]> {
        const arrLinhasCompras = await prisma.comprasLinha.findMany()
        return arrLinhasCompras
    }

    async pegarARLinhaComprasCalculoAtual(calculoId: string, regimeId: string, linhaComprasId: string): Promise<AntesReformaCompras | null> {
        const objARLinhaCompras = await prisma.antesReformaCompras.findFirst({
            where: {
                calculo_id: calculoId,
                regime_id: regimeId,
                linha_compras_id: linhaComprasId
            }
        })
        return objARLinhaCompras
    }

    async pegarDRLinhaComprasCalculoAtual(antesReformaComprasId: string): Promise<DepoisReformaCompras[]> {
        const arrDRLinhaCompras = await prisma.depoisReformaCompras.findMany({
            where: {
                antes_reforma_compras_id: antesReformaComprasId
            }
        })
        return arrDRLinhaCompras
    }


    // TABELA CAIXA
    async pegarIdCaixaPorLinha(linhaCaixa: LinhasCaixaType): Promise<CaixaLinha | null> {   
        const objLinhaCaixa = await prisma.caixaLinha.findUnique({
            where: {
                linha_caixa: linhaCaixa
            }
        })
        return objLinhaCaixa
    }

    async salvarTabelaCaixaAR(valoresCaixaAR: Prisma.AntesReformaCaixaUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.antesReformaCaixa.createMany({
            data: valoresCaixaAR
        })
        return objContagemSalvos
    }

    async salvarTabelaCaixaDR(valoresCaixaDR: Prisma.DepoisReformaCaixaUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.depoisReformaCaixa.createMany({
            data: valoresCaixaDR
        })
        return objContagemSalvos
    }

    // Pega os NOMES (não os valores) das linhas que a tabela Caixa deve ter, que estão salvos na tabela LinhasCaixa    
    async pegarLinhasCaixa(): Promise<CaixaLinha[]> {
        const arrLinhasCaixa = await prisma.caixaLinha.findMany()
        return arrLinhasCaixa
    }

    async pegarARLinhaCaixaCalculoAtual(calculoId: string, regimeId: string, linhaCaixaId: string): Promise<AntesReformaCaixa | null> {
        const objARLinhaCaixa = await prisma.antesReformaCaixa.findFirst({
            where: {
                calculo_id: calculoId,
                regime_id: regimeId,
                linha_caixa_id: linhaCaixaId
            }
        })
        return objARLinhaCaixa
    }

    async pegarDRLinhaCaixaCalculoAtual(antesReformaCaixaId: string): Promise<DepoisReformaCaixa[]> {
        const arrDRLinhaCaixa = await prisma.depoisReformaCaixa.findMany({
            where: {
                antes_reforma_caixa_id: antesReformaCaixaId
            }
        })
        return arrDRLinhaCaixa
    }


    // TABELA DRE
    async pegarIdDrePorLinha(linhaDre: LinhasDreType): Promise<DreLinha | null> {
        const objLinhaDre = await prisma.dreLinha.findUnique({
            where: {
               linha_dre: linhaDre 
            }
        })
        return objLinhaDre
    }

    async salvarTabelaDreAR(valoresDreAR: Prisma.AntesReformaDreUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.antesReformaDre.createMany({
            data: valoresDreAR
        })
        return objContagemSalvos
    }

    async salvarTabelaDreDR(valoresDreDR: Prisma.DepoisReformaDreUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        const objContagemSalvos = await prisma.depoisReformaDre.createMany({
            data:  valoresDreDR
        })
        return objContagemSalvos
    }

    // Pega os NOMES (não os valores) das linhas que a tabela Dre deve ter, que estão salvos na tabela LinhasDre    
    async pegarLinhasDre(): Promise<DreLinha[]> {
        const arrLinhasDre = await prisma.dreLinha.findMany()
        return arrLinhasDre
    }

    async pegarARLinhaDreCalculoAtual(calculoId: string, regimeId: string, linhaDreId: string): Promise<AntesReformaDre | null> {
        const objARLinhaDre = await prisma.antesReformaDre.findFirst({
            where: {
                calculo_id: calculoId,
                regime_id: regimeId,
                linha_dre_id: linhaDreId
            }
        })
        return objARLinhaDre
    }

    async pegarDRLinhaDreCalculoAtual(antesReformaDreId: string): Promise<DepoisReformaDre[]> {
        const arrDRLinhaDre = await prisma.depoisReformaDre.findMany({
            where: {
                antes_reforma_dre_id: antesReformaDreId
            }
        })
        return arrDRLinhaDre
    }

}