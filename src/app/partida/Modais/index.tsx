import { CartaOutputUnion } from '@/domain/Carta'
import { useJogoStore } from '@/store/useJogoStore'
import { useEffect, useState } from 'react'
import { ComprarEspaco } from './ComprarEspaco'
import { Default } from './Default'
import { NegociacaoModal } from './Negociacoes'
import { JogadorOutput } from '@/domain/jogador'

export function Modais() {
    const [comprarEspaco, setComprarEspaco] = useState<CartaOutputUnion | null>(
        null,
    )

    const jogo = useJogoStore(state => state.jogo!)

    useEffect(() => {
        const estadoJogo = jogo.toObject()
        const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]

        for (const jogador of estadoJogo.jogadores) {
            if (jogador.personagem === jogadorAtual.personagem) {
                const espacoTabuleiro =
                    estadoJogo.espacosTabuleiro[jogador.posicao]

                const cartaEstaNoBanco = estadoJogo.banco.cartas.find(
                    carta => carta.nome === espacoTabuleiro.nome,
                )

                if (cartaEstaNoBanco) {
                    setComprarEspaco(cartaEstaNoBanco)
                }
                break
            }
        }
    }, [jogo])

    if (comprarEspaco)
        return (
            <ComprarEspaco
                carta={comprarEspaco}
                onClose={() => setComprarEspaco(null)}
            />
        )

    return <Default />
}
