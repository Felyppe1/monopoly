export enum PERSONAGEM {
    CACHORRO = 'cachorro',
    CARRO = 'carro',
    CARTOLA = 'cartola',
    DEDAL = 'dedal',
    GATO = 'gato',
    NAVIO = 'navio',
    PATO = 'pato',
    PINGUIM = 'pinguim',
}

export interface JogadorInput {
    nome: string
    personagem: PERSONAGEM
    posicao?: number
}

export interface JogadorOutput extends JogadorInput {
    posicao: number
}

export interface CriarJogadorInput {
    nome: string
    personagem: PERSONAGEM
}

export class Jogador {
    private nome: string
    private personagem: PERSONAGEM
    private posicao: number

    static create({ nome, personagem }: CriarJogadorInput) {
        return new Jogador({ nome, personagem })
    }

    constructor({ nome, personagem, posicao = 0 }: JogadorInput) {
        if (!nome) {
            throw new Error('Nome do jogador é obrigatório')
        }

        if (!personagem) {
            throw new Error('Personagem do jogador é obrigatório')
        }

        this.nome = nome
        this.personagem = personagem
        this.posicao = posicao
    }

    mover(casas: number) {
        const TOTAL_CASAS = 40 // Total de casas no tabuleiro do Monopoly
        this.posicao = (this.posicao + casas) % TOTAL_CASAS
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
            posicao: this.posicao,
        }
    }
}
