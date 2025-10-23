import {
    CriarJogadorInput,
    Jogador,
    JogadorInput,
    JogadorOutput,
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
    personagemVencedor: string | null
    indiceJogadorAtual: number
}

export interface JogoOutput extends Omit<JogoInput, 'jogadores'> {
    jogadores: JogadorOutput[]
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: string | null
    private indiceJogadorAtual: number

    static criar(jogadores: CriarJogadorInput[]) {
        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
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

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
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
        }
    }
}
