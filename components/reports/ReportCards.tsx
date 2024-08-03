import { parseCurrency } from '@/lib/utils'
import * as ca from '../ui/card'
import React from 'react'
import { Loader2 } from 'lucide-react'

type reportCardType = {
    title: string,
    percent?: number | null,
    value: number,
    isCurrency: boolean,
    style?: 'dashboard' | 'report',
    icon?: JSX.Element | null,
    subtitle?: string | null,
    loading?: boolean
}

export const ReportCards = ({
    title,
    percent = null,
    value,
    isCurrency,
    style = 'report',
    icon,
    subtitle,
    loading
}: reportCardType) => {
    const Icon =
        <span className='text-base text-slate-900 dark:text-white'>
            {icon}
        </span>

    return (
        <ca.Card className='w-full lg:w-1/4 overflow-hidden relative'>
            {
                loading && (
                    <div className='w-full h-full z-20 bg-white dark:bg-slate-900 flex-center absolute'>
                        <Loader2 className="mr-2 h-8 w-8 animate-spin text-black dark:text-white" />
                    </div>
                )
            }
            <ca.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <ca.CardTitle className={`${style === 'report' ? 'text-sm font-medium' : 'text-base font-bold flex items-center gap-3'}`}>
                    {(icon && style === 'dashboard') && Icon}
                    {title}
                </ca.CardTitle>
                {
                    (icon && style === 'report') && Icon
                }
            </ca.CardHeader>
            <ca.CardContent className='space-y-2'>
                <div className={`${style === 'report' ? 'flex justify-start text-2xl font-bold ' : 'flex justify-center text-3xl font-semibold'}`}>
                    {isCurrency ? 'Rp. ' + parseCurrency(value) : value}
                </div>
                {
                    percent && (
                        <p className="text-xs text-muted-foreground">
                            {percent > 0 ? '+ ' : '- '}{percent}% from last month
                        </p>
                    )
                }
                {
                    subtitle && (
                        <p className='text-xs text-muted-foreground text-center'>
                            {subtitle}
                        </p>
                    )
                }
            </ca.CardContent>
        </ca.Card>
    )
}
