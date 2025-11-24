import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'
import { useState, useEffect } from 'react' // Importar useEffect

export function Default() {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)
    const estadoJogo = jogo!.toObject()

    // Inicializa com o valor salvo no backend, não com 5 e 3 fixos
    const [dado1, setDado1] = useState(estadoJogo.ultimoResultadoDados.dado1)
    const [dado2, setDado2] = useState(estadoJogo.ultimoResultadoDados.dado2)
    const [rolando, setRolando] = useState(false)

    // Sincroniza se o jogo mudar (ex: troca de turno ou carregamento)
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

            // O jogo calcula, processa o movimento, aluguel automático e salva os dados
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
                        estadoJogo.quantidadeDuplas > 0
                    }
                >
                    VIRAR TURNO
                </Button>
            </div>
        </>
    )
}
