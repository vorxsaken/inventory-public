import { Label } from '@/components/ui/label'
import { supplierType } from '@/lib/types'
import * as Di from '../../ui/dialog'

const ViewSupplier = (props: supplierType) => {
    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle className="capitalize">
                    {props?.contactName}
                </Di.DialogTitle>
            </Di.DialogHeader>
            <div className="h-[45vh] overflow-auto custom-scrollbar py-4">
                <div className="flex-start flex-col gap-6">
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">supplier name</Label>
                        <span className="text-start text-sm capitalize">{props?.supplierName}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">address</Label>
                        <span className="text-start text-sm capitalize">{props?.address}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">contact email</Label>
                        <span className="text-start text-sm capitalize">{props?.contactEmail}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">contact phone</Label>
                        <span className="text-start text-sm capitalize">{props?.contactPhone}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label className="text-xs text-gray-400 dark:text-slate-600 capitalize">contact name</Label>
                        <span className="text-start text-sm capitalize">{props?.contactName}</span>
                    </div>
                </div>
            </div>
        </Di.DialogContent >
    )
}

export default ViewSupplier