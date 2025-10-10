'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabuleiro } from './Tabuleiro'

export default function Partida() {
    return (
        <div className="flex justify-between">
            <Tabuleiro />
            <div className="flex flex-col w-[35%] p-2">
                <Card>
                    <CardHeader className="text-2xl">
                        <CardTitle>Jogadores</CardTitle>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </div>
    )
}
