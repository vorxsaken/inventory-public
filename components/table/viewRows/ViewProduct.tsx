import { productType, categoryType, supplierType } from "@/lib/types"
import Image from "next/image"
import * as Di from "../../ui/dialog"
import { Label } from "../../ui/label"

function ViewProduct(props: productType<categoryType, supplierType>) {
    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle className="capitalize">
                    {props?.productName}
                </Di.DialogTitle>
            </Di.DialogHeader>
            <div className="h-[45vh] overflow-auto custom-scrollbar py-4">
                <div className="flex-start flex-col gap-6">
                    <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 relative overflow-hidden rounded-lg">
                        <Image src={props?.productImage} fill className="object-cover" alt="" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Product Name</Label>
                        <span className="text-start text-sm">
                            {`${props?.productName?.charAt(0).toUpperCase()}${props?.productName?.substring(1,)}`}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Description</Label>
                        <span className="text-start text-sm">
                            {`${props?.description?.charAt(0).toUpperCase()}${props?.description?.substring(1,)}`}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Per Unit Price</Label>
                        <span className="text-start text-sm">
                            Rp. {new Intl.NumberFormat('de-DE').format(parseInt(props?.unitPrice))}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Category</Label>
                        <span className="text-start text-sm">
                            {props?.category?.categoryName}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Supplier</Label>
                        <span className="text-start text-sm">
                            {props?.supplier?.supplierName}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Stock</Label>
                        <span className="text-start text-sm">
                            {props?.quantityInStock}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-gray-400 dark:text-slate-600">Reorder Level</Label>
                        <span className="text-start text-sm">
                            {props?.reorderLevel}
                        </span>
                    </div>
                </div>
            </div>
        </Di.DialogContent >
    )
}

export default ViewProduct