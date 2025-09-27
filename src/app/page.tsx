'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Jogador {
  id: number
  nome: string
  personagem: 'pato' | 'carro'
}

const personagens = [
    { id: 'cachorro', nome: 'Cachorro', img: '/personagem-cachorro.png' },
    { id: 'carro', nome: 'Carro de Corrida', img: '/personagem-carro.png' },
    { id: 'cartola', nome: 'Cartola', img: '/personagem-cartola.png' },
    { id: 'dedal', nome: 'Dedal', img: '/personagem-dedal.png' },
    { id: 'gato', nome: 'Gato', img: '/personagem-gato.png' },
    { id: 'navio', nome: 'Navio', img: '/personagem-navio.png' },
    { id: 'pato', nome: 'Pato', img: '/personagem-pato.png' },
    { id: 'pinguim', nome: 'Pinguim', img: '/personagem-pinguim.png' },
]

export default function Home() {
    const [jogadores, setJogadores] = useState<Jogador[]>([
        { id: 1, nome: '', personagem: 'pato' },
        { id: 2, nome: '', personagem: 'carro' }
    ])
    const router = useRouter()

    const adicionarJogador = () => {
        if (jogadores.length < 8) {
            const novosPersonagens = ['pato', 'carro'] as const
            const personagemDisponivel = novosPersonagens[jogadores.length % 2]
            
            setJogadores([...jogadores, {
                id: jogadores.length + 1,
                nome: '',
                personagem: personagemDisponivel
            }])
        }
    }

    const removerJogador = (id: number) => {
        if (jogadores.length > 2) {
            setJogadores(jogadores.filter(jogador => jogador.id !== id))
        }
    }

    const atualizarNome = (id: number, nome: string) => {
        setJogadores(jogadores.map(jogador => 
            jogador.id === id ? { ...jogador, nome } : jogador
        ))
    }

    const selecionarPersonagem = (jogadorId: number, personagem: 'pato' | 'carro') => {
        setJogadores(jogadores.map(jogador => 
            jogador.id === jogadorId ? { ...jogador, personagem } : jogador
        ))
    }

    const podeJogar = jogadores.length >= 2 && jogadores.every(j => j.nome.trim() !== '')

    const iniciarJogo = () => {
        if (podeJogar) {
            router.push('/partida')
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center pt-4 pb-12 relative" 
             style={{
                 backgroundImage: 'url(/imagem-fundo.png)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
             }}>
            
            <img src="/logo.png" alt="" className='w-[30rem] mb-16' />

            {/* Background da cidade */}
            <div className="flex flex-col gap-12 w-full max-w-[70%] relative z-10">

                {/* Container principal */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-16 mb-8">
                    {jogadores.map((jogador, index) => (
                        <Card key={jogador.id} className="w-[15rem] p-2 relative">
                            <CardHeader>
                                <CardTitle>
                                    {personagens.find(p => p.id === jogador.personagem)?.nome}
                                    {/* {index === 0 && 'Jogador'}
                                    {index === 1 && 'Carro de Corrida'}
                                    {index === 2 && 'Cartola'}
                                    {index > 2 && `Jogador ${index + 1}`} */}
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-cyan-200 rounded-lg border-2 border-teal-600 flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            const proximoPersonagem = personagens[
                                                (personagens.findIndex(p => p.id === jogador.personagem) + 1) % personagens.length
                                            ]
                                            selecionarPersonagem(jogador.id, proximoPersonagem.id as any)
                                        }}>
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
                                        onChange={(e) => atualizarNome(jogador.id, e.target.value)}
                                        className="text-center"
                                    />

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
                        JOGADOR
                    </Button>
                </div>
            </div>
        </div>
    )
}