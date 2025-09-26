import { corParaTailwind } from "@/utils/mapeamento"

interface TerrenoProps {
    posicao: number
    ehLateral?: boolean
    tipo: 'propriedade' | 'imposto' | 'companhia' | 'estação de metrô' | 'prisão' | 'sorte' | 'cofre' | 'ponto de partida' | 'estacionamento' | 'vá para prisão'
    nome?: string
    valor?: number
    cor?: string
    personagens?: ('pato' | 'carro')[]
}

export function Terreno({ posicao, tipo, nome, valor, cor, personagens }: TerrenoProps) {
    const ehLateral = (posicao > 10 && posicao < 20) || (posicao > 30 && posicao < 40)
    const ehEsquerda = posicao > 10 && posicao < 20
    const ehDireita = posicao > 30 && posicao < 40
            console.log(personagens)
    
    return (
        <div 
            className={`${ehLateral ? '' : 'flex-col'} flex border border-black text-xs relative group`}
            style={{
                gridArea: `c${posicao}`
            }}
        >

            {tipo === 'propriedade' && !ehLateral && (
                <div className={`h-5 bg-${corParaTailwind(cor!)}`}></div>
            )}

            {tipo === 'propriedade' && ehDireita && (
                <div className={`min-w-5 bg-${corParaTailwind(cor!)}`}></div>
            )}

            <div className={`${ehLateral ? 'px-2 py-1' : 'py-4 flex-col'} flex-grow flex justify-between items-center text-center`}>
                {tipo === 'propriedade' || tipo === 'imposto' || tipo === 'companhia' || tipo === 'estação de metrô' ? (
                    <>
                    {ehLateral ? (
                        <>
                        {tipo === 'estação de metrô' && (
                            <img src='/metro.png' className='w-12' />
                        )}
                        {tipo === 'companhia' && nome === 'Companhia Elétrica' && (
                            <img src='/companhia-eletrica.png' className='w-8' />
                        )}
                        {tipo === 'imposto' && nome === 'Taxa de Riqueza' && (
                            <img src='/imposto-riqueza.png' className='w-10' />
                        )}
                        <div className='flex flex-col'>
                            <span className='font-bold'>{nome}</span>
                            <span>Preço ${valor}</span>
                        </div>
                        </>
                    ) : (
                        <>
                        <span className='font-bold'>{nome}</span>
                        {tipo === 'estação de metrô' && (
                            <img src='/metro.png' className='w-14' />
                        )}

                        {tipo === 'companhia' && nome === 'Companhia de Saneamento Básico' && (
                            <img src='/companhia-saneamento.png' className='w-10' />
                        )}
                        <span>Preço ${valor}</span>
                        </>
                    )}
                    </>
                ) : (
                    <>
                    {ehLateral ? (
                        <>
                        {(tipo === 'sorte' || tipo === 'cofre') && (
                            <>
                            <img src={`/${tipo}.png`} className={`${tipo === 'sorte' ? 'w-6' : 'w-10'}`} />
                            <div className='flex flex-col'>
                                <span className='font-bold'>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                                <span>Siga as instruções na carta</span>
                            </div>
                            </>
                        )}
                        </>
                    ) : (
                        <>
                        {(tipo === 'sorte' || tipo === 'cofre') && (
                            <>
                            <span className='font-bold'>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
                            <img src={`/${tipo}.png`} className={`${tipo === 'sorte' ? 'w-6' : 'w-10'}`} />
                            <span>Siga as instruções na carta</span>
                            </>
                        )}
                        </>
                    )}
                    </>
                )}

                {/* <span className="text-gray-600">
                    {posicao}
                </span> */}
            </div>

            {tipo === 'propriedade' && ehEsquerda && (
                <div className={`min-w-5 bg-${corParaTailwind(cor!)}`}></div>
            )}

            {personagens?.map((personagem, index) => {
                const total = personagens.length
                const perColumn = 4; // máximo de 4 por coluna
                const col = Math.floor(index / perColumn); // em qual coluna está
                const row = index % perColumn;             // em qual linha dentro da coluna

                const spacingY = ehLateral ? 70 : 60;
                const spacingX = ehLateral ? 60 : 80;

                // Centralizar no meio
                const totalCols = Math.ceil(total / perColumn);
                const totalRows = Math.min(total, perColumn);

                const offsetX = (col - (totalCols - 1) / 2) * spacingX;
                const offsetY = (row - (totalRows - 1) / 2) * spacingY;

                return (
                    <img
                    key={personagem}
                    src={`/personagem-${personagem}.png`}
                    alt=""
                    className="absolute w-10 left-1/2 top-1/2 group-hover:opacity-10 transition-opacity duration-100"
                    style={{
                        transform: ehLateral
                                        ? `translate(calc(-50% + ${offsetY}%), calc(-50% + ${offsetX}%))`
                                        : `translate(calc(-50% + ${offsetX}%), calc(-50% + ${offsetY}%))`,
                    }}
                    />
                );
                // const offset = - 70 + (index * 60);

                return (
                    <img
                        key={personagem}
                        src={`/personagem-${personagem}.png`}
                        alt=""
                        className={`absolute w-12 left-[50%] top-[50%] `}
                        style={{ translate: `-50% calc(${offset}% - 50%)` }}
                    />
                )
            })}
        </div>
    )
}