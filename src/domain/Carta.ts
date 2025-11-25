import { NomeEspaco } from './dados/nome-espacos'

export enum COR_ENUM {
    AZUL = 'azul',
    AZUL_CLARO = 'azul-claro',
    VERMELHO = 'vermelho',
    VERDE = 'verde',
    AMARELO = 'amarelo',
    ROSA = 'rosa',
    LARANJA = 'laranja',
    ROXO = 'roxo',
    MARROM = 'marrom',
}

export interface CartaInput {
    nome: NomeEspaco
    valorHipoteca: number
    preco: number
}

export interface CartaOutput extends CartaInput {}

export type CartaOutputUnion =
    | TituloDePosseOutput
    | EstacaoDeMetroOutput
    | CompanhiaOutput

export abstract class Carta {
    protected nome: NomeEspaco
    protected valorHipoteca: number
    protected preco: number

    constructor(nome: NomeEspaco, valorHipoteca: number, preco: number) {
        if (!nome) throw new Error('Nome é obrigatório.')
        if (!valorHipoteca) throw new Error('Valor de hipoteca é obrigatório.')
        if (!preco) throw new Error('Preço é obrigatório.')
        if (preco < 0) throw new Error('Preço deve ser maior ou igual a zero.')

        this.nome = nome
        this.valorHipoteca = valorHipoteca
        this.preco = preco
    }

    getNome() {
        return this.nome
    }
    getPreco() {
        return this.preco
    }
    getValorHipoteca() {
        return this.valorHipoteca
    }

    abstract toObject(): CartaOutputUnion
}

export interface TituloDePosseInput extends CartaInput {
    cor: COR_ENUM
    valorAluguel: number[]
    precoCasa: number
    precoHotel: number
}

export interface TituloDePosseOutput extends TituloDePosseInput {
    tipo: 'TituloDePosse'
}

export class TituloDePosse extends Carta {
    private cor: COR_ENUM
    private valorAluguel: number[]
    private precoCasa: number
    private precoHotel: number
    private numeroCasas: number = 0
    private numeroHoteis: number = 0

    constructor({
        nome,
        valorHipoteca,
        cor,
        valorAluguel,
        precoCasa,
        precoHotel,
        preco,
    }: TituloDePosseInput) {
        super(nome, valorHipoteca, preco)
        if (!valorAluguel || valorAluguel.length === 0)
            throw new Error('Valores de aluguel são obrigatórios.')

        this.cor = cor
        this.valorAluguel = valorAluguel
        this.precoCasa = precoCasa
        this.precoHotel = precoHotel

        this.numeroCasas = 0
        this.numeroHoteis = 0
    }

    getCor(): COR_ENUM {
        return this.cor
    }

    getValorAluguel(nCasas: number): number {
        return this.valorAluguel[Math.min(nCasas, this.valorAluguel.length - 1)]
    }

    getNumCasas(): number {
        return this.numeroCasas || 0
    }
    getNumHoteis(): number {
        return this.numeroHoteis || 0
    }

    adicionarCasa() {
        if (this.numeroCasas < 4 && this.numeroHoteis === 0) {
            this.numeroCasas++
        }
    }

    adicionarHotel() {
        if (this.numeroCasas === 4) {
            this.numeroCasas = 0
            this.numeroHoteis = 1
        }
    }

    resetar() {
        this.numeroCasas = 0
        this.numeroHoteis = 0
    }

    toObject(): TituloDePosseOutput {
        return {
            nome: this.nome,
            valorHipoteca: this.valorHipoteca,
            preco: this.preco,
            cor: this.cor,
            valorAluguel: this.valorAluguel,
            precoCasa: this.precoCasa,
            precoHotel: this.precoHotel,
            tipo: 'TituloDePosse',
        }
    }
}

export interface EstacaoDeMetroInput extends CartaInput {
    valorAluguel: number[]
}

export interface EstacaoDeMetroOutput extends EstacaoDeMetroInput {
    tipo: 'EstacaoDeMetro'
}

export class EstacaoDeMetro extends Carta {
    private valorAluguel: number[]

    constructor({
        nome,
        valorHipoteca,
        valorAluguel,
        preco,
    }: EstacaoDeMetroInput) {
        super(nome, valorHipoteca, preco)
        this.valorAluguel = valorAluguel
    }

    getValorAluguel(nEstacoes: number): number {
        return this.valorAluguel[
            Math.min(nEstacoes, this.valorAluguel.length - 1)
        ]
    }

    toObject(): EstacaoDeMetroOutput {
        return {
            nome: this.nome,
            valorHipoteca: this.valorHipoteca,
            preco: this.preco,
            valorAluguel: this.valorAluguel,
            tipo: 'EstacaoDeMetro',
        }
    }
}

interface CompanhiaInput extends CartaInput {}
export interface CompanhiaOutput extends CartaOutput {
    tipo: 'Companhia'
}

export class Companhia extends Carta {
    constructor(data: CompanhiaInput) {
        super(data.nome, data.valorHipoteca, data.preco)
    }

    toObject(): CompanhiaOutput {
        return {
            nome: this.nome,
            valorHipoteca: this.valorHipoteca,
            preco: this.preco,
            tipo: 'Companhia',
        }
    }
}
