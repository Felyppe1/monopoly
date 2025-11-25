import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'
import { useState, useEffect } from 'react'
import { ESTADO_JOGO } from '@/domain/jogo'

// NOVO: Interface para definir as props que este componente aceita
interface DefaultProps {
    onAbrirNegociacao?: () => void
}

export function Default({ onAbrirNegociacao }: DefaultProps) {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)
    const estadoJogo = jogo!.toObject()

    const [dado1, setDado1] = useState(estadoJogo.ultimoResultadoDados.dado1)
    const [dado2, setDado2] = useState(estadoJogo.ultimoResultadoDados.dado2)
    const [rolando, setRolando] = useState(false)

    const jogoAcabou = estadoJogo.estado === ESTADO_JOGO.FINALIZADO

    useEffect(() => {
        setDado1(estadoJogo.ultimoResultadoDados.dado1)
        setDado2(estadoJogo.ultimoResultadoDados.dado2)
    }, [estadoJogo.ultimoResultadoDados])

    const rolarDados = () => {
        setRolando(true)

        const intervalo = setInterval(() => {
            setDado1(Math.floor(Math.random() * 6) + 1)
            setDado2(Math.floor(Math.random() * 6) + 1)
        }, 100)

        setTimeout(() => {
            clearInterval(intervalo)
            const resultado = jogo.jogarDados()
            setJogo(jogo)

            setDado1(resultado.dado1)
            setDado2(resultado.dado2)
            setRolando(false)
        }, 1500)
    }

    const gerarPontosDado = (numero: number) => {
        const pontos = [
            [],
            [4],
            [0, 8],
            [0, 4, 8],
            [0, 2, 6, 8],
            [0, 2, 4, 6, 8],
            [0, 1, 2, 6, 7, 8],
        ]
        return Array.from(
            { length: 9 },
            (_, i) => pontos[numero]?.includes(i) || false,
        )
    }

    const virarTurno = () => {
        jogo.virarTurno()
        setJogo(jogo)
    }

    return (
        <>
            <div className="flex gap-4 mb-6">
                <div
                    className={`w-16 h-16 bg-white border-2 border-black rounded-lg shadow-lg flex justify-center items-center transform rotate-3 ${rolando ? 'animate-bounce' : ''}`}
                >
                    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-10 h-10">
                        {gerarPontosDado(dado1).map((temPonto, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${temPonto ? 'bg-black' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>
                <div
                    className={`w-16 h-16 bg-white border-2 border-black rounded-lg shadow-lg flex justify-center items-center transform -rotate-3 ${rolando ? 'animate-bounce' : ''}`}
                >
                    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-10 h-10">
                        {gerarPontosDado(dado2).map((temPonto, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${temPonto ? 'bg-black' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 z-1">
                <Button
                    onClick={rolarDados}
                    disabled={
                        rolando ||
                        jogoAcabou ||
                        (estadoJogo.jogouOsDados &&
                            estadoJogo.quantidadeDuplas === 0)
                    }
                >
                    {rolando ? 'ROLANDO...' : 'JOGAR DADOS'}
                </Button>

                <Button
                    onClick={virarTurno}
                    disabled={
                        !estadoJogo.jogouOsDados ||
                        jogoAcabou ||
                        estadoJogo.quantidadeDuplas > 0
                    }
                >
                    VIRAR TURNO
                </Button>

                {/* Botão para abrir Negociação */}
                {onAbrirNegociacao && !jogoAcabou && (
                    <Button
                        onClick={onAbrirNegociacao}
                        variant="secondary"
                        className="bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200"
                    >
                        NEGOCIAR
                    </Button>
                )}
            </div>
        </>
    )
}
