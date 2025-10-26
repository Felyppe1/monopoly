import { COR_ENUM } from '@/domain/Carta'

export function corParaTailwind(cor: COR_ENUM) {
    return cor.split(' ').join('-')
}
