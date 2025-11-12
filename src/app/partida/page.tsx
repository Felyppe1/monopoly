'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabuleiro } from './Tabuleiro'
import { MapPin } from 'lucide-react'
import { useJogoStore } from '@/store/useJogoStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Partida() {
    const jogo = useJogoStore(state => state.jogo)

    const router = useRouter()

    useEffect(() => {
        if (!jogo) {
            router.push('/')
        }
    }, [jogo, router])

    if (!jogo) {
        return null
    }

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
                                        <div
                                            className="bg-[#8FCBBB] w-[60%] 
px-4 py-1 rounded-r-md text-neutral-800"
                                        >
                                            {/* INÍCIO DO NOVO BLOCO CONDICIONAL PARA PRISÃO */}
                                            {jogador.estaPreso ? (
                                                <div className="flex items-center gap-2 text-red-700">
                                                    <MapPin
                                                        size={16}
                                                        className="fill-red-700"
                                                    />
                                                    <span className="font-bold text-md">
                                                        NA PRISÃO (
                                                        {jogador.turnosNaPrisao}
                                                        /3)
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <MapPin
                                                        size={16}
                                                        className="fill-neutral-700"
                                                    />
                                                    <span
                                                        className="font-bold 
text-md"
                                                    >
                                                        {espacoTabuleiro.nome}
                                                    </span>
                                                </div>
                                            )}
                                            {/* FIM DO NOVO BLOCO CONDICIONAL */}

                                            <div className="flex flex-col items-start">
                                                <span className="font-bold text-md mb-0.5">
                                                    Propriedades
                                                </span>
                                                <div className="flex gap-1 flex-wrap">
                                                    <div className="w-3 h-4 border-2 border-laranja"></div>

                                                    <div className="w-3 h-4 border-2 border-laranja"></div>
                                                    <div className="w-3 h-4 border-2 border-laranja"></div>

                                                    <div className="w-3 h-4 border-2 border-vermelho"></div>
                                                    <div className="w-3 h-4 border-2 border-vermelho"></div>

                                                    <div className="w-3 h-4 border-2 border-vermelho"></div>

                                                    <div className="w-3 h-4 border-2"></div>

                                                    <div className="w-3 h-4 border-2"></div>
                                                    <div className="w-3 h-4 border-2"></div>

                                                    <div className="w-3 h-4 border-2"></div>

                                                    <div className="w-3 h-4 border-2"></div>

                                                    {/* <div className='w-3 h-4 border-2'></div>
                                        
            <div className='w-3 h-4 border-2'></div>

                                                    <div className='w-3 h-4 border-2'></div>
                              
                      <div className='w-3 h-4 border-2'></div>
                                                    <div className='w-3 h-4 border-2'></div>

                    
                                <div className='w-3 h-4 border-2'></div>
                                                    <div className='w-3 h-4 border-2'></div>
          
                                          <div className='w-3 h-4 border-2'></div>

                                                    <div className='w-3 h-4 
border-2'></div>
                                                    <div className='w-3 h-4 border-2'></div>
                                             
       <div className='w-3 h-4 border-2'></div> */}
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
