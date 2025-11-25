import { useJogoStore } from '@/store/useJogoStore'
import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogDescription,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { CartaSorteBau } from '@/components/carta-sorte-bau'
import { CartaEventoOutput, TIPO_CARTA } from '@/domain/CartaCofreouSorte'

interface ModalCartaSorteBauProps {
    carta: CartaEventoOutput
    onClose: () => void
}

export function ModalCartaSorteBau({
    carta,
    onClose,
}: ModalCartaSorteBauProps) {
    const jogo = useJogoStore(state => state.jogo)!
    const setJogo = useJogoStore(state => state.setJogo)

    const handleContinuar = () => {
        jogo.eventoSorteCofre()
        setJogo(jogo)
        onClose()
    }

    const eCartaSairPrisao = carta.acao === 'sair_da_prisao'
    const jogadorTemCartaPrisao =
        jogo?.toObject().jogadores[jogo.toObject().indiceJogadorAtual]
            ?.temCartaSaidaPrisao

    return (
        <TabuleiroDialog open={true} onOpenChange={() => onClose()}>
            <TabuleiroDialogContent className="w-full max-w-[40rem] bg-teal-700 flex flex-col p-4">
                <TabuleiroDialogHeader>
                    <TabuleiroDialogTitle className="text-white text-center">
                        {carta.tipo === TIPO_CARTA.SORTE
                            ? 'Carta de Sorte!'
                            : 'Carta de Cofre!'}
                    </TabuleiroDialogTitle>
                    <TabuleiroDialogDescription className="sr-only">
                        {carta.descricao}
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
