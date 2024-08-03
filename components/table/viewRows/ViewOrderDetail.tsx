import { Label } from "@/components/ui/label"
import { orderDetailsType } from "@/lib/types"
import { parseCurrency } from "@/lib/utils"

function ViewOrderDetail({ index, ...props }: { index: number, } & orderDetailsType) {
    return (
        <div className={`flex-start flex-col gap-4 border border-slate-200 dark:border-slate-800 
        rounded-lg px-6 py-4 relative`}>
            <div className="w-6 h-6 absolute rounded-full border border-slate-300 dark:border-slate-700 
            -right-2 -top-2 flex-center text-[0.65rem] bg-gray-100 dark:bg-gray-900 font-bold text-black dark:text-white ">
                {index + 1}
            </div>
            <div className='flex flex-col gap-2'>
                <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">product</Label>
                <span className="text-start text-sm capitalize">{props?.product?.productName}</span>
            </div>
            <div className='flex flex-col gap-2'>
                <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">quantity</Label>
                <span className="text-start text-sm capitalize">{props?.quantity}</span>
            </div>
            <div className='flex flex-col gap-2'>
                <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">unit price</Label>
                <span className="text-start text-sm capitalize">Rp. {parseCurrency(props?.unitPrice as number)}</span>
            </div>
            <div className='flex flex-col gap-2'>
                <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">sub total</Label>
                <span className="text-start text-sm capitalize">Rp. {parseCurrency(props?.subTotal as number)}</span>
            </div>
        </div>
    )
}

export default ViewOrderDetail