import { Jogo, JogoOutput } from '@/domain/jogo'
import { create } from 'zustand'

interface JogoStore {
    jogo: Jogo | null
    estadoJogo: JogoOutput | null

    setJogo: (jogo: Jogo) => void
    setEstadoJogo: (estado: JogoOutput) => void
    resetarJogo: () => void
}

const estadoInicial = {
    jogo: null,
    estadoJogo: null,
}

export const useJogoStore = create<JogoStore>((set, get) => ({
    ...estadoInicial,

    setJogo: jogo => {
        set(() => ({ jogo }))
    },

    setEstadoJogo: estado => {
        set(() => ({ estadoJogo: estado }))
    },

    resetarJogo: () => {
        set(() => estadoInicial)
    },
}))
