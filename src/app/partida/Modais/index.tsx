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

    const [comprarCartaSorteBau, setComprarCartaSorteBau] =
        useState<CartaEventoOutput | null>(null)

    const jogo = useJogoStore(state => state.jogo!)

    useEffect(() => {
        const estadoJogo = jogo.toObject()
        const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]

        for (const jogador of estadoJogo.jogadores) {
            if (jogador.personagem === jogadorAtual.personagem) {
                const espacoTabuleiro =
                    // estadoJogo.espacosTabuleiro[jogador.posicao]
                    estadoJogo.espacosTabuleiro[7]

                const cartaEstaNoBanco = estadoJogo.banco.cartas.find(
                    carta => carta.nome === espacoTabuleiro.nome,
                )

                if (cartaEstaNoBanco) {
                    setComprarEspaco(cartaEstaNoBanco)
                }

                if (espacoTabuleiro.tipo === TIPO_ESPACO_ENUM.COFRE) {
                    setComprarCartaSorteBau(
                        estadoJogo.baralho.cartasCofre.pop()!,
                    )
                }

                if (espacoTabuleiro.tipo === TIPO_ESPACO_ENUM.SORTE) {
                    setComprarCartaSorteBau(
                        estadoJogo.baralho.cartasSorte.pop()!,
                    )
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

    if (comprarCartaSorteBau)
        return (
            <ModalCartaSorteBau
                carta={comprarCartaSorteBau}
                onClose={() => setComprarCartaSorteBau(null)}
            />
        )

    return <Default />
}
