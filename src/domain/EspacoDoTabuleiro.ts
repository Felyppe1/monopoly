import {
    Carta,
    CartaOutput,
    TituloDePosse,
    TituloDePosseOutput,
    EstacaoDeMetro as CartaEstacaoDeMetro,
    EstacaoDeMetroOutput as CartaEstacaoDeMetroOutput,
    Companhia as CartaCompanhia,
    CompanhiaOutput as CartaCompanhiaOutput,
} from './Carta'
import { NomeEspaco } from './dados/nome-espacos'

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

interface EspacoDoTabuleiroBaseOutput
    extends Omit<EspacoDoTabuleiroInput, 'tipo'> {}

export type EspacoDoTabuleiroOutputUnion =
    | EspacoDoTabuleiroExcludeOutput
    | PropriedadeOutput
    | EstacaoDeMetroOutput
    | CompanhiaOutput

export interface EspacoDoTabuleiroInput {
    nome: NomeEspaco
    posicao: number
    tipo: TIPO_ESPACO_ENUM
}

export interface EspacoDoTabuleiroExcludeOutput
    extends EspacoDoTabuleiroBaseOutput {
    tipo: Exclude<
        TIPO_ESPACO_ENUM,
        | TIPO_ESPACO_ENUM.PROPRIEDADE
        | TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
        | TIPO_ESPACO_ENUM.COMPANHIA
    >
}

export interface EspacoDoTabuleiroOutput extends EspacoDoTabuleiroInput {}

export class EspacoDoTabuleiro {
    protected nome: NomeEspaco
    protected posicao: number
    protected tipo: TIPO_ESPACO_ENUM

    constructor(data: EspacoDoTabuleiroInput) {
        if (!data.nome) throw new Error('Nome do espaço é obrigatório.')
        if (data.posicao < 0) throw new Error('Posição inválida.')
        this.nome = data.nome
        this.posicao = data.posicao
        this.tipo = data.tipo
    }

    getNome(): NomeEspaco {
        return this.nome
    }

    toObject(): EspacoDoTabuleiroOutput {
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

export interface PropriedadeOutput extends EspacoDoTabuleiroBaseOutput {
    tipo: TIPO_ESPACO_ENUM.PROPRIEDADE
    tituloDePosse: TituloDePosseOutput
}

export class Propriedade extends EspacoDoTabuleiro {
    tituloDePosse: TituloDePosse

    constructor({ nome, posicao, tituloDePosse }: PropriedadeInput) {
        super({ nome, posicao, tipo: TIPO_ESPACO_ENUM.PROPRIEDADE })
        this.tituloDePosse = tituloDePosse
    }

    toObject(): PropriedadeOutput {
        return {
            ...super.toObject(),
            tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
            tituloDePosse: this.tituloDePosse.toObject(),
        }
    }
}

export interface EstacaoDeMetroInput
    extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    cartaEstacaoDeMetro: CartaEstacaoDeMetro
}

export interface EstacaoDeMetroOutput extends EspacoDoTabuleiroBaseOutput {
    tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
    cartaEstacaoDeMetro: CartaEstacaoDeMetroOutput
}

export class EstacaoDeMetro extends EspacoDoTabuleiro {
    cartaEstacaoDeMetro: CartaEstacaoDeMetro

    constructor({ nome, posicao, cartaEstacaoDeMetro }: EstacaoDeMetroInput) {
        super({ nome, posicao, tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO })
        this.cartaEstacaoDeMetro = cartaEstacaoDeMetro
    }

    toObject(): EstacaoDeMetroOutput {
        return {
            ...super.toObject(),
            tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
            cartaEstacaoDeMetro: this.cartaEstacaoDeMetro.toObject(),
        }
    }
}

export interface CompanhiaInput extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    cartaCompanhia: CartaCompanhia
}

export interface CompanhiaOutput extends EspacoDoTabuleiroBaseOutput {
    tipo: TIPO_ESPACO_ENUM.COMPANHIA
    cartaCompanhia: CartaCompanhiaOutput
}

export class Companhia extends EspacoDoTabuleiro {
    cartaCompanhia: CartaCompanhia

    constructor({ nome, posicao, cartaCompanhia }: CompanhiaInput) {
        super({ nome, posicao, tipo: TIPO_ESPACO_ENUM.COMPANHIA })
        this.cartaCompanhia = cartaCompanhia
    }

    toObject(): CompanhiaOutput {
        return {
            ...super.toObject(),
            tipo: TIPO_ESPACO_ENUM.COMPANHIA,
            cartaCompanhia: this.cartaCompanhia.toObject(),
        }
    }
}
