import type { Jogador } from './jogador'
import type { Jogo } from './jogo'

export enum TIPO_CARTA {
    SORTE = 'sorte',
    AZAR = 'azar',
}

export enum ACAO_CARTA {
    RECEBER = 'receber',
    PAGAR = 'pagar',
    SAIR_DA_PRISAO = 'sair_da_prisao',
    MULTAR_POR_CASA = 'multar_por_casa',
    AVANCAR_INICIO = 'avancar_inicio',
    IR_PARA_PRISAO = 'ir_para_prisao',
    AVANCAR_PROPRIEDADE = 'avancar_propriedade',
    PAGAR_TODOS = 'pagar_todos',
    AVANCAR_ESTACAO = 'avancar_estacao',
    AVANCAR_ESTACAO_ESPECIFICA = 'avancar_estacao_especifica',
    VOLTAR_CASAS = 'voltar_casas',
    AVANCAR_COMPANHIA = 'avancar_companhia',
}

export interface CartaEventoInput {
    descricao: string
    tipo: TIPO_CARTA
    acao: ACAO_CARTA
    valor?: number
    destino?: string
    valorPorCasa?: number
    valorPorHotel?: number
    quantidadeCasas?: number
    multiplicadorAluguel?: number
}

export interface CartaEventoOutput {
    descricao: string
    tipo: TIPO_CARTA
    acao: ACAO_CARTA
    valor?: number
    destino?: string
    valorPorCasa?: number
    valorPorHotel?: number
    quantidadeCasas?: number
    multiplicadorAluguel?: number
}

export class CartaEvento {
    private descricao: string
    private tipo: TIPO_CARTA
    private acao: ACAO_CARTA
    private valor?: number
    private destino?: string
    private valorPorCasa?: number
    private valorPorHotel?: number
    private quantidadeCasas?: number
    private multiplicadorAluguel?: number

    constructor({
        descricao,
        tipo,
        acao,
        valor,
        destino,
        valorPorCasa,
        valorPorHotel,
        quantidadeCasas,
        multiplicadorAluguel,
    }: CartaEventoInput) {
        if (!descricao) throw new Error('Descrição é obrigatória.')
        if (!tipo) throw new Error('Tipo é obrigatório.')
        if (!acao) throw new Error('Ação é obrigatória.')

        this.validarAcao(
            acao,
            valor,
            destino,
            valorPorCasa,
            valorPorHotel,
            quantidadeCasas,
        )

        this.descricao = descricao
        this.tipo = tipo
        this.acao = acao
        this.valor = valor
        this.destino = destino
        this.valorPorCasa = valorPorCasa
        this.valorPorHotel = valorPorHotel
        this.quantidadeCasas = quantidadeCasas
        this.multiplicadorAluguel = multiplicadorAluguel
    }

    private validarAcao(
        acao: ACAO_CARTA,
        valor?: number,
        destino?: string,
        valorPorCasa?: number,
        valorPorHotel?: number,
        quantidadeCasas?: number,
    ): void {
        switch (acao) {
            case ACAO_CARTA.RECEBER:
            case ACAO_CARTA.PAGAR:
            case ACAO_CARTA.PAGAR_TODOS:
                if (valor === undefined || valor <= 0) {
                    throw new Error(
                        `Valor é obrigatório e deve ser positivo para ação: ${acao}`,
                    )
                }
                break

            case ACAO_CARTA.AVANCAR_PROPRIEDADE:
            case ACAO_CARTA.AVANCAR_ESTACAO_ESPECIFICA:
                if (!destino) {
                    throw new Error('Destino é obrigatório para esta ação')
                }
                break

            case ACAO_CARTA.MULTAR_POR_CASA:
                if (valorPorCasa === undefined || valorPorCasa <= 0) {
                    throw new Error(
                        'valorPorCasa é obrigatório e deve ser positivo',
                    )
                }
                if (valorPorHotel === undefined || valorPorHotel <= 0) {
                    throw new Error(
                        'valorPorHotel é obrigatório e deve ser positivo',
                    )
                }
                break

            case ACAO_CARTA.VOLTAR_CASAS:
                if (quantidadeCasas === undefined || quantidadeCasas <= 0) {
                    throw new Error(
                        'quantidadeCasas é obrigatório e deve ser positivo',
                    )
                }
                break

            case ACAO_CARTA.IR_PARA_PRISAO:
            case ACAO_CARTA.AVANCAR_ESTACAO:
            case ACAO_CARTA.AVANCAR_COMPANHIA:
            case ACAO_CARTA.SAIR_DA_PRISAO:
            case ACAO_CARTA.AVANCAR_INICIO:
                break

            default:
                throw new Error(`Ação não reconhecida: ${acao}`)
        }
    }

    getDescricao(): string {
        return this.descricao
    }

    getTipo(): TIPO_CARTA {
        return this.tipo
    }

    getAcao(): ACAO_CARTA {
        return this.acao
    }

    getValor(): number | undefined {
        return this.valor
    }

    getDestino(): string | undefined {
        return this.destino
    }

    getValorPorCasa(): number | undefined {
        return this.valorPorCasa
    }

    getValorPorHotel(): number | undefined {
        return this.valorPorHotel
    }

    getQuantidadeCasas(): number | undefined {
        return this.quantidadeCasas
    }

    getMultiplicadorAluguel(): number | undefined {
        return this.multiplicadorAluguel
    }

    executarAcao(
        jogador: Jogador,
        jogo?: Jogo,
    ): {
        valor: number
        destino?: string
        cartaPrisao?: boolean
        irParaPrisao?: boolean
        voltarCasas?: number
        tipoMovimento?: 'avancar' | 'voltar' | 'prisao'
        multiplicadorAluguel?: number
        avancarPara?: 'estacao' | 'companhia'
        acao?: ACAO_CARTA
        deveGuardarCarta?: boolean
    } {
        const baseRetorno = { acao: this.acao, valor: 0 }
        switch (this.acao) {
            case ACAO_CARTA.RECEBER:
                return { ...baseRetorno, valor: this.valor! }

            case ACAO_CARTA.PAGAR:
                return { ...baseRetorno, valor: -this.valor! }

            case ACAO_CARTA.PAGAR_TODOS:
                // Se o jogo for passado, calcula com base no número real de jogadores.
                // Senão, assume 1 oponente (padrão de segurança).
                // Assumindo que Jogo tem um método getJogadores() ou similar.
                // Como 'jogo' é tipagem fraca aqui para evitar ciclo, usamos lógica defensiva.
                const numJogadores = jogo
                    ? (jogo as any).jogadores?.length || 2
                    : 2
                const totalPagar = this.valor! * (numJogadores - 1)
                return { ...baseRetorno, valor: -totalPagar }

            case ACAO_CARTA.IR_PARA_PRISAO:
                return {
                    ...baseRetorno,
                    irParaPrisao: true,
                    tipoMovimento: 'prisao',
                }

            case ACAO_CARTA.AVANCAR_PROPRIEDADE:
                return {
                    ...baseRetorno,
                    valor: 0,
                    destino: this.destino!,
                    tipoMovimento: 'avancar',
                }

            case ACAO_CARTA.AVANCAR_ESTACAO:
                return {
                    ...baseRetorno,
                    valor: 0,
                    destino: this.destino,
                    tipoMovimento: 'avancar',
                    avancarPara: 'estacao',
                    multiplicadorAluguel: this.multiplicadorAluguel || 2,
                }

            case ACAO_CARTA.AVANCAR_ESTACAO_ESPECIFICA:
                return {
                    ...baseRetorno,
                    valor: 0,
                    destino: this.destino!,
                    tipoMovimento: 'avancar',
                    avancarPara: 'estacao',
                }

            case ACAO_CARTA.MULTAR_POR_CASA:
                // LÓGICA CORRIGIDA: Usa os métodos do jogador
                const qtdCasas = jogador.getQuantidadeTotalCasas()
                const qtdHoteis = jogador.getQuantidadeTotalHoteis()

                const multaCasas =
                    qtdCasas * this.valorPorCasa! +
                    qtdHoteis * this.valorPorHotel!

                return { ...baseRetorno, valor: -multaCasas }

            case ACAO_CARTA.VOLTAR_CASAS:
                return {
                    ...baseRetorno,
                    voltarCasas: this.quantidadeCasas!,
                    tipoMovimento: 'voltar',
                }

            case ACAO_CARTA.AVANCAR_COMPANHIA:
                return {
                    ...baseRetorno,
                    destino: this.destino,
                    tipoMovimento: 'avancar',
                    avancarPara: 'companhia',
                    multiplicadorAluguel: this.multiplicadorAluguel || 10,
                }

            case ACAO_CARTA.SAIR_DA_PRISAO:
                if (jogador.temCartaSaidaPrisao()) {
                    console.log(
                        `${jogador.getNome()} já tem uma carta de "Sair da Prisão"`,
                    )
                    return {
                        ...baseRetorno,
                        deveGuardarCarta: false,
                    }
                } else {
                    console.log(
                        `${jogador.getNome()} guardou a carta de "Sair da Prisão"`,
                    )
                    return {
                        ...baseRetorno,
                        cartaPrisao: true,
                        deveGuardarCarta: true,
                    }
                }

            case ACAO_CARTA.AVANCAR_INICIO:
                return {
                    ...baseRetorno,
                    valor: this.valor || 200,
                    destino: 'Ponto de Partida',
                    tipoMovimento: 'avancar',
                }

            default:
                throw new Error(`Ação não implementada: ${this.acao}`)
        }
    }

    toObject(): CartaEventoOutput {
        return {
            descricao: this.descricao,
            tipo: this.tipo,
            acao: this.acao,
            valor: this.valor,
            destino: this.destino,
            valorPorCasa: this.valorPorCasa,
            valorPorHotel: this.valorPorHotel,
            quantidadeCasas: this.quantidadeCasas,
            multiplicadorAluguel: this.multiplicadorAluguel,
        }
    }
}
