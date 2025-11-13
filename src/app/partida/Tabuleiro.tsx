'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Terreno } from './Terreno'
import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'
import { TIPO_ESPACO_ENUM } from '@/domain/EspacoDoTabuleiro'

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

export function Tabuleiro() {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    const estadoJogo = jogo!.toObject()

    const [dado1, setDado1] = useState(5)
    const [dado2, setDado2] = useState(3)
    const [rolando, setRolando] = useState(false)

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
            const resultado = jogo.jogarDados()
            setJogo(jogo)

            setDado1(resultado.dado1)
            setDado2(resultado.dado2)

            setRolando(false)
        }, 1500)
    }

    const virarTurno = () => {
        jogo.virarTurno()

        setJogo(jogo)
    }

    return (
        <div
            className="grid h-full max-h-screen aspect-5/4 border border-black bg-tabuleiro"
            style={{
                gridTemplateColumns: `minmax(0, 6fr) repeat(9, minmax(0, 3fr)) minmax(0, 6fr)`,
                gridTemplateRows: `minmax(0, 7fr) repeat(9, minmax(0, 3fr)) minmax(0, 7fr)`,
                gridTemplateAreas: `
                "c20 c21 c22 c23 c24 c25 c26 c27 c28 c29 c30"
                "c19 m   m   m   m   m   m   m   m   m   c31"
                "c18 m   m   m   m   m   m   m   m   m   c32"
                "c17 m   m   m   m   m   m   m   m   m   c33"
                "c16 m   m   m   m   m   m   m   m   m   c34"
                "c15 m   m   m   m   m   m   m   m   m   c35"
                "c14 m   m   m   m   m   m   m   m   m   c36"
                "c13 m   m   m   m   m   m   m   m   m   c37"
                "c12 m   m   m   m   m   m   m   m   m   c38"
                "c11 m   m   m   m   m   m   m   m   m   c39"
                "c10 c9  c8  c7  c6  c5  c4  c3  c2  c1  c0"
                `,
            }}
        >
            {estadoJogo.espacosTabuleiro.map((espaco, i) => {
                const personagensNaPosicao = estadoJogo.jogadores
                    .filter(jogador => jogador.posicao === espaco.posicao)
                    .map(jogador => jogador.personagem)

                const getPropriedades = () => {
                    if (espaco.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                        return {
                            cor: espaco.tituloDePosse.cor,
                            valor: espaco.tituloDePosse.preco,
                        }
                    }

                    if (espaco.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                        return {
                            valor: espaco.cartaEstacaoDeMetro.preco,
                        }
                    }

                    if (espaco.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                        return {
                            valor: espaco.cartaCompanhia.preco,
                        }
                    }

                    return {}
                }

                return (
                    <Terreno
                        key={i}
                        posicao={i}
                        tipo={espaco.tipo}
                        nome={espaco.nome}
                        {...getPropriedades()}
                        // cor={espaco.tituloDePosse?.cor}
                        // valor={
                        //     espaco.tituloDePosse?.preco ||
                        //     espaco.cartaEstacaoDeMetro?.preco ||
                        //     espaco.cartaCompanhia?.preco
                        // }
                        personagens={personagensNaPosicao}
                    />
                )
            })}

            <div
                className="flex flex-col justify-center items-center relative border border-black bg-green-100 p-4"
                style={{
                    gridArea: 'm',
                }}
            >
                <Image
                    src="/monopoly-logo.png"
                    alt='Logo do Monopoly escrito "Monopoly" em branco em um fundo vermelho com o boneco do jogo de terno preto em cima'
                    className="absolute -rotate-45 mb-4"
                    width={400}
                    height={400}
                />

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
            </div>
        </div>
    )
}
