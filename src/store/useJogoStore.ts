import { Jogo } from '@/domain/jogo'
import { create } from 'zustand'

interface JogoStore {
    jogo: Jogo | null

    setJogo: (jogo: Jogo) => void
    resetarJogo: () => void
}

const estadoInicial = {
    jogo: null,
}

export const useJogoStore = create<JogoStore>((set, get) => ({
    ...estadoInicial,

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
}))
