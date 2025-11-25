import { EstacaoDeMetroOutput } from '@/domain/Carta'
import { cn } from '../lib/utils'

interface CartaEstacaoDeMetroProps {
    estacaoDeMetro: EstacaoDeMetroOutput
    size?: 'sm'
}

export const CartaEstacaoDeMetroView = ({
    estacaoDeMetro,
    size = 'sm',
}: CartaEstacaoDeMetroProps) => {
    const sizeClasses = size === 'sm' ? 'w-[16rem] p-4 text-sm' : ''

    return (
        <div className="p-3 bg-gray-100">
            <div
                className={cn(
                    'relative flex flex-col items-center border-2 border-black rounded-none overflow-hidden bg-white',
                    sizeClasses,
                )}
            >
                <img src={'./metro.png'} className="w-18 pb-4" />

                <h2 className="font-extrabold text-center text-base/4 tracking-tight border-y-2 border-black py-1.5 w-full">
                    {estacaoDeMetro.nome.toUpperCase()}
                </h2>

                <ul className="space-y-1 w-full mt-3">
                    {estacaoDeMetro.valorAluguel.map((valor, index) => (
                        <li
                            key={index}
                            className="flex justify-between text-sm font-semibold"
                        >
                            <span>
                                {index === 0
                                    ? 'Aluguel'
                                    : `Se possuir ${index + 1} estações:`}
                            </span>
                            <span>${valor}</span>
                        </li>
                    ))}
                    <li className="flex justify-between text-sm font-semibold mt-1">
                        <span>Valor da Hipoteca</span>
                        <span>${estacaoDeMetro.valorHipoteca}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
