import { Banco } from './banco'
import { Carta } from './Carta'
import { NomeEspaco } from './dados/nome-espacos'

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
    cartas: Carta[]
    saldo: number
}

export interface JogadorOutput extends JogadorInput {}

export interface CriarJogadorInput {
    nome: string
    personagem: PERSONAGEM
    saldo?: number
}

export class Jogador {
    private nome: string
    private personagem: PERSONAGEM
    private posicao: number
    private cartas: Carta[]
    private saldo: number

    static create({ nome, personagem }: CriarJogadorInput) {
        const SALDO_INICIAL = 1500
        return new Jogador({
            nome,
            personagem,
            posicao: 0,
            cartas: [],
            saldo: SALDO_INICIAL,
        })
    }

    constructor({ nome, personagem, posicao, cartas }: JogadorInput) {
        if (!nome) {
            throw new Error('Nome do jogador é obrigatório')
        }

        if (!personagem) {
            throw new Error('Personagem do jogador é obrigatório')
        }

        if (posicao < 0 || posicao >= 40) {
            throw new Error('Posição do jogador deve estar entre 0 e 39')
        }

        if (!cartas) {
            throw new Error('Cartas do jogador são obrigatórias')
        }

        this.nome = nome
        this.personagem = personagem
        this.posicao = posicao
        this.cartas = cartas
        this.saldo = 1500
    }

    mover(casas: number) {
        const TOTAL_CASAS = 40 // Total de casas no tabuleiro do Monopoly
        const posicaoAnterior = this.posicao
        this.posicao = (this.posicao + casas) % TOTAL_CASAS

        if (this.posicao < posicaoAnterior) {
            this.saldo += 200 // Recebe $200 ao passar pela casa "Início"
            console.log(
                `${this.nome} passou pela casa Início e recebeu $200! Novo saldo: $${this.saldo}`,
            )
        }
    }

    receber(valor: number) {
        this.saldo += valor
    }

    getSaldo() {
        return this.saldo
    }

    getPosicao() {
        return this.posicao
    }

    comprarCarta(banco: Banco, nomeEspaco: NomeEspaco) {
        const carta = banco.retirarCarta(nomeEspaco)

        if (!carta) {
            throw new Error('Carta não está à venda no banco')
        }

        if (this.saldo < carta.getPreco()) {
            banco.devolverCarta(carta)
            throw new Error('Saldo insuficiente para comprar essa carta')
        }

        this.saldo -= carta.getPreco()
        this.cartas.push(carta)
    }

    getPersonagem() {
        return this.personagem
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
            posicao: this.posicao,
            cartas: this.cartas,
            saldo: this.saldo,
        }
    }
}
