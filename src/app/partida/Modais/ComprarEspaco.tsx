import { useJogoStore } from '@/store/useJogoStore'
import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
    TabuleiroDialogDescription,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { TituloDePosseView } from '@/components/titulo-de-posse'
import { CartaOutputUnion } from '@/domain/Carta'
import { CartaCompanhiaView } from '@/components/carta-companhia'
import { CartaEstacaoDeMetroView } from '@/components/carta-estacao-de-metro'

interface ComprarEspacoProps {
    carta: CartaOutputUnion
    onClose: () => void
}

export function ComprarEspaco({ carta, onClose }: ComprarEspacoProps) {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    // Obter saldo do jogador atual para verificação
    const estadoJogo = jogo.toObject()
    const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]
    const temSaldo = jogadorAtual.saldo >= carta.preco

    const handleComprar = () => {
        if (!temSaldo) return // Proteção extra

        try {
            jogo.comprarEspaco()
            setJogo(jogo)
            onClose()
        } catch (error) {
            console.error('Erro ao comprar:', error)
            onClose()
        }
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

                <div className="flex justify-center items-center gap-4 text-2xl text-[#D1F1DD] font-bold bg-gradient-to-b from-teal-800 to-teal-950 p-2 rounded">
                    À VENDA{' '}
                    <span
                        className={`text-3xl font-extrabold ${temSaldo ? 'text-[#00fb44]' : 'text-red-500'}`}
                    >
                        $ {carta?.preco}
                    </span>
                </div>

                {!temSaldo && (
                    <div className="text-center bg-red-900/50 text-white font-bold py-1 px-2 rounded mt-2 border border-red-500">
                        SALDO INSUFICIENTE (Seu saldo: ${jogadorAtual.saldo})
                    </div>
                )}

                <div className="flex flex-col justify-between h-full mt-2">
                    <div className="flex justify-center bg-gradient-to-b from-teal-800 to-teal-950 p-4 rounded-lg">
                        {carta?.tipo === 'TituloDePosse' && (
                            <TituloDePosseView tituloDePosse={carta} />
                        )}
                        {carta?.tipo === 'Companhia' && (
                            <CartaCompanhiaView companhia={carta} />
                        )}
                        {carta?.tipo === 'EstacaoDeMetro' && (
                            <CartaEstacaoDeMetroView estacaoDeMetro={carta} />
                        )}
                    </div>

                    <div className="flex justify-evenly mt-4">
                        <Button
                            size="lg"
                            onClick={handleComprar}
                            disabled={!temSaldo} // Desabilita se não tiver dinheiro
                            className={
                                !temSaldo ? 'opacity-50 cursor-not-allowed' : ''
                            }
                        >
                            Comprar
                        </Button>
                        <Button size="lg" onClick={onClose} variant="secondary">
                            {temSaldo ? 'Cancelar' : 'Fechar'}
                        </Button>
                    </div>
                </div>
            </TabuleiroDialogContent>
        </TabuleiroDialog>
    )
}
