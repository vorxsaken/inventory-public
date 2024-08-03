import { highestSalesType, orderType } from '@/lib/types'
import { cutLongString, parseCurrency } from '@/lib/utils'
import { LucideTrash } from 'lucide-react'
import List from '../List'

export const RecentSales = ({ sales, loading }: { sales: orderType[], loading?: boolean }) => {
    const emptyRecentSales = (
        <div className='w-full h-full flex-center flex-col gap-2'>
            <LucideTrash className='w-8 h-8' />
            <span className='text-muted-foreground'>Empty List</span>
        </div>
    )
    const recentSalesArray =
        (
            <div className='w-full flex-start flex-col gap-[0.80rem]'>
                {
                    [...sales].sort((a, b) => (b.totalAmount as number as number) - (a.totalAmount as number)).map(sale => (
                        <div key={sale.id} className="w-full flex items-center p-2 border border-slate-200 dark:border-slate-800 rounded-lg">
                            <div className='flex-start flex-col gap-0'>
                                <p
                                    className="font-semibold leading-none"
                                    title={sale.customerName}
                                >
                                    {cutLongString(sale.customerName, 23)}
                                </p>
                                <span className='text-xs text-muted-foreground' title={sale.customerAddress}>
                                    {cutLongString(sale.customerAddress, 30)}
                                </span>
                            </div>
                            <div className="ml-auto font-medium text-xs">Rp.{parseCurrency(sale.totalAmount as number)}</div>
                        </div>
                    ))
                }
            </div>
        )

    return (
        <List
            data={sales}
            list={recentSalesArray}
            emptyList={emptyRecentSales}
            title='Recent Sales'
            subtitle='Current Sales Created'
            className='h-[540px]'
            loading={loading}
        />
    )
}
