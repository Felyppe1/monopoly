import { Banco } from './banco'
import {
    Carta,
    CartaOutputUnion,
    Companhia,
    COR_ENUM,
    EstacaoDeMetro,
    TituloDePosse,
} from './Carta'
import { NomeEspaco } from './dados/nome-espacos'
import { CartaEvento } from './CartaCofreouSorte'

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
    falido: boolean
}

export interface JogadorOutput extends Omit<JogadorInput, 'cartas'> {
    cartas: CartaOutputUnion[]
}

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
    private cartasSaidaPrisao: CartaEvento[] = []
    private falido: boolean

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
            falido: false,
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
        falido,
    }: JogadorInput) {
        if (!nome) throw new Error('Nome do jogador é obrigatório')
        if (!personagem) throw new Error('Personagem do jogador é obrigatório')
        if (posicao < 0 || posicao >= 40)
            throw new Error('Posição deve estar entre 0 e 39')

        this.nome = nome
        this.personagem = personagem
        this.posicao = posicao
        this.cartas = cartas
        this.saldo = 1500
        this.estaPreso = estaPreso
        this.turnosNaPrisao = turnosNaPrisao
        this.tentativasDuplo = tentativasDuplo
        this.falido = falido
    }

    declararFalencia(banco: Banco) {
        this.falido = true
        this.saldo = 0

        this.cartas.forEach(carta => {
            if (carta instanceof TituloDePosse) {
                carta.resetar()
            }
            banco.devolverCarta(carta)
        })

        this.cartas = []
        console.log(`${this.nome} declarou falência!`)
    }

    getFalido() {
        return this.falido
    }

    irParaPrisao() {
        this.posicao = 10
        this.estaPreso = true
        this.turnosNaPrisao = 0
        this.tentativasDuplo = 0
    }

    tentarSairDaPrisao(dado1: number, dado2: number) {
        if (!this.estaPreso) return
        this.pagar(50) // Poderia ser opcional, mas simplificado aqui
        this.tentativasDuplo += 1
        this.turnosNaPrisao += 1

        if (this.tentativasDuplo === 3 || dado1 === dado2) {
            this.sairDaPrisao()
            if (this.tentativasDuplo === 3) this.pagar(50)
            this.mover(dado1 + dado2)
        }
    }

    sairDaPrisao() {
        this.estaPreso = false
        this.turnosNaPrisao = 0
        this.tentativasDuplo = 0
    }

    adicionarCartaSaidaPrisao(carta: CartaEvento) {
        this.cartasSaidaPrisao.push(carta)
    }
    temCartaSaidaPrisao(): boolean {
        return this.cartasSaidaPrisao.length > 0
    }
    usarCartaSaidaPrisao(): CartaEvento | null {
        return this.cartasSaidaPrisao.pop() || null
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
        const TOTAL_CASAS = 40
        const posicaoAnterior = this.posicao
        this.posicao = (this.posicao + casas) % TOTAL_CASAS

        if (this.posicao < posicaoAnterior) {
            this.saldo += 200
            console.log(`${this.nome} passou pelo Início e recebeu $200.`)
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
        if (!carta) throw new Error('Carta não está à venda')

        const pagamentoRealizado = this.pagar(carta.getPreco())
        if (!pagamentoRealizado) {
            banco.devolverCarta(carta)
            throw new Error('Saldo insuficiente')
        }
        this.cartas.push(carta)
    }

    pagar(valor: number) {
        if (this.saldo < valor) return false
        this.saldo -= valor
        return true
    }

    getCarta(nomeEspaco: NomeEspaco) {
        return this.cartas.find(c => c.getNome() === nomeEspaco) || null
    }

    getQuantidadeDeTitulos(cor: COR_ENUM) {
        return this.cartas.filter(
            c => c instanceof TituloDePosse && c.getCor() === cor,
        ).length
    }
    getQuantidadeDeEstacoesMetro() {
        return this.cartas.filter(c => c instanceof EstacaoDeMetro).length
    }
    getQuantidadeDeCompanhias() {
        return this.cartas.filter(c => c instanceof Companhia).length
    }

    getPersonagem() {
        return this.personagem
    }
    getNome() {
        return this.nome
    }

    getQuantidadeTotalCasas(): number {
        return this.cartas.reduce((total, carta) => {
            if (carta instanceof TituloDePosse)
                return total + (carta.getNumCasas ? carta.getNumCasas() : 0)
            return total
        }, 0)
    }

    getQuantidadeTotalHoteis(): number {
        return this.cartas.reduce((total, carta) => {
            if (carta instanceof TituloDePosse)
                return total + (carta.getNumHoteis ? carta.getNumHoteis() : 0)
            return total
        }, 0)
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
            posicao: this.posicao,
            cartas: this.cartas.map(c => c.toObject()),
            saldo: this.saldo,
            estaPreso: this.estaPreso,
            turnosNaPrisao: this.turnosNaPrisao,
            tentativasDuplo: this.tentativasDuplo,
            falido: this.falido,
        }
    }
}
