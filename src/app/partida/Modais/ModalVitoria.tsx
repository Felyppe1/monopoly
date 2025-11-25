import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
    TabuleiroDialogDescription,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ModalVitoriaProps {
    nomeVencedor: string
}

export function ModalVitoria({ nomeVencedor }: ModalVitoriaProps) {
    const router = useRouter()

    return (
        <TabuleiroDialog open={true}>
            <TabuleiroDialogContent className="w-full max-w-lg bg-yellow-500 border-4 border-yellow-700 flex flex-col p-8 items-center text-center shadow-[0_0_50px_rgba(234,179,8,0.6)]">
                <TabuleiroDialogHeader>
                    <TabuleiroDialogTitle className="text-4xl text-yellow-950 font-black uppercase tracking-widest mb-2 drop-shadow-sm">
                        TEMOS UM VENCEDOR!
                    </TabuleiroDialogTitle>
                    <TabuleiroDialogDescription className="text-yellow-900 text-xl font-bold">
                        Parabéns, {nomeVencedor}! <br />
                        Você conquistou o monopólio da cidade.
                    </TabuleiroDialogDescription>
                </TabuleiroDialogHeader>

                <div className="my-8 animate-bounce">
                    <span className="text-6xl">🏆</span>
                </div>

                <Button
                    size="lg"
                    className="mt-4 w-full font-bold text-xl bg-green-600 hover:bg-green-700 text-white border-2 border-white"
                    onClick={() => router.push('/')}
                >
                    VOLTAR AO MENU
                </Button>
            </TabuleiroDialogContent>
        </TabuleiroDialog>
    )
}
