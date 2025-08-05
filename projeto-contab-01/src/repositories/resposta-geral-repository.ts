import { Calculo, CalculoPorCpf, CalculoPorEmpresa, Regime, RegimesType, TipoUsuarioType } from "@prisma/client"

export interface RespostaGeralRepository {

    criarCalculo(usuarioId: string, tipoUsuario: TipoUsuarioType, nomeCalculo: string): Promise<Calculo>

    criarCalculoPorEmpresa(calculoId: string, empresaId: string): Promise<CalculoPorEmpresa>

    pegarRegimes(): Promise<Regime[]>

    pegarIdRegimePorNome(regime: RegimesType): Promise<Regime | null>

    pegarCalculoPorId(calculoId: string): Promise<Calculo | null>
    
    pegarEmpresaIdPorCalculoId(calculoId: string): Promise<CalculoPorEmpresa | null>

    pegarCpfPorCalculoId(calculoId: string): Promise<CalculoPorCpf | null>

    pegarResultadosSalvosUsuario(usuarioId: string): Promise<Calculo[]>

}