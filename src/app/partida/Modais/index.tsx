import { CartaOutputUnion } from '@/domain/Carta'
import { useJogoStore } from '@/store/useJogoStore'
import { useEffect, useState } from 'react'
import { ComprarEspaco } from './ComprarEspaco'
import { Default } from './Default'
import { CartaEventoOutput } from '@/domain/CartaCofreouSorte'
import { TIPO_ESPACO_ENUM } from '@/domain/EspacoDoTabuleiro'
import { ModalCartaSorteBau } from './ModalCartaSorteBau'

export function Modais() {
    const [comprarEspaco, setComprarEspaco] = useState<CartaOutputUnion | null>(
        null,
    )
    const [cartaEvento, setCartaEvento] = useState<CartaEventoOutput | null>(
        null,
    )

    const jogo = useJogoStore(state => state.jogo)
    const setJogo = useJogoStore(state => state.setJogo)

    useEffect(() => {
        if (!jogo) return

        const estadoJogo = jogo.toObject()
        const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]
        const espacoAtual = estadoJogo.espacosTabuleiro[jogadorAtual.posicao]

        const cartaEstaNoBanco = estadoJogo.banco.cartas.find(
            carta => carta.nome === espacoAtual.nome,
        )

        if (cartaEstaNoBanco) {
            setComprarEspaco(cartaEstaNoBanco)
            return
        }

        if (
            espacoAtual.tipo === TIPO_ESPACO_ENUM.COFRE ||
            espacoAtual.tipo === TIPO_ESPACO_ENUM.SORTE
        ) {
            const carta =
                espacoAtual.tipo === TIPO_ESPACO_ENUM.COFRE
                    ? estadoJogo.baralho.cartasCofre.pop()!
                    : estadoJogo.baralho.cartasSorte.pop()!

            setCartaEvento(carta)
        }
    }, [jogo, setJogo])

    const handleFecharCartaEvento = () => {
        if (jogo) {
            jogo.processarCartaEvento()
            setJogo(jogo)
        }
        setCartaEvento(null)
    }

    const handleFecharCompraEspaco = () => {
        setComprarEspaco(null)
    }

    if (comprarEspaco) {
        return (
            <ComprarEspaco
                carta={comprarEspaco}
                onClose={handleFecharCompraEspaco}
            />
        )
    }

    if (cartaEvento) {
        return (
            <ModalCartaSorteBau
                carta={cartaEvento}
                onClose={handleFecharCartaEvento}
            />
        )
    }

    return <Default />
}
