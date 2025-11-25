import React, { useMemo, useState, useEffect } from 'react'
import { Carta, TituloDePosse } from '@/domain/Carta'
import { Jogador } from '@/domain/jogador'
import { NomeEspaco } from '@/domain/dados/nome-espacos'
import { useJogoStore } from '@/store/useJogoStore'

// --- Tipos Auxiliares ---
interface Oferta {
    dinheiro: number
    propriedades: NomeEspaco[]
    cartasSaidaPrisao: number
}

// --- Componente da Coluna de Oferta ---
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
    isOrigin?: boolean
    disableAccept?: boolean
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

    // Nota: Acessando diretamente do objeto jogador (instância)
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
                max={jogador.getSaldo()}
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

// --- Componente Modal Principal ---

interface NegociacaoModalProps {
    onClose: () => void
}

export function NegociacaoModal({ onClose }: NegociacaoModalProps) {
    const jogo = useJogoStore(state => state.jogo!)
    const setJogo = useJogoStore(state => state.setJogo)

    if (!jogo) return null

    // Usar toObject apenas para leituras estáticas iniciais se necessário,
    // mas preferir métodos da instância para lógica.
    const estadoJogo = jogo.toObject()

    // Lista de oponentes para o select (baseado no estado atual)
    const outrosJogadores = useMemo(() => {
        const atual = estadoJogo.jogadores[estadoJogo.indiceJogadorAtual]
        return estadoJogo.jogadores.filter(
            j => j.nome !== atual.nome && !j.falido,
        )
    }, []) // Array vazio de deps: assumimos que a lista de jogadores não muda DURANTE a negociação

    // --- Hooks de Estado Local ---
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

    const [aceitaOrigem, setAceitaOrigem] = useState(false)
    const [aceitaDestino, setAceitaDestino] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    // Recuperando Instâncias Reais de forma estável
    // Corrigido: Não colocamos 'jogo' no array de dependências para evitar re-calculo quando setJogo for chamado externamente
    const jogadorOrigemInstancia = useMemo(() => {
        return jogo.getJogador(estadoJogo.indiceJogadorAtual)
    }, [])

    const jogadorDestinoInstancia = useMemo(() => {
        if (!destinoId) return null
        // Procura pelo nome percorrendo índices na instância do Jogo
        // Usamos um método 'hacky' se o jogo não expõe getJogadores publicamente ou usamos o loop seguro.
        // Assumindo que jogo.getJogador(i) funciona.
        for (let i = 0; i < 8; i++) {
            try {
                const j = jogo.getJogador(i)
                if (j && j.getNome() === destinoId) return j
            } catch (e) {
                break
            }
        }
        return null
    }, [destinoId]) // Só atualiza se mudar o destino selecionado

    // Propriedades (Memoizadas para não piscar a tela)
    const propsOrigemReal = useMemo(() => {
        if (!jogadorOrigemInstancia) return []
        return jogadorOrigemInstancia
            .getCartas()
            .filter(c => c instanceof TituloDePosse) as TituloDePosse[]
    }, [jogadorOrigemInstancia])

    const propsDestinoReal = useMemo(() => {
        if (!jogadorDestinoInstancia) return []
        return jogadorDestinoInstancia
            .getCartas()
            .filter(c => c instanceof TituloDePosse) as TituloDePosse[]
    }, [jogadorDestinoInstancia])

    // --- Funções de Manipulação ---

    // Reseta o lado do destino apenas quando o destino muda
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
        setAceitaDestino(false) // Invalida o aceite do outro se eu mudar minha oferta
        setAceitaOrigem(false)
    }

    function atualizarOfertaDestino(patch: Partial<Oferta>) {
        setOfertaDestino(prev => ({ ...prev, ...patch }))
        setAceitaOrigem(false)
        setAceitaDestino(false)
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

    function validarOferta(oferta: Oferta, jogador: Jogador): string | null {
        if (oferta.dinheiro < 0) return 'Dinheiro não pode ser negativo'
        if (oferta.dinheiro > jogador.getSaldo())
            return `${jogador.getNome()} não tem saldo suficiente`

        // Validar propriedades
        for (const nome of oferta.propriedades) {
            const c = jogador.getCarta(nome)
            if (!c) return `${jogador.getNome()} não possui ${nome}`
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

    function origemAceita() {
        setErro(null)
        if (!jogadorDestinoInstancia) {
            setErro('Destino inválido')
            return
        }
        const err = validarOferta(ofertaOrigem, jogadorOrigemInstancia) // Valido se EU tenho o que prometi
        if (err) {
            setErro(err)
            return
        }
        setAceitaOrigem(true)
    }

    function destinoAceita() {
        setErro(null)
        if (!jogadorDestinoInstancia) {
            setErro('Destino inválido')
            return
        }
        const err = validarOferta(ofertaDestino, jogadorDestinoInstancia) // Valido se ELE tem o que prometeu
        if (err) {
            setErro(err)
            return
        }
        setAceitaDestino(true)
    }

    // --- Execução da Troca ---
    function executarTroca() {
        if (!jogadorDestinoInstancia || !jogadorOrigemInstancia) return

        // 1. Dinheiro
        if (ofertaOrigem.dinheiro > 0) {
            jogadorOrigemInstancia.pagar(ofertaOrigem.dinheiro)
            jogadorDestinoInstancia.receber(ofertaOrigem.dinheiro)
        }
        if (ofertaDestino.dinheiro > 0) {
            jogadorDestinoInstancia.pagar(ofertaDestino.dinheiro)
            jogadorOrigemInstancia.receber(ofertaDestino.dinheiro)
        }

        // 2. Propriedades Origem -> Destino
        ofertaOrigem.propriedades.forEach(nome => {
            const c = jogadorOrigemInstancia.getCarta(nome)
            if (c) {
                jogadorOrigemInstancia.removerCarta(nome)
                jogadorDestinoInstancia.adicionarCarta(c)
            }
        })

        // 3. Propriedades Destino -> Origem
        ofertaDestino.propriedades.forEach(nome => {
            const c = jogadorDestinoInstancia.getCarta(nome)
            if (c) {
                jogadorDestinoInstancia.removerCarta(nome)
                jogadorOrigemInstancia.adicionarCarta(c)
            }
        })

        // 4. Cartas Prisão (Lógica simplificada de transferência numérica,
        // idealmente moveria o objeto da cartaEvento)
        // Aqui assumimos troca simbólica ou implemente a troca de objeto se necessário.

        // Salvar estado global
        setJogo(jogo)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                <header className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                        Troca entre Jogadores
                    </h3>
                    <button
                        className="rounded px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna Origem */}
                    <PlayerOfferColumn
                        title={jogadorOrigemInstancia?.getNome()}
                        jogador={jogadorOrigemInstancia}
                        oferta={ofertaOrigem}
                        propriedadesDisponiveis={propsOrigemReal}
                        aceita={aceitaOrigem}
                        onChangeOferta={atualizarOfertaOrigem}
                        onTogglePropriedade={togglePropriedadeOfertaOrigem}
                        onAccept={origemAceita}
                        onReset={() => {
                            setOfertaOrigem({
                                dinheiro: 0,
                                propriedades: [],
                                cartasSaidaPrisao: 0,
                            })
                            setAceitaOrigem(false)
                        }}
                        isOrigin={true}
                    />

                    {/* Coluna Destino */}
                    {!destinoId ? (
                        <div className="border p-4 rounded flex flex-col justify-center bg-gray-50">
                            <label className="mb-2 font-medium text-center">
                                Selecione com quem negociar:
                            </label>
                            <select
                                className="border p-2 rounded w-full"
                                value={destinoId || ''}
                                onChange={e => setDestinoId(e.target.value)}
                            >
                                <option value="">
                                    Selecione um oponente...
                                </option>
                                {outrosJogadores.map(j => (
                                    <option key={j.nome} value={j.nome}>
                                        {j.nome} (R$ {j.saldo})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        jogadorDestinoInstancia && (
                            <PlayerOfferColumn
                                title={jogadorDestinoInstancia.getNome()}
                                jogador={jogadorDestinoInstancia}
                                oferta={ofertaDestino}
                                propriedadesDisponiveis={propsDestinoReal}
                                aceita={aceitaDestino}
                                onChangeOferta={atualizarOfertaDestino}
                                onTogglePropriedade={
                                    togglePropriedadeOfertaDestino
                                }
                                onAccept={destinoAceita}
                                onReset={() => {
                                    setOfertaDestino({
                                        dinheiro: 0,
                                        propriedades: [],
                                        cartasSaidaPrisao: 0,
                                    })
                                    setAceitaDestino(false)
                                }}
                            />
                        )
                    )}
                </div>

                {erro && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 font-bold text-center rounded border border-red-300">
                        {erro}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded font-bold shadow-md transition-all ${aceitaOrigem && aceitaDestino ? 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!aceitaOrigem || !aceitaDestino}
                        onClick={executarTroca}
                    >
                        Finalizar Troca
                    </button>
                </div>
            </div>
        </div>
    )
}
