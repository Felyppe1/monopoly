import { CartaEvento } from './CartaCofreouSorte'

export class Baralho {
    private cartasCofre: CartaEvento[] = []
    private cartasSorte: CartaEvento[] = []

    adicionarCartaCofre(carta: CartaEvento): void {
        this.cartasCofre.push(carta)
    }

    adicionarCartaSorte(carta: CartaEvento): void {
        this.cartasSorte.push(carta)
    }

    comprarCartaCofre(): CartaEvento | undefined {
        if (this.cartasCofre.length === 0) {
            console.warn('Baralho de cofre vazio!')
            return undefined
        }
        return this.cartasCofre.pop()
    }

    comprarCartaSorte(): CartaEvento | undefined {
        if (this.cartasSorte.length === 0) {
            console.warn('Baralho de sorte vazio!')
            return undefined
        }
        return this.cartasSorte.pop()
    }

    embaralhar(): void {
        this.embaralharArray(this.cartasCofre)
        this.embaralharArray(this.cartasSorte)
    }

    private embaralharArray(array: CartaEvento[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
    }

    getNumeroCartasCofre(): number {
        return this.cartasCofre.length
    }

    getNumeroCartasSorte(): number {
        return this.cartasSorte.length
    }

    devolverCartaCofre(carta: CartaEvento): void {
        this.cartasCofre.unshift(carta)
    }

    devolverCartaSorte(carta: CartaEvento): void {
        this.cartasSorte.unshift(carta)
    }
}
