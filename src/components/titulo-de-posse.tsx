// app/components/TituloDePosseView.tsx
import { cn } from '../lib/utils'
import { Card } from './ui/card'
import { TituloDePosse } from '@/domain/Carta'

interface TitulosDePosseProps {
    tituloDePosse: TituloDePosse
    size?: 'sm' | 'md' | 'xl'
}

export const TituloDePosseView = ({
    tituloDePosse,
    size = 'md',
}: TitulosDePosseProps) => {
    const corDaCarta = tituloDePosse.getCor().toLowerCase()
    console.log(corDaCarta)

    const sizeClasses =
        size === 'sm'
            ? 'w-[120px] h-[180px] p-2 text-xs'
            : size === 'md'
              ? 'w-[150px] h-[220px] p-3 text-sm'
              : 'w-[180px] h-[260px] p-4 text-base'

    return (
        <div className="p-1 bg-gray-100 rounded-md">
            <Card
                className={cn(
                    'relative flex flex-col items-center border border-gray-400 rounded-md overflow-hidden shadow-sm bg-white',
                    sizeClasses,
                )}
            >
                <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] italic text-gray-500">
                        Título de Posse
                    </p>
                    <div
                        className={cn(
                            'flex justify-center items-center text-center border border-gray-300 rounded-sm w-full h-[30px] p-2',
                            corDaCarta,
                        )}
                    >
                        <h2 className="font-bold uppercase text-white-600">
                            {tituloDePosse.getNome()}
                        </h2>
                    </div>
                </div>

                <div className="w-full mt-2 border-t border-gray-300 pt-1 text-gray-700">
                    <p className="text-center text-[11px] mb-1 font-semibold">
                        Aluguel: ${tituloDePosse.getValorAluguel(0)}
                    </p>

                    <ul className="text-[10px] px-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <li key={i} className="flex justify-between">
                                <span>
                                    {i + 1} casa{i > 0 ? 's' : ''}:
                                </span>
                                <span>
                                    ${tituloDePosse.getValorAluguel(i + 1)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-gray-300 w-full text-[10px] text-center text-gray-600 pt-1">
                    <p>Casas custam ${tituloDePosse['precoCasa']} cada</p>
                    <p>Hotéis custam ${tituloDePosse['precoHotel']}</p>
                </div>

                <div className="absolute bottom-0 w-full text-[9px] text-gray-400 text-center border-t border-gray-200">
                    © MONOPOLY
                </div>
            </Card>
        </div>
    )
}
