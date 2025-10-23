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
    jogadores: JogadorInput[]
    estado: ESTADO_JOGO
    personagemVencedor: string | null
}

export interface JogoOutput {
    jogadores: JogadorOutput[]
    estado: ESTADO_JOGO
    personagemVencedor: string | null
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: string | null

    static criar(jogadores: CriarJogadorInput[]) {
        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores,
            personagemVencedor: null,
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
                jogador => jogador.personagem === data.personagemVencedor!,
            )

            if (!personagemVencedorExiste) {
                throw new Error(
                    'O vencedor precisa ser um dos personagens da partida',
                )
            }
        }

        this.jogadores = data.jogadores.map(jogador => new Jogador(jogador))
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
    }

    toObject(): JogoOutput {
        return {
            jogadores: this.jogadores.map(jogador => jogador.toObject()),
            estado: this.estado,
            personagemVencedor: this.personagemVencedor,
        }
    }
}
