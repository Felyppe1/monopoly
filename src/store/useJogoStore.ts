import { Jogo } from '@/domain/jogo'
import { create } from 'zustand'
import { CartaEvento } from '@/domain/CartaCofreouSorte'
import { CartaOutputUnion } from '@/domain/Carta'

interface JogoStore {
    jogo: Jogo | null
    cartaAtiva: CartaEvento | null
    espacoParaComprar: CartaOutputUnion | null

    setJogo: (jogo: Jogo) => void
    resetarJogo: () => void
    jogarDados: () => void
    fecharModalCarta: () => void
    setEspacoParaComprar: (carta: CartaOutputUnion | null) => void
    fecharComprarEspaco: () => void
    resolverCarta: () => void
}

const estadoInicial = {
    jogo: null,
    espacoParaComprar: null,
}

export const useJogoStore = create<JogoStore>((set, get) => ({
    ...estadoInicial,
    cartaAtiva: null,

    setJogo: jogo => {
        set(() => ({
            jogo: Object.assign(
                Object.create(Object.getPrototypeOf(jogo)),
                jogo,
            ),
        }))
    },

    resetarJogo: () => {
        set(() => estadoInicial)
    },

    setEspacoParaComprar: carta => {
        set({ espacoParaComprar: carta })
    },

    fecharComprarEspaco: () => {
        set({ espacoParaComprar: null })
    },

    jogarDados: () => {
        console.log('🔥 A STORE FOI CHAMADA! 🔥')
        const jogo = get().jogo
        if (!jogo) return

        // 1. Chama o jogo e recebe o pacote (dados + carta)
        const resultado = jogo.jogarDados()

        // DEBUG: Veja se chegou na store
        console.log('📦 STORE RECEBEU:', resultado.cartaComprada)

        set(() => ({
            jogo: Object.assign(
                Object.create(Object.getPrototypeOf(jogo)),
                jogo,
            ),

            cartaAtiva: resultado.cartaComprada || null,
        }))
    },

    fecharModalCarta: () => {
        set({ cartaAtiva: null })
    },

    resolverCarta: () => {
        const { jogo, cartaAtiva } = get()

        if (jogo && cartaAtiva) {
            jogo.realizarAcaoCarta(cartaAtiva)

            set({
                jogo: Object.assign(
                    Object.create(Object.getPrototypeOf(jogo)),
                    jogo,
                ),
                cartaAtiva: null,
            })
        }
    },
}))
