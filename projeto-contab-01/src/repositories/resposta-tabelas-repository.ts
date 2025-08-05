import { AntesReformaCaixa, AntesReformaCompras, AntesReformaDre, AntesReformaVendas, CaixaLinha, ComprasLinha, DepoisReformaCaixa, DepoisReformaCompras, DepoisReformaDre, DepoisReformaVendas, DreLinha, LinhasCaixaType, LinhasDreType, LinhasTotalCompras, LinhasTotalVendas, Prisma, VendasLinha } from "@prisma/client";


export interface RespostaTabelasRepository {

    // TABELA VENDAS
    pegarIdVendaPorLinha(linhaVenda: LinhasTotalVendas): Promise<VendasLinha | null>

    salvarTabelaVendasAR(valoresVendasAR: Prisma.AntesReformaVendasUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    salvarTabelaVendasDR(valoresVendasDR: Prisma.DepoisReformaVendasUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    // Pega os NOMES (não os valores) das linhas que a tabela vendas deve ter, que estão salvos na tabela VendasLinha
    pegarLinhasVendas(): Promise<VendasLinha[]>

    pegarARLinhaVendasCalculoAtual(calculoId: string, regimeId: string, linhaVendasId: string): Promise<AntesReformaVendas | null>

    pegarDRLinhaVendasCalculoAtual(antesReformaVendasId: string): Promise<DepoisReformaVendas[]>

    
    // TABELA COMPRAS
    pegarIdComprasPorLinha(linhaCompras: LinhasTotalCompras): Promise<ComprasLinha | null>

    salvarTabelaComprasAR(valoresComprasAR: Prisma.AntesReformaComprasUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    salvarTabelaComprasDR(valoresComprasDR: Prisma.DepoisReformaComprasUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    // Pega os NOMES (não os valores) das linhas que a tabela compras deve ter, que estão salvos na tabela ComprasLinha
    pegarLinhasCompras(): Promise<ComprasLinha[]>

    pegarARLinhaComprasCalculoAtual(calculoId: string, regimeId: string, linhaComprasId: string): Promise<AntesReformaCompras | null>

    pegarDRLinhaComprasCalculoAtual(antesReformaComprasId: string): Promise<DepoisReformaCompras[]>


    // TABELA CAIXA
    pegarIdCaixaPorLinha(linhaCaixa: LinhasCaixaType): Promise<CaixaLinha | null>

    salvarTabelaCaixaAR(valoresCaixaAR: Prisma.AntesReformaCaixaUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    salvarTabelaCaixaDR(valoresCaixaDR: Prisma.DepoisReformaCaixaUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    // Pega os NOMES (não os valores) das linhas que a tabela caixa deve ter, que estão salvos na tabela CaixaLinha
    pegarLinhasCaixa(): Promise<CaixaLinha []>

    pegarARLinhaCaixaCalculoAtual(calculoId: string, regimeId: string, linhaCaixaId: string): Promise<AntesReformaCaixa | null>

    pegarDRLinhaCaixaCalculoAtual(antesReformaCaixaId: string): Promise<DepoisReformaCaixa[]>


    // TABELA DRE
    pegarIdDrePorLinha(linhaDre: LinhasDreType): Promise<DreLinha | null>

    salvarTabelaDreAR(valoresDreAR: Prisma.AntesReformaDreUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    salvarTabelaDreDR(valoresDreDR: Prisma.DepoisReformaDreUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    // Pega os NOMES (não os valores) das linhas que a tabela DRE deve ter, que estão salvos na tabela DreLinha
    pegarLinhasDre(): Promise<DreLinha[]>

    pegarARLinhaDreCalculoAtual(calculoId: string, regimeId: string, linhaDreId: string): Promise<AntesReformaDre | null>

    pegarDRLinhaDreCalculoAtual(antesReformaDreId: string): Promise<DepoisReformaDre[]>


}