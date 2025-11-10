'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Terreno } from './Terreno'
import { Button } from '@/components/ui/button'
import { useJogoStore } from '@/store/useJogoStore'
import { COR_ENUM } from '@/domain/Carta'

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
    const estadoJogo = useJogoStore(state => state.estadoJogo)!

    const getJogadoresNaPosicao = (posicao: number) => {
        return estadoJogo.jogadores
            .filter(jogador => jogador.posicao === posicao)
            .map(jogador => jogador.personagem)
    }

    const terrenos = [
        {
            tipo: 'ponto de partida',
            jogadores: estadoJogo.jogadores
                .filter(jogador => jogador.posicao === 0)
                .map(jogador => jogador.personagem),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Sumaré',
            valor: 60,
            cor: 'marrom',
            jogadores: estadoJogo.jogadores
                .filter(jogador => jogador.posicao === 1)
                .map(jogador => jogador.personagem),
        },
        {
            tipo: 'cofre',
            jogadores: getJogadoresNaPosicao(2),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Presidente Vargas',
            valor: 60,
            cor: 'marrom',
            jogadores: getJogadoresNaPosicao(3),
        },
        {
            tipo: 'imposto',
            nome: 'Imposto de Renda',
            valor: 200,
            jogadores: getJogadoresNaPosicao(4),
        },
        {
            tipo: 'estação de metrô',
            nome: 'Estação do Maracanã',
            valor: 200,
            jogadores: getJogadoresNaPosicao(5),
        },
        {
            tipo: 'propriedade',
            nome: 'Rua 25 de Março',
            valor: 100,
            cor: 'azul claro',
            jogadores: getJogadoresNaPosicao(6),
        },
        {
            tipo: 'sorte',
            jogadores: getJogadoresNaPosicao(7),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. São João',
            valor: 100,
            cor: 'azul claro',
            jogadores: getJogadoresNaPosicao(8),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Paulista',
            valor: 120,
            cor: 'azul claro',
            jogadores: getJogadoresNaPosicao(9),
        },
        {
            tipo: 'prisão',
            jogadores: getJogadoresNaPosicao(10),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Veneza',
            valor: 140,
            cor: 'rosa',
            jogadores: getJogadoresNaPosicao(11),
        },
        {
            tipo: 'companhia',
            nome: 'Companhia Elétrica',
            valor: 150,
            jogadores: getJogadoresNaPosicao(12),
        },
        {
            tipo: 'propriedade',
            nome: 'Niterói',
            valor: 140,
            cor: 'rosa',
            jogadores: getJogadoresNaPosicao(13),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Atlântica',
            valor: 160,
            cor: 'rosa',
            jogadores: getJogadoresNaPosicao(14),
        },
        {
            tipo: 'estação de metrô',
            nome: 'Estação do Méier',
            valor: 200,
            jogadores: getJogadoresNaPosicao(15),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Presidente Kubitschek',
            valor: 180,
            cor: 'laranja',
            jogadores: getJogadoresNaPosicao(16),
        },
        {
            tipo: 'cofre',
            jogadores: getJogadoresNaPosicao(17),
        },
        {
            tipo: 'propriedade',
            nome: 'Boulevard Higienópolis',
            valor: 180,
            cor: 'laranja',
            jogadores: getJogadoresNaPosicao(18),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Ipiranga',
            valor: 200,
            cor: 'laranja',
            jogadores: getJogadoresNaPosicao(19),
        },
        {
            tipo: 'estacionamento',
            jogadores: getJogadoresNaPosicao(20),
        },
        {
            tipo: 'propriedade',
            nome: 'Ipanema',
            valor: 220,
            cor: 'vermelho',
            jogadores: getJogadoresNaPosicao(21),
        },
        {
            tipo: 'sorte',
            jogadores: getJogadoresNaPosicao(22),
        },
        {
            tipo: 'propriedade',
            nome: 'Leblon',
            valor: 220,
            cor: 'vermelho',
            jogadores: getJogadoresNaPosicao(23),
        },
        {
            tipo: 'propriedade',
            nome: 'Copacabana',
            valor: 240,
            cor: 'vermelho',
            jogadores: getJogadoresNaPosicao(24),
        },
        {
            tipo: 'estação de metrô',
            nome: 'Estação de Conexão',
            valor: 200,
            jogadores: getJogadoresNaPosicao(25),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Cidade Jardim',
            valor: 260,
            cor: 'amarelo',
            jogadores: getJogadoresNaPosicao(26),
        },
        {
            tipo: 'propriedade',
            nome: 'Pacaembu',
            valor: 260,
            cor: 'amarelo',
            jogadores: getJogadoresNaPosicao(27),
        },
        {
            tipo: 'companhia',
            nome: 'Companhia de Saneamento Básico',
            valor: 150,
            jogadores: getJogadoresNaPosicao(28),
        },
        {
            tipo: 'propriedade',
            nome: 'Ibirapuera',
            valor: 280,
            cor: 'amarelo',
            jogadores: getJogadoresNaPosicao(29),
        },
        {
            tipo: 'vá para prisão',
            jogadores: getJogadoresNaPosicao(30),
        },
        {
            tipo: 'propriedade',
            nome: 'Barra da Tijuca',
            valor: 300,
            cor: 'verde',
            jogadores: getJogadoresNaPosicao(31),
        },
        {
            tipo: 'propriedade',
            nome: 'Jardim Botânico',
            valor: 300,
            cor: 'verde',
            jogadores: getJogadoresNaPosicao(32),
        },
        {
            tipo: 'cofre',
            jogadores: getJogadoresNaPosicao(33),
        },
        {
            tipo: 'propriedade',
            nome: 'Lagoa Rodrigo de Freitas',
            valor: 320,
            cor: 'verde',
            jogadores: getJogadoresNaPosicao(34),
        },
        {
            tipo: 'estação de metrô',
            nome: 'Estação da República',
            valor: 200,
            jogadores: getJogadoresNaPosicao(35),
        },
        {
            tipo: 'sorte',
            jogadores: getJogadoresNaPosicao(36),
        },
        {
            tipo: 'propriedade',
            nome: 'Av. Morumbi',
            valor: 350,
            cor: 'roxo',
            jogadores: getJogadoresNaPosicao(37),
        },
        {
            tipo: 'imposto',
            nome: 'Taxa de Riqueza',
            valor: 100,
            jogadores: getJogadoresNaPosicao(38),
        },
        {
            tipo: 'propriedade',
            nome: 'Rua Oscar Freire',
            valor: 400,
            cor: 'roxo',
            jogadores: getJogadoresNaPosicao(39),
        },
    ]
    const [dado1, setDado1] = useState(5)
    const [dado2, setDado2] = useState(3)
    const [rolando, setRolando] = useState(false)

    const jogarDados = useJogoStore(state => state.jogarDados)

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
            const resultado = jogarDados()
            if (resultado) {
                setDado1(resultado.dado1)
                setDado2(resultado.dado2)
            }
            setRolando(false)
        }, 1500)
    }

    const passarVez = () => {
        // Lógica para passar a vez
        console.log('Passando a vez...')
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

                console.log(espaco)
                return (
                    <Terreno
                        key={i}
                        posicao={i}
                        tipo={espaco.tipo}
                        nome={espaco.nome}
                        cor={espaco.tituloDePosse?.cor}
                        valor={
                            espaco.tituloDePosse?.preco ||
                            espaco.cartaEstacaoDeMetro?.preco ||
                            espaco.cartaCompanhia?.preco
                        }
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
                    <Button onClick={rolarDados} disabled={rolando}>
                        {rolando ? 'ROLANDO...' : 'JOGAR DADOS'}
                    </Button>
                    <Button onClick={passarVez}>TERMINAR TURNO</Button>
                </div>
            </div>
        </div>
    )
}
