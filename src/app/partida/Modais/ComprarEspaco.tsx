import { useJogoStore } from '@/store/useJogoStore'
// import { useEffect, useState } from 'react'
import {
    TabuleiroDialog,
    TabuleiroDialogContent,
    TabuleiroDialogDescription,
    TabuleiroDialogHeader,
    TabuleiroDialogTitle,
    TabuleiroDialogTrigger,
} from '@/components/ui/tabuleiro-dialog'
import { Button } from '@/components/ui/button'
import { TituloDePosseView } from '@/components/titulo-de-posse'
// import { TIPO_ESPACO_ENUM } from '@/domain/EspacoDoTabuleiro'
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

    const handleComprar = () => {
        jogo.comprarEspaco()

        setJogo(jogo)
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
                <div className="flex justify-center items-center gap-4 text-2xl text-[#D1F1DD] font-bold bg-gradient-to-b from-teal-800 to-teal-950 p-2 rounded">
                    À VENDA{' '}
                    <span className="text-3xl font-extrabold text-[#00fb44]">
                        {' '}
                        $ {carta?.preco}
                    </span>
                </div>
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
                    <div className="flex justify-evenly">
                        <Button size="lg" onClick={handleComprar}>
                            Comprar
                        </Button>
                        <Button size="lg" onClick={onClose}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </TabuleiroDialogContent>
        </TabuleiroDialog>
    )
}
