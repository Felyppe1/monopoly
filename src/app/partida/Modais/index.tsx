import { CartaOutputUnion } from '@/domain/Carta'
import { useJogoStore } from '@/store/useJogoStore'
import { useEffect, useState } from 'react'
import { ComprarEspaco } from './ComprarEspaco'
import { Default } from './Default'
import { ModalFalencia } from './ModalFalencia'
import { ModalVitoria } from './ModalVitoria'
import { ESTADO_JOGO } from '@/domain/jogo'

export function Modais() {
    const [comprarEspaco, setComprarEspaco] = useState<CartaOutputUnion | null>(
        null,
    )
    const [mostrarFalencia, setMostrarFalencia] = useState(false)

    const [posicaoIgnorada, setPosicaoIgnorada] = useState<number | null>(null)

    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    if (!jogo) return null

    const estadoJogo = jogo.toObject()
    const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]

    useEffect(() => {
        if (
            posicaoIgnorada !== null &&
            jogadorAtual.posicao !== posicaoIgnorada
        ) {
            setPosicaoIgnorada(null)
        }
    }, [jogadorAtual.posicao, posicaoIgnorada])

    useEffect(() => {
        if (estadoJogo.estado === ESTADO_JOGO.FINALIZADO) {
            setComprarEspaco(null)
            setMostrarFalencia(false)
            return
        }

        if (jogadorAtual.falido) {
            setMostrarFalencia(true)
            setComprarEspaco(null)
            return
        }

        if (jogadorAtual.posicao !== posicaoIgnorada) {
            const espacoTabuleiro =
                estadoJogo.espacosTabuleiro[jogadorAtual.posicao]

            if (espacoTabuleiro.nome) {
                const cartaEstaNoBanco = estadoJogo.banco.cartas.find(
                    carta => carta.nome === espacoTabuleiro.nome,
                )

                if (cartaEstaNoBanco) {
                    const timer = setTimeout(() => {
                        setComprarEspaco(cartaEstaNoBanco)
                    }, 500)
                    return () => clearTimeout(timer)
                }
            }
        }
    }, [
        jogo,
        estadoJogo.indiceJogadorAtual,
        estadoJogo.jogadores,
        estadoJogo.estado,
        posicaoIgnorada,
    ])

    // -- RENDERIZAÇÃO --

    if (
        estadoJogo.estado === ESTADO_JOGO.FINALIZADO &&
        estadoJogo.personagemVencedor
    ) {
        const vencedor = estadoJogo.jogadores.find(
            j => j.personagem === estadoJogo.personagemVencedor,
        )
        return <ModalVitoria nomeVencedor={vencedor?.nome || 'Desconhecido'} />
    }

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

    if (comprarEspaco) {
        return (
            <ComprarEspaco
                carta={comprarEspaco}
                onClose={() => {
                    setPosicaoIgnorada(jogadorAtual.posicao)
                    setComprarEspaco(null)
                }}
            />
        )
    }

    return <Default />
}
