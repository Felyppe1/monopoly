import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'
import { useState, useEffect } from 'react'

export function Default() {
    const [dado1, setDado1] = useState(5)
    const [dado2, setDado2] = useState(3)
    const [rolando, setRolando] = useState(false)

    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    const estadoJogo = jogo!.toObject()

    useEffect(() => {
        const jogadorAtual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]

        if (jogadorAtual.ehBot && !rolando) {
            
            const precisaJogar = !estadoJogo.jogouOsDados || (estadoJogo.quantidadeDuplas > 0 && !jogadorAtual.estaPreso)

            if (precisaJogar) {
                rolarDados()
            }
        }
    }, [jogo])

    const rolarDados = () => {
        setRolando(true)

        // Simular movimento dos dados
        const intervalo = setInterval(() => {
            setDado1(Math.floor(Math.random() * 6) + 1)
            setDado2(Math.floor(Math.random() * 6) + 1)
        }, 100)

        // Parar após 1 segundo e meio e definir os valores finais
        setTimeout(() => {
            clearInterval(intervalo)

            try{
                const resultado = jogo.jogarDados()          
                setJogo(jogo)
                setDado1(resultado.dado1)
                setDado2(resultado.dado2)    
            } catch (e) {
                console.error(e)
            } finally {
                setRolando(false)
            }
            

            setRolando(false)
        }, 1500)
    }

    const gerarPontosDado = (numero: number) => {
        const pontos = [
            [], // não usado
            [4], // 1
            [0, 8], // 2
            [0, 4, 8], // 3
            [0, 2, 6, 8], // 4
            [0, 2, 4, 6, 8], // 5
            [0, 1, 2, 6, 7, 8], // 6
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
