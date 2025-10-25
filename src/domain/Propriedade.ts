import { EspacoDoTabuleiro } from './EspacoDoTabuleiro'
import { TIPO_ESPACO_ENUM } from './EspacoDoTabuleiro'
import { TituloDePosse } from './Carta'

export class Propriedade extends EspacoDoTabuleiro {
    titulo: TituloDePosse

    constructor(nome: string, posicao: number, titulo: TituloDePosse) {
        super(nome, posicao, TIPO_ESPACO_ENUM.PROPRIEDADE)
        this.titulo = titulo
    }

    toObject() {
        return {
            ...super.toObject(),
            titulo: this.titulo.toObject(),
        }
    }
}
