export enum TIPO_ESPACO_ENUM {
    PROPRIEDADE = 'propriedade',
    IMPOSTO = 'imposto',
    COMPANHIA = 'companhia',
    ESTACAO_DE_METRO = 'estacao_de_metro',
    PRISAO = 'prisao',
    SORTE = 'sorte',
    COFRE = 'cofre',
    PONTO_DE_PARTIDA = 'ponto_de_partida',
    ESTACIONAMENTO = 'estacionamento',
    VA_PARA_PRISAO = 'va_para_prisao',
}

export class EspacoDoTabuleiro {
    nome: string
    posicao: number
    tipo: TIPO_ESPACO_ENUM

    constructor(nome: string, posicao: number, tipo: TIPO_ESPACO_ENUM) {
        if (!nome) throw new Error('Nome do espaço é obrigatório.')
        if (posicao < 0) throw new Error('Posição inválida.')
        this.nome = nome
        this.posicao = posicao
        this.tipo = tipo
    }

    toObject() {
        return {
            nome: this.nome,
            posicao: this.posicao,
            tipo: this.tipo,
        }
    }
}
