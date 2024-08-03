import { Label } from '@/components/ui/label'
import { orderDetailsType, orderType } from '@/lib/types'
import { parseCurrency, parseDate, standartDate } from '@/lib/utils'
import * as Di from '../../ui/dialog'
import ViewOrderDetail from './ViewOrderDetail'

const ViewOrder = (props: orderType<orderDetailsType[]>) => {
    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle className="capitalize">
                    {props.customerName}
                </Di.DialogTitle>
            </Di.DialogHeader>
            <div className="h-[55vh] overflow-auto custom-scrollbar py-4">
                <div className="flex-start flex-col gap-6">
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">customer name</Label>
                        <span className="text-start text-sm capitalize">{props.customerName}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">address</Label>
                        <span className="text-start text-sm capitalize">{props.customerAddress}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">order date</Label>
                        <span className="text-start text-sm capitalize">{standartDate(props.orderDate as string)}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">total amount</Label>
                        <span className="text-start text-sm capitalize">Rp. {parseCurrency(props.totalAmount as number)}</span>
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">order detail</Label>
                        <div className='flex flex-col justify-center gap-4 pr-4'>
                            {
                                props?.orderDetails?.map((orderDetail, index) => (
                                    <ViewOrderDetail
                                        {...orderDetail}
                                        index={index}
                                        key={index}
                                    />
                                ))
                            }
                        </div>
                    </div>

                </div>
            </div>
        </Di.DialogContent >
    )
}

export default ViewOrder