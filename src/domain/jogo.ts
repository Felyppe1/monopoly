import { Banco, BancoOutput } from './banco'
import {
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
} from './Carta'
import { terrenoDados } from './dados'
import { NomeEspaco } from './dados/nome-espacos'
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
    espacosTabuleiro: EspacoDoTabuleiro[]
    banco: Banco
    quantidadeDuplas: number
    jogouOsDados: boolean
}

export interface JogoOutput
    extends Omit<JogoInput, 'jogadores' | 'espacosTabuleiro' | 'banco'> {
    jogadores: JogadorOutput[]
    espacosTabuleiro: EspacoDoTabuleiroOutputUnion[]
    banco: BancoOutput
}

export class Jogo {
    private jogadores: Jogador[]
    private estado: ESTADO_JOGO
    private personagemVencedor: PERSONAGEM | null
    private indiceJogadorAtual: number
    private espacosTabuleiro: EspacoDoTabuleiro[]
    private quantidadeDuplas: number
    private banco: Banco
    private jogouOsDados: boolean

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

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = 0
        this.espacosTabuleiro = data.espacosTabuleiro
        this.banco = data.banco
        this.quantidadeDuplas = data.quantidadeDuplas
        this.jogouOsDados = data.jogouOsDados
    }

    private static criarEspacos(banco: Banco) {
        const terrenos = terrenoDados.map((dado, index) => {
            if (dado.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                const tituloDePosse = banco.getCarta(
                    dado.nome,
                )! as TituloDePosse

                return new Propriedade({
                    nome: dado.nome,
                    posicao: dado.posicao, // Poderia usar o index
                    tituloDePosse: tituloDePosse,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                const estacaoDeMetro = banco.getCarta(
                    dado.nome,
                )! as CartaEstacaoDeMetro

                return new EstacaoDeMetro({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaEstacaoDeMetro: estacaoDeMetro,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                const companhia = banco.getCarta(dado.nome)! as CartaCompanhia

                return new Companhia({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaCompanhia: companhia,
                })
            }

            if (dado.tipo === TIPO_ESPACO_ENUM.IMPOSTO) {
                return new Imposto({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    aluguel: dado.aluguel!,
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

    private rolarDado(): number {
        this.jogouOsDados = true
        return Math.floor(Math.random() * 6) + 1
    }

    // jjogarDados(): { dado1: number; dado2: number } {
    //     if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
    //         throw new Error('O jogo já está finalizado')
    //     }

    //     const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

    //     const dado1 = this.rolarDado()
    //     const dado2 = this.rolarDado()

    //     if (dado1 === dado2) {
    //         this.quantidadeDuplas += 1

    //         if (this.quantidadeDuplas === 3) {
    //             // Envia o jogador para a prisão
    //             jogadorAtual.mover(10 - jogadorAtual.getPosicao())

    //             this.quantidadeDuplas = 0
    //         }
    //     } else {
    //         this.quantidadeDuplas = 0

    //         jogadorAtual.mover(dado1 + dado2)
    //     }

    //     return { dado1, dado2 }
    // }

    jogarDados(): {
        dado1: number
        dado2: number
    } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const dado1 = this.rolarDado()
        const dado2 = this.rolarDado()

        const eDuplo = dado1 === dado2

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (jogadorAtual.getEstaPreso()) {
            jogadorAtual.tentarSairDaPrisao()

            if (eDuplo) {
                jogadorAtual.sairDaPrisao()

                jogadorAtual.mover(dado1 + dado2)
            } else if (jogadorAtual.getTentativasDuplo() === 3) {
                jogadorAtual.mover(dado1 + dado2)
            }
        } else {
            const espacoAtual = this.espacosTabuleiro[jogadorAtual.getPosicao()]

            if (eDuplo) {
                this.quantidadeDuplas += 1

                if (
                    this.quantidadeDuplas === 3 ||
                    espacoAtual.getTipo() === TIPO_ESPACO_ENUM.VA_PARA_PRISAO ||
                    espacoAtual.getTipo() === TIPO_ESPACO_ENUM.PRISAO
                ) {
                    jogadorAtual.irParaPrisao()

                    this.quantidadeDuplas = 0
                }
            } else {
                this.quantidadeDuplas = 0

                jogadorAtual.mover(dado1 + dado2)
            }
        }

        this.jogouOsDados = true

        return {
            dado1,
            dado2,
        }
    }

    // TODO: se tiver mais lugares que precisam da informação dos dados, salvar na classe Jogo
    cobrarAluguel(dados?: { dado1: number; dado2: number }) {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) {
            throw new Error('O jogo já está finalizado')
        }

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        const posicao = jogadorAtual.getPosicao()

        const espaco = this.espacosTabuleiro[posicao]

        if (espaco instanceof Imposto) {
            const pagamentoRealizado = jogadorAtual.pagar(espaco.getAluguel())
            return
        }

        const proprietario = this.getProprietario(espaco.getNome())

        if (proprietario && proprietario !== jogadorAtual) {
            let valorAluguel = 0

            if (espaco instanceof Propriedade) {
                const quantidadeTitulosProprietario =
                    proprietario.getQuantidadeDeTitulos(espaco.getCor())

                const totalTitulos = this.espacosTabuleiro.filter(
                    espacoTabuleiro =>
                        espacoTabuleiro.getTipo() ===
                            TIPO_ESPACO_ENUM.PROPRIEDADE &&
                        (espacoTabuleiro as Propriedade).getCor() ===
                            espaco.getCor(),
                ).length

                valorAluguel =
                    quantidadeTitulosProprietario === totalTitulos
                        ? espaco.calcularAluguel(
                              espaco.getQuantidadeConstrucoes() === 0,
                          )
                        : espaco.calcularAluguel(false)
            } else if (espaco instanceof EstacaoDeMetro) {
                const quantidadeEstacoes =
                    proprietario.getQuantidadeDeEstacoesMetro()

                valorAluguel = espaco.calcularAluguel(quantidadeEstacoes)
            } else if (espaco instanceof Companhia) {
                const quantidadeCompanhias =
                    proprietario.getQuantidadeDeCompanhias()

                if (!dados) {
                    throw new Error(
                        'Os valores dos dados são necessários para calcular o aluguel da companhia',
                    )
                }

                valorAluguel = espaco.calcularAluguel(
                    quantidadeCompanhias,
                    dados.dado1 + dados.dado2,
                )
            } else {
                throw new Error('Não é possível cobrar aluguel deste espaço')
            }

            // TODO: o que acontece se ele não tiver dinheiro? falência?
            const pagamentoRealizado = jogadorAtual.pagar(valorAluguel)
            proprietario.receber(valorAluguel)
        }
    }

    comprarEspaco() {
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        const posicao = jogadorAtual.getPosicao()

        const espaco = this.espacosTabuleiro[posicao]

        jogadorAtual.comprarCarta(this.banco, espaco.getNome())
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
    }

    private getProprietario(nomeEspaco: NomeEspaco) {
        const jogador = this.jogadores.find(jogador =>
            jogador.getCarta(nomeEspaco),
        )

        if (!jogador) {
            return null
        }

        return jogador
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
