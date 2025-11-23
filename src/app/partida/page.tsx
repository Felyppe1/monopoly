'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabuleiro } from './Tabuleiro'
import { Crown, Hotel, House, MapPin } from 'lucide-react'
import { useJogoStore } from '@/store/useJogoStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

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
            <div className="flex flex-col w-[40%] p-4">
                <Card className="relative shadow-lg">
                    <CardHeader className="text-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center justify-center gap-2">
                            Jogadores
                        </CardTitle>
                    </CardHeader>
                </Card>
                <div className="flex flex-col justify-between h-full">
                    <div className="bg-gradient-to-b from-teal-50 to-emerald-50 -mt-4 py-6 rounded-lg border-4 border-teal-600 shadow-xl overflow-y-auto max-h-[80vh]">
                        <ul className="flex flex-col gap-4 px-4">
                            {estadoJogo.jogadores.map((jogador, index) => {
                                const espacoTabuleiro =
                                    estadoJogo.espacosTabuleiro.find(
                                        espaco =>
                                            espaco.posicao === jogador.posicao,
                                    )!

                                const eJogadorDaVez =
                                    index === estadoJogo.indiceJogadorAtual

                                // Agrupar propriedades por cor
                                const propriedadesPorCor = new Map<
                                    string,
                                    any[]
                                >()
                                const estacoes: any[] = []
                                const companhias: any[] = []

                                jogador.cartas.forEach(carta => {
                                    if (carta.tipo === 'TituloDePosse') {
                                        const cor = carta.cor
                                        if (!propriedadesPorCor.has(cor)) {
                                            propriedadesPorCor.set(cor, [])
                                        }
                                        propriedadesPorCor.get(cor)!.push(carta)
                                    } else if (
                                        carta.tipo === 'EstacaoDeMetro'
                                    ) {
                                        estacoes.push(carta)
                                    } else if (carta.tipo === 'Companhia') {
                                        companhias.push(carta)
                                    }
                                })

                                // Verificar quais cores formam monopólio (assumindo 3 propriedades = monopólio)
                                const coresMonopolio = Array.from(
                                    propriedadesPorCor.entries(),
                                )
                                    .filter(([_, props]) => props.length === 3)
                                    .map(([cor, _]) => cor)

                                return (
                                    <li key={index} className="">
                                        <button className="flex w-full">
                                            <div className="bg-white px-5 py-4 rounded-xl w-full shadow-lg hover:shadow-xl transition-shadow duration-200 border-2 border-teal-200">
                                                <div className="flex justify-between">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="">
                                                            <img
                                                                src={`personagem-${jogador.personagem}.png`}
                                                                alt=""
                                                                className="w-16 h-16 rounded-full border-4 border-teal-400 shadow-md"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col items-start">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-lg leading-tight text-gray-800">
                                                                    {
                                                                        jogador.nome
                                                                    }
                                                                </span>
                                                                {eJogadorDaVez && (
                                                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                                        SUA VEZ
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <span className="font-extrabold text-2xl text-teal-700">
                                                                R${' '}
                                                                {jogador.saldo.toLocaleString(
                                                                    'pt-BR',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-2 px-3 py-2 h-fit rounded-full shadow-sm ${jogador.estaPreso ? 'bg-red-100 border-2 border-red-300' : 'bg-teal-100 border-2 border-teal-300'}`}
                                                    >
                                                        <MapPin
                                                            size={16}
                                                            className={`${jogador.estaPreso ? 'fill-red-600 text-red-600' : 'fill-teal-600 text-teal-600'}`}
                                                        />
                                                        <span
                                                            className={`font-semibold text-sm ${jogador.estaPreso ? 'text-red-800' : 'text-teal-800'}`}
                                                        >
                                                            {jogador.estaPreso
                                                                ? 'PRISÃO (' +
                                                                  jogador.turnosNaPrisao +
                                                                  '/3)'
                                                                : espacoTabuleiro.nome}
                                                        </span>
                                                    </div>
                                                </div>

                                                {jogador.cartas.length > 0 && (
                                                    <div className="mt-4">
                                                        <p className="text-start mb-2 font-bold text-gray-700 text-sm uppercase tracking-wide">
                                                            Propriedades
                                                        </p>

                                                        {/* Renderizar monopólios primeiro */}
                                                        {coresMonopolio.map(
                                                            cor => {
                                                                const props =
                                                                    propriedadesPorCor.get(
                                                                        cor,
                                                                    )!
                                                                return (
                                                                    <div
                                                                        key={
                                                                            cor
                                                                        }
                                                                        className="bg-gradient-to-br from-teal-600 to-teal-700 w-full px-3 py-3 rounded-xl shadow-md border border-teal-800 mb-2"
                                                                    >
                                                                        <p className="flex items-center gap-2 text-sm font-semibold text-teal-100 mb-2">
                                                                            <Crown
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="fill-yellow-300 text-yellow-300"
                                                                            />
                                                                            Monopólio
                                                                        </p>

                                                                        <div className="flex gap-2 justify-between">
                                                                            {props.map(
                                                                                prop => (
                                                                                    <CartaPropriedade
                                                                                        key={
                                                                                            prop.nome
                                                                                        }
                                                                                        monopolio={
                                                                                            true
                                                                                        }
                                                                                        cor={
                                                                                            prop.cor
                                                                                        }
                                                                                        nome={
                                                                                            prop.nome
                                                                                        }
                                                                                        aluguel={
                                                                                            prop
                                                                                                .valorAluguel[0]
                                                                                        }
                                                                                        numeroCasas={
                                                                                            3
                                                                                        }
                                                                                    />
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            },
                                                        )}

                                                        {/* Renderizar propriedades sem monopólio agrupadas por cor */}
                                                        {Array.from(
                                                            propriedadesPorCor.entries(),
                                                        )
                                                            .filter(
                                                                ([cor, _]) =>
                                                                    !coresMonopolio.includes(
                                                                        cor,
                                                                    ),
                                                            )
                                                            .map(
                                                                ([
                                                                    cor,
                                                                    props,
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            cor
                                                                        }
                                                                        className="flex gap-2 flex-wrap mb-2"
                                                                    >
                                                                        {props.map(
                                                                            prop => (
                                                                                <CartaPropriedade
                                                                                    key={
                                                                                        prop.nome
                                                                                    }
                                                                                    monopolio={
                                                                                        false
                                                                                    }
                                                                                    cor={
                                                                                        prop.cor
                                                                                    }
                                                                                    nome={
                                                                                        prop.nome
                                                                                    }
                                                                                    aluguel={
                                                                                        prop
                                                                                            .valorAluguel[0]
                                                                                    }
                                                                                    numeroCasas={
                                                                                        0
                                                                                    }
                                                                                />
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}

                                                        {/* Renderizar estações */}
                                                        {estacoes.length >
                                                            0 && (
                                                            <div className="flex gap-2 flex-wrap mb-2">
                                                                {estacoes.map(
                                                                    estacao => (
                                                                        <CartaEstacao
                                                                            key={
                                                                                estacao.nome
                                                                            }
                                                                            monopolio={
                                                                                false
                                                                            }
                                                                            nome={
                                                                                estacao.nome
                                                                            }
                                                                            aluguel={
                                                                                estacao
                                                                                    .valorAluguel[0]
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Renderizar companhias */}
                                                        {companhias.length >
                                                            0 && (
                                                            <div className="flex gap-2 flex-wrap">
                                                                {companhias.map(
                                                                    companhia => (
                                                                        <CartaCompanhia
                                                                            key={
                                                                                companhia.nome
                                                                            }
                                                                            monopolio={
                                                                                false
                                                                            }
                                                                            nome={
                                                                                companhia.nome
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {/* <div className="bg-[#8FCBBB] w-[60%] px-4 py-1 rounded-r-md text-neutral-800">
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
                                            </div> */}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="flex">
                        <Button>Trocar Cartas</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface CartaPropriedadeProps {
    cor: string
    nome: string
    aluguel: number
    numeroCasas: number
    monopolio: boolean
}

function CartaPropriedade({
    cor,
    nome,
    aluguel,
    numeroCasas,
    monopolio,
}: CartaPropriedadeProps) {
    // Mapeamento de cores para códigos Tailwind mais vibrantes
    const corMap: { [key: string]: { border: string; bg: string } } = {
        marrom: { border: 'border-amber-800', bg: 'bg-amber-50' },
        'azul-claro': { border: 'border-sky-400', bg: 'bg-sky-50' },
        rosa: { border: 'border-pink-500', bg: 'bg-pink-50' },
        laranja: { border: 'border-orange-500', bg: 'bg-orange-50' },
        vermelho: { border: 'border-red-600', bg: 'bg-red-50' },
        amarelo: { border: 'border-yellow-400', bg: 'bg-yellow-50' },
        verde: { border: 'border-green-600', bg: 'bg-green-50' },
        azul: { border: 'border-azul', bg: 'bg-blue-50' },
        roxo: { border: 'border-purple-600', bg: 'bg-purple-50' },
    }

    const corEstilo = corMap[cor] || {
        border: 'border-gray-400',
        bg: 'bg-gray-50',
    }

    return (
        <div
            className={`flex justify-between items-center py-2 px-3 ${corEstilo.bg} border-l-[8px] ${corEstilo.border} rounded-lg shadow-md hover:shadow-lg transition-all ${monopolio ? 'w-full' : 'w-[48%]'}`}
        >
            <div className="text-start flex-1">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                    {nome}
                </p>
                <p className="text-xs text-gray-700 font-semibold mt-0.5">
                    Aluguel: ${aluguel}
                </p>
            </div>

            <div
                className={`flex gap-1.5 justify-center items-center px-2 py-1.5 rounded-lg text-sm font-bold shadow-sm ${numeroCasas === 5 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gradient-to-br from-green-500 to-green-600 text-white'}`}
            >
                {numeroCasas === 5 ? <Hotel size={16} /> : <House size={16} />}
                {numeroCasas === 5 ? '1' : numeroCasas}
            </div>
        </div>
    )
}

interface CartaEstacaoProps {
    nome: string
    aluguel: number
    monopolio: boolean
}

function CartaEstacao({ nome, aluguel, monopolio }: CartaEstacaoProps) {
    return (
        <div
            className={`flex justify-between items-center py-2 px-3 bg-gray-50 border-l-[8px] border-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all ${monopolio ? 'w-full' : 'w-[48%]'}`}
        >
            <div className="text-start flex-1">
                <div className="flex items-center gap-2">
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {nome}
                        </p>
                        <p className="text-xs text-gray-700 font-semibold">
                            Aluguel: ${aluguel}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface CartaCompanhiaProps {
    nome: string
    monopolio: boolean
}

function CartaCompanhia({ nome, monopolio }: CartaCompanhiaProps) {
    return (
        <div
            className={`flex justify-between items-center py-2 px-3 bg-blue-50 border-l-[8px] border-blue-600 rounded-lg shadow-md hover:shadow-lg transition-all ${monopolio ? 'w-full' : 'w-[48%]'}`}
        >
            <div className="text-start flex-1">
                <div className="flex items-center gap-2">
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {nome}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
