import {
    Carta,
    CartaOutputUnion,
    Companhia,
    EstacaoDeMetro,
    TituloDePosse,
} from './Carta'
import {
    companhiaDados,
    estacaoDeMetroDados,
    tituloDePosseDados,
} from './dados'
import { NomeEspaco } from './dados/nome-espacos'

export interface BancoInput {
    cartas: Carta[]
}

export interface BancoOutput {
    cartas: CartaOutputUnion[]
}

export class Banco {
    private cartas: Carta[]

    static criar() {
        const titulosDePosse = tituloDePosseDados.map(dado => {
            return new TituloDePosse({
                nome: dado.nome,
                valorHipoteca: dado.valorHipoteca,
                cor: dado.cor,
                valorAluguel: dado.valoresAluguel,
                precoCasa: dado.precoCasa,
                precoHotel: dado.precoHotel,
                preco: dado.preco,
            })
        })

        const estacoesDeMetro = estacaoDeMetroDados.map(dado => {
            return new EstacaoDeMetro({
                nome: dado.nome,
                preco: dado.preco,
                valorHipoteca: dado.valorHipoteca,
                valorAluguel: dado.valoresAluguel,
            })
        })

        const companhias = companhiaDados.map(dado => {
            return new Companhia({
                nome: dado.nome,
                valorHipoteca: dado.valorHipoteca,
                preco: dado.preco,
            })
        })

        const cartas = [...titulosDePosse, ...estacoesDeMetro, ...companhias]

        return new Banco({ cartas })
    }

    constructor(input: BancoInput) {
        this.cartas = input.cartas
    }

    getCarta(nome: NomeEspaco) {
        const carta = this.cartas.find(carta => carta.getNome() === nome)

        if (!carta) return null

        return carta
    }

    toObject(): BancoOutput {
        return {
            cartas: this.cartas.map(carta => carta.toObject()),
        }
    }
}
