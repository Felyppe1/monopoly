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
import { Jogador } from './jogador'
import { Jogo } from './jogo'

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

    getTipo(): TIPO_ESPACO_ENUM {
        return this.tipo
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
    private quantidadeConstrucoes: number
    private tituloDePosse: TituloDePosse

    constructor({ nome, posicao, tituloDePosse }: PropriedadeInput) {
        super({ nome, posicao, tipo: TIPO_ESPACO_ENUM.PROPRIEDADE })
        this.tituloDePosse = tituloDePosse
        this.quantidadeConstrucoes = 0
    }

    getQuantidadeConstrucoes() {
        return this.quantidadeConstrucoes
    }

    getTituloDePosse() {
        return this.tituloDePosse
    }

    getCor() {
        return this.tituloDePosse.getCor()
    }

    calcularAluguel(possuiMonopolio: boolean) {
        const valorAluguel = this.tituloDePosse.getValorAluguel(
            this.quantidadeConstrucoes,
        )

        if (possuiMonopolio && this.quantidadeConstrucoes === 0) {
            return valorAluguel * 2
        }

        return valorAluguel
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

    calcularAluguel(quantidadeEstacoesPossuidas: number) {
        return this.cartaEstacaoDeMetro.getValorAluguel(
            quantidadeEstacoesPossuidas,
        )
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

    calcularAluguel(quantidadeCompanhiasPossuidas: number, somaDados: number) {
        return quantidadeCompanhiasPossuidas === 1
            ? somaDados * 4
            : somaDados * 10
    }

    toObject(): CompanhiaOutput {
        return {
            ...super.toObject(),
            tipo: TIPO_ESPACO_ENUM.COMPANHIA,
            cartaCompanhia: this.cartaCompanhia.toObject(),
        }
    }
}

export interface ImpostoInput extends Omit<EspacoDoTabuleiroInput, 'tipo'> {
    aluguel: number
}

export interface ImpostoOutput extends EspacoDoTabuleiroBaseOutput {
    tipo: TIPO_ESPACO_ENUM.IMPOSTO
}

export class Imposto extends EspacoDoTabuleiro {
    private aluguel: number

    constructor({ nome, posicao, aluguel }: ImpostoInput) {
        super({ nome, posicao, tipo: TIPO_ESPACO_ENUM.IMPOSTO })

        if (aluguel === undefined || aluguel === null) {
            throw new Error('Aluguel do imposto é obrigatório')
        }

        this.aluguel = aluguel
    }

    getAluguel() {
        return this.aluguel
    }

    toObject(): ImpostoOutput {
        return {
            ...super.toObject(),
            tipo: TIPO_ESPACO_ENUM.IMPOSTO,
        }
    }
}
