import {
    TituloDePosse,
    TituloDePosseOutput,
    EstacaoDeMetro as CartaEstacaoDeMetro,
    EstacaoDeMetroOutput as CartaEstacaoDeMetroOutput,
    Companhia as CartaCompanhia,
    CompanhiaOutput as CartaCompanhiaOutput,
} from './Carta'

export enum TIPO_ESPACO_ENUM {
    PROPRIEDADE = 'propriedade',
    IMPOSTO = 'imposto',
    COMPANHIA = 'companhia',
    ESTACAO_DE_METRO = 'estação de metrô',
    PRISAO = 'prisão',
    SORTE = 'sorte',
    COFRE = 'cofre',
    PONTO_DE_PARTIDA = 'ponto de partida',
    ESTACIONAMENTO = 'estacionamento',
    VA_PARA_PRISAO = 'vá para prisão',
}

export interface EspacoDoTabuleiroInput {
    nome: string
    posicao: number
    tipo: TIPO_ESPACO_ENUM
}

export interface EspacoDoTabuleiroOutput extends EspacoDoTabuleiroInput {}

export class EspacoDoTabuleiro {
    nome: string
    posicao: number
    tipo: TIPO_ESPACO_ENUM

    constructor(nome: string, posicao: number, tipo: TIPO_ESPACO_ENUM) {
        if (!nome) throw new Error('Nome do espaço é obrigatório.')
        if (posicao < 0) throw new Error('Posição inválida.')
        this.nome = nome
        this.posicao = posicao
        this.tipo = tipo
    }

    toObject() {
        return {
            nome: this.nome,
            posicao: this.posicao,
            tipo: this.tipo,
        }
    }
}

export interface PropriedadeInput extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    tituloDePosse: TituloDePosse
}

export interface PropriedadeOutput extends EspacoDoTabuleiroOutput {
    tituloDePosse: TituloDePosseOutput
}

export class Propriedade extends EspacoDoTabuleiro {
    tituloDePosse: TituloDePosse

    constructor(data: PropriedadeInput) {
        super(data.nome, data.posicao, TIPO_ESPACO_ENUM.PROPRIEDADE)
        this.tituloDePosse = data.tituloDePosse
    }

    toObject(): PropriedadeOutput {
        return {
            ...super.toObject(),
            tituloDePosse: this.tituloDePosse.toObject(),
        }
    }
}

export interface EstacaoDeMetroInput
    extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    cartaEstacaoDeMetro: CartaEstacaoDeMetro
}

export interface EstacaoDeMetroOutput extends EspacoDoTabuleiroOutput {
    cartaEstacaoDeMetro: CartaEstacaoDeMetroOutput
}

export class EstacaoDeMetro extends EspacoDoTabuleiro {
    cartaEstacaoDeMetro: CartaEstacaoDeMetro

    constructor(data: EstacaoDeMetroInput) {
        super(data.nome, data.posicao, TIPO_ESPACO_ENUM.ESTACAO_DE_METRO)
        this.cartaEstacaoDeMetro = data.cartaEstacaoDeMetro
    }

    toObject(): EstacaoDeMetroOutput {
        return {
            ...super.toObject(),
            cartaEstacaoDeMetro: this.cartaEstacaoDeMetro.toObject(),
        }
    }
}

export interface CompanhiaInput extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    cartaCompanhia: CartaCompanhia
}

export interface CompanhiaOutput extends EspacoDoTabuleiroOutput {
    cartaCompanhia: CartaCompanhiaOutput
}

export class Companhia extends EspacoDoTabuleiro {
    cartaCompanhia: CartaCompanhia

    constructor(data: CompanhiaInput) {
        super(data.nome, data.posicao, TIPO_ESPACO_ENUM.COMPANHIA)
        this.cartaCompanhia = data.cartaCompanhia
    }

    toObject(): CompanhiaOutput {
        return {
            ...super.toObject(),
            cartaCompanhia: this.cartaCompanhia.toObject(),
        }
    }
}
