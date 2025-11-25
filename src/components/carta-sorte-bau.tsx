// components/CartaSorteBau.tsx
import { CompanhiaOutput } from '@/domain/Carta'
import { cn } from '../lib/utils'
import { Card } from './ui/card'
import { CartaEventoOutput, TIPO_CARTA } from '@/domain/CartaCofreouSorte'

interface CartaSorteBauProps {
    carta: CartaEventoOutput
    size?: 'sm'
}

export const CartaSorteBau = ({ carta, size = 'sm' }: CartaSorteBauProps) => {
    const sizeClasses = size === 'sm' ? 'w-[28rem] p-4 text-sm' : ''

    return (
        <div className="p-3 bg-gray-100 h-fit">
            <div
                className={cn(
                    'flex flex-col items-center aspect-16/9 border-2 border-black rounded-none bg-white',
                    sizeClasses,
                )}
            >
                <p className="text-xl font-extrabold">
                    {carta.tipo === TIPO_CARTA.SORTE ? 'SORTE' : 'COFRE'}
                </p>

                <div className="flex items-center gap-8 h-full">
                    <img
                        src="homem-monopoly.png"
                        className="w-26 self-end ml-[5%]"
                    />

                    {/* <h2 className="font-extrabold text-center text-base/4 tracking-tight border-y-2 border-black py-1.5 w-full">
                        {companhia.nome.toUpperCase()}
                    </h2> */}

                    <p className="text-base w-full text-center">
                        {carta.descricao}
                    </p>
                </div>
            </div>
        </div>
    )
}
