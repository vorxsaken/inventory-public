import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import useCommonForm from "@/lib/useCommonForm"
import { forwardRef } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { stockInSchema as formSchema } from "@/lib/formSchemaValidation";
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from "../ui/use-toast"
import { fetcher, parseNumber } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { categoryType, productType, stockInType } from "@/lib/types"
import { fetchProduct, resetProduct, selectAllProduct, updateProduct } from "@/store/reducers/productReducer"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/datePicker"
import { addStockIn, updateStockIn } from "@/store/reducers/stockinReducer"
import { dispatch } from "@/store"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"
import { getPermissions } from "@/store/reducers/authReducer"

const StockIn = forwardRef(({ defaultValue, edit }: { defaultValue?: categoryType, edit?: boolean }, ref) => {
    const { form } = useCommonForm(formSchema, ref as any, defaultValue && defaultValue);
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const workString = edit ? 'update' : 'add';
    const products = useSelector(state => selectAllProduct(state));
    const {permissions} = getPermissions()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setloading(true);
        let stockIn;

        try {
            if (!edit) {
                stockIn = await fetcher('/api/stock-in/create', { 
                    ...values,
                    quantity: parseInt(values.quantity), 
                    totalPrice: parseNumber(values.totalPrice.toString()) 
                }) as stockInType
                dispatch(addStockIn(stockIn));

                const product = await fetcher(`/api/product/read/${values.productId}`) as productType;
                dispatch(updateProduct({id: values.productId as string, changes: product}));
                
            } else {
                if (!permissions.editStock) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }

                stockIn = await fetcher('/api/stock-in/update', { id: defaultValue?.id, ...values }) as stockInType
                dispatch(updateStockIn({ id: defaultValue?.id as string, changes: stockIn }))
            }

            toast({
                description: `Successfully ${workString} stock in`
            })

        } catch (error) {
            toast({
                description: `Failed to ${workString} stock in`
            })
        }

        dispatch(fetchDashboards())
        setloading(false);

    }

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    Stock In
                </Di.DialogTitle>
                <Di.DialogDescription>
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name={'productId'}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Product</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                {field.value ? <SelectValue placeholder={'Select a product'} /> : `Select a product`}
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                <SelectGroup>
                                                    <SelectLabel>Products</SelectLabel>
                                                    {
                                                        products.map(item => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.productName}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input number placeholder="Enter quantity" {...field} {...form.register("quantity")} />
                                    </FormControl>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="createdAt"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-col gap-2">
                                    <FormLabel>Date</FormLabel>
                                    <DatePicker value={field.value} onChange={field.onChange} />
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalPrice"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Total Price</FormLabel>
                                    <FormControl>
                                        <Input number currency placeholder="Enter total price" {...field} {...form.register("totalPrice")} />
                                    </FormControl>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading} className="capitalize">
                            {workString} Stock
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

StockIn.displayName = 'StockIn';
export default StockIn