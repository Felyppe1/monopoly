import {
    COR_ENUM,
    TituloDePosse,
    TituloDePosseOutput,
    EstacaoDeMetro as CartaEstacaoDeMetro,
    EstacaoDeMetroOutput as CartaEstacaoDeMetroOutput,
    Companhia as CartaCompanhia,
    CompanhiaOutput as CartaCompanhiaOutput,
} from './Carta'
import {
    Companhia,
    EstacaoDeMetro,
    NomeEspaco,
    Propriedade,
} from './dados/nome-espacos'
import { TIPO_ESPACO_ENUM } from './EspacoDoTabuleiro'
import { Jogador } from './jogador'
import { Jogo } from './jogo'

export interface IEspaco {
    cobrarAluguel(jogador: Jogador, jogo: Jogo): void
    pertenceACor?(cor: COR_ENUM): boolean
}

export interface EspacoInput {
    nome: NomeEspaco
    posicao: number
    tipo: TIPO_ESPACO_ENUM
}

export interface EspacoOutput extends Omit<EspacoInput, 'tipo'> {
    tipo: Exclude<
        TIPO_ESPACO_ENUM,
        | TIPO_ESPACO_ENUM.PROPRIEDADE
        | TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
        | TIPO_ESPACO_ENUM.COMPANHIA
    >
}

export type EspacoOutputUnion =
    | EspacoOutput
    | PropriedadeEspacoOutput
    | EstacaoDeMetroEspacoOutput
    | CompanhiaEspacoOutput

export abstract class Espaco {
    protected nome: NomeEspaco
    protected posicao: number
    protected tipo: TIPO_ESPACO_ENUM

    constructor(data: EspacoInput) {
        if (!data.nome) throw new Error('Nome do espaço é obrigatório.')
        if (!data.posicao) throw new Error('Posição do espaço é obrigatória.')
        if (!data.tipo) throw new Error('Tipo do espaço é obrigatório.')

        if (data.posicao < 0 || data.posicao > 39)
            throw new Error('Posição inválida.')

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

    getPosicao(): number {
        return this.posicao
    }

    cobrarAluguel(jogador: Jogador, proprietario: Jogador, jogo: Jogo): void {}

    pertenceACor(cor: COR_ENUM): boolean {
        return false
    }

    abstract acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void

    abstract toObject(): EspacoOutputUnion
}

export type TIPO_ESPACO_COMPRAVEL = Extract<
    TIPO_ESPACO_ENUM,
    | TIPO_ESPACO_ENUM.PROPRIEDADE
    | TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
    | TIPO_ESPACO_ENUM.COMPANHIA
>

export interface EspacoCompravelInput extends Omit<EspacoInput, 'tipo'> {
    tipo: TIPO_ESPACO_COMPRAVEL
}

export abstract class EspacoCompravel extends Espaco {
    constructor(data: EspacoCompravelInput) {
        super(data)
    }
}

export interface PropriedadeEspacoInput
    extends Omit<EspacoCompravelInput, 'tipo'> {
    tipo: TIPO_ESPACO_ENUM.PROPRIEDADE
    quantidadeConstrucoes: number
    tituloDePosse: TituloDePosse
}

export interface CriarPropriedadeEspacoInput
    extends Omit<PropriedadeEspacoInput, 'tipo' | 'quantidadeConstrucoes'> {}

export interface PropriedadeEspacoOutput
    extends Omit<PropriedadeEspacoInput, 'tipo' | 'tituloDePosse'> {
    tipo: TIPO_ESPACO_ENUM.PROPRIEDADE
    tituloDePosse: TituloDePosseOutput
}

export class PropriedadeEspaco extends EspacoCompravel {
    private quantidadeConstrucoes: number
    private tituloDePosse: TituloDePosse

    static criar(data: CriarPropriedadeEspacoInput): PropriedadeEspaco {
        return new PropriedadeEspaco({
            ...data,
            tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
            quantidadeConstrucoes: 0,
        })
    }

    constructor(data: PropriedadeEspacoInput) {
        super({ nome: data.nome, posicao: data.posicao, tipo: data.tipo })

        if (!data.tituloDePosse)
            throw new Error('Título de posse é obrigatório.')
        if (
            data.quantidadeConstrucoes === undefined ||
            data.quantidadeConstrucoes === null
        ) {
            throw new Error('Quantidade de construções é obrigatória.')
        }

        this.quantidadeConstrucoes = data.quantidadeConstrucoes
        this.tituloDePosse = data.tituloDePosse
    }

    getCor() {
        return this.tituloDePosse.getCor()
    }

    override pertenceACor(cor: COR_ENUM): boolean {
        return this.getCor() === cor
    }

    acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void {}

    override cobrarAluguel(
        jogadorAtual: Jogador,
        proprietario: Jogador,
        jogo: Jogo,
    ): void {
        if (!proprietario || proprietario === jogadorAtual) {
            return
        }

        const quantidadeTitulosProprietario =
            proprietario.getQuantidadeDeTitulos(this.getCor())

        const totalTitulos = jogo.getQuantidadePropriedades(this.getCor())

        const valorAluguel = this.calcularAluguel(
            quantidadeTitulosProprietario === totalTitulos,
        )

        const pagamentoRealizado = jogadorAtual.pagar(valorAluguel)
        proprietario.receber(valorAluguel)
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

    getQuantidadeConstrucoes() {
        return this.quantidadeConstrucoes
    }

    toObject(): PropriedadeEspacoOutput {
        return {
            nome: this.nome as Propriedade,
            posicao: this.posicao,
            tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
            quantidadeConstrucoes: this.quantidadeConstrucoes,
            tituloDePosse: this.tituloDePosse.toObject(),
        }
    }
}

export interface EstacaoDeMetroEspacoInput
    extends Omit<EspacoCompravelInput, 'tipo'> {
    tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
    carta: CartaEstacaoDeMetro
}

export interface CriarEstacaoDeMetroEspacoInput
    extends Omit<EstacaoDeMetroEspacoInput, 'tipo'> {}

export interface EstacaoDeMetroEspacoOutput
    extends Omit<EstacaoDeMetroEspacoInput, 'tipo' | 'carta'> {
    tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
    carta: CartaEstacaoDeMetroOutput
}

export class EstacaoDeMetroEspaco extends EspacoCompravel {
    private carta: CartaEstacaoDeMetro

    static criar(data: CriarEstacaoDeMetroEspacoInput): EstacaoDeMetroEspaco {
        return new EstacaoDeMetroEspaco({
            ...data,
            tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
        })
    }

    constructor(data: EstacaoDeMetroEspacoInput) {
        super({ nome: data.nome, posicao: data.posicao, tipo: data.tipo })

        if (!data.carta)
            throw new Error('Carta da estação de metrô é obrigatória.')

        this.carta = data.carta
    }

    acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void {}

    override cobrarAluguel(
        jogadorAtual: Jogador,
        proprietario: Jogador,
        jogo: Jogo,
    ): void {
        if (!proprietario || proprietario === jogadorAtual) {
            return
        }

        const quantidadeEstacoes = proprietario.getQuantidadeDeEstacoesMetro()

        const valorAluguel = this.calcularAluguel(quantidadeEstacoes)

        const pagamentoRealizado = jogadorAtual.pagar(valorAluguel)
        proprietario.receber(valorAluguel)
    }

    calcularAluguel(quantidadeEstacoesPossuidas: number) {
        return this.carta.getValorAluguel(quantidadeEstacoesPossuidas)
    }

    toObject(): EstacaoDeMetroEspacoOutput {
        return {
            nome: this.nome as EstacaoDeMetro,
            posicao: this.posicao,
            tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
            carta: this.carta.toObject(),
        }
    }
}

export interface CompanhiaEspacoInput
    extends Omit<EspacoCompravelInput, 'tipo'> {
    tipo: TIPO_ESPACO_ENUM.COMPANHIA
    carta: CartaCompanhia
}

export interface CriarCompanhiaEspacoInput
    extends Omit<CompanhiaEspacoInput, 'tipo'> {}

export interface CompanhiaEspacoOutput
    extends Omit<CompanhiaEspacoInput, 'tipo' | 'carta'> {
    tipo: TIPO_ESPACO_ENUM.COMPANHIA
    carta: CartaCompanhiaOutput
}

export class CompanhiaEspaco extends EspacoCompravel {
    private carta: CartaCompanhia

    static criar(data: CriarCompanhiaEspacoInput): CompanhiaEspaco {
        return new CompanhiaEspaco({
            ...data,
            tipo: TIPO_ESPACO_ENUM.COMPANHIA,
        })
    }

    constructor(data: CompanhiaEspacoInput) {
        super({ nome: data.nome, posicao: data.posicao, tipo: data.tipo })

        if (!data.carta) throw new Error('Carta da companhia é obrigatória.')
        this.carta = data.carta
    }

    acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void {}

    override cobrarAluguel(
        jogadorAtual: Jogador,
        proprietario: Jogador,
        jogo: Jogo,
    ): void {
        const quantidadeCompanhias = proprietario.getQuantidadeDeCompanhias()

        const valorAluguel = this.calcularAluguel(
            quantidadeCompanhias,
            jogo.getDados()!.dado1 + jogo.getDados()!.dado2,
        )

        proprietario.receber(valorAluguel)
    }

    calcularAluguel(quantidadeCompanhiasPossuidas: number, somaDados: number) {
        return quantidadeCompanhiasPossuidas === 1
            ? somaDados * 4
            : somaDados * 10
    }

    toObject(): CompanhiaEspacoOutput {
        return {
            nome: this.nome as Companhia,
            posicao: this.posicao,
            tipo: TIPO_ESPACO_ENUM.COMPANHIA,
            carta: this.carta.toObject(),
        }
    }
}

export interface EspacoNaoCompravelInput extends Omit<EspacoInput, 'tipo'> {
    tipo: Exclude<
        TIPO_ESPACO_ENUM,
        | TIPO_ESPACO_ENUM.PROPRIEDADE
        | TIPO_ESPACO_ENUM.ESTACAO_DE_METRO
        | TIPO_ESPACO_ENUM.COMPANHIA
    >
}

abstract class EspacoNaoCompravel extends Espaco {
    constructor(data: EspacoNaoCompravelInput) {
        super(data)
    }
}

export class VaParaPrisaoEspaco extends EspacoNaoCompravel {
    constructor(data: EspacoNaoCompravelInput) {
        super(data)
    }

    acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void {
        jogadorAtual.irParaPrisao()
    }

    toObject(): EspacoOutput {
        return {
            nome: this.nome,
            posicao: this.posicao,
            tipo: TIPO_ESPACO_ENUM.VA_PARA_PRISAO,
        }
    }
}

export class ImpostoEspaco extends EspacoNaoCompravel {
    constructor(data: EspacoNaoCompravelInput) {
        super(data)
    }

    acaoAoCair(jogadorAtual: Jogador, jogo: Jogo): void {
        jogadorAtual.pagar(200)
    }

    toObject(): EspacoOutput {
        return {
            nome: this.nome,
            posicao: this.posicao,
            tipo: TIPO_ESPACO_ENUM.IMPOSTO,
        }
    }
}
