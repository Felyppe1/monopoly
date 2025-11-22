import { useJogoStore } from '@/store/useJogoStore'
// import { useEffect, useState } from 'react'
import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogDescription,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { CartaOutputUnion } from '@/domain/Carta'
import { CartaSorteBau } from '@/components/carta-sorte-bau'
import { CartaEventoOutput } from '@/domain/CartaCofreouSorte'

interface ModalCartaSorteBauProps {
    carta: CartaEventoOutput
    onClose: () => void
}

export function ModalCartaSorteBau({
    carta,
    onClose,
}: ModalCartaSorteBauProps) {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    const handleContinuar = () => {
        // jogo.realizarAcaoDaCarta()

        // setJogo(jogo)

        onClose()
    }

    return (
        <TabuleiroDialog open={true}>
            <TabuleiroDialogContent className="w-full max-w-[40rem] bg-teal-700 flex flex-col p-4">
                <TabuleiroDialogHeader className="sr-only">
                    <TabuleiroDialogTitle>
                        Comprar Propriedade
                    </TabuleiroDialogTitle>
                    <TabuleiroDialogDescription>
                        Você pode comprar esta propriedade ou cancelar.
                    </TabuleiroDialogDescription>
                </TabuleiroDialogHeader>
                <div className="flex flex-col justify-between gap-4 h-full mt-2">
                    <div className="flex justify-center items-center bg-gradient-to-b from-teal-800 to-teal-950 p-4 rounded-lg h-full">
                        <CartaSorteBau carta={carta} />
                    </div>
                    <div className="flex justify-evenly">
                        <Button size="lg" onClick={handleContinuar}>
                            Continuar
                        </Button>
                    </div>
                </div>
            </TabuleiroDialogContent>
        </TabuleiroDialog>
    )
}
