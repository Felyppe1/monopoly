import { Jogo, JogoOutput } from '@/domain/jogo'
import { create } from 'zustand'

interface JogoStore {
    jogo: Jogo | null
    estadoJogo: JogoOutput | null

    setJogo: (jogo: Jogo) => void
    setEstadoJogo: (estado: JogoOutput) => void
    resetarJogo: () => void

    jogarDados: () => {
        dado1: number
        dado2: number
        saiuDaPrisao: boolean
        jogadorPermaneceuPreso: boolean
        jogadorFoiParaPrisao: boolean
    } | null
}

const estadoInicial = {
    jogo: null,
    estadoJogo: null,
}

export const useJogoStore = create<JogoStore>((set, get) => ({
    ...estadoInicial,

    setJogo: jogo => {
        set(() => ({
            jogo: Object.assign(
                Object.create(Object.getPrototypeOf(jogo)),
                jogo,
            ),
            estadoJogo: jogo.toObject(),
        }))
    },

    setEstadoJogo: estado => {
        set(() => ({ estadoJogo: estado }))
    },

    resetarJogo: () => {
        set(() => estadoInicial)
    },

    jogarDados: () => {
        const { jogo } = get()
        if (!jogo) return null

        const resultado = jogo.jogarDados()

        set(() => ({ estadoJogo: jogo.toObject() }))
        return resultado
    },
}))
