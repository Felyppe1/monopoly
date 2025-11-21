// components/CartaCompanhia.tsx
import { CompanhiaOutput } from '@/domain/Carta'
import { cn } from '../lib/utils'
import { Card } from './ui/card'

interface CartaCompanhiaProps {
    companhia: CompanhiaOutput
    size?: 'sm'
}

export const CartaCompanhiaView = ({
    companhia,
    size = 'sm',
}: CartaCompanhiaProps) => {
    const sizeClasses = size === 'sm' ? 'w-[16rem] p-4 text-sm' : ''

    return (
        <div className="p-3 bg-gray-100">
            <div
                className={cn(
                    'relative flex flex-col items-center border-2 border-black rounded-none overflow-hidden bg-white',
                    sizeClasses,
                )}
            >
                <img
                    src={
                        companhia.nome === 'Companhia Elétrica'
                            ? 'companhia-eletrica.png'
                            : 'companhia-saneamento.png'
                    }
                    className="w-16 pb-4"
                />

                <h2 className="font-extrabold text-center text-base/4 tracking-tight border-y-2 border-black py-1.5 w-full">
                    {companhia.nome.toUpperCase()}
                </h2>

                <div className="flex-1 flex flex-col justify-center text-xs leading-tight px-2 pt-3 text-center">
                    <p className="mb-3">
                        Se uma companhia for possuída, o aluguel é 4 vezes o
                        valor mostrado nos dados.
                    </p>
                    <p className="mb-3">
                        Se ambas as companhias forem possuídas, o aluguel é 10
                        vezes o valor mostrado nos dados.
                    </p>
                    <p className="">
                        Valor da Hipoteca &nbsp;&nbsp;&nbsp; ${companhia.preco}.
                    </p>
                </div>
            </div>
        </div>
    )
}
