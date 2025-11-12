import { COR_ENUM } from '../Carta'
import { TIPO_ESPACO_ENUM } from '../EspacoDoTabuleiro'
import { NomeEspaco } from './nome-espacos'

export const tituloDePosseDados: {
    nome: NomeEspaco
    preco: number
    valorHipoteca: number
    cor: COR_ENUM
    valoresAluguel: number[]
    precoCasa: number
    precoHotel: number
}[] = [
    // Marrom
    {
        nome: 'Av. Sumaré',
        preco: 60,
        valorHipoteca: 30,
        cor: COR_ENUM.MARROM,
        valoresAluguel: [10, 30, 90, 160, 250],
        precoCasa: 50,
        precoHotel: 50,
    },
    {
        nome: 'Av. Presidente Vargas',
        preco: 60,
        valorHipoteca: 30,
        cor: COR_ENUM.MARROM,
        valoresAluguel: [20, 60, 180, 320, 450],
        precoCasa: 50,
        precoHotel: 50,
    },

    // Azul-claro
    {
        nome: 'Rua 25 de Março',
        preco: 100,
        valorHipoteca: 50,
        cor: COR_ENUM.AZUL_CLARO,
        valoresAluguel: [30, 90, 270, 400, 550],
        precoCasa: 50,
        precoHotel: 50,
    },
    {
        nome: 'Av. São João',
        preco: 100,
        valorHipoteca: 50,
        cor: COR_ENUM.AZUL_CLARO,
        valoresAluguel: [40, 100, 300, 450, 600],
        precoCasa: 50,
        precoHotel: 50,
    },
    {
        nome: 'Av. Paulista',
        preco: 120,
        valorHipoteca: 60,
        cor: COR_ENUM.AZUL_CLARO,
        valoresAluguel: [50, 150, 450, 625, 750],
        precoCasa: 50,
        precoHotel: 50,
    },

    // Rosa
    {
        nome: 'Av. Veneza',
        preco: 120,
        valorHipoteca: 60,
        cor: COR_ENUM.ROSA,
        valoresAluguel: [60, 180, 500, 700, 900],
        precoCasa: 100,
        precoHotel: 100,
    },
    {
        nome: 'Niterói',
        preco: 140,
        valorHipoteca: 70,
        cor: COR_ENUM.ROSA,
        valoresAluguel: [60, 180, 500, 700, 900],
        precoCasa: 100,
        precoHotel: 100,
    },
    {
        nome: 'Av. Atlântica',
        preco: 160,
        valorHipoteca: 80,
        cor: COR_ENUM.ROSA,
        valoresAluguel: [70, 200, 550, 750, 950],
        precoCasa: 100,
        precoHotel: 100,
    },

    // Laranja
    {
        nome: 'Av. Ipiranga',
        preco: 200,
        valorHipoteca: 100,
        cor: COR_ENUM.LARANJA,
        valoresAluguel: [90, 250, 700, 875, 1050],
        precoCasa: 100,
        precoHotel: 100,
    },
    {
        nome: 'Boulevard Higienópolis',
        preco: 180,
        valorHipoteca: 90,
        cor: COR_ENUM.LARANJA,
        valoresAluguel: [100, 300, 750, 925, 1100],
        precoCasa: 100,
        precoHotel: 100,
    },
    {
        nome: 'Av. Presidente Kubitschek',
        preco: 180,
        valorHipoteca: 90,
        cor: COR_ENUM.LARANJA,
        valoresAluguel: [110, 330, 800, 975, 1150],
        precoCasa: 100,
        precoHotel: 100,
    },

    // Vermelho
    {
        nome: 'Ipanema',
        preco: 440,
        valorHipoteca: 220,
        cor: COR_ENUM.AZUL,
        valoresAluguel: [350, 1000, 2200, 2600, 3000],
        precoCasa: 200,
        precoHotel: 200,
    },
    {
        nome: 'Leblon',
        preco: 440,
        valorHipoteca: 220,
        cor: COR_ENUM.AZUL,
        valoresAluguel: [400, 1100, 2400, 2800, 3200],
        precoCasa: 200,
        precoHotel: 200,
    },
    {
        nome: 'Copacabana',
        preco: 480,
        valorHipoteca: 240,
        cor: COR_ENUM.AZUL,
        valoresAluguel: [450, 1200, 2500, 2900, 3400],
        precoCasa: 200,
        precoHotel: 200,
    },

    // Amarelo
    {
        nome: 'Av. Cidade Jardim',
        preco: 260,
        valorHipoteca: 130,
        cor: COR_ENUM.VERMELHO,
        valoresAluguel: [150, 450, 1000, 1200, 1400],
        precoCasa: 150,
        precoHotel: 150,
    },
    {
        nome: 'Pacaembu',
        preco: 260,
        valorHipoteca: 130,
        cor: COR_ENUM.VERMELHO,
        valoresAluguel: [160, 480, 1100, 1300, 1500],
        precoCasa: 150,
        precoHotel: 150,
    },
    {
        nome: 'Ibirapuera',
        preco: 280,
        valorHipoteca: 140,
        cor: COR_ENUM.VERMELHO,
        valoresAluguel: [180, 500, 1200, 1400, 1600],
        precoCasa: 150,
        precoHotel: 150,
    },

    // Verde
    {
        nome: 'Barra da Tijuca',
        preco: 300,
        valorHipoteca: 150,
        cor: COR_ENUM.AMARELO,
        valoresAluguel: [200, 600, 1400, 1700, 1900],
        precoCasa: 200,
        precoHotel: 200,
    },
    {
        nome: 'Jardim Botânico',
        preco: 300,
        valorHipoteca: 150,
        cor: COR_ENUM.AMARELO,
        valoresAluguel: [220, 660, 1500, 1800, 2000],
        precoCasa: 200,
        precoHotel: 200,
    },
    {
        nome: 'Lagoa Rodrigo de Freitas',
        preco: 320,
        valorHipoteca: 160,
        cor: COR_ENUM.AMARELO,
        valoresAluguel: [240, 700, 1600, 1900, 2100],
        precoCasa: 200,
        precoHotel: 200,
    },

    // Roxo
    {
        nome: 'Av. Morumbi',
        preco: 350,
        valorHipoteca: 175,
        cor: COR_ENUM.VERDE,
        valoresAluguel: [260, 750, 1700, 2000, 2200],
        precoCasa: 200,
        precoHotel: 200,
    },
    {
        nome: 'Rua Oscar Freire',
        preco: 400,
        valorHipoteca: 200,
        cor: COR_ENUM.VERDE,
        valoresAluguel: [300, 900, 2000, 2400, 2800],
        precoCasa: 200,
        precoHotel: 200,
    },
]

export const estacaoDeMetroDados: {
    nome: NomeEspaco
    valorHipoteca: number
    valoresAluguel: number[]
    preco: number
}[] = [
    {
        nome: 'Estação do Maracanã',
        valorHipoteca: 100,
        valoresAluguel: [25, 50, 100, 200],
        preco: 200,
    },
    {
        nome: 'Estação do Méier',
        valorHipoteca: 100,
        valoresAluguel: [25, 50, 100, 200],
        preco: 200,
    },
    {
        nome: 'Estação da República',
        valorHipoteca: 100,
        valoresAluguel: [25, 50, 100, 200],
        preco: 200,
    },
    {
        nome: 'Estação de Conexão',
        valorHipoteca: 100,
        valoresAluguel: [25, 50, 100, 200],
        preco: 200,
    },
]

export const companhiaDados: {
    nome: NomeEspaco
    valorHipoteca: number
    preco: number
}[] = [
    {
        nome: 'Companhia Elétrica',
        valorHipoteca: 75,
        preco: 150,
    },
    {
        nome: 'Companhia de Saneamento Básico',
        valorHipoteca: 75,
        preco: 150,
    },
]

export const terrenoDados: {
    nome: NomeEspaco
    tipo: TIPO_ESPACO_ENUM
    posicao: number
}[] = [
    {
        nome: 'Ponto de Partida',
        tipo: TIPO_ESPACO_ENUM.PONTO_DE_PARTIDA,
        posicao: 0,
    },
    {
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        nome: 'Av. Sumaré',
        posicao: 1,
    },
    {
        nome: 'Cofre',
        tipo: TIPO_ESPACO_ENUM.COFRE,
        posicao: 2,
    },
    {
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        nome: 'Av. Presidente Vargas',
        posicao: 3,
    },
    {
        tipo: TIPO_ESPACO_ENUM.IMPOSTO,
        nome: 'Imposto de Renda',
        posicao: 4,
    },
    {
        tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
        nome: 'Estação do Maracanã',
        posicao: 5,
    },
    {
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        nome: 'Rua 25 de Março',
        posicao: 6,
    },
    {
        tipo: TIPO_ESPACO_ENUM.SORTE,
        nome: 'Sorte',
        posicao: 7,
    },
    {
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        nome: 'Av. São João',
        posicao: 8,
    },
    {
        nome: 'Av. Paulista',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 9,
    },
    {
        nome: 'Prisão',
        tipo: TIPO_ESPACO_ENUM.PRISAO,
        posicao: 10,
    },
    {
        nome: 'Av. Veneza',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 11,
    },
    {
        nome: 'Companhia Elétrica',
        tipo: TIPO_ESPACO_ENUM.COMPANHIA,
        posicao: 12,
    },
    {
        nome: 'Niterói',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 13,
    },
    {
        nome: 'Av. Atlântica',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 14,
    },
    {
        nome: 'Estação do Méier',
        tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
        posicao: 15,
    },
    {
        nome: 'Av. Presidente Kubitschek',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 16,
    },
    {
        nome: 'Cofre',
        tipo: TIPO_ESPACO_ENUM.COFRE,
        posicao: 17,
    },
    {
        nome: 'Boulevard Higienópolis',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 18,
    },
    {
        nome: 'Av. Ipiranga',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 19,
    },
    {
        nome: 'Estacionamento',
        tipo: TIPO_ESPACO_ENUM.ESTACIONAMENTO,
        posicao: 20,
    },
    {
        nome: 'Ipanema',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 21,
    },
    {
        nome: 'Sorte',
        tipo: TIPO_ESPACO_ENUM.SORTE,
        posicao: 22,
    },
    {
        nome: 'Leblon',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 23,
    },
    {
        nome: 'Copacabana',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 24,
    },
    {
        nome: 'Estação de Conexão',
        tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
        posicao: 25,
    },
    {
        nome: 'Av. Cidade Jardim',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 26,
    },
    {
        nome: 'Pacaembu',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 27,
    },
    {
        nome: 'Companhia de Saneamento Básico',
        tipo: TIPO_ESPACO_ENUM.COMPANHIA,
        posicao: 28,
    },
    {
        nome: 'Ibirapuera',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 29,
    },
    {
        nome: 'Vá para Prisão',
        tipo: TIPO_ESPACO_ENUM.VA_PARA_PRISAO,
        posicao: 30,
    },
    {
        nome: 'Barra da Tijuca',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 31,
    },
    {
        nome: 'Jardim Botânico',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 32,
    },
    {
        nome: 'Cofre',
        tipo: TIPO_ESPACO_ENUM.COFRE,
        posicao: 33,
    },
    {
        nome: 'Lagoa Rodrigo de Freitas',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 34,
    },
    {
        nome: 'Estação da República',
        tipo: TIPO_ESPACO_ENUM.ESTACAO_DE_METRO,
        posicao: 35,
    },
    {
        nome: 'Sorte',
        tipo: TIPO_ESPACO_ENUM.SORTE,
        posicao: 36,
    },
    {
        nome: 'Av. Morumbi',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 37,
    },
    {
        nome: 'Taxa de Riqueza',
        tipo: TIPO_ESPACO_ENUM.IMPOSTO,
        posicao: 38,
    },
    {
        nome: 'Rua Oscar Freire',
        tipo: TIPO_ESPACO_ENUM.PROPRIEDADE,
        posicao: 39,
    },
]
