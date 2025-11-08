import {
    COR_ENUM,
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
    Carta,
    CartaOutput,
} from './Carta'
import {
    companhiaDados,
    estacaoDeMetroDados,
    terrenoDados,
    tituloDePosseDados,
} from './dados'
import {
    Companhia,
    EspacoDoTabuleiro,
    EspacoDoTabuleiroOutput,
    EstacaoDeMetro,
    Propriedade,
    TIPO_ESPACO_ENUM,
} from './EspacoDoTabuleiro'
import {
    CriarJogadorInput,
    Jogador,
    JogadorOutput,
    PERSONAGEM,
} from './jogador'

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
    cartas: Carta[]
}

export interface JogoOutput
    extends Omit<JogoInput, 'jogadores' | 'espacosTabuleiro' | 'cartas'> {
    jogadores: JogadorOutput[]
    espacosTabuleiro: EspacoDoTabuleiroOutput[]
    cartas: CartaOutput[]
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: PERSONAGEM | null
    private indiceJogadorAtual: number
    private espacosTabuleiro: EspacoDoTabuleiro[]
    private cartas: Carta[]

    static criar(jogadores: CriarJogadorInput[]) {
        const { terrenos, cartas } = this.createEspacosECartas()

        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
            espacosTabuleiro: terrenos,
            cartas: cartas,
        })

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

        if (!data.cartas) {
            throw new Error('As cartas do jogo são obrigatórias')
        }

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
        this.espacosTabuleiro = data.espacosTabuleiro
        this.cartas = data.cartas
    }

    private static createEspacosECartas() {
        const titulosDePosse = tituloDePosseDados.map(dado => {
            return new TituloDePosse({
                nome: dado.nome,
                valorHipoteca: dado.valorHipoteca,
                cor: dado.cor,
                valorAluguel: dado.valoresAluguel,
                precoCasa: dado.precoCasa,
                precoHotel: dado.precoHotel,
                preco: dado.preco,
            })
        })

        const estacoesDeMetro = estacaoDeMetroDados.map(dado => {
            return new CartaEstacaoDeMetro({
                nome: dado.nome,
                preco: dado.preco,
                valorHipoteca: dado.valorHipoteca,
                valorAluguel: dado.valoresAluguel,
            })
        })

        const companhias = companhiaDados.map(dado => {
            return new CartaCompanhia({
                nome: dado.nome,
                preco: dado.preco,
                valorHipoteca: dado.valorHipoteca,
            })
        })

        const terrenos = terrenoDados.map((dado, index) => {
            if (dado.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                const tituloDePosse = titulosDePosse.find(
                    titulo => titulo.getNome() === dado.nome,
                )!

                return new Propriedade({
                    nome: dado.nome,
                    posicao: dado.posicao, // Poderia usar o index
                    tituloDePosse: tituloDePosse,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                const estacaoDeMetro = estacoesDeMetro.find(
                    estacao => estacao.getNome() === dado.nome,
                )!

                return new EstacaoDeMetro({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaEstacaoDeMetro: estacaoDeMetro,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                const companhia = companhias.find(
                    companhia => companhia.getNome() === dado.nome,
                )!

                return new Companhia({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaCompanhia: companhia,
                })
            }

            return new EspacoDoTabuleiro(dado.nome, dado.posicao, dado.tipo)
        })

        const cartas = [...titulosDePosse, ...estacoesDeMetro, ...companhias]

        return {
            terrenos,
            cartas,
        }
    }

    private rolarDado(): number {
        return Math.floor(Math.random() * 6) + 1
    }

    jogarDados(): { dado1: number; dado2: number } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const dado1 = this.rolarDado()
        const dado2 = this.rolarDado()

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]
        jogadorAtual.mover(dado1 + dado2)

        // Passa a vez para o próximo jogador -- "MOCKANDO" o turno por enquanto
        this.indiceJogadorAtual =
            (this.indiceJogadorAtual + 1) % this.jogadores.length

        return { dado1, dado2 }
    }

    toObject(): JogoOutput {
        return {
            jogadores: this.jogadores.map(jogador => jogador.toObject()),
            estado: this.estado,
            personagemVencedor: this.personagemVencedor,
            indiceJogadorAtual: this.indiceJogadorAtual,
            cartas: this.cartas.map(carta => carta.toObject()),
            espacosTabuleiro: this.espacosTabuleiro.map(espaco => {
                return espaco.toObject()
            }),
        }
    }
}
