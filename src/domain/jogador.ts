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
    ehBot: boolean
}

export interface JogadorOutput extends Omit<JogadorInput, 'cartas'> {
    cartas: CartaOutputUnion[]
}

export interface CriarJogadorInput {
    nome: string
    personagem: PERSONAGEM
    saldo?: number
    ehBot?: boolean
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
    private ehBot: boolean

    static create({ nome, personagem, ehBot=false }: CriarJogadorInput) {
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
            ehBot: ehBot,
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
        ehBot,
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
        this.ehBot = ehBot
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

    tentarSairDaPrisao(dado1: number, dado2: number) {
        if (!this.estaPreso) return
        this.pagar(50)
        this.tentativasDuplo += 1
        this.turnosNaPrisao += 1

        if (this.tentativasDuplo === 3) {
            this.sairDaPrisao()
            this.pagar(50)
            this.mover(dado1 + dado2)
        } else if (dado1 === dado2) {
            this.sairDaPrisao()
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

    getCartaSaidaPrisao(): CartaEvento[] {
        return this.cartasSaidaPrisao
    }

    getCartas(): Carta[] {
        return this.cartas
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

    getEhBot() {
        return this.ehBot
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

        const pagamentoRealizado = this.pagar(carta.getPreco())

        if (!pagamentoRealizado) {
            banco.devolverCarta(carta)
            throw new Error('Saldo insuficiente para comprar essa carta')
        }

        this.cartas.push(carta)
    }

    pagar(valor: number) {
        if (this.saldo < valor) {
            return false
        }

        this.saldo -= valor

        return true
    }

    public removerCarta(nomeEspaco: NomeEspaco): boolean {
        const cartaIndex: number = this.cartas.findIndex(
            carta => carta.getNome() === nomeEspaco,
        )
        if (cartaIndex !== -1) {
            this.cartas.splice(cartaIndex, 1)
            return true
        }
        return false
    }

    public adicionarCarta(carta: Carta) {
        this.cartas.push(carta)
    }

    getCarta(nomeEspaco: NomeEspaco) {
        const carta = this.cartas.find(carta => carta.getNome() === nomeEspaco)
        return carta || null
    }

    getQuantidadeDeTitulos(cor: COR_ENUM) {
        const quantidade = this.cartas.filter(
            carta => carta instanceof TituloDePosse && carta.getCor() === cor,
        ).length

        return quantidade
    }

    getQuantidadeDeEstacoesMetro() {
        const quantidade = this.cartas.filter(
            carta => carta instanceof EstacaoDeMetro,
        ).length

        return quantidade
    }

    getQuantidadeDeCompanhias() {
        const quantidade = this.cartas.filter(
            carta => carta instanceof Companhia,
        ).length

        return quantidade
    }

    getPersonagem() {
        return this.personagem
    }

    getNome() {
        return this.nome
    }

    getQuantidadeTotalCasas(): number {
        return this.cartas.reduce((total, carta) => {
            if (carta instanceof TituloDePosse) {
                return total + (carta.getNumCasas ? carta.getNumCasas() : 0)
            }
            return total
        }, 0)
    }

    getQuantidadeTotalHoteis(): number {
        return this.cartas.reduce((total, carta) => {
            if (carta instanceof TituloDePosse) {
                return total + (carta.getNumHoteis ? carta.getNumHoteis() : 0)
            }
            return total
        }, 0)
    }

    toObject(): JogadorOutput {
        return {
            nome: this.nome,
            personagem: this.personagem,
            posicao: this.posicao,
            cartas: this.cartas.map(carta => carta.toObject()),
            saldo: this.saldo,
            estaPreso: this.estaPreso,
            turnosNaPrisao: this.turnosNaPrisao,
            tentativasDuplo: this.tentativasDuplo,
            ehBot: this.ehBot,
        }
    }
}
