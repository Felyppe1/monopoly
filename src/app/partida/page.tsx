'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabuleiro } from './Tabuleiro'
import { MapPin } from 'lucide-react'
import { useJogoStore } from '@/store/useJogoStore'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Partida() {
    const jogo = useJogoStore(state => state.jogo)
    const setJogo = useJogoStore(state => state.setJogo)

    const router = useRouter()
    const turnoEmAndamento = useRef(false) // TRAVA

    useEffect(() => {
        if (!jogo) {
            router.push('/')
        }
    }, [jogo, router])

    if (!jogo) {
        return null
    }

    // --- ORQUESTRAÇÃO DO BOT ---
    useEffect(() => {
        if (!jogo) return

        const estado = jogo.toObject()
        const jogadorAtual = estado.jogadores[estado.indiceJogadorAtual]

        if (jogadorAtual.ehBot && estado.estado === 'EM_ANDAMENTO') {
            
            if (turnoEmAndamento.current) return 

            const executarTurnoBot = async () => {
                try {
                    turnoEmAndamento.current = true

                    if (jogadorAtual.estaPreso) {
                        const usouCarta = jogo.botTentarSairDaPrisao()
                        if (usouCarta) {
                            setJogo(jogo)
                            await new Promise(r => setTimeout(r, 1000))
                        }
                    }
                    
                    const objJogo = jogo.toObject()
                    const jaJogou = objJogo.jogouOsDados
                    const temDuplaPendente = objJogo.quantidadeDuplas > 0
                    const estaLivre = !objJogo.jogadores[objJogo.indiceJogadorAtual].estaPreso


                    if (!jaJogou || (temDuplaPendente && estaLivre)) {           
                        await new Promise(r => setTimeout(r, 3500))
                        await new Promise(r => setTimeout(r, 2000))
                    }

                    const jogoPosMovimento = jogo.toObject() 
                    const posAtual = jogoPosMovimento.jogadores[jogoPosMovimento.indiceJogadorAtual].posicao
                    
                    if (posAtual !== 10 && posAtual !== 30) {
                        jogo.botRealizarConstrucoes()
                        setJogo(jogo)
                        await new Promise(r => setTimeout(r, 1000))
                    }

                    const estadoFinal = jogo.toObject()
                    const botFoiPreso = estadoFinal.jogadores[estadoFinal.indiceJogadorAtual].estaPreso

                    if (estadoFinal.quantidadeDuplas === 0 || botFoiPreso) {
                         jogo.virarTurno()
                         setJogo(jogo)
                    } 
                    
                } catch (error) {
                    console.error("Erro no turno do bot:", error)
                } finally {
                    turnoEmAndamento.current = false
                }
            }

            executarTurnoBot()
        }
    }, [jogo, setJogo])

    const estadoJogo = jogo.toObject()

    return (
        <div className="flex justify-between">
            <Tabuleiro />
            <div className="flex flex-col w-[35%] p-2">
                <Card className="relative">
                    <CardHeader className="text-2xl">
                        <CardTitle>Jogadores</CardTitle>
                    </CardHeader>
                </Card>
                <div className="bg-[#D1F1DD] -mt-4 py-4 rounded-lg border-4 border-teal-600">
                    <ul className="flex flex-col gap-2 px-4">
                        {estadoJogo.jogadores.map(jogador => {
                            const espacoTabuleiro =
                                estadoJogo.espacosTabuleiro.find(
                                    espaco =>
                                        espaco.posicao === jogador.posicao,
                                )!

                            return (
                                <li>
                                    <button className="flex w-full">
                                        <div className="bg-[#B2E1CE] w-[40%] flex gap-4 items-center px-4 py-1 rounded-l-md">
                                            <img
                                                src={`personagem-${jogador.personagem}.png`}
                                                alt=""
                                                className="w-14 h-14"
                                            />

                                            <div className="flex flex-col items-start">
                                                <span className="font-semibold text-md leading-4.5 text-left">
                                                    {jogador.nome}
                                                </span>

                                                <span className="font-extrabold text-lg">
                                                    R${' '}
                                                    {jogador.saldo.toLocaleString(
                                                        'pt-BR',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-[#8FCBBB] w-[60%] px-4 py-1 rounded-r-md text-neutral-800">
                                            <div
                                                className={`flex items-center gap-2 ${jogador.estaPreso && 'text-red-700'}`}
                                            >
                                                <MapPin
                                                    size={16}
                                                    className={`${jogador.estaPreso ? 'fill-red-700' : 'fill-neutral-800'}`}
                                                />
                                                <span className="font-bold">
                                                    {jogador.estaPreso
                                                        ? 'NA PRISÃO (' +
                                                          jogador.turnosNaPrisao +
                                                          '/3)'
                                                        : espacoTabuleiro.nome}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-md mb-0.5">
                                                    Propriedades
                                                </span>
                                                <div className="flex gap-1 flex-wrap">
                                                    {jogador.cartas.map(
                                                        carta => {
                                                            console.log(carta)
                                                            const cor =
                                                                carta.tipo ===
                                                                'TituloDePosse'
                                                                    ? carta.cor
                                                                    : carta.tipo ===
                                                                        'EstacaoDeMetro'
                                                                      ? 'preto'
                                                                      : 'cinza'

                                                            console.log(cor)
                                                            return (
                                                                <div
                                                                    className={`w-3 h-4 border-2 border-${cor}`}
                                                                ></div>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}
