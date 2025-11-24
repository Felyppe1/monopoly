import React, { useMemo, useState, useEffect } from 'react'
import { Carta, TituloDePosse } from '@/domain/Carta'
import { Jogador } from '@/domain/jogador'
import { NomeEspaco } from '@/domain/dados/nome-espacos'
import { Card } from '@/components/ui/card'

interface PlayerOfferColumnProps {
    title?: string
    jogador: Jogador
    oferta: Oferta
    propriedadesDisponiveis: TituloDePosse[]
    aceita: boolean
    onChangeOferta: (patch: Partial<Oferta>) => void
    onTogglePropriedade: (nome: NomeEspaco) => void
    onAccept: () => void
    onReset: () => void
    isOrigin?: boolean // se true mostra "(Você)" no título
    disableAccept?: boolean // extra control
}

function PlayerOfferColumn({
    title,
    jogador,
    oferta,
    propriedadesDisponiveis,
    aceita,
    onChangeOferta,
    onTogglePropriedade,
    onAccept,
    onReset,
    isOrigin = false,
    disableAccept = false,
}: PlayerOfferColumnProps) {
    const ofertaTemAlgo = (o: Oferta) =>
        (o.dinheiro ?? 0) > 0 ||
        (o.propriedades ?? []).length > 0 ||
        (o.cartasSaidaPrisao ?? 0) > 0

    const possuiCartasSaida = jogador.getCartaSaidaPrisao?.()?.length ?? 0

    return (
        <div className="border p-4 rounded">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                    {title ?? jogador.getNome()} {isOrigin ? '(Você)' : ''}
                </h4>
                <div
                    className={`text-xs font-medium ${ofertaTemAlgo(oferta) ? 'text-green-600' : 'text-red-600'}`}
                >
                    {ofertaTemAlgo(oferta) ? 'Oferta pronta' : 'Oferta vazia'}
                </div>
            </div>

            <div className="mb-2 text-sm">Saldo: R$ {jogador.getSaldo()}</div>

            <label className="block text-sm font-medium">
                Dinheiro ofertado
            </label>
            <input
                type="number"
                value={oferta.dinheiro}
                onChange={e =>
                    onChangeOferta({ dinheiro: Number(e.target.value || 0) })
                }
                className="mt-1 w-full rounded border px-3 py-2"
                min={0}
            />

            <label className="block text-sm font-medium mt-3">
                Cartas Saia da Prisão
            </label>
            <input
                type="number"
                value={oferta.cartasSaidaPrisao}
                onChange={e =>
                    onChangeOferta({
                        cartasSaidaPrisao: Number(e.target.value || 0),
                    })
                }
                className="mt-1 w-28 rounded border px-3 py-2"
                min={0}
                max={possuiCartasSaida}
            />
            <div className="text-xs text-gray-500 mt-1">
                Você possui: {possuiCartasSaida}
            </div>

            <div className="mt-3">
                <label className="block text-sm font-medium">
                    Propriedades que oferta
                </label>
                <div className="mt-2 max-h-40 overflow-auto rounded border p-2">
                    {propriedadesDisponiveis.length === 0 && (
                        <div className="text-sm text-gray-500">
                            Nenhuma propriedade
                        </div>
                    )}
                    {propriedadesDisponiveis.map(c => {
                        const temConstrucoes =
                            (c.getNumCasas?.() ?? 0) > 0 ||
                            (c.getNumHoteis?.() ?? 0) > 0
                        return (
                            <label
                                key={c.getNome()}
                                className="flex items-center gap-2 py-1 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={oferta.propriedades.includes(
                                        c.getNome(),
                                    )}
                                    onChange={() =>
                                        onTogglePropriedade(c.getNome())
                                    }
                                    disabled={temConstrucoes}
                                />
                                <div>
                                    {c.getNome()}
                                    {temConstrucoes && (
                                        <span className="text-xs text-red-600">
                                            {' '}
                                            — venda construções
                                        </span>
                                    )}
                                </div>
                            </label>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
                <button
                    className={`rounded px-4 py-2 ${
                        aceita
                            ? 'bg-green-600 text-white'
                            : !disableAccept
                              ? 'bg-gray-100 cursor-pointer'
                              : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    onClick={onAccept}
                    disabled={disableAccept}
                >
                    {aceita
                        ? isOrigin
                            ? 'Aceito'
                            : 'Aceito'
                        : isOrigin
                          ? 'Aceitar oferta'
                          : 'Aceitar oferta'}
                </button>

                <button
                    className="rounded px-3 py-2 bg-gray-50"
                    onClick={onReset}
                >
                    Resetar
                </button>
            </div>
        </div>
    )
}

interface Oferta {
    dinheiro: number
    propriedades: NomeEspaco[]
    cartasSaidaPrisao: number
}

interface NegociacaoModalProps {
    aberto: boolean
    jogadorAtual: Jogador // jogador que abriu a negociação (origem)
    outrosJogadores: Jogador[] // possíveis destinos
    onFechar: () => void
    onSucesso?: (resultado?: any) => void
}

export function NegociacaoModal({
    aberto,
    jogadorAtual,
    outrosJogadores,
    onFechar,
    onSucesso,
}: NegociacaoModalProps) {
    // seleção de destino
    const [destinoId, setDestinoId] = useState<string | null>(null)

    const [ofertaOrigem, setOfertaOrigem] = useState<Oferta>({
        dinheiro: 0,
        propriedades: [],
        cartasSaidaPrisao: 0,
    })
    const [ofertaDestino, setOfertaDestino] = useState<Oferta>({
        dinheiro: 0,
        propriedades: [],
        cartasSaidaPrisao: 0,
    })
    const [destinoSelecionado, setDestinoSelecionado] = useState<boolean>(false)

    const [aceitaOrigem, setAceitaOrigem] = useState(false)
    const [aceitaDestino, setAceitaDestino] = useState(false)

    const [erro, setErro] = useState<string | null>(null)

    const jogadorDestino = useMemo(
        () => outrosJogadores.find(p => p.getNome() === destinoId) || null,
        [outrosJogadores, destinoId],
    )

    // listar propriedades disponíveis para cada jogador
    const propriedadesOrigem = useMemo(() => {
        return jogadorAtual
            .getCartas()
            .filter((c: Carta) => c instanceof TituloDePosse) as TituloDePosse[]
    }, [jogadorAtual])

    const propriedadesDestino = useMemo(() => {
        if (!jogadorDestino) return [] as TituloDePosse[]
        return jogadorDestino
            .getCartas()
            .filter((c: Carta) => c instanceof TituloDePosse) as TituloDePosse[]
    }, [jogadorDestino])

    // se trocar destino, resetar ofertaDestino / aceitações
    useEffect(() => {
        setOfertaDestino({
            dinheiro: 0,
            propriedades: [],
            cartasSaidaPrisao: 0,
        })
        setAceitaDestino(false)
        setAceitaOrigem(false)
        setErro(null)
    }, [destinoId])

    function atualizarOfertaOrigem(patch: Partial<Oferta>) {
        setOfertaOrigem(prev => ({ ...prev, ...patch }))
        setAceitaDestino(false)
    }
    function atualizarOfertaDestino(patch: Partial<Oferta>) {
        setOfertaDestino(prev => ({ ...prev, ...patch }))
        setAceitaOrigem(false)
    }

    function togglePropriedadeOfertaOrigem(nome: NomeEspaco) {
        atualizarOfertaOrigem({
            propriedades: ofertaOrigem.propriedades.includes(nome)
                ? ofertaOrigem.propriedades.filter(p => p !== nome)
                : [...ofertaOrigem.propriedades, nome],
        })
    }
    function togglePropriedadeOfertaDestino(nome: NomeEspaco) {
        atualizarOfertaDestino({
            propriedades: ofertaDestino.propriedades.includes(nome)
                ? ofertaDestino.propriedades.filter(p => p !== nome)
                : [...ofertaDestino.propriedades, nome],
        })
    }

    function ofertaTemAlgo(oferta: Oferta) {
        return (
            (oferta.dinheiro ?? 0) > 0 ||
            (oferta.propriedades ?? []).length > 0 ||
            (oferta.cartasSaidaPrisao ?? 0) > 0
        )
    }

    // validações antes de permitir "aceitar" — checagens locais mínimas:
    function validarOferta(oferta: Oferta, jogador: Jogador): string | null {
        if (oferta.dinheiro < 0) return 'Dinheiro não pode ser negativo'
        if (oferta.dinheiro > jogador.getSaldo())
            return `${jogador.getNome()} não tem saldo suficiente`
        if (oferta.cartasSaidaPrisao < 0) return 'Quantidade de cartas inválida'
        if (oferta.cartasSaidaPrisao > jogador.getCartaSaidaPrisao().length)
            return `${jogador.getNome()} não possui tantas cartas "Saia da Prisão"`
        // propriedades existem e não possuem construções
        for (const nome of oferta.propriedades) {
            const c = jogador.getCarta(nome)
            if (!c)
                return `${jogador.getNome()} não possui a propriedade ${nome}`
            if (c instanceof TituloDePosse) {
                if (
                    (c.getNumCasas?.() ?? 0) > 0 ||
                    (c.getNumHoteis?.() ?? 0) > 0
                ) {
                    return `Propriedade ${nome} possui construções — venda-as antes`
                }
            }
        }
        return null
    }

    function validarObrigatoriedade(oferta: Oferta, quem: string) {
        if (!ofertaTemAlgo(oferta)) {
            return `${quem} deve ofertar dinheiro, propriedade, ou carta "Saia da Prisão" para a troca ser realizada.`
        }
        return null
    }

    // quando um jogador pressiona "Aceitar", apenas marca sua aceitação (se a oferta adversária estiver válida).
    function origemAceita() {
        setErro(null)
        if (!jogadorDestino) {
            setErro('Jogador destino inválido')
            return
        }

        // const obrigOrig = validarObrigatoriedade(ofertaOrigem, 'Você (origem)')
        // if (obrigOrig) {
        //   setErro(obrigOrig)
        //   return
        // }
        const obrigDestino = validarObrigatoriedade(
            ofertaDestino,
            jogadorDestino.getNome(),
        )
        if (obrigDestino) {
            setErro(obrigDestino)
            return
        }

        const problema = validarOferta(ofertaDestino, jogadorDestino)
        if (problema) {
            setErro(`Problema com a oferta do destino: ${problema}`)
            return
        }

        setAceitaOrigem(true)
    }

    function destinoAceita() {
        setErro(null)
        if (!jogadorDestino) {
            setErro('Jogador destino inválido')
            return
        }

        // const obrigDestino = validarObrigatoriedade(ofertaDestino, 'Você (destino)')
        // if (obrigDestino) {
        //   setErro(obrigDestino)
        //   return
        // }
        const obrigOrig = validarObrigatoriedade(
            ofertaOrigem,
            jogadorAtual.getNome(),
        )
        if (obrigOrig) {
            setErro(obrigOrig)
            return
        }

        const problema = validarOferta(ofertaOrigem, jogadorAtual)
        if (problema) {
            setErro(`Problema com a oferta do origem: ${problema}`)
            return
        }
        const problemaDestino = validarOferta(ofertaDestino, jogadorDestino!)
        if (problemaDestino) {
            setErro(`Problema com a própria oferta: ${problemaDestino}`)
            return
        }
        setAceitaDestino(true)
    }

    function tentarAplicarTroca() {
        setErro(null)
        if (!jogadorDestino) return

        const obrigOrig = validarObrigatoriedade(
            ofertaOrigem,
            jogadorAtual.getNome(),
        )
        if (obrigOrig) {
            setErro(obrigOrig)
            return
        }
        const obrigDest = validarObrigatoriedade(
            ofertaDestino,
            jogadorDestino.getNome(),
        )
        if (obrigDest) {
            setErro(obrigDest)
            return
        }

        // re-check atômico: valida tudo antes de fazer alterações mutáveis
        const err1 = validarOferta(ofertaOrigem, jogadorAtual)
        const err2 = validarOferta(ofertaDestino, jogadorDestino)
        if (err1) {
            setErro(err1)
            return
        }
        if (err2) {
            setErro(err2)
            return
        }

        for (const nome of ofertaOrigem.propriedades) {
            const carta = jogadorAtual.getCarta(nome)
            if (!carta) {
                setErro(`Origem não possui mais ${nome}`)
                return
            }
        }
        for (const nome of ofertaDestino.propriedades) {
            const carta = jogadorDestino.getCarta(nome)
            if (!carta) {
                setErro(`Destino não possui mais ${nome}`)
                return
            }
        }

        // 1) Dinheiro (origem paga ofertaOrigem.dinheiro para destino; destino paga ofertaDestino.dinheiro para origem)
        const originPays = ofertaOrigem.dinheiro
        const destPays = ofertaDestino.dinheiro

        if (originPays > 0) {
            const ok = jogadorAtual.pagar(originPays)
            if (!ok) {
                setErro('Falha ao debitar origem')
                return
            }
            jogadorDestino.receber(originPays)
        }
        if (destPays > 0) {
            const ok = jogadorDestino.pagar(destPays)
            if (!ok) {
                setErro('Falha ao debitar destino')
                // rollback money already moved from origin -> destino
                if (originPays > 0) {
                    jogadorDestino.pagar(originPays)
                    jogadorAtual.receber(originPays)
                }
                return
            }
            jogadorAtual.receber(destPays)
        }

        // 2) Propriedades
        // Remover do dono e adicionar ao destinatario
        for (const nome of ofertaOrigem.propriedades) {
            const carta = jogadorAtual.getCarta(nome)
            if (!carta) {
                setErro(`Erro ao transferir ${nome}`)
                return
            }
            if (
                typeof jogadorAtual.removerCarta === 'function' &&
                typeof jogadorDestino.adicionarCarta === 'function'
            ) {
                jogadorAtual.removerCarta(nome)
                jogadorDestino.adicionarCarta(carta)
            } else {
                const all = jogadorAtual.getCartas()
                const idx = all.findIndex((c: Carta) => c.getNome() === nome)
                if (idx >= 0) {
                    const [c] = all.splice(idx, 1)
                    jogadorDestino.getCartas().push(c)
                } else {
                    setErro(`Erro ao transferir ${nome}`)
                    return
                }
            }
        }
        for (const nome of ofertaDestino.propriedades) {
            const carta = jogadorDestino.getCarta(nome)
            if (!carta) {
                setErro(`Erro ao transferir ${nome}`)
                return
            }
            if (
                typeof jogadorDestino.removerCarta === 'function' &&
                typeof jogadorAtual.adicionarCarta === 'function'
            ) {
                jogadorDestino.removerCarta(nome)
                jogadorAtual.adicionarCarta(carta)
            } else {
                const all = jogadorDestino.getCartas()
                const idx = all.findIndex((c: Carta) => c.getNome() === nome)
                if (idx >= 0) {
                    const [c] = all.splice(idx, 1)
                    jogadorAtual.getCartas().push(c)
                } else {
                    setErro(`Erro ao transferir ${nome}`)
                    return
                }
            }
        }

        // 3) Cartas Saida da Prisao
        for (let i = 0; i < ofertaOrigem.cartasSaidaPrisao; i++) {
            const carta = jogadorAtual.usarCartaSaidaPrisao()
            if (!carta) {
                setErro('Erro ao transferir carta da origem')
                return
            }
            jogadorDestino.adicionarCartaSaidaPrisao(carta)
        }
        for (let i = 0; i < ofertaDestino.cartasSaidaPrisao; i++) {
            const carta = jogadorDestino.usarCartaSaidaPrisao()
            if (!carta) {
                setErro('Erro ao transferir carta do destino')
                return
            }
            jogadorAtual.adicionarCartaSaidaPrisao(carta)
        }

        if (onSucesso) {
            onSucesso({
                origem: jogadorAtual,
                destino: jogadorDestino,
                ofertaOrigem,
                ofertaDestino,
            })
        }

        setOfertaOrigem({ dinheiro: 0, propriedades: [], cartasSaidaPrisao: 0 })
        setOfertaDestino({
            dinheiro: 0,
            propriedades: [],
            cartasSaidaPrisao: 0,
        })
        setAceitaOrigem(false)
        setAceitaDestino(false)
        setDestinoSelecionado(false)
        onFechar()
    }

    // Se ambos aceitaram, tentar aplicar troca (efeito colateral)
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null

        if (aceitaOrigem && aceitaDestino) {
            // espera 2 segundos antes de aplicar a troca
            timer = setTimeout(() => {
                tentarAplicarTroca()
            }, 2000)
        }

        // cleanup para evitar timers órfãos
        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [aceitaOrigem, aceitaDestino])

    if (!aberto) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg">
                <header className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Troca entre Jogadores
                    </h3>
                    <button
                        className="rounded px-3 py-1 cursor-pointer text-sm hover:bg-gray-100"
                        onClick={() => {
                            onFechar()
                        }}
                    >
                        Fechar
                    </button>
                </header>

                <div className="text-sm text-gray-600 mb-3">
                    Cada jogador deve ofertar{' '}
                    <span className="font-bold">pelo menos uma</span> das
                    opções: dinheiro, propriedade ou carta "Saia da Prisão" para
                    a troca ser realizada.
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <PlayerOfferColumn
                        title={jogadorAtual.getNome()}
                        jogador={jogadorAtual}
                        oferta={ofertaOrigem}
                        propriedadesDisponiveis={propriedadesOrigem}
                        aceita={aceitaOrigem}
                        onChangeOferta={patch => atualizarOfertaOrigem(patch)}
                        onTogglePropriedade={nome =>
                            togglePropriedadeOfertaOrigem(nome)
                        }
                        onAccept={origemAceita}
                        disableAccept={!ofertaTemAlgo(ofertaDestino)}
                        onReset={() => {
                            setOfertaOrigem({
                                dinheiro: 0,
                                propriedades: [],
                                cartasSaidaPrisao: 0,
                            })
                            setAceitaOrigem(false)
                            setAceitaDestino(false)
                        }}
                        isOrigin={true}
                    />

                    {/* Coluna Destino */}

                    {/* Se nenhum destino foi escolhido, mostra a seleção */}
                    {!destinoId && (
                        <div className="border p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Selecionar jogador destino
                                </label>
                                <select
                                    value={destinoId ?? ''}
                                    onChange={e => setDestinoId(e.target.value)}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                >
                                    <option value="">Selecione…</option>
                                    {outrosJogadores.map(p => (
                                        <option
                                            key={p.getNome()}
                                            value={p.getNome()}
                                        >
                                            {p.getNome()} — R$ {p.getSaldo()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Após escolher o destino, o select some e aparece o PlayerOfferColumn */}
                    {jogadorDestino && (
                        <PlayerOfferColumn
                            title={jogadorDestino.getNome()}
                            jogador={jogadorDestino}
                            oferta={ofertaDestino}
                            propriedadesDisponiveis={propriedadesDestino}
                            aceita={aceitaDestino}
                            onChangeOferta={patch =>
                                atualizarOfertaDestino(patch)
                            }
                            onTogglePropriedade={nome =>
                                togglePropriedadeOfertaDestino(nome)
                            }
                            onAccept={destinoAceita}
                            onReset={() => {
                                setDestinoId(null) // também remove o destinatário
                                setOfertaDestino({
                                    dinheiro: 0,
                                    propriedades: [],
                                    cartasSaidaPrisao: 0,
                                })
                                setAceitaOrigem(false)
                                setAceitaDestino(false)
                            }}
                            isOrigin={false}
                            disableAccept={!ofertaTemAlgo(ofertaOrigem)}
                        />
                    )}
                </div>

                {erro && (
                    <div className="mt-4 text-sm text-red-600">{erro}</div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded cursor-pointer bg-gray-100 px-4 py-2 hover:bg-gray-200"
                        onClick={() => {
                            onFechar()
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="rounded cursor-pointer bg-indigo-600 px-4 py-2 text-white"
                        onClick={() => {
                            if (aceitaOrigem && aceitaDestino)
                                tentarAplicarTroca()
                            else
                                setErro(
                                    'Ambos jogadores devem aceitar para concluir a troca.',
                                )
                        }}
                    >
                        Finalizar Troca
                    </button>
                </div>
            </div>
        </div>
    )
}
