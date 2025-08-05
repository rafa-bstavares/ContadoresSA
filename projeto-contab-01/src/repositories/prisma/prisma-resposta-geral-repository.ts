import { Calculo, CalculoPorCpf, CalculoPorEmpresa, Regime, RegimesType, TipoUsuarioType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { RespostaGeralRepository } from "../resposta-geral-repository";


export class PrismaRespostaGeralRepository implements RespostaGeralRepository {

    async criarCalculo(usuarioId: string, tipoUsuario: TipoUsuarioType, nomeCalculo: string): Promise<Calculo> {

        // Se o nome do calculo vier vazio temos que preencher um nome padrão
        if(nomeCalculo == ""){
            const calculosUsuario = await prisma.calculo.findMany({
                where: {
                    usuario_id: usuarioId
                }
            })
            const quantidadeCalculos = calculosUsuario.length
            nomeCalculo = "Calculo-" + (quantidadeCalculos + 1) 
        }

        const data = {
            usuario_id: usuarioId,
            tipo_usuario: tipoUsuario,
            nome_calculo: nomeCalculo
        }
        
        const objCalculoCriado = await prisma.calculo.create({
            data
        })

        return objCalculoCriado

    }

    async criarCalculoPorEmpresa(calculoId: string, empresaId: string): Promise<CalculoPorEmpresa> {

        const data = {
            calculo_id: calculoId,
            empresa_id: empresaId
        }
        
        const objCalculoPorEmpresa = await prisma.calculoPorEmpresa.create({
            data
        })

        return objCalculoPorEmpresa

    }

    async pegarRegimes(): Promise<Regime[]> {
        
        const objRegimes = await prisma.regime.findMany()

        return objRegimes

    }

    async pegarIdRegimePorNome(regime: RegimesType): Promise<Regime | null> {
        
        const objRegime = await prisma.regime.findUnique({
            where: {
                regime
            }
        })

        return objRegime

    }

    async pegarCalculoPorId(calculoId: string): Promise<Calculo | null> {
        
        const objCalculo = await prisma.calculo.findUnique({
            where: {
                id: calculoId
            }
        })

        return objCalculo

    }

    async pegarEmpresaIdPorCalculoId(calculoId: string): Promise<CalculoPorEmpresa | null> {
        const linhaCalculoPorEmpresa = await prisma.calculoPorEmpresa.findFirst({
            where:{
                calculo_id: calculoId
            }
        })


        return linhaCalculoPorEmpresa
    }

    async pegarCpfPorCalculoId(calculoId: string): Promise<CalculoPorCpf | null> {
        const linhaCalculoPorCpf = await prisma.calculoPorCpf.findFirst({
            where: {
                calculo_id: calculoId
            }
        })
        return linhaCalculoPorCpf
    }

    async pegarResultadosSalvosUsuario(usuarioId: string): Promise<Calculo[]> {
        const resultadosSalvosUsuario = await prisma.calculo.findMany({
            where: {
                usuario_id: usuarioId
            }
        })
        return resultadosSalvosUsuario
    }

}