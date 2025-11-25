import { Banco, BancoOutput } from './banco'
import {
    EstacaoDeMetro as CartaEstacaoDeMetro,
    Companhia as CartaCompanhia,
    TituloDePosse,
    Carta,
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

import { Baralho, BaralhoOutput } from './Baralho'
import {
    CartaEvento,
    TIPO_CARTA,
    ACAO_CARTA,
    CartaEventoInput,
} from './CartaCofreouSorte'

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
    ultimoResultadoDados: { dado1: number; dado2: number }
}

export interface JogoOutput
    extends Omit<JogoInput, 'jogadores' | 'espacosTabuleiro' | 'banco'> {
    jogadores: JogadorOutput[]
    espacosTabuleiro: EspacoDoTabuleiroOutputUnion[]
    banco: BancoOutput
    baralho: BaralhoOutput
    ultimoResultadoDados: { dado1: number; dado2: number }
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
    private baralho: Baralho
    private cartaEventoAtual: CartaEvento | null = null
    private ultimoResultadoDados: { dado1: number; dado2: number }

    static criar(jogadores: CriarJogadorInput[]) {
        const banco = Banco.criar()
        const terrenos = Jogo.criarEspacos(banco)

        const jogo = new Jogo({
            estado: ESTADO_JOGO.EM_ANDAMENTO,
            jogadores: jogadores.map(jogador => Jogador.create(jogador)),
            personagemVencedor: null,
            indiceJogadorAtual: 0,
            espacosTabuleiro: terrenos,
            banco: banco,
            quantidadeDuplas: 0,
            jogouOsDados: false,
            ultimoResultadoDados: { dado1: 5, dado2: 3 },
        })

        jogo.inicializarBaralhoCofre()
        jogo.inicializarBaralhoSorte()
        return jogo
    }

    constructor(data: JogoInput) {
        if (!data.jogadores || data.jogadores.length < 2)
            throw new Error('Mínimo 2 jogadores')
        if (data.espacosTabuleiro.length !== 40)
            throw new Error('Tabuleiro inválido')

        this.jogadores = data.jogadores
        this.estado = data.estado
        this.personagemVencedor = data.personagemVencedor ?? null
        this.indiceJogadorAtual = data.indiceJogadorAtual
        this.espacosTabuleiro = data.espacosTabuleiro
        this.baralho = new Baralho()
        this.banco = data.banco
        this.quantidadeDuplas = data.quantidadeDuplas
        this.jogouOsDados = data.jogouOsDados
        this.ultimoResultadoDados = data.ultimoResultadoDados
    }

    private static criarEspacos(banco: Banco) {
        return terrenoDados.map(dado => {
            if (dado.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                return new Propriedade({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    tituloDePosse: banco.getCarta(dado.nome)! as TituloDePosse,
                })
            }
            if (dado.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                return new EstacaoDeMetro({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaEstacaoDeMetro: banco.getCarta(
                        dado.nome,
                    )! as CartaEstacaoDeMetro,
                })
            }
            if (dado.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                return new Companhia({
                    nome: dado.nome,
                    posicao: dado.posicao,
                    cartaCompanhia: banco.getCarta(
                        dado.nome,
                    )! as CartaCompanhia,
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
    }

    private processarPagamento(
        pagador: Jogador,
        valor: number,
        recebedor?: Jogador,
    ): void {
        const conseguiuPagar = pagador.pagar(valor)

        if (!conseguiuPagar) {
            pagador.declararFalencia(this.banco)
            this.verificarVitoria()
        } else if (recebedor) {
            recebedor.receber(valor)
        }
    }

    private verificarVitoria() {
        const jogadoresAtivos = this.jogadores.filter(j => !j.getFalido())
        if (jogadoresAtivos.length === 1) {
            this.estado = ESTADO_JOGO.FINALIZADO
            this.personagemVencedor = jogadoresAtivos[0].getPersonagem()
        }
    }

    private rolarDado(): number {
        return Math.floor(Math.random() * 6) + 1
    }

    jogarDados(): {
        dado1: number
        dado2: number
        cartaComprada?: CartaEvento | null
    } {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO)
            throw new Error('Jogo finalizado')

        const dado1 = this.rolarDado()
        const dado2 = this.rolarDado()
        this.ultimoResultadoDados = { dado1, dado2 }

        const eDuplo = dado1 === dado2
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (jogadorAtual.getEstaPreso()) {
            jogadorAtual.tentarSairDaPrisao(dado1, dado2)
        } else {
            jogadorAtual.mover(dado1 + dado2)
            const cartaComprada = this.eventoSorteCofre(jogadorAtual)

            // Aluguel Automático
            this.cobrarAluguel({ dado1, dado2 })

            const espacoAtual = this.espacosTabuleiro[jogadorAtual.getPosicao()]

            if (eDuplo) {
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
        return { dado1, dado2 }
    }

    virarTurno() {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO)
            throw new Error('Jogo finalizado')
        if (this.quantidadeDuplas > 0)
            throw new Error('Jogador deve jogar novamente')

        // Pula jogadores falidos
        let proximoIndice =
            (this.indiceJogadorAtual + 1) % this.jogadores.length
        let tentativas = 0
        while (
            this.jogadores[proximoIndice].getFalido() &&
            tentativas < this.jogadores.length
        ) {
            proximoIndice = (proximoIndice + 1) % this.jogadores.length
            tentativas++
        }

        this.indiceJogadorAtual = proximoIndice
        this.jogouOsDados = false
    }

    // Métodos de Baralho e Eventos
    private inicializarBaralhoCofre(): void {}
    private inicializarBaralhoSorte(): void {}
    public comprarCartaCofre() {
        return this.baralho.comprarCartaCofre()
    }
    public comprarCartaSorte() {
        return this.baralho.comprarCartaSorte()
    }
    public getInfoBaralho() {
        return {
            cartasCofre: this.baralho.getNumeroCartasCofre(),
            cartasSorte: this.baralho.getNumeroCartasSorte(),
        }
    }

    public getCartaEventoAtual(): CartaEvento | null {
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]
        const posicao = jogadorAtual.getPosicao()
        const espacoAtual = this.espacosTabuleiro[posicao]

        if (
            espacoAtual.getTipo() === TIPO_ESPACO_ENUM.COFRE ||
            espacoAtual.getTipo() === TIPO_ESPACO_ENUM.SORTE
        ) {
            return this.eventoSorteCofre(jogadorAtual)
        }

        return null
    }

    public processarCartaEvento(): void {
        this.virarTurno()
    }

    private eventoSorteCofre(jogadorAtual: Jogador): CartaEvento | null {
        const espacoAtual = this.espacosTabuleiro[jogadorAtual.getPosicao()]

        switch (espacoAtual.getTipo()) {
            case TIPO_ESPACO_ENUM.COFRE:
                const cartaCofre = this.baralho.comprarCartaCofre()
                if (cartaCofre) {
                    const resultado = cartaCofre.executarAcao(
                        jogadorAtual,
                        this,
                    )
                    this.aplicarEfeitoCarta(jogadorAtual, resultado, cartaCofre)
                    if (!resultado.cartaPrisao) {
                        this.baralho.devolverCartaCofre(cartaCofre)
                    }
                    console.log(
                        `${jogadorAtual.getNome()} caiu em cofre. carta: ${cartaCofre.getDescricao()}`,
                    )

                    return cartaCofre
                }
                break

            case TIPO_ESPACO_ENUM.SORTE:
                const cartaSorte = this.baralho.comprarCartaSorte()
                if (cartaSorte) {
                    const resultado = cartaSorte.executarAcao(
                        jogadorAtual,
                        this,
                    )
                    this.aplicarEfeitoCarta(jogadorAtual, resultado, cartaSorte)
                    if (!resultado.cartaPrisao) {
                        this.baralho.devolverCartaSorte(cartaSorte)
                    }
                    console.log(
                        `${jogadorAtual.getNome()} caiu em sorte. carta: ${cartaSorte.getDescricao()}`,
                    )
                    return cartaSorte
                }
                break

            default:
                break
        }

        return null
    }

    public jogadorUsaCartaSaidaPrisao(): boolean {
        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]

        if (!jogadorAtual.getEstaPreso()) {
            throw new Error(
                'Jogador não está preso para usar a carta de "Sair da Prisão"',
            )
        }

        if (!jogadorAtual.temCartaSaidaPrisao()) {
            throw new Error('Jogador não possui carta de "Sair da Prisão"')
        }

        const carta = jogadorAtual.usarCartaSaidaPrisao()

        if (carta) {
            console.log(
                `${jogadorAtual.getNome()} usou a carta e saiu da prisão!`,
            )

            // Devolve a carta ao baralho apropriado
            if (carta.getTipo() === TIPO_CARTA.SORTE) {
                this.baralho.devolverCartaSorte(carta)
            } else {
                this.baralho.devolverCartaCofre(carta)
            }

            return true
        }

        return false
    }

    public tentarSairDaPrisaoComCarta(): boolean {
        try {
            return this.jogadorUsaCartaSaidaPrisao()
        } catch (error) {
            console.warn((error as Error).message)
            return false
        }
    }

    private encontrarPosicaoPorNome(nome: string): number {
        return this.espacosTabuleiro.findIndex(e => e.getNome() === nome)
    }

    private encontrarProximaEstacao(posicaoAtual: number): number {
        for (let i = 1; i < 40; i++) {
            const proximaPosicao = (posicaoAtual + i) % 40
            const espaco = this.espacosTabuleiro[proximaPosicao]
            if (espaco.getTipo() === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                return proximaPosicao
            }
        }
        return -1
    }

    private aplicarEfeitoCarta(
        jogador: Jogador,
        resultado: any,
        cartaOriginal: CartaEvento,
    ): void {
        if (resultado.valor !== undefined && resultado.valor !== 0) {
            if (resultado.valor > 0) {
                jogador.receber(resultado.valor)
            } else {
                const valorPagar = Math.abs(resultado.valor)
                if (resultado.acao === ACAO_CARTA.PAGAR_TODOS) {
                    this.jogadores.forEach(outro => {
                        if (outro !== jogador && !outro.getFalido()) {
                            this.processarPagamento(jogador, valorPagar, outro)
                        }
                    })
                } else {
                    this.processarPagamento(jogador, valorPagar)
                }
            }
        }

        if (resultado.irParaPrisao || resultado.tipoMovimento === 'prisao') {
            jogador.irParaPrisao()
            this.quantidadeDuplas = 0
            return
        }

        if (resultado.cartaPrisao) {
            // Lógica para quando o jogador ganha a carta de sair da prisão (guarda)
            // Assumimos que a carta executada foi a de "Sair da Prisão"
            jogador.adicionarCartaSaidaPrisao(cartaOriginal)
            console.log(
                `${jogador.getNome()} guardou a carta 'Saia da Prisão'!`,
            )
            return
        }

        if (resultado.destino) {
            const novaPosicao = this.encontrarPosicaoPorNome(resultado.destino)

            if (novaPosicao !== -1) {
                const posicaoAtual = jogador.getPosicao()

                if (
                    novaPosicao < posicaoAtual &&
                    resultado.tipoMovimento === 'avancar'
                ) {
                    jogador.receber(200)
                }

                const passos = (novaPosicao - posicaoAtual + 40) % 40
                jogador.mover(passos)
            } else {
                console.warn(
                    `Destino "${resultado.destino}" não encontrado no tabuleiro!`,
                )
            }
        } else if (resultado.voltarCasas) {
            jogador.mover(-resultado.voltarCasas)
        } else if (resultado.acao === ACAO_CARTA.AVANCAR_ESTACAO) {
            const posAtual = jogador.getPosicao()
            const posDestino = this.encontrarProximaEstacao(posAtual)

            if (posDestino !== -1) {
                const passos = (posDestino - posAtual + 40) % 40
                if (posDestino < posAtual) jogador.receber(200)
                jogador.mover(passos)

                const estacao = this.espacosTabuleiro[posDestino]
                const dono = this.getProprietario(estacao.getNome())

                if (
                    dono &&
                    dono !== jogador &&
                    estacao instanceof EstacaoDeMetro
                ) {
                    const qtd = dono.getQuantidadeDeEstacoesMetro()
                    const aluguelBase = estacao.calcularAluguel(qtd)
                    const dobro = aluguelBase * 2

                    console.log(`Pagando aluguel dobrado na estação: ${dobro}`)
                    this.processarPagamento(jogador, dobro, dono)
                }
            }
        }
    }

    private getProprietario(nomeEspaco: NomeEspaco) {
        return this.jogadores.find(j => j.getCarta(nomeEspaco)) || null
    }

    comprarEspaco() {
        const atual = this.jogadores[this.indiceJogadorAtual]
        const espaco = this.espacosTabuleiro[atual.getPosicao()]
        atual.comprarCarta(this.banco, espaco.getNome())
    }

    cobrarAluguel(dados?: { dado1: number; dado2: number }) {
        if (this.estado !== ESTADO_JOGO.EM_ANDAMENTO) return

        const jogadorAtual = this.jogadores[this.indiceJogadorAtual]
        if (jogadorAtual.getFalido()) return

        const posicao = jogadorAtual.getPosicao()
        const espaco = this.espacosTabuleiro[posicao]

        if (espaco instanceof Imposto) {
            this.processarPagamento(jogadorAtual, espaco.getAluguel())
            return
        }

        const proprietario = this.getProprietario(espaco.getNome())

        if (
            proprietario &&
            proprietario !== jogadorAtual &&
            !proprietario.getFalido()
        ) {
            let valorAluguel = 0

            if (espaco instanceof Propriedade) {
                const qtdTitulos = proprietario.getQuantidadeDeTitulos(
                    espaco.getCor(),
                )
                const totalCor = this.espacosTabuleiro.filter(
                    e =>
                        e.getTipo() === TIPO_ESPACO_ENUM.PROPRIEDADE &&
                        (e as Propriedade).getCor() === espaco.getCor(),
                ).length
                valorAluguel = espaco.calcularAluguel(qtdTitulos === totalCor)
            } else if (espaco instanceof EstacaoDeMetro) {
                valorAluguel = espaco.calcularAluguel(
                    proprietario.getQuantidadeDeEstacoesMetro(),
                )
            } else if (espaco instanceof Companhia) {
                if (!dados) throw new Error('Dados necessários para companhia')
                valorAluguel = espaco.calcularAluguel(
                    proprietario.getQuantidadeDeCompanhias(),
                    dados.dado1 + dados.dado2,
                )
            }

            if (valorAluguel > 0) {
                console.log(`Cobrando aluguel de $${valorAluguel}`)
                this.processarPagamento(
                    jogadorAtual,
                    valorAluguel,
                    proprietario,
                )
            }
        }
    }

    getJogador(indice: number): Jogador {
        return this.jogadores[indice]
    }

    // --- LÓGICAS DO BOT ---

    public botDeveComprarEspaco(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const espaco = this.espacosTabuleiro[jogador.getPosicao()]
        const carta = this.banco.getCarta(espaco.getNome())

        if (!carta) return false
        return jogador.getSaldo() >= carta.getPreco()
    }

    // NOVO: Bot tenta pagar para sair da prisão se tiver dinheiro
    public botTentarPagarParaSairDaPrisao(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        if (!jogador.getEstaPreso()) return false

        // Se tiver saldo > 50 + 200 de reserva, paga
        if (jogador.getSaldo() >= 250) {
            if (jogador.pagar(50)) {
                jogador.sairDaPrisao()
                console.log(
                    `${jogador.getNome()} pagou $50 para sair da prisão.`,
                )
                return true
            }
        }
        return false
    }

    public botTentarSairDaPrisao(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        if (!jogador.getEstaPreso()) return false

        if (jogador.temCartaSaidaPrisao()) {
            this.jogadorUsaCartaSaidaPrisao()
            return true
        }
        return false
    }

    public botRealizarConstrucoes(): void {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const saldoReserva = 200

        this.espacosTabuleiro.forEach(espaco => {
            if (espaco instanceof Propriedade) {
                const titulo = espaco.getTituloDePosse()

                if (this.getProprietario(espaco.getNome()) === jogador) {
                    const cor = titulo.getCor()

                    const totalDaCor = this.espacosTabuleiro.filter(
                        e =>
                            e instanceof Propriedade &&
                            e.getTituloDePosse().getCor() === cor,
                    ).length
                    const qtdDoJogador = jogador.getQuantidadeDeTitulos(cor)

                    if (qtdDoJogador === totalDaCor) {
                        const custoCasa = titulo.toObject().precoCasa
                        const custoHotel = titulo.toObject().precoHotel

                        if (
                            titulo.getNumCasas() < 4 &&
                            jogador.getSaldo() >= custoCasa + saldoReserva
                        ) {
                            if (jogador.pagar(custoCasa)) {
                                titulo.adicionarCasa()
                                console.log(
                                    `[BOT] Construiu Casa em ${espaco.getNome()}`,
                                )
                            }
                        } else if (
                            titulo.getNumCasas() === 4 &&
                            titulo.getNumHoteis() === 0 &&
                            jogador.getSaldo() >= custoHotel + saldoReserva
                        ) {
                            if (jogador.pagar(custoHotel)) {
                                titulo.adicionarHotel()
                                console.log(
                                    `[BOT] Construiu HOTEL em ${espaco.getNome()}`,
                                )
                            }
                        }
                    }
                }
            }
        })
    }

    public botGerenciarConstrucoes() {
        this.botRealizarConstrucoes()
    }

    public botPodeComprarCartaAtual(): boolean {
        const jogador = this.jogadores[this.indiceJogadorAtual]
        const espaco = this.espacosTabuleiro[jogador.getPosicao()]

        const carta = this.banco.getCarta(espaco.getNome())

        if (carta && jogador.getSaldo() >= carta.getPreco()) {
            return true
        }
        return false
    }

    toObject(): JogoOutput {
        return {
            jogadores: this.jogadores.map(j => j.toObject()),
            estado: this.estado,
            personagemVencedor: this.personagemVencedor,
            indiceJogadorAtual: this.indiceJogadorAtual,
            espacosTabuleiro: this.espacosTabuleiro.map(
                e => e.toObject() as EspacoDoTabuleiroOutputUnion,
            ),
            banco: this.banco.toObject(),
            quantidadeDuplas: this.quantidadeDuplas,
            jogouOsDados: this.jogouOsDados,
            baralho: this.baralho.toObject(),
            ultimoResultadoDados: this.ultimoResultadoDados,
        }
    }
}
