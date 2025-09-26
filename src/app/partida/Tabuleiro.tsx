'use client'

import Image from 'next/image';

import { corParaTailwind } from "@/utils/mapeamento"
import { Terreno } from './Terreno';

const terrenos = [
    {
        "tipo": "ponto de partida",
        "jogadores": [
            'pato',
            'carro',
            'pato',
            'carro',
            'pato',
            'carro',
            'pato',
            'carro',
        ]
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Sumaré",
        "valor": 60,
        "cor": "marrom",
        "jogadores": []
    },
    {
        "tipo": "cofre",
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Presidente Vargas",
        "valor": 60,
        "cor": "marrom",
        "jogadores": []
    },
    {
        "tipo": "imposto",
        "nome": "Imposto de Renda",
        "valor": 200
    },
    {
        "tipo": "estação de metrô",
        "nome": "Estação do Maracanã",
        "valor": 200
    },
    {
        "tipo": "propriedade",
        "nome": "Rua 25 de Março",
        "valor": 100,
        "cor": "azul claro"
    },
    {
        "tipo": "sorte",
    },
    {
        "tipo": "propriedade",
        "nome": "Av. São João",
        "valor": 100,
        "cor": "azul claro"
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Paulista",
        "valor": 120,
        "cor": "azul claro"
    },
    {
        "tipo": "prisão",
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Veneza",
        "valor": 140,
        "cor": "rosa"
    },
    {
        "tipo": "companhia",
        "nome": "Companhia Elétrica",
        "valor": 150
    },
    {
        "tipo": "propriedade",
        "nome": "Niterói",
        "valor": 140,
        "cor": "rosa"
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Atlântica",
        "valor": 160,
        "cor": "rosa"
    },
    {
        "tipo": "estação de metrô",
        "nome": "Estação do Méier",
        "valor": 200
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Presidente Kubitschek",
        "valor": 180,
        "cor": "laranja"
    },
    {
        "tipo": "cofre",
        "jogadores": []
    },
    {
        "tipo": "propriedade",
        "nome": "Boulevard Higienópolis",
        "valor": 180,
        "cor": "laranja"
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Ipiranga",
        "valor": 200,
        "cor": "laranja"
    },
    {
        "tipo": "estacionamento",
    },
    {
        "tipo": "propriedade",
        "nome": "Ipanema",
        "valor": 220,
        "cor": "vermelho"
    },
    {
        "tipo": "sorte",
    },
    {
        "tipo": "propriedade",
        "nome": "Leblon",
        "valor": 220,
        "cor": "vermelho"
    },
    {
        "tipo": "propriedade",
        "nome": "Copacabana",
        "valor": 240,
        "cor": "vermelho"
    },
    {
        "tipo": "estação de metrô",
        "nome": "Estação de Conexão",
        "valor": 200
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Cidade Jardim",
        "valor": 260,
        "cor": "amarelo"
    },
    {
        "tipo": "propriedade",
        "nome": "Pacaembu",
        "valor": 260,
        "cor": "amarelo"
    },
    {
        "tipo": "companhia",
        "nome": "Companhia de Saneamento Básico",
        "valor": 150
    },
    {
        "tipo": "propriedade",
        "nome": "Ibirapuera",
        "valor": 280,
        "cor": "amarelo"
    },
    {
        "tipo": "vá para prisão",
    },
    {
        "tipo": "propriedade",
        "nome": "Barra da Tijuca",
        "valor": 300,
        "cor": "verde"
    },
    {
        "tipo": "propriedade",
        "nome": "Jardim Botânico",
        "valor": 300,
        "cor": "verde"
    },
    {
        "tipo": "cofre",
    },
    {
        "tipo": "propriedade",
        "nome": "Lagoa Rodrigo de Freitas",
        "valor": 320,
        "cor": "verde"
    },
    {
        "tipo": "estação de metrô",
        "nome": "Estação da República",
        "valor": 200
    },
    {
        "tipo": "sorte",
    },
    {
        "tipo": "propriedade",
        "nome": "Av. Morumbi",
        "valor": 350,
        "cor": "roxo"
    },
    {
        "tipo": "imposto",
        "nome": "Taxa de Riqueza",
        "valor": 100
    },
    {
        "tipo": "propriedade",
        "nome": "Rua Oscar Freire",
        "valor": 400,
        "cor": "roxo"
    }
]

export function Tabuleiro() {
    return (
        <div
            className='grid h-full max-h-screen aspect-5/4 border border-black bg-tabuleiro'
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
                `
            }}
        >
            {terrenos.map((terreno, i) => {
                return (
                    <Terreno
                        key={i}
                        posicao={i}
                        tipo={terreno.tipo}
                        nome={terreno.nome}
                        valor={terreno.valor}
                        cor={terreno.cor}
                        personagens={terreno.jogadores}
                    />
                )
            })}
            {/* {Array.from({ length: 40 }).map((_, i) => {
                return (
                    <Terreno
                        key={i}
                        posicao={i}
                        tipo="propriedade"
                        nome={`Propriedade ${i}`}
                        valor={100 + i * 10}
                        cor="verde"
                    />
                )
            })} */}
            <div
                className='flex justify-center items-center relative border border-black'
                style={{
                    gridArea: 'm'
                }}
            >
                <Image
                    src="/monopoly-logo.png"
                    alt='Logo do Monopoly escrito "Monopoly" em branco em um fundo vermelho com o boneco do jogo de terno preto em cima'
                    className='relative -rotate-45 -top-[7%]'
                    width={400}
                    height={400}
                />
            </div>
        </div>
    )
}