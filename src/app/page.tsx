'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Jogo } from '@/domain/jogo'
import { useJogoStore } from '@/store/useJogoStore'
import { PERSONAGEM } from '@/domain/jogador'

interface Jogador {
    id: number
    nome: string
    personagem: PERSONAGEM
    ehBot: boolean
}

const personagens = [
    {
        id: PERSONAGEM.CACHORRO,
        nome: 'Cachorro',
        img: '/personagem-cachorro.png',
    },
    {
        id: PERSONAGEM.CARRO,
        nome: 'Carro de Corrida',
        img: '/personagem-carro.png',
    },
    { id: PERSONAGEM.CARTOLA, nome: 'Cartola', img: '/personagem-cartola.png' },
    { id: PERSONAGEM.DEDAL, nome: 'Dedal', img: '/personagem-dedal.png' },
    { id: PERSONAGEM.GATO, nome: 'Gato', img: '/personagem-gato.png' },
    { id: PERSONAGEM.NAVIO, nome: 'Navio', img: '/personagem-navio.png' },
    { id: PERSONAGEM.PATO, nome: 'Pato', img: '/personagem-pato.png' },
    { id: PERSONAGEM.PINGUIM, nome: 'Pinguim', img: '/personagem-pinguim.png' },
]

export default function Home() {
    const [jogadores, setJogadores] = useState<Jogador[]>([
        { id: 1, nome: '', personagem: PERSONAGEM.PATO, ehBot: false },
        { id: 2, nome: '', personagem: PERSONAGEM.CARRO, ehBot: false },
    ])

    const setJogo = useJogoStore(state => state.setJogo)

    const router = useRouter()

    const adicionarJogador = () => {
        if (jogadores.length < 8) {
            const personagensDisponiveis = Object.values(PERSONAGEM).filter(
                personagem => !jogadores.some(j => j.personagem === personagem),
            )
            const personagemDisponivel = personagensDisponiveis[0]

            setJogadores([
                ...jogadores,
                {
                    id: jogadores.length + 1,
                    nome: '',
                    personagem: personagemDisponivel,
                    ehBot: false,
                },
            ])
        }
    }

    const removerJogador = (id: number) => {
        if (jogadores.length > 2) {
            setJogadores(jogadores.filter(jogador => jogador.id !== id))
        }
    }

    const atualizarNome = (id: number, nome: string) => {
        setJogadores(
            jogadores.map(jogador =>
                jogador.id === id ? { ...jogador, nome } : jogador,
            ),
        )
    }

    const toggleBot = (id: number) => {
        setJogadores(
            jogadores.map(jogador =>
                jogador.id === id
                    ? {
                          ...jogador,
                          ehBot: !jogador.ehBot,
                          nome: !jogador.ehBot
                              ? `Bot ${jogador.personagem}`
                              : '',
                      }
                    : jogador,
            ),
        )
    }

    const selecionarPersonagem = (
        jogadorId: number,
        personagem: PERSONAGEM,
    ) => {
        setJogadores(
            jogadores.map(jogador =>
                jogador.id === jogadorId ? { ...jogador, personagem } : jogador,
            ),
        )
    }

    const podeJogar =
        jogadores.length >= 2 &&
        jogadores.every(j => j.ehBot || j.nome.trim() !== '')

    const iniciarJogo = () => {
        try {
            const jogo = Jogo.criar(jogadores)

            setJogo(jogo)

            router.push('/partida')
        } catch (error) {
            console.error('Erro ao iniciar o jogo:', error)
        }
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center pt-4 pb-12 relative"
            style={{
                backgroundImage: 'url(/imagem-fundo.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <img src="/logo.png" alt="" className="w-[30rem] mb-16" />

            {/* Background da cidade */}
            <div className="flex flex-col gap-12 w-full max-w-[70%] relative z-10">
                {/* Container principal */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-16 mb-8">
                    {jogadores.map((jogador, index) => (
                        <Card
                            key={jogador.id}
                            className="w-[15rem] p-2 relative"
                        >
                            <CardHeader>
                                <CardTitle>
                                    {
                                        personagens.find(
                                            p => p.id === jogador.personagem,
                                        )?.nome
                                    }
                                    {/* {index === 0 && 'Jogador'}
                                    {index === 1 && 'Carro de Corrida'}
                                    {index === 2 && 'Cartola'}
                                    {index > 2 && `Jogador ${index + 1}`} */}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="">
                                <div className="flex justify-center">
                                    <div
                                        className="w-20 h-20 bg-cyan-200 rounded-lg border-2 border-teal-600 flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            const personagensUsados = jogadores
                                                .filter(
                                                    j => j.id !== jogador.id,
                                                )
                                                .map(j => j.personagem)

                                            const personagemAtualIndex =
                                                personagens.findIndex(
                                                    p =>
                                                        p.id ===
                                                        jogador.personagem,
                                                )

                                            for (
                                                let i = 1;
                                                i <= personagens.length;
                                                i++
                                            ) {
                                                const proximoIndex =
                                                    (personagemAtualIndex + i) %
                                                    personagens.length
                                                const proximoPersonagem =
                                                    personagens[proximoIndex]

                                                if (
                                                    !personagensUsados.includes(
                                                        proximoPersonagem.id,
                                                    )
                                                ) {
                                                    selecionarPersonagem(
                                                        jogador.id,
                                                        proximoPersonagem.id,
                                                    )
                                                    return
                                                }
                                            }
                                        }}
                                    >
                                        <img
                                            src={`/personagem-${jogador.personagem}.png`}
                                            alt={jogador.personagem}
                                            className="w-16 h-16"
                                        />
                                    </div>
                                </div>

                                <p className="text-white text-xs mb-2 text-center mt-1 mb-4">
                                    Clique no ícone do personagem para trocar
                                </p>
                                <Input
                                    placeholder="Digite seu nome"
                                    value={jogador.nome}
                                    onChange={e =>
                                        atualizarNome(
                                            jogador.id,
                                            e.target.value,
                                        )
                                    }
                                    className="text-center"
                                />

                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`bot-${jogador.id}`}
                                        checked={jogador.ehBot}
                                        onChange={() => toggleBot(jogador.id)}
                                        className="w-4 h-4"
                                    />
                                    <label
                                        htmlFor={`bot-${jogador.id}`}
                                        className="text-xs text-white font-bold cursor-pointer select-none"
                                    >
                                        BOT
                                    </label>
                                </div>
                            </CardContent>

                            {jogadores.length > 2 && index >= 2 && (
                                <Button
                                    onClick={() => removerJogador(jogador.id)}
                                    variant="retro"
                                    size="sm"
                                    className="absolute -bottom-[12%] left-[50%] transform -translate-x-1/2"
                                >
                                    REMOVER
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Botões inferiores */}
                <div className="flex justify-center space-x-4">
                    <Button
                        variant="retro"
                        size="lg"
                        onClick={adicionarJogador}
                        disabled={jogadores.length >= 8}
                    >
                        ADICIONAR JOGADOR
                    </Button>

                    <Button
                        variant="retro"
                        size="lg"
                        onClick={iniciarJogo}
                        disabled={!podeJogar}
                    >
                        JOGAR
                    </Button>
                </div>
            </div>
        </div>
    )
}
