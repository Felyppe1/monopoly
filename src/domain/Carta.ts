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

export abstract class CartaEvento {
    protected nome: string
    protected valorHipoteca: number

    constructor(nome: string, valorHipoteca: number) {
        if (!nome) throw new Error('Nome é obrigatório.')
        this.nome = nome
        this.valorHipoteca = valorHipoteca
    }

    getNome() {
        return this.nome
    }

    getValorHipoteca() {
        return this.valorHipoteca
    }

    toObject() {
        return {
            nome: this.nome,
            valorHipoteca: this.valorHipoteca,
        }
    }
}

export interface TituloDePosseInput {
    nome: string
    valorHipoteca: number
    cor: COR_ENUM
    valorAluguel: number[]
    precoPorCasa: number
    precoHotel: number
}

// Correção aplicada: definido explicitamente, sem 'propriedade'
export type TituloDePosseOutput = {
    nome: string
    valorHipoteca: number
    cor: COR_ENUM
    valorAluguel: number[]
    precoPorCasa: number
    precoHotel: number
}

export class TituloDePosse extends CartaEvento {
    private cor: COR_ENUM
    private valorAluguel: number[]
    private precoPorCasa: number
    private precoHotel: number

    constructor({
        nome,
        valorHipoteca,
        cor,
        valorAluguel,
        precoPorCasa,
        precoHotel,
    }: TituloDePosseInput) {
        super(nome, valorHipoteca)

        if (!valorAluguel || valorAluguel.length === 0)
            throw new Error('Valores de aluguel são obrigatórios.')
        if (precoPorCasa <= 0) throw new Error('Preço por casa inválido.')
        if (precoHotel <= 0) throw new Error('Preço do hotel inválido.')

        this.cor = cor
        this.valorAluguel = valorAluguel
        this.precoPorCasa = precoPorCasa
        this.precoHotel = precoHotel
    }

    getCor() {
        return this.cor
    }

    getValorAluguel(nCasas: number): number {
        return this.valorAluguel[Math.min(nCasas, this.valorAluguel.length - 1)]
    }

    toObject(): TituloDePosseOutput {
        return {
            ...super.toObject(),
            cor: this.cor,
            valorAluguel: this.valorAluguel,
            precoPorCasa: this.precoPorCasa,
            precoHotel: this.precoHotel,
        }
    }
}

export interface CompanhiaInput {
    nome: string
    valorHipoteca: number
    preco: number
}

export type CompanhiaOutput = CompanhiaInput

export class Companhia extends CartaEvento {
    private preco: number

    constructor({ nome, valorHipoteca, preco }: CompanhiaInput) {
        super(nome, valorHipoteca)
        if (preco <= 0) throw new Error('Preço inválido.')
        this.preco = preco
    }

    getPreco() {
        return this.preco
    }

    toObject(): CompanhiaOutput {
        return {
            ...super.toObject(),
            preco: this.preco,
        }
    }
}

export interface EstacaoDeMetroInput {
    nome: string
    valorHipoteca: number
    valorAluguel: number[]
    preco: number
}

export type EstacaoDeMetroOutput = EstacaoDeMetroInput

export class EstacaoDeMetro extends CartaEvento {
    private valorAluguel: number[]
    private preco: number

    constructor({
        nome,
        valorHipoteca,
        valorAluguel,
        preco,
    }: EstacaoDeMetroInput) {
        super(nome, valorHipoteca)
        if (!valorAluguel || valorAluguel.length === 0)
            throw new Error('Valores de aluguel são obrigatórios.')
        if (preco <= 0) throw new Error('Preço inválido.')

        this.valorAluguel = valorAluguel
        this.preco = preco
    }

    getValorAluguel(nEstacoes: number): number {
        return this.valorAluguel[
            Math.min(nEstacoes, this.valorAluguel.length - 1)
        ]
    }

    getPreco() {
        return this.preco
    }

    toObject(): EstacaoDeMetroOutput {
        return {
            ...super.toObject(),
            valorAluguel: this.valorAluguel,
            preco: this.preco,
        }
    }
}
