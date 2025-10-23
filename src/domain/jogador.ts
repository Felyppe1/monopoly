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
}

export interface JogadorOutput extends JogadorInput {}

export interface CriarJogadorInput {
    nome: string
    personagem: PERSONAGEM
}

export class Jogador {
    private nome: string
    private personagem: PERSONAGEM

    static create({ nome, personagem }: CriarJogadorInput) {
        return new Jogador({ nome, personagem })
    }

    constructor({ nome, personagem }: JogadorInput) {
        if (!nome) {
            throw new Error('Nome do jogador é obrigatório')
        }

        if (!personagem) {
            throw new Error('Personagem do jogador é obrigatório')
        }

        this.nome = nome
        this.personagem = personagem
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
        }
    }
}
