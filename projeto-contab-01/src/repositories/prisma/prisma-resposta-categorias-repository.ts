import { AntesReformaCategoria, Calculo, Categoria, CategoriaType, DepoisReformaCategoria, Prisma, Regime, RegimesType, TipoUsuarioType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { RespostaCategoriasRepository } from "../resposta-categorias-repository";


export class PrismaRespostaCategoriasRepository implements RespostaCategoriasRepository {

    async pegarCategorias(): Promise<Categoria[]> {
        
        const categorias = await prisma.categoria.findMany()

        return categorias

    }

    async criarARCategoria(data: Prisma.AntesReformaCategoriaUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        
        const ARCategoria = await prisma.antesReformaCategoria.createMany({
            data
        })

        return ARCategoria

    }

    async criarDRCategoria(data: Prisma.DepoisReformaCategoriaUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        
        const DRCategoria = await prisma.depoisReformaCategoria.createMany({
            data
        })

        return DRCategoria

    }

    async pegarARCategoriaCalculoAtual(calculoId: string, regimeId: string, categoriaId: string): Promise<AntesReformaCategoria | null> {
        
        const ARCategoriaAtual = await prisma.antesReformaCategoria.findFirst({
            where: {
                calculo_id: calculoId,
                regime_id: regimeId,
                categoria_id: categoriaId
            }
        })

        return ARCategoriaAtual

    }

    async pegarDRCategoriaCalculoAtual(antesReformaId: string): Promise<DepoisReformaCategoria[]> {
        const arrDRCategoriaAtual = await prisma.depoisReformaCategoria.findMany({
            where: {
                antes_reforma_categoria_id: antesReformaId
            }
        })

        return arrDRCategoriaAtual
    }

    async pegarIdCategoriaPorNome(categoria: CategoriaType): Promise<Categoria | null> {
        
        const objCategoria = await prisma.categoria.findUnique({
            where: {
                categoria
            }
        })

        return objCategoria

    }

}