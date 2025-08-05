import { AntesReformaCategoria, Calculo, Categoria, CategoriaType, DepoisReformaCategoria, Prisma, Regime, RegimesType, TipoUsuarioType } from "@prisma/client"

export interface RespostaCategoriasRepository {

    pegarCategorias(): Promise<Categoria[]>

    criarARCategoria(data: Prisma.AntesReformaCategoriaUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    criarDRCategoria(data: Prisma.DepoisReformaCategoriaUncheckedCreateInput[]): Promise<Prisma.BatchPayload>

    pegarARCategoriaCalculoAtual(calculoId: string, regimeId: string, categoriaId: string): Promise<AntesReformaCategoria | null>

    pegarDRCategoriaCalculoAtual(antesReformaId: string): Promise<DepoisReformaCategoria[]>

    pegarIdCategoriaPorNome(categoria: CategoriaType): Promise<Categoria | null>
    

}