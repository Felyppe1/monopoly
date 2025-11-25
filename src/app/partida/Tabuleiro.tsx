'use client'

import Image from 'next/image'
import { Terreno } from './Terreno'
import { useJogoStore } from '@/store/useJogoStore'
import { TIPO_ESPACO_ENUM } from '@/domain/EspacoDoTabuleiro'
import { Modais } from './Modais'

export function Tabuleiro() {
    const jogo = useJogoStore(state => state.jogo!)
    const estadoJogo = jogo!.toObject()

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
                    .filter(
                        jogador =>
                            jogador.posicao === espaco.posicao &&
                            !jogador.falido,
                    )
                    .map(jogador => jogador.personagem)

                let donoPersonagem = null
                if (espaco.nome) {
                    const cartaNoBanco = estadoJogo.banco.cartas.find(
                        c => c.nome === espaco.nome,
                    )

                    if (!cartaNoBanco) {
                        const jogadorDono = estadoJogo.jogadores.find(j =>
                            j.cartas.some(c => c.nome === espaco.nome),
                        )
                        if (jogadorDono) {
                            donoPersonagem = jogadorDono.personagem
                        }
                    }
                }

                const getPropriedades = () => {
                    if (espaco.tipo === TIPO_ESPACO_ENUM.PROPRIEDADE) {
                        return {
                            cor: espaco.tituloDePosse.cor,
                            valor: espaco.tituloDePosse.preco,
                        }
                    }
                    if (espaco.tipo === TIPO_ESPACO_ENUM.ESTACAO_DE_METRO) {
                        return { valor: espaco.cartaEstacaoDeMetro.preco }
                    }
                    if (espaco.tipo === TIPO_ESPACO_ENUM.COMPANHIA) {
                        return { valor: espaco.cartaCompanhia.preco }
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
                        personagens={personagensNaPosicao}
                        dono={donoPersonagem}
                    />
                )
            })}

            <div
                className="flex flex-col justify-center items-center relative border border-black bg-green-100 p-4"
                style={{ gridArea: 'm' }}
            >
                <Image
                    src="/monopoly-logo.png"
                    alt="Logo"
                    className="absolute -rotate-45 mb-4"
                    width={400}
                    height={400}
                />
                <Modais />
            </div>
        </div>
    )
}
