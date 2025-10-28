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
    nome: string
    valorHipoteca: number
    preco: number
}

export interface CartaOutput extends CartaInput {}

export abstract class Carta {
    protected nome: string
    protected valorHipoteca: number
    protected preco: number

    constructor(nome: string, valorHipoteca: number, preco: number) {
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

    getValorHipoteca() {
        return this.valorHipoteca
    }

    toObject(): CartaOutput {
        return {
            nome: this.nome,
            valorHipoteca: this.valorHipoteca,
            preco: this.preco,
        }
    }
}

export interface TituloDePosseInput {
    nome: string
    valorHipoteca: number
    cor: COR_ENUM
    valorAluguel: number[]
    precoCasa: number
    precoHotel: number
    preco: number
}

// Correção aplicada: definido explicitamente, sem 'propriedade'
export type TituloDePosseOutput = {
    nome: string
    valorHipoteca: number
    cor: COR_ENUM
    valorAluguel: number[]
    precoCasa: number
    precoHotel: number
    preco: number
}

export class TituloDePosse extends Carta {
    private cor: COR_ENUM
    private valorAluguel: number[]
    private precoCasa: number
    private precoHotel: number

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
        if (precoCasa <= 0) throw new Error('Preço da casa inválido.')
        if (precoHotel <= 0) throw new Error('Preço do hotel inválido.')

        this.cor = cor
        this.valorAluguel = valorAluguel
        this.precoCasa = precoCasa
        this.precoHotel = precoHotel
    }

    getCor(): COR_ENUM {
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
            precoCasa: this.precoCasa,
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

export class Companhia extends Carta {
    constructor({ nome, valorHipoteca, preco }: CompanhiaInput) {
        super(nome, valorHipoteca, preco)
    }

    toObject(): CompanhiaOutput {
        return {
            ...super.toObject(),
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

export class EstacaoDeMetro extends Carta {
    private valorAluguel: number[]

    constructor({
        nome,
        valorHipoteca,
        valorAluguel,
        preco,
    }: EstacaoDeMetroInput) {
        super(nome, valorHipoteca, preco)
        if (!valorAluguel || valorAluguel.length === 0)
            throw new Error('Valores de aluguel são obrigatórios.')

        this.valorAluguel = valorAluguel
    }

    getValorAluguel(nEstacoes: number): number {
        return this.valorAluguel[
            Math.min(nEstacoes, this.valorAluguel.length - 1)
        ]
    }

    toObject(): EstacaoDeMetroOutput {
        return {
            ...super.toObject(),
            valorAluguel: this.valorAluguel,
        }
    }
}
