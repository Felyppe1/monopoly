import { Banco, BancoOutput } from './banco'
import {
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
} from './Carta'
import { terrenoDados } from './dados'
import {
    Companhia,
    EspacoDoTabuleiro,
    EspacoDoTabuleiroOutputUnion,
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
    banco: Banco
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
    private banco: Banco

    static criar(jogadores: CriarJogadorInput[]) {
        const banco = Banco.criar()

        const terrenos = this.criarEspacos(banco)

        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
            espacosTabuleiro: terrenos,
            banco: banco,
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

        if (!data.banco) {
            throw new Error('O banco do jogo é obrigatório')
        }

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
        this.espacosTabuleiro = data.espacosTabuleiro
        this.banco = data.banco
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
        saiuDaPrisao: boolean
        jogadorPermaneceuPreso: boolean
        jogadorFoiParaPrisao: boolean
    } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const dado1 = this.rolarDado()
        const dado2 = this.rolarDado()
        const eDuplo = dado1 === dado2

        let saiuDaPrisao = false

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (jogadorAtual.getEstaPreso()) {
            jogadorAtual.tentarSairDaPrisao()

            if (eDuplo) {
                jogadorAtual.sairDaPrisao()
                saiuDaPrisao = true

                jogadorAtual.mover(dado1 + dado2)
            } else if (jogadorAtual.getTentativasDuplo() === 3) {
                jogadorAtual.pagar(50)
                jogadorAtual.sairDaPrisao()
                saiuDaPrisao = true
                jogadorAtual.mover(dado1 + dado2)
            } else {
                jogadorAtual.pagar(50)
            }
        } else {
            jogadorAtual.mover(dado1 + dado2)

            const espacoAtual =
                this.espacosTabuleiro[jogadorAtual.toObject().posicao]
            if (
                espacoAtual.tipo === TIPO_ESPACO_ENUM.VA_PARA_PRISAO ||
                espacoAtual.tipo === TIPO_ESPACO_ENUM.PRISAO
            ) {
                jogadorAtual.irParaPrisao()
            }
        }

        // Passa a vez para o próximo jogador -- "MOCKANDO" o turno por enquanto
        this.indiceJogadorAtual =
            (this.indiceJogadorAtual + 1) % this.jogadores.length

        return {
            dado1,
            dado2,
            saiuDaPrisao,
            jogadorPermaneceuPreso: jogadorAtual.getEstaPreso(),
            jogadorFoiParaPrisao: jogadorAtual.getEstaPreso() && !saiuDaPrisao,
        }
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
        }
    }
}
