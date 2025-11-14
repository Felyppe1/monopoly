import { Banco, BancoOutput } from './banco'
import {
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
    COR_ENUM,
} from './Carta'
import { terrenoDados } from './dados'
import { NomeEspaco } from './dados/nome-espacos'
import {
    CompanhiaEspaco,
    Espaco,
    EspacoCompravel,
    EstacaoDeMetroEspaco,
    ImpostoEspaco,
    PropriedadeEspaco,
} from './espaco'
import {
    Companhia,
    EspacoDoTabuleiro,
    EspacoDoTabuleiroOutputUnion,
    EstacaoDeMetro,
    Imposto,
    Propriedade,
    TIPO_ESPACO_ENUM,
} from './EspacoDoTabuleiro'
import {
    CriarJogadorInput,
    Jogador,
    JogadorOutput,
    PERSONAGEM,
} from './jogador'

export enum ESTADO_JOGO {
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    FINALIZADO = 'FINALIZADO',
}

export interface CriarJogoInput {
    jogadores: CriarJogadorInput[]
}

export interface JogoInput {
    jogadores: Jogador[]
    estado: ESTADO_JOGO
    personagemVencedor: PERSONAGEM | null
    indiceJogadorAtual: number
    espacosTabuleiro: Espaco[]
    banco: Banco
    quantidadeDuplas: number
    jogouOsDados: boolean
    dados: { dado1: number; dado2: number } | null
}

export interface JogoOutput
    extends Omit<
        JogoInput,
        'jogadores' | 'espacosTabuleiro' | 'banco' | 'dados'
    > {
    jogadores: JogadorOutput[]
    espacosTabuleiro: EspacoDoTabuleiroOutputUnion[]
    banco: BancoOutput
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: PERSONAGEM | null
    private indiceJogadorAtual: number
    private espacosTabuleiro: Espaco[]
    private quantidadeDuplas: number
    private banco: Banco
    private jogouOsDados: boolean
    private dados: { dado1: number; dado2: number } | null

    static criar(jogadores: CriarJogadorInput[]) {
        const banco = Banco.criar()

        const terrenos = this.criarEspacos(banco)

        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
            espacosTabuleiro: terrenos,
            banco: banco,
            quantidadeDuplas: 0,
            jogouOsDados: false,
            dados: null,
        })

        return jogo
    }

    constructor(data: JogoInput) {
        if (!data.jogadores || data.jogadores.length < 2) {
            throw new Error('O jogo precisa de pelo menos dois jogadores')
        }

        if (data.jogadores.length > 8) {
            throw new Error('O jogo suporta no máximo oito jogadores')
        }

        for (const jogador of data.jogadores) {
            const personagensRepetidos = data.jogadores.filter(
                j => j.getPersonagem() === jogador.getPersonagem(),
            )

            if (personagensRepetidos.length > 1) {
                throw new Error(
                    'Não pode haver jogadores com personagens repetidos',
                )
            }
        }

        if (data.personagemVencedor && data.estado !== ESTADO_JOGO.FINALIZADO) {
            throw new Error(
                'O jogo só pode ter um personagemVencedor se estiver finalizado',
            )
        }

        if (
            data.estado === ESTADO_JOGO.FINALIZADO &&
            !data.personagemVencedor
        ) {
            throw new Error('O jogo finalizado precisa ter um vencedor')
        }

        if (data.personagemVencedor) {
            const personagemVencedorExiste = data.jogadores.some(
                jogador => jogador.getPersonagem() === data.personagemVencedor!,
            )

            if (!personagemVencedorExiste) {
                throw new Error(
                    'O vencedor precisa ser um dos personagens da partida',
                )
            }
        }

        if (!data.espacosTabuleiro || data.espacosTabuleiro.length !== 40) {
            throw new Error('O tabuleiro precisa ter exatamente 40 espaços')
        }

        if (!data.banco) {
            throw new Error('O banco do jogo é obrigatório')
        }

        if (
            data.quantidadeDuplas === undefined ||
            data.quantidadeDuplas === null
        ) {
            throw new Error('A quantidade de duplas é obrigatória')
        }

        if (data.jogouOsDados === undefined || data.jogouOsDados === null) {
            throw new Error('O status de jogou os dados é obrigatório')
        }

        // data.espacosTabuleiro.forEach(espaco => {
        //     espaco.
        // })

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
        this.espacosTabuleiro = data.espacosTabuleiro
        this.banco = data.banco
        this.quantidadeDuplas = data.quantidadeDuplas
        this.jogouOsDados = data.jogouOsDados
        this.dados = data.dados
    }

    private static criarEspacos(banco: Banco) {
        const terrenos = terrenoDados.map((dado, index) => {
            if (dado.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                const tituloDePosse = banco.getCarta(
                    dado.nome,
                )! as TituloDePosse

                return PropriedadeEspaco.criar({
                    nome: dado.nome,
                    posicao: dado.posicao, // Poderia usar o index
                    tituloDePosse: tituloDePosse,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                const estacaoDeMetro = banco.getCarta(
                    dado.nome,
                )! as CartaEstacaoDeMetro

                return EstacaoDeMetroEspaco.criar({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    carta: estacaoDeMetro,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                const companhia = banco.getCarta(dado.nome)! as CartaCompanhia

                return CompanhiaEspaco.criar({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    carta: companhia,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.IMPOSTO) {
                return new ImpostoEspaco({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    tipo: TIPO_ESPACO_ENUM.IMPOSTO,
                })
            }

            return new EspacoDoTabuleiro({
                nome: dado.nome,
                posicao: dado.posicao,
                tipo: dado.tipo,
            })
        })

        return terrenos
    }

    private rolarDados() {
        const dados = {
            dado1: Math.floor(Math.random() * 6) + 1,
            dado2: Math.floor(Math.random() * 6) + 1,
        }

        this.dados = dados
    }

    jogarDados(): {
        dado1: number
        dado2: number
    } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        this.rolarDados()

        const eDuplo = this.dados!.dado1 === this.dados!.dado2

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (jogadorAtual.getEstaPreso()) {
            const saiuDaPrisao = jogadorAtual.tentarSairDaPrisao(
                this.dados!.dado1,
                this.dados!.dado2,
            )

            const espacoAtual = this.getEspacoTabuleiroPorPosicao(
                jogadorAtual.getPosicao(),
            )

            if (saiuDaPrisao) {
                espacoAtual.acaoAoCair(jogadorAtual, this)
            }
        } else {
            jogadorAtual.mover(this.dados!.dado1 + this.dados!.dado2)

            const espacoAtual = this.getEspacoTabuleiroPorPosicao(
                jogadorAtual.getPosicao(),
            )

            espacoAtual.acaoAoCair(jogadorAtual, this)

            if (eDuplo && !jogadorAtual.getEstaPreso()) {
                this.quantidadeDuplas += 1

                if (this.quantidadeDuplas === 3) {
                    jogadorAtual.irParaPrisao()

                    this.quantidadeDuplas = 0
                }
            } else {
                this.quantidadeDuplas = 0
            }

            if (espacoAtual.getTipo() === TIPO_ESPACO_ENUM.VA_PARA_PRISAO) {
                jogadorAtual.irParaPrisao()

                this.quantidadeDuplas = 0
            }
        }

        this.jogouOsDados = true

        return {
            dado1: this.dados!.dado1,
            dado2: this.dados!.dado2,
        }
    }

    virarTurno() {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        if (this.quantidadeDuplas > 0) {
            throw new Error('O jogador atual deve jogar novamente')
        }

        this.indiceJogadorAtual =
            (this.indiceJogadorAtual + 1) % this.jogadores.length

        this.jogouOsDados = false
    }

    getJogadorAtual() {
        return this.jogadores[this.indiceJogadorAtual]
    }

    getEspacoTabuleiroPorPosicao(posicao: number) {
        return this.espacosTabuleiro[posicao]
    }

    // TODO: se tiver mais lugares que precisam da informação dos dados, salvar na classe Jogo
    cobrarAluguel() {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const jogadorAtual = this.getJogadorAtual()

        const espaco = this.getEspacoTabuleiroPorPosicao(
            jogadorAtual.getPosicao(),
        )

        espaco.cobrarAluguel(
            jogadorAtual,
            this.getProprietario(espaco.getNome())!,
            this,
        )
    }

    getQuantidadePropriedades(cor: COR_ENUM) {
        return this.espacosTabuleiro.filter(espaco => {
            return espaco.pertenceACor?.(cor) ?? false
        }).length
    }

    comprarEspaco() {
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        const posicao = jogadorAtual.getPosicao()

        const espaco = this.espacosTabuleiro[posicao]

        jogadorAtual.comprarCarta(this.banco, espaco.getNome())
    }

    getProprietario(nomeEspaco: NomeEspaco) {
        const jogador = this.jogadores.find(jogador =>
            jogador.getCarta(nomeEspaco),
        )

        if (!jogador) {
            return null
        }

        return jogador
    }

    getDados() {
        return this.dados
    }

    toObject(): JogoOutput {
        return {
            jogadores: this.jogadores.map(jogador => jogador.toObject()),
            estado: this.estado,
            personagemVencedor: this.personagemVencedor,
            indiceJogadorAtual: this.indiceJogadorAtual,
            espacosTabuleiro: this.espacosTabuleiro.map(espaco => {
                return espaco.toObject() as EspacoDoTabuleiroOutputUnion
            }),
            banco: this.banco.toObject(),
            quantidadeDuplas: this.quantidadeDuplas,
            jogouOsDados: this.jogouOsDados,
        }
    }
}
