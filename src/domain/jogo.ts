import { Banco, BancoOutput } from './banco'
import {
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
    Carta,
} from './Carta'
import { terrenoDados } from './dados'
import { NomeEspaco } from './dados/nome-espacos'
import {
    Companhia,
    EspacoDoTabuleiro,
    EspacoDoTabuleiroOutputUnion,
    EstacaoDeMetro,
    Imposto,
    Propriedade,
    TIPO_ESPACO_ENUM,
} from './EspacoDoTabuleiro'
import {
    CriarJogadorInput,
    Jogador,
    JogadorOutput,
    PERSONAGEM,
} from './jogador'

import { Baralho } from './Baralho'
import {
    CartaEvento,
    TIPO_CARTA,
    ACAO_CARTA,
    CartaEventoInput,
} from './CartaCofreouSorte'

export enum ESTADO_JOGO {
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    FINALIZADO = 'FINALIZADO',
}

export interface CriarJogoInput {
    jogadores: CriarJogadorInput[]
}

export interface JogoInput {
    jogadores: Jogador[]
    estado: ESTADO_JOGO
    personagemVencedor: PERSONAGEM | null
    indiceJogadorAtual: number
    espacosTabuleiro: EspacoDoTabuleiro[]
    banco: Banco
    quantidadeDuplas: number
    jogouOsDados: boolean
}

export interface JogoOutput
    extends Omit<JogoInput, 'jogadores' | 'espacosTabuleiro' | 'banco'> {
    jogadores: JogadorOutput[]
    espacosTabuleiro: EspacoDoTabuleiroOutputUnion[]
    banco: BancoOutput
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: PERSONAGEM | null
    private indiceJogadorAtual: number
    private espacosTabuleiro: EspacoDoTabuleiro[]
    private quantidadeDuplas: number
    private banco: Banco
    private jogouOsDados: boolean
    private baralho: Baralho

    static criar(jogadores: CriarJogadorInput[]) {
        const banco = Banco.criar()

        const terrenos = Jogo.criarEspacos(banco)

        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
            espacosTabuleiro: terrenos,
            banco: banco,
            quantidadeDuplas: 0,
            jogouOsDados: false,
        })

        jogo.inicializarBaralhoCofre()
        jogo.inicializarBaralhoSorte()

        return jogo
    }

    constructor(data: JogoInput) {
        if (!data.jogadores || data.jogadores.length < 2) {
            throw new Error('O jogo precisa de pelo menos dois jogadores')
        }

        if (data.jogadores.length > 8) {
            throw new Error('O jogo suporta no máximo oito jogadores')
        }

        for (const jogador of data.jogadores) {
            const personagensRepetidos = data.jogadores.filter(
                j => j.getPersonagem() === jogador.getPersonagem(),
            )

            if (personagensRepetidos.length > 1) {
                throw new Error(
                    'Não pode haver jogadores com personagens repetidos',
                )
            }
        }

        if (data.personagemVencedor && data.estado !== ESTADO_JOGO.FINALIZADO) {
            throw new Error(
                'O jogo só pode ter um personagemVencedor se estiver finalizado',
            )
        }

        if (
            data.estado === ESTADO_JOGO.FINALIZADO &&
            !data.personagemVencedor
        ) {
            throw new Error('O jogo finalizado precisa ter um vencedor')
        }

        if (data.personagemVencedor) {
            const personagemVencedorExiste = data.jogadores.some(
                jogador => jogador.getPersonagem() === data.personagemVencedor!,
            )

            if (!personagemVencedorExiste) {
                throw new Error(
                    'O vencedor precisa ser um dos personagens da partida',
                )
            }
        }

        if (!data.espacosTabuleiro || data.espacosTabuleiro.length !== 40) {
            throw new Error('O tabuleiro precisa ter exatamente 40 espaços')
        }

        if (!data.banco) {
            throw new Error('O banco do jogo é obrigatório')
        }

        if (
            data.quantidadeDuplas === undefined ||
            data.quantidadeDuplas === null
        ) {
            throw new Error('A quantidade de duplas é obrigatória')
        }

        if (data.jogouOsDados === undefined || data.jogouOsDados === null) {
            throw new Error('O status de jogou os dados é obrigatório')
        }

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
        this.espacosTabuleiro = data.espacosTabuleiro
        this.baralho = new Baralho()
        this.banco = data.banco
        this.quantidadeDuplas = data.quantidadeDuplas
        this.jogouOsDados = data.jogouOsDados
    }

    private static criarEspacos(banco: Banco) {
        const terrenos = terrenoDados.map((dado, index) => {
            if (dado.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                const tituloDePosse = banco.getCarta(
                    dado.nome,
                )! as TituloDePosse

                return new Propriedade({
                    nome: dado.nome,
                    posicao: dado.posicao, // Poderia usar o index
                    tituloDePosse: tituloDePosse,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                const estacaoDeMetro = banco.getCarta(
                    dado.nome,
                )! as CartaEstacaoDeMetro

                return new EstacaoDeMetro({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaEstacaoDeMetro: estacaoDeMetro,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                const companhia = banco.getCarta(dado.nome)! as CartaCompanhia

                return new Companhia({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaCompanhia: companhia,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.IMPOSTO) {
                return new Imposto({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    aluguel: dado.aluguel!,
                })
            }

            return new EspacoDoTabuleiro({
                nome: dado.nome,
                posicao: dado.posicao,
                tipo: dado.tipo,
            })
        })

        return terrenos
    }

    private rolarDado(): number {
        return Math.floor(Math.random() * 6) + 1
    }

    jogarDados(): {
        dado1: number
        dado2: number
        cartaComprada?: CartaEvento | null
    } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const dado1 = this.rolarDado()
        const dado2 = this.rolarDado()

        const eDuplo = dado1 === dado2

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (jogadorAtual.getEstaPreso()) {
            jogadorAtual.tentarSairDaPrisao(dado1, dado2)
        } else {
            jogadorAtual.mover(dado1 + dado2)

            const cartaComprada = this.eventoSorteCofre(jogadorAtual)

            const espacoAtual = this.espacosTabuleiro[jogadorAtual.getPosicao()]

            if (eDuplo) {
                this.quantidadeDuplas += 1

                if (this.quantidadeDuplas === 3) {
                    jogadorAtual.irParaPrisao()

                    this.quantidadeDuplas = 0
                }
            } else {
                this.quantidadeDuplas = 0
            }

            if (espacoAtual.getTipo() === TIPO_ESPACO_ENUM.VA_PARA_PRISAO) {
                jogadorAtual.irParaPrisao()

                this.quantidadeDuplas = 0
            }
        }

        this.jogouOsDados = true

        return {
            dado1,
            dado2,
        }
    }

    virarTurno() {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        if (this.quantidadeDuplas > 0) {
            throw new Error('O jogador atual deve jogar novamente')
        }

        this.indiceJogadorAtual =
            (this.indiceJogadorAtual + 1) % this.jogadores.length

        this.jogouOsDados = false
    }

    private inicializarBaralhoCofre(): void {
        const cartasCofre: CartaEventoInput[] = [
            {
                descricao:
                    'Você ajudou seus vizinhos a limparem seus quintais depois de uma grande tempestade. RECEBA R$400.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 400,
            },

            {
                descricao:
                    'Você se voluntariou em uma campanha de doação de sangue, tem biscoitos grátis! RECEBA R$10.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 15,
            },

            {
                descricao:
                    'Você organizou uma venda de bolos para sua escola local. RECEBA R$10.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 10,
            },

            {
                descricao: 'Ações da empresa aumentaram. RECEBA R$50.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 50,
            },

            {
                descricao: 'Herança inesperada. RECEBA R$150.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 150,
            },

            {
                descricao: 'Reembolso de seguros. RECEBA R$100.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 100,
            },

            {
                descricao: 'Multa por embriaguez. PAGUE R$50.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 50,
            },

            {
                descricao: 'Tratamento médico. PAGUE R$100',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 100,
            },

            {
                descricao: 'Conserto de rua. PAGUE R$100 por casa',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 100,
            },

            {
                descricao: 'Imposto escolar. PAGUE R$150.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 150,
            },

            {
                descricao: 'Volte três casas.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.VOLTAR_CASAS,
                quantidadeCasas: 3,
            },

            {
                descricao: 'Vá para a prisão.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.IR_PARA_PRISAO,
            },

            {
                descricao:
                    'Seus amigos fofinhos do abrigo de animais ficarão gratos pela sua doação. PAGUE R$50.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.PAGAR,
                valor: 50,
            },

            {
                descricao: 'Saia da prisão.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.SAIR_DA_PRISAO,
            },

            {
                descricao:
                    'Pague reparos em suas propriedades. PAGUE R$25 por casa, R$100 por hotel.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.MULTAR_POR_CASA,
                valorPorCasa: 25,
                valorPorHotel: 100,
            },

            {
                descricao:
                    'Conserto de rua. PAGUE R$100 por casa, R$200 por hotel.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.MULTAR_POR_CASA,
                valorPorCasa: 100,
                valorPorHotel: 200,
            },
        ]

        cartasCofre.forEach(cartaData => {
            try {
                const carta = new CartaEvento(cartaData)
                this.baralho.adicionarCartaCofre(carta)
            } catch (error) {
                console.error(`${cartaData.descricao} erro`)
            }
        })

        this.baralho.embaralhar()
        console.log('baralho de cofre carregado')
    }

    private inicializarBaralhoSorte(): void {
        const cartasSorte = [
            {
                descricao: 'Vá para a prisão.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.IR_PARA_PRISAO,
            },
            {
                descricao:
                    'Avance até a Av. Atlântica. Se passar pelo início, RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_PROPRIEDADE,
                destino: 'Av. Atlântica',
            },
            {
                descricao:
                    'Você foi eleito presidente do conselho. PAGUE R$50.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 50,
            },
            {
                descricao:
                    'Avance até a próxima estação. Se não tiver dono, você pode comprá-la do banco. Se tiver dono, pague ao proprietário duas vezes o aluguel original. Se passar pelo início, RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_ESTACAO,
                multiplicadorAluguel: 2,
            },
            {
                descricao:
                    'Faça uma viagem até a estação do Maracanã. Se passar pelo início, RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_ESTACAO_ESPECIFICA,
                destino: 'Estação do Maracanã',
            },
            {
                descricao: 'Seu empréstimo imobiliário venceu. RECEBA R$150.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 150,
            },
            {
                descricao:
                    'Faça reparos gerais em todas as suas propriedades. Para cada casa, PAGUE R$25. Para cada hotel, PAGUE R$100.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.MULTAR_POR_CASA,
                valorPorCasa: 25,
                valorPorHotel: 100,
            },
            {
                descricao: 'Volte três casas.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.VOLTAR_CASAS,
                quantidadeCasas: 3,
            },
            {
                descricao: 'O banco paga seu dividendo de R$50. RECEBA R$50.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.RECEBER,
                valor: 50,
            },
            {
                descricao:
                    'Avance até a Av. Cidade Jardim. Se passar pelo início. RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_PROPRIEDADE,
                destino: 'Av. Cidade Jardim',
            },
            {
                descricao:
                    'Avance até a Av. Presidente Vargas. Se passar pelo início. RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_PROPRIEDADE,
                destino: 'Av. Presidente Vargas',
            },
            {
                descricao: 'Saia da prisão livremente.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.SAIR_DA_PRISAO,
            },
            {
                descricao: 'Multa por excesso de velocidade. PAGUE R$15.',
                tipo: TIPO_CARTA.AZAR,
                acao: ACAO_CARTA.PAGAR,
                valor: 15,
            },
            {
                descricao: 'Avance até a Av. Paulista.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_PROPRIEDADE,
                destino: 'Av. Paulista',
            },
            {
                descricao: 'Avance até a Av. Ipiranga.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_PROPRIEDADE,
                destino: 'Av. Ipiranga',
            },
            {
                descricao: 'Avance até o início, RECEBA R$200.',
                tipo: TIPO_CARTA.SORTE,
                acao: ACAO_CARTA.AVANCAR_INICIO,
            },
        ]

        cartasSorte.forEach(cartaData => {
            try {
                const carta = new CartaEvento(cartaData)
                this.baralho.adicionarCartaSorte(carta)
            } catch (error) {
                console.error(`${cartaData.descricao} erro`)
            }
        })

        this.baralho.embaralhar()
        console.log(`baralho de sorte carregado`)
    }

    public comprarCartaCofre() {
        return this.baralho.comprarCartaCofre()
    }

    public comprarCartaSorte() {
        return this.baralho.comprarCartaSorte()
    }

    public getInfoBaralho() {
        return {
            cartasCofre: this.baralho.getNumeroCartasCofre(),
            cartasSorte: this.baralho.getNumeroCartasSorte(),
        }
    }

    private eventoSorteCofre(jogador: Jogador): CartaEvento | null {
        const posicaoAtual = jogador.getPosicao()
        const espacoAtual = this.espacosTabuleiro[posicaoAtual]

        switch (espacoAtual.getTipo()) {
            case TIPO_ESPACO_ENUM.COFRE:
                const cartaCofre = this.baralho.comprarCartaCofre()
                if (cartaCofre) {
                    const resultado = cartaCofre.executarAcao(jogador, this)
                    this.aplicarEfeitoCarta(jogador, resultado, cartaCofre)
                    if (!resultado.cartaPrisao) {
                        this.baralho.devolverCartaCofre(cartaCofre)
                    }
                    console.log(
                        `${jogador.getNome()} caiu em cofre. carta: ${cartaCofre.getDescricao()}`,
                    )
                    return cartaCofre
                }
                break

            case TIPO_ESPACO_ENUM.SORTE:
                const cartaSorte = this.baralho.comprarCartaSorte()
                if (cartaSorte) {
                    const resultado = cartaSorte.executarAcao(jogador, this)
                    this.aplicarEfeitoCarta(jogador, resultado, cartaSorte)
                    if (!resultado.cartaPrisao) {
                        this.baralho.devolverCartaCofre(cartaSorte)
                    }
                    console.log(
                        `${jogador.getNome()} caiu em sorte. carta: ${cartaSorte.getDescricao()}`,
                    )
                    return cartaSorte
                }
                break

            default:
                break
        }

        return null
    }

    private encontrarPosicaoPorNome(nome: string): number {
        return this.espacosTabuleiro.findIndex(e => e.getNome() === nome)
    }

    private encontrarProximaEstacao(posicaoAtual: number): number {
        for (let i = 1; i < 40; i++) {
            const proximaPosicao = (posicaoAtual + i) % 40
            const espaco = this.espacosTabuleiro[proximaPosicao]
            if (espaco.getTipo() === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                return proximaPosicao
            }
        }
        return -1
    }

    private aplicarEfeitoCarta(
        jogador: Jogador,
        resultado: any,
        cartaOriginal: CartaEvento,
    ): void {
        if (resultado.valor !== undefined && resultado.valor !== 0) {
            if (resultado.valor > 0) {
                jogador.receber(resultado.valor)
            } else {
                const valorPagar = Math.abs(resultado.valor)

                if (resultado.acao === ACAO_CARTA.PAGAR_TODOS) {
                    this.jogadores.forEach(outroJogador => {
                        if (outroJogador !== jogador) {
                            const pagou = jogador.pagar(valorPagar)
                            if (pagou) outroJogador.receber(valorPagar)
                        }
                    })
                } else {
                    jogador.pagar(valorPagar)
                }
            }
        }

        if (resultado.irParaPrisao || resultado.tipoMovimento === 'prisao') {
            jogador.irParaPrisao()
            this.quantidadeDuplas = 0
            return
        }

        if (resultado.cartaPrisao) {
            jogador.adicionarCartaSaidaPrisao(cartaOriginal)
            console.log(
                `${jogador.getNome()} guardou a carta 'Saia da Prisão'!`,
            )
        }

        if (resultado.destino) {
            const novaPosicao = this.encontrarPosicaoPorNome(resultado.destino)

            if (novaPosicao !== -1) {
                const posicaoAtual = jogador.getPosicao()

                if (
                    novaPosicao < posicaoAtual &&
                    resultado.tipoMovimento === 'avancar'
                ) {
                    jogador.receber(200)
                }

                const passos = (novaPosicao - posicaoAtual + 40) % 40
                jogador.mover(passos)
            } else {
                console.warn(
                    `⚠️ Destino "${resultado.destino}" não encontrado no tabuleiro!`,
                )
            }
        } else if (resultado.voltarCasas) {
            jogador.mover(-resultado.voltarCasas)
        } else if (resultado.acao === ACAO_CARTA.AVANCAR_ESTACAO) {
            const posAtual = jogador.getPosicao()
            const posDestino = this.encontrarProximaEstacao(posAtual)

            if (posDestino !== -1) {
                const passos = (posDestino - posAtual + 40) % 40
                if (posDestino < posAtual) jogador.receber(200)
                jogador.mover(passos)

                const estacao = this.espacosTabuleiro[posDestino]
                const dono = this.getProprietario(estacao.getNome())

                if (
                    dono &&
                    dono !== jogador &&
                    estacao instanceof EstacaoDeMetro
                ) {
                    const qtd = dono.getQuantidadeDeEstacoesMetro()
                    const aluguelBase = estacao.calcularAluguel(qtd)
                    const dobro = aluguelBase * 2

                    console.log(`Pagando aluguel dobrado na estação: ${dobro}`)
                    if (jogador.pagar(dobro)) {
                        dono.receber(dobro)
                    }
                }
            }
        }
    }

    jogadorUsaCartaSaidaPrisao() {
        const jogador = this.jogadores[this.indiceJogadorAtual]

        if (!jogador.getEstaPreso()) {
            throw new Error('Jogador não está preso.')
        }

        if (!jogador.temCartaSaidaPrisao()) {
            throw new Error('Jogador não possui carta de Saída da Prisão.')
        }

        const carta = jogador.usarCartaSaidaPrisao()

        if (carta) {
            jogador.sairDaPrisao()
            console.log(`${jogador.getNome()} usou a carta e está livre!`)

            if (carta.getTipo() === TIPO_CARTA.SORTE) {
                this.baralho.devolverCartaSorte(carta)
            } else {
                this.baralho.devolverCartaCofre(carta)
            }
        }
    }

    // TODO: se tiver mais lugares que precisam da informação dos dados, salvar na classe Jogo
    cobrarAluguel(dados?: { dado1: number; dado2: number }) {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        const posicao = jogadorAtual.getPosicao()

        const espaco = this.espacosTabuleiro[posicao]

        if (espaco instanceof Imposto) {
            const pagamentoRealizado = jogadorAtual.pagar(espaco.getAluguel())
            return
        }

        const proprietario = this.getProprietario(espaco.getNome())

        if (proprietario && proprietario !== jogadorAtual) {
            let valorAluguel = 0

            if (espaco instanceof Propriedade) {
                const quantidadeTitulosProprietario =
                    proprietario.getQuantidadeDeTitulos(espaco.getCor())

                const totalTitulos = this.espacosTabuleiro.filter(
                    espacoTabuleiro =>
                        espacoTabuleiro.getTipo() ===
                            TIPO_ESPACO_ENUM.PROPRIEDADE &&
                        (espacoTabuleiro as Propriedade).getCor() ===
                            espaco.getCor(),
                ).length

                valorAluguel =
                    quantidadeTitulosProprietario === totalTitulos
                        ? espaco.calcularAluguel(
                              espaco.getQuantidadeConstrucoes() === 0,
                          )
                        : espaco.calcularAluguel(false)
            } else if (espaco instanceof EstacaoDeMetro) {
                const quantidadeEstacoes =
                    proprietario.getQuantidadeDeEstacoesMetro()

                valorAluguel = espaco.calcularAluguel(quantidadeEstacoes)
            } else if (espaco instanceof Companhia) {
                const quantidadeCompanhias =
                    proprietario.getQuantidadeDeCompanhias()

                if (!dados) {
                    throw new Error(
                        'Os valores dos dados são necessários para calcular o aluguel da companhia',
                    )
                }

                valorAluguel = espaco.calcularAluguel(
                    quantidadeCompanhias,
                    dados.dado1 + dados.dado2,
                )
            } else {
                throw new Error('Não é possível cobrar aluguel deste espaço')
            }

            // TODO: o que acontece se ele não tiver dinheiro? falência?
            const pagamentoRealizado = jogadorAtual.pagar(valorAluguel)
            proprietario.receber(valorAluguel)
        }
    }

    comprarEspaco() {
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        const posicao = jogadorAtual.getPosicao()

        const espaco = this.espacosTabuleiro[posicao]

        jogadorAtual.comprarCarta(this.banco, espaco.getNome())
    }

    private getProprietario(nomeEspaco: NomeEspaco) {
        const jogador = this.jogadores.find(jogador =>
            jogador.getCarta(nomeEspaco),
        )

        if (!jogador) {
            return null
        }

        return jogador
    }

    getJogador(indice: number): Jogador {
        return this.jogadores[indice]
    }

    public botDeveComprarEspaco(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const espaco = this.espacosTabuleiro[jogador.getPosicao()] 
        const carta = this.banco.getCarta(espaco.getNome())

        if (!carta) return false
        return jogador.getSaldo() >= carta.getPreco()
    }

    public botGerenciarConstrucoes() {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const estadoJogador = jogador.toObject() 
        
        estadoJogador.cartas.forEach(cartaObj => {
            if (cartaObj.tipo === 'TituloDePosse') {
                // Recuperar a instância real da carta no jogador
                const titulo = jogador.getCarta(cartaObj.nome) as TituloDePosse
                
                if (titulo) {
                    // Regra: Pode construir se tiver dinheiro e não tiver hotel
                    // Nota: O código original de TituloDePosse não valida saldo ou cor completa no método adicionarCasa,
                    // apenas incrementa. Vamos adicionar a validação financeira aqui.
                    
                    // Verificar se possui o grupo de cor completo (Regra clássica do Monopoly)
                    const totalTitulosDaCor = this.espacosTabuleiro.filter(e => 
                         e.getTipo() === TIPO_ESPACO_ENUM.PROPRIEDADE && 
                         (e as Propriedade).getCor() === titulo.getCor()
                    ).length
                    
                    const titulosDoJogador = jogador.getQuantidadeDeTitulos(titulo.getCor())
                    
                    if (titulosDoJogador === totalTitulosDaCor) {
                        // Tenta construir o máximo possível com o saldo atual
                        const precoCasa = titulo.toObject().precoCasa // Acessando via toObject pois precoCasa é private na classe fornecida
                        
                        // Loop simples para adicionar 1 casa por turno por propriedade para não gastar tudo de uma vez
                        if (titulo.getNumCasas() < 4 && jogador.getSaldo() > (precoCasa + 200)) { // Mantém uma reserva de 200
                            if (jogador.pagar(precoCasa)) {
                                titulo.adicionarCasa()
                                console.log(`Bot ${jogador.getNome()} construiu casa em ${titulo.getNome()}`)
                            }
                        } else if (titulo.getNumCasas() === 4 && titulo.getNumHoteis() === 0 && jogador.getSaldo() > (titulo.toObject().precoHotel + 200)) {
                             if (jogador.pagar(titulo.toObject().precoHotel)) {
                                titulo.adicionarHotel()
                                console.log(`Bot ${jogador.getNome()} construiu HOTEL em ${titulo.getNome()}`)
                            }
                        }
                    }
                }
            }
        })
    }

    // 1. Decisão de sair da prisão - BOT
    public botTentarSairDaPrisao(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        if (!jogador.getEstaPreso()) return false

        if (jogador.temCartaSaidaPrisao()) {
            this.jogadorUsaCartaSaidaPrisao()
            return true
        }
        return false
    }

    // 2. Decisão de Construir Casas/Hotéis - BOT
    public botRealizarConstrucoes(): void {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const saldoReserva = 200 

        this.espacosTabuleiro.forEach(espaco => {
            if (espaco instanceof Propriedade) {
                const titulo = espaco.getTituloDePosse()
                
                if (this.getProprietario(espaco.getNome()) === jogador) {
                    const cor = titulo.getCor()
                    
                    const totalDaCor = this.espacosTabuleiro.filter(e => 
                        e instanceof Propriedade && e.getTituloDePosse().getCor() === cor
                    ).length
                    const qtdDoJogador = jogador.getQuantidadeDeTitulos(cor)

                    if (qtdDoJogador === totalDaCor) {
                        const custoCasa = titulo.toObject().precoCasa 
                        const custoHotel = titulo.toObject().precoHotel

                        if (titulo.getNumCasas() < 4 && jogador.getSaldo() >= (custoCasa + saldoReserva)) {
                            if (jogador.pagar(custoCasa)) {
                                titulo.adicionarCasa()
                                console.log(`[BOT] Construiu Casa em ${espaco.getNome()}`)
                            }
                        } else if (titulo.getNumCasas() === 4 && titulo.getNumHoteis() === 0 && jogador.getSaldo() >= (custoHotel + saldoReserva)) {
                             if (jogador.pagar(custoHotel)) {
                                titulo.adicionarHotel()
                                console.log(`[BOT] Construiu HOTEL em ${espaco.getNome()}`)
                            }
                        }
                    }
                }
            }
        })
    }

    // 3. Método auxiliar para verificar se pode comprar a carta atual - BOT
    public botPodeComprarCartaAtual(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const espaco = this.espacosTabuleiro[jogador.getPosicao()]
        
        const carta = this.banco.getCarta(espaco.getNome())
        
        if (carta && jogador.getSaldo() >= carta.getPreco()) {
            return true
        }
        return false
    }

    toObject(): JogoOutput {
        return {
            jogadores: this.jogadores.map(jogador => jogador.toObject()),
            estado: this.estado,
            personagemVencedor: this.personagemVencedor,
            indiceJogadorAtual: this.indiceJogadorAtual,
            espacosTabuleiro: this.espacosTabuleiro.map(espaco => {
                return espaco.toObject() as EspacoDoTabuleiroOutputUnion
            }),
            banco: this.banco.toObject(),
            quantidadeDuplas: this.quantidadeDuplas,
            jogouOsDados: this.jogouOsDados,
        }
    }
}
