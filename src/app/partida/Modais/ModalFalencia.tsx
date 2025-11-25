import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
    TabuleiroDialogDescription,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'

interface ModalFalenciaProps {
    nomeJogador: string
    onConfirm: () => void
}

export function ModalFalencia({ nomeJogador, onConfirm }: ModalFalenciaProps) {
    return (
        <TabuleiroDialog open={true}>
            <TabuleiroDialogContent className="w-full max-w-md bg-red-900 border-4 border-red-950 flex flex-col p-6 items-center text-center">
                <TabuleiroDialogHeader>
                    <TabuleiroDialogTitle className="text-3xl text-white font-black uppercase tracking-widest mb-4">
                        VOCÊ FALIU!
                    </TabuleiroDialogTitle>
                    <TabuleiroDialogDescription className="text-red-100 text-lg font-medium">
                        Que pena, <strong>{nomeJogador}</strong>. <br />
                        Suas propriedades foram devolvidas ao banco e você está
                        fora do jogo.
                    </TabuleiroDialogDescription>
                </TabuleiroDialogHeader>

                <div className="mt-8">
                    <img
                        src="./personagem-cadeia.png"
                        alt="Falência"
                        className="w-32 h-32 opacity-80 mb-4 mx-auto grayscale"
                    />
                    {/* Nota: Se não tiver imagem especifica, pode remover a img ou usar uma existente */}
                </div>

                <Button
                    size="lg"
                    variant="destructive"
                    className="mt-6 w-full font-bold text-xl border-2 border-white"
                    onClick={onConfirm}
                >
                    ACEITAR DESTINO
                </Button>
            </TabuleiroDialogContent>
        </TabuleiroDialog>
    )
}
