import { highestSalesType } from '@/lib/types'
import { cutLongString } from '@/lib/utils'
import { LucideTrash } from 'lucide-react'
import List from '../List'

export const HighestSales = ({ products }: { products: highestSalesType }) => {
    const emptyHighestSales = (
        <div className='w-full h-full flex-center flex-col gap-2'>
            <LucideTrash className='w-8 h-8' />
            <span className='text-muted-foreground dark:text-white'>Empty List</span>
        </div>
    )
    const HighestSalesArray =
        <div className='w-full flex-start flex-col gap-[0.80rem]'>
            {
                products.sort((a, b) => b.totalSales - a.totalSales).map((product, index) => (
                    <div key={index} className="w-full flex items-center p-2 border border-slate-200 rounded-lg">
                        <p
                            className="text-sm font-semibold leading-none"
                            title={product?.product}
                        >
                            {cutLongString(product?.product, 23)}
                        </p>
                        <div className="ml-auto font-medium">{product?.totalSales}</div>
                    </div>
                ))
            }
        </div>

    return (
        <List
            data={products}
            list={HighestSalesArray}
            emptyList={emptyHighestSales}
            title='Highest Sales'
            subtitle='Highetest product sales per dates'
            className='h-[440px]'
        />
    )
}
