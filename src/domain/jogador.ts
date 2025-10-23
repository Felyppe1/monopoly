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
    posicao: number
}

export interface JogadorOutput extends JogadorInput {}

export interface CriarJogadorInput {
    nome: string
    personagem: PERSONAGEM
}

export class Jogador {
    private nome: string
    private personagem: PERSONAGEM
    private posicao: number

    static create({ nome, personagem }: CriarJogadorInput) {
        return new Jogador({ nome, personagem, posicao: 0 })
    }

    constructor({ nome, personagem, posicao }: JogadorInput) {
        if (!nome) {
            throw new Error('Nome do jogador é obrigatório')
        }

        if (!personagem) {
            throw new Error('Personagem do jogador é obrigatório')
        }

        if (posicao < 0 || posicao >= 40) {
            throw new Error('Posição do jogador deve estar entre 0 e 39')
        }

        this.nome = nome
        this.personagem = personagem
        this.posicao = posicao
    }

    mover(casas: number) {
        const TOTAL_CASAS = 40 // Total de casas no tabuleiro do Monopoly
        this.posicao = (this.posicao + casas) % TOTAL_CASAS
    }

    getPersonagem() {
        return this.personagem
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
            posicao: this.posicao,
        }
    }
}
