export class Peca {
  personagem: string
  posicao: number
  id: string

  constructor(personagem: string, posicao = 0, id?: string) {
    this.personagem = personagem
    this.posicao = posicao
    // preserva id se fornecido, senão gera um único
    this.id = id ?? `${personagem}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  }

  /**
   * Calcula o movimento e retorna [posicaoAntiga, posicaoNova].
   * Não altera a instância (imutável).
   */
  mover(passos: number): [number, number] {
    const antiga = this.posicao
    const nova = (this.posicao + passos) % 40
    return [antiga, nova]
  }

  toJSON() {
    return {
      id: this.id,
      personagem: this.personagem,
      posicao: this.posicao,
    }
  }
}
