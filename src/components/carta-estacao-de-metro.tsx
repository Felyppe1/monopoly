// components/CartaEstacaoDeMetro.tsx
import { EstacaoDeMetroOutput } from '@/domain/EspacoDoTabuleiro'
import { cn } from '../lib/utils'
import { Card } from './ui/card'

interface CartaEstacaoDeMetroProps {
    estacaoDeMetro: EstacaoDeMetroOutput
    size?: 'sm' | 'md' | 'xl'
}

export const CartaEstacaoDeMetroView = ({
    estacaoDeMetro,
    size = 'md',
}: CartaEstacaoDeMetroProps) => {
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
                <div className="flex flex-col items-center text-center w-full">
                    <p className="text-[10px] italic text-gray-500">
                        Estação de Metrô
                    </p>
                    <div className="flex justify-center items-center text-center border border-gray-300 rounded-sm w-full h-[30px] p-2 bg-gray-800">
                        <h2 className="font-bold uppercase text-white text-[11px]">
                            {estacaoDeMetro.nome}
                        </h2>
                    </div>
                </div>

                {/* Ícone de trem */}
                <div className="my-3 text-4xl">🚇</div>

                <div className="w-full border-t border-gray-300 pt-2 text-gray-700">
                    <p className="text-center text-[11px] mb-2 font-semibold">
                        Aluguel
                    </p>

                    <ul className="text-[10px] px-2 space-y-1">
                        <li className="flex justify-between items-center">
                            <span>1 estação:</span>
                            <span className="font-semibold">
                                $
                                {
                                    estacaoDeMetro.cartaEstacaoDeMetro
                                        .valorAluguel[0]
                                }
                            </span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>2 estações:</span>
                            <span className="font-semibold">
                                $
                                {
                                    estacaoDeMetro.cartaEstacaoDeMetro
                                        .valorAluguel[1]
                                }
                            </span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>3 estações:</span>
                            <span className="font-semibold">
                                $
                                {
                                    estacaoDeMetro.cartaEstacaoDeMetro
                                        .valorAluguel[2]
                                }
                            </span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span>4 estações:</span>
                            <span className="font-semibold">
                                $
                                {
                                    estacaoDeMetro.cartaEstacaoDeMetro
                                        .valorAluguel[3]
                                }
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="border-t border-gray-300 w-full text-[10px] text-center text-gray-600 pt-2 mt-2">
                    <p>Preço: ${estacaoDeMetro.cartaEstacaoDeMetro.preco}</p>
                    <p>
                        Hipoteca: $
                        {estacaoDeMetro.cartaEstacaoDeMetro.valorHipoteca}
                    </p>
                </div>

                <div className="absolute bottom-0 w-full text-[9px] text-gray-400 text-center border-t border-gray-200 py-1">
                    © MONOPOLY
                </div>
            </Card>
        </div>
    )
}
