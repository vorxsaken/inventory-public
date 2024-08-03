import { productType } from '@/lib/types'
import { cutLongString } from '@/lib/utils'
import { LucideTrash } from 'lucide-react'
import Image from 'next/image'
import List from '../List'

export const LowStocks = ({ products }: { products: productType[] }) => {
    const emptyLowStocks = (
        <div className='w-full h-full flex-center flex-col gap-2'>
            <LucideTrash className='w-8 h-8' />
            <span className='text-muted-foreground dark:text-white'>Empty List</span>
        </div>
    )
    const LowStockArray =
        <div className='w-full flex-start flex-row gap-4 flex-wrap'>
            {
                products.map(product => (
                    <div key={product.id} className='w-72 h-40 rounded-lg overflow-hidden border border-slate-200 flex-start flex-col gap-0'>
                        <div className='w-full h-28 overflow-hidden relative'>
                            <Image fill src={product.productImage} alt='' className="object-cover" />
                        </div>
                        <div className='w-full flex-start justify-between p-2 gap-1'>
                            <span className='font-bold text-sm'>
                                {cutLongString(product.productName, 23)}
                            </span>
                            <span className='text-sm'>
                                {product.quantityInStock}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>

    return (
        <List
            data={products}
            list={LowStockArray}
            emptyList={emptyLowStocks}
            title='Lowest Product Stock'
            subtitle='Product stock below reorder level'
            className='pb-8'
        />
    )
}
