// app/components/TituloDePosseView.tsx
import { cn } from '../lib/utils'
import { Card } from './ui/card'
import { TituloDePosse, TituloDePosseOutput } from '@/domain/Carta'

interface TitulosDePosseProps {
    tituloDePosse: TituloDePosseOutput
    size?: 'sm' | 'lg'
}

export const TituloDePosseView = ({
    tituloDePosse,
    size = 'sm',
}: TitulosDePosseProps) => {
    const corDaCarta = tituloDePosse.cor.toLocaleLowerCase()

    return (
        <div
            className={cn(
                'border border-gray-300 bg-white',
                size === 'lg' && 'w-[23rem] p-4',
                size === 'sm' && 'w-[16rem] p-2',
            )}
        >
            <div
                className={cn(
                    'border-2 border-black flex flex-col',
                    size === 'lg' && 'p-2.5',
                    size === 'sm' && 'p-1.5 pb-0',
                )}
            >
                <div
                    className={cn(
                        'flex flex-col items-center justify-center border-black border-2',
                        size === 'lg' && 'gap-2 px-4 py-3',
                        size === 'sm' && 'gap-1 px-2 py-1.5',
                        corDaCarta,
                    )}
                >
                    <p
                        className={cn(
                            'font-bold tracking-wide',
                            size === 'lg' && 'text-sm',
                            size === 'sm' && 'text-[10px]',
                        )}
                    >
                        ESCRITURA DE PROPRIEDADE
                    </p>
                    <h1
                        className={cn(
                            'font-extrabold uppercase tracking-tight text-center',
                            size === 'lg' && 'text-2xl/5',
                            size === 'sm' && 'text-sm/4',
                        )}
                    >
                        {tituloDePosse.nome}
                    </h1>
                </div>

                <div
                    className={cn(
                        'flex-1 flex flex-col',
                        size === 'lg' && 'px-6 py-4',
                        size === 'sm' && 'px-3 py-2',
                    )}
                >
                    <div
                        className={cn(
                            size === 'lg' && 'space-y-2',
                            size === 'sm' && 'space-y-1',
                        )}
                    >
                        <div
                            className={cn(
                                'text-center',
                                size === 'lg' && 'mb-3',
                                size === 'sm' && 'mb-1.5',
                            )}
                        >
                            <p
                                className={cn(
                                    'font-bold',
                                    size === 'lg' && 'text-xl',
                                    size === 'sm' && 'text-xs',
                                )}
                            >
                                ALUGUEL ${tituloDePosse.valorAluguel[0]}
                            </p>
                        </div>

                        <ul
                            className={cn(
                                size === 'lg' && 'space-y-1',
                                size === 'sm' && 'space-y-0.5',
                            )}
                        >
                            {tituloDePosse.valorAluguel.map((valor, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span
                                        className={cn(
                                            'font-medium',
                                            size === 'lg' && 'text-sm',
                                            size === 'sm' && 'text-xs',
                                        )}
                                    >
                                        Com {index + 1} Casa
                                    </span>
                                    <span
                                        className={cn(
                                            'font-bold text-right',
                                            size === 'lg' && 'text-sm',
                                            size === 'sm' && 'text-xs',
                                        )}
                                    >
                                        ${tituloDePosse.valorAluguel[index]}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div
                        className={cn(
                            'border-t border-gray-300',
                            size === 'lg' && 'my-2',
                            size === 'sm' && 'my-1',
                        )}
                    ></div>

                    <div
                        className={cn(
                            'text-center font-medium',
                            size === 'lg' && 'text-sm',
                            size === 'sm' && 'text-[10px]',
                        )}
                    >
                        <p>
                            Valor da Hipoteca{' '}
                            <strong>${tituloDePosse.valorHipoteca}</strong>
                        </p>
                        <p>
                            Casas custam{' '}
                            <strong>${tituloDePosse.precoCasa}</strong> cada
                        </p>
                        <p>
                            Hotéis, <strong>${tituloDePosse.precoHotel}</strong>{' '}
                            cada
                        </p>
                        <p className="italic">mais 4 casas</p>
                    </div>

                    <div
                        className={cn(
                            'text-center italic text-gray-700',
                            size === 'lg' && 'text-xs mt-2',
                            size === 'sm' && 'text-[.625rem]/3 mt-1',
                        )}
                    >
                        <p>
                            Se um jogador possui todos os terrenos de qualquer
                            grupo de cores, o aluguel é dobrado em terrenos sem
                            construção.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
