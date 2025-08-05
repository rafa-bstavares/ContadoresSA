import { CnaesRepository } from "../repositories/cnaes-repository";
import { EmpresasRepository } from "../repositories/empresas-repository";
import { RespostaCategoriasRepository } from "../repositories/resposta-categorias-repository";
import { RespostaGeralRepository } from "../repositories/resposta-geral-repository";
import { RespostaTabelasRepository } from "../repositories/resposta-tabelas-repository";
import { UsersRepository } from "../repositories/users-repository";
import { respostaFinalCaluloPessoaFisicaType } from "./calcularPessoaFisicaUseCase";
import { anosType, antesReformaComprasType, antesReformaDreCaixaType, antesReformaVendasType, linhaArDrDiferencas, objAntesReforma, objAreaComprasTransicaoType, objAreaComprasType, objAreaVendasTransicaoType, objAreaVendasType, objDepoisReforma, objDepoisReformaDreCaixa, objItemFinal, respostaFinalCaluloEmpresaType, tiposRegime, valorInicialObjRegime } from "./calcularSimplificadoUseCase";
import { AcessoNegadoErro } from "./errors/acesso-negado";
import { RecursoNaoEncontradoErro } from "./errors/recurso-nao-encontrado-erro";
import { UsuarioJaCadastrouEmpresa } from "./errors/usuario-ja-cadastrou-empresa";

export class PegarResultadoUseCase {
    constructor(private EmpresaRepository: EmpresasRepository, private RespGeralRepository: RespostaGeralRepository, private RespCategoriasRepository: RespostaCategoriasRepository, private RespTabelasRepository: RespostaTabelasRepository){}



    async execute(calculoId: string, usuarioId: string){

        type respostaFinalCaluloGenericoType = respostaFinalCaluloEmpresaType | respostaFinalCaluloPessoaFisicaType
        let respostaFinalCalculo: respostaFinalCaluloGenericoType

        const respCategoriasRepo = this.RespCategoriasRepository
        const respGeralRepo = this.RespGeralRepository
        const respTabelasRepo = this.RespTabelasRepository
        const empresaRepo = this.EmpresaRepository


        // Conferir se esse calculo é desse usuário
        const objCalculo = await respGeralRepo.pegarCalculoPorId(calculoId)

        // Caso não encontre calculo com esse id
        if(!objCalculo){
            throw new RecursoNaoEncontradoErro()
        }

        // Caso encontre calculo mas o id do usuário não bata
        if(objCalculo.usuario_id !== usuarioId){
            throw new AcessoNegadoErro()
        }

        // Caso passe é pq encontrou o calculo e ele de fato é desse usuário
        // *********** Dividir entre Empresa e Pessoa Fisica
        if(objCalculo.tipo_usuario == "Empresa"){
            // *********** PEGAR INFORMAÇÕES BÁSICAS CALCULO (Se empresa -> cnpj e regime. Se Pessoa Física -> cpf)
                // Pegar um objeto da tabela CalculoPorEmpresa que contém o id da empresa que fez aquele calculo
            const linhaCalculoPorEmpresa = await respGeralRepo.pegarEmpresaIdPorCalculoId(objCalculo.id)

                // Caso não encontre empresa com aquele calculoId na tabela CalculoPorEmpresa
            if(!linhaCalculoPorEmpresa){
                throw new RecursoNaoEncontradoErro()
            }

                // Pegar os dados de fato da empresa 
            const dadosEmpresaAtual = await empresaRepo.buscarEmpresaPorEmpresaId(linhaCalculoPorEmpresa.empresa_id)

                // Caso não encontre aquela empresa no banco
            if(!dadosEmpresaAtual){
                throw new RecursoNaoEncontradoErro()
            }
            let meuRegime: tiposRegime
            switch(dadosEmpresaAtual.regime_tributario){
                case "LUCRO_PRESUMIDO":
                    meuRegime = "Lucro Presumido"
                    break
                case "LUCRO_REAL":
                    meuRegime = "Lucro Real"
                    break
                case "SIMPLES_NACIONAL":
                    meuRegime = "Simples Nacional"
                    break
                default:
                    meuRegime = "Lucro Real"
                    break
            }

            const respostaFinalCalculoEmpresa: respostaFinalCaluloEmpresaType = {
                tipoUsuario: "Empresa",
                simplesNacional: JSON.parse(JSON.stringify(valorInicialObjRegime)),
                lucroReal: JSON.parse(JSON.stringify(valorInicialObjRegime)),
                lucroPresumido: JSON.parse(JSON.stringify(valorInicialObjRegime)),
                meuRegime,
                cnpj: dadosEmpresaAtual.cnpj
            }
            // ****** FIM INFORMAÇÕES BÁSICAS

            // ****** Fazer loop nos regimes
            const regimes = await respGeralRepo.pegarRegimes()

            for(const linhaRegime of regimes){
                const regimeAtual = linhaRegime.regime
                const regimeAtualId = linhaRegime.id
                
                // **** PRIMEIRO FAZER LOOP CATEGORIAS
                const categorias = await respCategoriasRepo.pegarCategorias()
                for(const linhaCategoria of categorias){
                    const categoriaAtual = linhaCategoria.categoria
                    const categoriaAtualId = linhaCategoria.id

                    // encontrar o AR Categoria atual
                    const linhaARAtual = await respCategoriasRepo.pegarARCategoriaCalculoAtual(calculoId, regimeAtualId, categoriaAtualId)
                    if(linhaARAtual){
                        const objARAtual: objAntesReforma = {
                            valor: Number(linhaARAtual.valor),
                            valorImpostos: Number(linhaARAtual.valor_impostos),
                            valorDesonerado: Number(linhaARAtual.valor_desonerado),
                            custo: linhaARAtual.custo == null ? null : Number(linhaARAtual.custo),
                            porcentagemCargaTributaria: Number(linhaARAtual.porcentagem_carga_tributaria)
                        }

                        // encontrando os DR desse AR. Aqui embaixo é a variavel que guarda o array de objetos DR desse AR que estamos no loop atual
                        const arrDRAtualDb = await respCategoriasRepo.pegarDRCategoriaCalculoAtual(linhaARAtual.id)
                        // inicializo com valores vazios para caso algum ano não tenha sido salvo no banco ele retorna vazio
                        const arrDRAtualFinal: objDepoisReforma[] = [
                            {ano: "A2026", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2027", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2028", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2029", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2030", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2031", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2032", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2033", valor: 0, valorImpostos: 0, valorSemIva: 0, custo: 0, porcentagemCargaTributaria: 0},
                        ]
                        // loop nos DR pra preencher com os valores verdadeiros
                        for(const drAtual of arrDRAtualDb){
                            const anoDRAtual: anosType = drAtual.ano
                            const objDR = arrDRAtualFinal.find(objDR => objDR.ano == anoDRAtual)
                            if(objDR){
                                objDR.valor = Number(drAtual.valor)
                                objDR.valorImpostos = Number(drAtual.valor_impostos)
                                objDR.valorSemIva = Number(drAtual.valor_sem_iva)
                                objDR.custo = drAtual.custo == null ? null : Number(drAtual.custo)
                                objDR.porcentagemCargaTributaria = Number(drAtual.porcentagem_carga_tributaria)
                            }
                        }

                        // Adicionar AR e DR na categoria na respostaFinal
                        const objLinhaCategoriaAtual: objItemFinal = {
                            antesReforma: objARAtual,
                            depoisReforma: arrDRAtualFinal
                        }
                        respostaFinalCalculoEmpresa[regimeAtual][categoriaAtual].push(objLinhaCategoriaAtual)
                    }
                }
                // ******** FIM LOOP CATEGORIAS


                // ******* PREENCHER TABELA VENDAS
                    // Pega os NOMES (não os valores) das linhas que a tabela vendas deve ter, que estão salvos na tabela LinhasVendas
                const linhasVendas = await respTabelasRepo.pegarLinhasVendas()
                for(const linhaVenda of linhasVendas){
                    const linhaVendaAtual = linhaVenda.linha_vendas
                    // ID no nome da linha (vendasProdutos, servicosPrestados, ...)
                    const linhaVendaAtualId = linhaVenda.id

                    // Encontrar o AR Linha Vendas atual
                    const linhaARAtual = await respTabelasRepo.pegarARLinhaVendasCalculoAtual(calculoId, regimeAtualId, linhaVendaAtualId)
                    if(linhaARAtual){
                        const objLinhaVendasAR: antesReformaVendasType = {
                            valorAR: Number(linhaARAtual.valor_ar),
                            impostosAR: Number(linhaARAtual.impostos_ar),
                            valorDesonerado: Number(linhaARAtual.valor_desonerado),
                            porcentagemCargaTributariaAR: Number(linhaARAtual.porcentagem_carga_tributaria_ar)
                        }

                        // encontrando os DR desse AR. Aqui embaixo é a variavel que guarda o array de objetos DR desse AR que estamos no loop atual
                        // o id que é passado aqui embaixo é o id da linha do AntesReformaVendas
                        const arrDRAtualDb = await respTabelasRepo.pegarDRLinhaVendasCalculoAtual(linhaARAtual.id)
                        // inicializo com valores vazios para caso algum ano não tenha sido salvo no banco ele retorna vazio
                        const arrDRAtualFinal: objAreaVendasTransicaoType[] = [
                            {ano: "A2026", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2027", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2028", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2029", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2030", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2031", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2032", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                            {ano: "A2033", valor: 0, impostos: 0, valorSemIva: 0, porcentagemCargaTributaria: 0},
                        ]

                        // loop no array DR pra preencher o array de transição com os valores verdadeiros
                        for(const drAtual of arrDRAtualDb){
                            const anoDRAtual: anosType = drAtual.ano
                            const objDR = arrDRAtualFinal.find(objDR => objDR.ano == anoDRAtual)
                            if(objDR){
                                objDR.valor = Number(drAtual.valor)
                                objDR.impostos = Number(drAtual.impostos)
                                objDR.valorSemIva = Number(drAtual.valor_sem_iva)
                                objDR.porcentagemCargaTributaria = Number(drAtual.porcentagem_carga_tributaria)
                            }
                        }

                        // Adicionar AR e DR linha Vendas na resposta final
                        const objLinhaVendasAtual: objAreaVendasType = {
                            antesReforma: objLinhaVendasAR,
                            depoisReforma: arrDRAtualFinal
                        }
                        respostaFinalCalculoEmpresa[regimeAtual].totalVendas[linhaVendaAtual] = objLinhaVendasAtual
                    }

                }

                // ******* FIM TABELA VENDAS



                // ******* PREENCHER TABELA COMPRAS
                    // Pega os NOMES (não os valores) das linhas que a tabela Compras deve ter, que estão salvos na tabela LinhasCompras
                const linhasCompras = await respTabelasRepo.pegarLinhasCompras()
                for(const linhaCompra of linhasCompras){
                    const linhaCompraAtual = linhaCompra.linha_compras
                    // ID do nome da linha (comprasProdutos, servicosTomados, ...)
                    const linhaCompraAtualId = linhaCompra.id

                    // Encontrar o AR Linha Compras atual
                    const linhaARAtual = await respTabelasRepo.pegarARLinhaComprasCalculoAtual(calculoId, regimeAtualId, linhaCompraAtualId)
                    if(linhaARAtual){
                        const objLinhaComprasAR: antesReformaComprasType = {
                             valorAR: Number(linhaARAtual.valor_ar),
                             impostosAR: Number(linhaARAtual.impostos_ar),
                             valorDesonerado: Number(linhaARAtual.valor_desonerado),
                             custoAR: Number(linhaARAtual.custo_ar),
                             creditoAR: Number(linhaARAtual.credito_ar),
                             porcentagemCargaTributariaAR: Number(linhaARAtual.porcentagem_carga_tributaria_ar),
                             porcentagemCustoEfetivoAR: Number(linhaARAtual.porcentagem_custo_efetivo_ar)
                        }

                        // encontrando os DR desse AR. Aqui embaixo é a variavel que guarda o array de objetos DR desse AR que estamos no loop atual
                        // o id que é passado aqui embaixo é o id da linha do AntesReformaCompras
                        const arrDRAtualDb = await respTabelasRepo.pegarDRLinhaComprasCalculoAtual(linhaARAtual.id)
                        // inicializo com valores vazios para caso algum ano não tenha sido salvo no banco ele retorna vazio
                        const arrDRAtualFinal: objAreaComprasTransicaoType[] = [
                            {ano: "A2026", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2027", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2028", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2029", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2030", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2031", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2032", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                            {ano: "A2033", valor: 0, impostos: 0, valorSemIva: 0, credito: 0, custo: 0, porcentagemCargaTributaria: 0, porcentagemCustoEfetivo: 0},
                        ]

                        // loop no array DR pra preencher o array de transição com os valores verdadeiros
                        for(const drAtual of arrDRAtualDb){
                            const anoDRAtual: anosType = drAtual.ano
                            const objDR = arrDRAtualFinal.find(objDR => objDR.ano == anoDRAtual)
                            if(objDR){
                                objDR.valor = Number(drAtual.valor)
                                objDR.impostos = Number(drAtual.impostos)
                                objDR.valorSemIva = Number(drAtual.valor_sem_iva)
                                objDR.credito = Number(drAtual.credito),
                                objDR.custo = Number(drAtual.custo),
                                objDR.porcentagemCargaTributaria = Number(drAtual.porcentagem_carga_tributaria),
                                objDR.porcentagemCustoEfetivo = Number(drAtual.porcentagem_custo_efetivo)
                            }
                        }

                        // Adicionar AR e DR linha Compras na resposta final
                        const objLinhaComprasAtual: objAreaComprasType = {
                            antesReforma: objLinhaComprasAR,
                            depoisReforma: arrDRAtualFinal
                        }
                        respostaFinalCalculoEmpresa[regimeAtual].totalCompras[linhaCompraAtual] = objLinhaComprasAtual
                    }

                }

                            
                // ******* FIM TABELA COMPRAS



                // ******* PREENCHER TABELA CAIXA
                    // Pega os NOMES (não os valores) das linhas que a tabela caixa deve ter, que estão salvos na tabela LinhasCaixa
                const linhasCaixa = await respTabelasRepo.pegarLinhasCaixa()
                for(const linhaCaixa of linhasCaixa){
                    const linhaCaixaAtual = linhaCaixa.linha_caixa
                    // ID no nome da linha (fornecedores, tributosCredito, ...)
                    const linhaCaixaAtualId = linhaCaixa.id

                    // Encontrar o AR Linha Caixa atual
                    const linhaARAtual = await respTabelasRepo.pegarARLinhaCaixaCalculoAtual(calculoId, regimeAtualId, linhaCaixaAtualId)
                    if(linhaARAtual){
                        const objLinhaCaixaAR: antesReformaDreCaixaType = {
                            valor: Number(linhaARAtual.valor)
                        }

                        // encontrando os DR desse AR. Aqui embaixo é a variavel que guarda o array de objetos DR desse AR que estamos no loop atual
                        // o id que é passado aqui embaixo é o id da linha do AntesReformaCaixa
                        const arrDRAtualDb = await respTabelasRepo.pegarDRLinhaCaixaCalculoAtual(linhaARAtual.id)
                        // inicializo com valores vazios para caso algum ano não tenha sido salvo no banco ele retorna vazio
                        const arrDRAtualFinal: objDepoisReformaDreCaixa[] = [
                            {ano: "A2026", valor: 0},
                            {ano: "A2027", valor: 0},
                            {ano: "A2028", valor: 0},
                            {ano: "A2029", valor: 0},
                            {ano: "A2030", valor: 0},
                            {ano: "A2031", valor: 0},
                            {ano: "A2032", valor: 0},
                            {ano: "A2033", valor: 0},
                        ]

                        // loop no array DR pra preencher o array de transição com os valores verdadeiros
                        for(const drAtual of arrDRAtualDb){
                            const anoDRAtual: anosType = drAtual.ano
                            const objDR = arrDRAtualFinal.find(objDR => objDR.ano == anoDRAtual)
                            if(objDR){
                                objDR.valor = Number(drAtual.valor)
                            }
                        }

                        // Adicionar AR e DR linha Caixa na resposta final
                        const objLinhaCaixaAtual: linhaArDrDiferencas = {
                            antesReforma: objLinhaCaixaAR,
                            depoisReforma: arrDRAtualFinal
                        }
                        respostaFinalCalculoEmpresa[regimeAtual].caixa[linhaCaixaAtual] = objLinhaCaixaAtual
                    }

                }
                // ******* FIM TABELA CAIXA



                // ******* PREENCHER TABELA DRE
                    // Pega os NOMES (não os valores) das linhas que a tabela Dre deve ter, que estão salvos na tabela LinhasDre
                const linhasDre = await respTabelasRepo.pegarLinhasDre()
                for(const linhaDre of linhasDre){
                    const linhaDreAtual = linhaDre.linha_dre
                    // ID no nome da linha (receitaBruta, deducoesTributos, ...) (id linha da tabela LinhasDre)
                    const linhaDreAtualId = linhaDre.id

                    // Encontrar o AR Linha Dre atual
                    const linhaARAtual = await respTabelasRepo.pegarARLinhaDreCalculoAtual(calculoId, regimeAtualId, linhaDreAtualId)
                    if(linhaARAtual){
                        const objLinhaDreAR: antesReformaDreCaixaType = {
                            valor: Number(linhaARAtual.valor)
                        }

                        // encontrando os DR desse AR. Aqui embaixo é a variavel que guarda o array de objetos DR desse AR que estamos no loop atual
                        // o id que é passado aqui embaixo é o id da linha do AntesReformaDre
                        const arrDRAtualDb = await respTabelasRepo.pegarDRLinhaDreCalculoAtual(linhaARAtual.id)
                        // inicializo com valores vazios para caso algum ano não tenha sido salvo no banco ele retorna vazio
                        const arrDRAtualFinal: objDepoisReformaDreCaixa[] = [
                            {ano: "A2026", valor: 0},
                            {ano: "A2027", valor: 0},
                            {ano: "A2028", valor: 0},
                            {ano: "A2029", valor: 0},
                            {ano: "A2030", valor: 0},
                            {ano: "A2031", valor: 0},
                            {ano: "A2032", valor: 0},
                            {ano: "A2033", valor: 0},
                        ]

                        // loop no array DR pra preencher o array de transição com os valores verdadeiros
                        for(const drAtual of arrDRAtualDb){
                            const anoDRAtual: anosType = drAtual.ano
                            const objDR = arrDRAtualFinal.find(objDR => objDR.ano == anoDRAtual)
                            if(objDR){
                                objDR.valor = Number(drAtual.valor)
                            }
                        }

                        // Adicionar AR e DR linha Dre na resposta final
                        const objLinhaDreAtual: linhaArDrDiferencas = {
                            antesReforma: objLinhaDreAR,
                            depoisReforma: arrDRAtualFinal
                        }
                        respostaFinalCalculoEmpresa[regimeAtual].dre[linhaDreAtual] = objLinhaDreAtual
                    }

                }
                            
                // ******* FIM TABELA DRE



                

            }
            // ***** FIM LOOP REGIMES

            respostaFinalCalculo = respostaFinalCalculoEmpresa

        }else{
            // Como na tabela calculo a coluna tipo_usuario é not null e só pode "Empresa" ou "Pessoa Física", caso não seja "Empresa" com certeza é "Pesso Física"
            const linhaCalculoPorCpf = await respGeralRepo.pegarCpfPorCalculoId(calculoId)

            // Caso não encontre cpf pro calculoId enviado na tabela CalculoPorCpf
            if(!linhaCalculoPorCpf){
                throw new RecursoNaoEncontradoErro()
            }

            const respostaFinalCalculoPessoaFisica: respostaFinalCaluloPessoaFisicaType = {
                tipoUsuario: "Pessoa Física",
                respostaFinal: JSON.parse(JSON.stringify(valorInicialObjRegime)),
                cpf: linhaCalculoPorCpf.cpf
            }         
            
            respostaFinalCalculo = respostaFinalCalculoPessoaFisica

        }
        

        return respostaFinalCalculo
        


        
    }

}