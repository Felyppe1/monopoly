import { CartaOutputUnion } from '@/domain/Carta'
import { useJogoStore } from '@/store/useJogoStore'
import { useEffect, useState } from 'react'
import { ComprarEspaco } from './ComprarEspaco'
import { Default } from './Default'
import { CartaEventoOutput } from '@/domain/CartaCofreouSorte'
import { TIPO_ESPACO_ENUM } from '@/domain/EspacoDoTabuleiro'
import { ModalCartaSorteBau } from './ModalCartaSorteBau'
import { NegociacaoModal } from './Negociacoes'
import { ModalFalencia } from './ModalFalencia'
import { ModalVitoria } from './ModalVitoria'
import { ESTADO_JOGO } from '@/domain/jogo'

export function Modais() {
    const jogo = useJogoStore(state => state.jogo)
    const setJogo = useJogoStore(state => state.setJogo)

    // Estados Locais
    const [comprarEspaco, setComprarEspaco] = useState<CartaOutputUnion | null>(
        null,
    )
    const [cartaEvento, setCartaEvento] = useState<CartaEventoOutput | null>(
        null,
    )
    const [mostrarFalencia, setMostrarFalencia] = useState(false)
    const [mostrarNegociacao, setMostrarNegociacao] = useState(false)
    const [posicaoIgnorada, setPosicaoIgnorada] = useState<number | null>(null)

    if (!jogo) return null

    const estadoJogo = jogo.toObject()
    const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]

    // 1. Resetar posição ignorada quando o jogador se move
    useEffect(() => {
        if (
            posicaoIgnorada !== null &&
            jogadorAtual.posicao !== posicaoIgnorada
        ) {
            setPosicaoIgnorada(null)
        }
    }, [jogadorAtual.posicao, posicaoIgnorada])

    // 2. Gerenciar Estado Geral e Triggers de Tabuleiro
    useEffect(() => {
        if (!jogo) return

        // Se o jogo acabou, fecha tudo
        if (estadoJogo.estado === ESTADO_JOGO.FINALIZADO) {
            setComprarEspaco(null)
            setMostrarFalencia(false)
            setMostrarNegociacao(false)
            setCartaEvento(null)
            return
        }

        // Se faliu
        if (jogadorAtual.falido) {
            setMostrarFalencia(true)
            setComprarEspaco(null)
            setMostrarNegociacao(false)
            setCartaEvento(null)
            return
        }

        // Lógica de Espaços (apenas se não estiver ignorando a posição atual após fechar um modal)
        if (jogadorAtual.posicao !== posicaoIgnorada) {
            const espacoAtual =
                estadoJogo.espacosTabuleiro[jogadorAtual.posicao]

            // A) Verificar se é carta comprável (Propriedade/Estação/Companhia)
            if (espacoAtual.nome) {
                const cartaEstaNoBanco = estadoJogo.banco.cartas.find(
                    carta => carta.nome === espacoAtual.nome,
                )

                if (cartaEstaNoBanco) {
                    // Pequeno delay para não abrir instantaneamente ao mover
                    const timer = setTimeout(() => {
                        setComprarEspaco(cartaEstaNoBanco)
                    }, 500)
                    return () => clearTimeout(timer)
                }
            }

            // B) Verificar se é Sorte ou Cofre
            // Só abre se ainda não estiver com uma carta evento aberta
            if (
                !cartaEvento &&
                (espacoAtual.tipo === TIPO_ESPACO_ENUM.COFRE ||
                    espacoAtual.tipo === TIPO_ESPACO_ENUM.SORTE)
            ) {
                // A carta é retirada do baralho na lógica do jogo ou aqui para visualização?
                // Idealmente o método jogarDados já deveria ter populado algo ou usamos o getter
                // Como no seu código original você fazia o pop aqui:
                // const carta = jogo.getCartaEventoAtual() // Método adicionado no jogo.ts recentemente ou usamos a lógica manual
                const carta =
                    espacoAtual.tipo === TIPO_ESPACO_ENUM.COFRE
                        ? estadoJogo.baralho.cartasCofre.pop()!
                        : estadoJogo.baralho.cartasSorte.pop()!

                if (carta) {
                    setCartaEvento(carta)
                } else {
                    // Fallback caso o método não retorne (ex: manual)
                    const cartaManual =
                        espacoAtual.tipo === TIPO_ESPACO_ENUM.COFRE
                            ? estadoJogo.baralho.cartasCofre[
                                  estadoJogo.baralho.cartasCofre.length - 1
                              ] // Peek
                            : estadoJogo.baralho.cartasSorte[
                                  estadoJogo.baralho.cartasSorte.length - 1
                              ]

                    if (cartaManual) setCartaEvento(cartaManual)
                }
            }
        }
    }, [
        jogo,
        estadoJogo.indiceJogadorAtual,
        estadoJogo.estado,
        posicaoIgnorada,
        jogadorAtual.falido,
        jogadorAtual.posicao,
    ])

    // Handlers
    const handleFecharCartaEvento = () => {
        if (jogo) {
            jogo.processarCartaEvento() // Efetiva a ação e vira o turno
            setJogo(jogo)
        }
        setPosicaoIgnorada(jogadorAtual.posicao)
        setCartaEvento(null)
    }

    const handleFecharCompraEspaco = () => {
        setPosicaoIgnorada(jogadorAtual.posicao)
        setComprarEspaco(null)
    }

    // --- RENDERIZAÇÃO (Ordem de Prioridade) ---

    // 1. Vitória
    if (
        estadoJogo.estado === ESTADO_JOGO.FINALIZADO &&
        estadoJogo.personagemVencedor
    ) {
        const vencedor = estadoJogo.jogadores.find(
            j => j.personagem === estadoJogo.personagemVencedor,
        )
        return <ModalVitoria nomeVencedor={vencedor?.nome || 'Desconhecido'} />
    }

    // 2. Falência
    if (mostrarFalencia) {
        return (
            <ModalFalencia
                nomeJogador={jogadorAtual.nome}
                onConfirm={() => {
                    setMostrarFalencia(false)
                    jogo.virarTurno()
                    setJogo(jogo)
                }}
            />
        )
    }

    // 3. Carta de Evento (Sorte/Cofre)
    if (cartaEvento) {
        return (
            <ModalCartaSorteBau
                carta={cartaEvento}
                onClose={handleFecharCartaEvento}
            />
        )
    }

    // 4. Negociação
    if (mostrarNegociacao) {
        return <NegociacaoModal onClose={() => setMostrarNegociacao(false)} />
    }

    // 5. Compra de Espaço
    if (comprarEspaco) {
        return (
            <ComprarEspaco
                carta={comprarEspaco}
                onClose={handleFecharCompraEspaco}
            />
        )
    }

    // 6. Default (Dados e Botões)
    return <Default onAbrirNegociacao={() => setMostrarNegociacao(true)} />
}
