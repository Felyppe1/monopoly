import { Carta } from './Carta'

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
    estaPreso: boolean
    turnosNaPrisao: number
    tentativasDuplo: number
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
    private estaPreso: boolean
    private turnosNaPrisao: number
    private tentativasDuplo: number

    static create({ nome, personagem }: CriarJogadorInput) {
        const SALDO_INICIAL = 1500
        return new Jogador({
            nome,
            personagem,
            posicao: 0,
            cartas: [],
            estaPreso: false,
            turnosNaPrisao: 0,
            tentativasDuplo: 0,
            saldo: SALDO_INICIAL,
        })
    }

    constructor({
        nome,
        personagem,
        posicao,
        cartas,
        estaPreso,
        turnosNaPrisao,
        tentativasDuplo,
    }: JogadorInput) {
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
        this.estaPreso = estaPreso
        this.turnosNaPrisao = turnosNaPrisao
        this.tentativasDuplo = tentativasDuplo
    }

    irParaPrisao() {
        this.posicao = 10
        this.estaPreso = true
        this.turnosNaPrisao = 0
        this.tentativasDuplo = 0
    }

    tentarSairDaPrisao() {
        if (!this.estaPreso) return
        this.tentativasDuplo += 1
        this.turnosNaPrisao += 1
    }

    sairDaPrisao() {
        this.estaPreso = false
        this.turnosNaPrisao = 0
        this.tentativasDuplo = 0
    }

    pagarFianca() {
        this.saldo -= 50
        this.sairDaPrisao()
    }

    getEstaPreso() {
        return this.estaPreso
    }

    getTurnosNaPrisao() {
        return this.turnosNaPrisao
    }

    getTentativasDuplo() {
        return this.tentativasDuplo
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

    pagar(valor: number) {
        this.saldo -= valor
    }

    getSaldo() {
        return this.saldo
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
            estaPreso: this.estaPreso,
            turnosNaPrisao: this.turnosNaPrisao,
            tentativasDuplo: this.tentativasDuplo,
        }
    }
}
