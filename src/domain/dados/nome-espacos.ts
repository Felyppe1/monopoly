export type Propriedade =
    | 'Av. Sumaré'
    | 'Av. Presidente Vargas'
    | 'Rua 25 de Março'
    | 'Av. São João'
    | 'Av. Paulista'
    | 'Av. Veneza'
    | 'Niterói'
    | 'Av. Atlântica'
    | 'Av. Ipiranga'
    | 'Boulevard Higienópolis'
    | 'Av. Presidente Kubitschek'
    | 'Ipanema'
    | 'Leblon'
    | 'Copacabana'
    | 'Av. Cidade Jardim'
    | 'Pacaembu'
    | 'Ibirapuera'
    | 'Barra da Tijuca'
    | 'Jardim Botânico'
    | 'Lagoa Rodrigo de Freitas'
    | 'Av. Morumbi'
    | 'Rua Oscar Freire'

export type EstacaoDeMetro =
    | 'Estação do Maracanã'
    | 'Estação do Méier'
    | 'Estação de Conexão'
    | 'Estação da República'

export type Companhia = 'Companhia Elétrica' | 'Companhia de Saneamento Básico'

export type NomeEspaco =
    | Propriedade
    | EstacaoDeMetro
    | Companhia
    // Outros espaços
    | 'Cofre'
    | 'Sorte'
    | 'Imposto de Renda'
    | 'Taxa de Riqueza'
    | 'Ponto de Partida'
    | 'Prisão'
    | 'Estacionamento'
    | 'Vá para Prisão'
