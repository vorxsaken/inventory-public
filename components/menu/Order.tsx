import * as Di from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import useCommonForm from "@/lib/useCommonForm"
import { forwardRef, useImperativeHandle } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { orderFormSchema as formSchema, editOrderFormSchema } from "@/lib/formSchemaValidation";
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from "../ui/use-toast"
import { fetcher, parseCurrency, parseNumber } from "@/lib/utils"
import { useSelector } from "react-redux"
import { dispatch } from "@/store"
import { orderDetailsType, orderType } from "@/lib/types"
import { Textarea } from "../ui/textarea"
import { DatePicker } from "../ui/datePicker"
import { useFieldArray } from "react-hook-form"
import { Plus, Trash2 as Trash, LucideTrash2 } from 'lucide-react'
import { Separator } from "../ui/separator"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { selectAllProduct, resetProduct, fetchProduct } from "@/store/reducers/productReducer"
import { addOrder, updateOrder } from "@/store/reducers/orderReducer"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"
import { getPermissions } from "@/store/reducers/authReducer"

const Order = forwardRef(({ defaultValue, edit }: { defaultValue?: orderType<orderDetailsType[]>, edit?: boolean }, ref) => {
    const { form, resetForm: reset } = useCommonForm(
        edit ? editOrderFormSchema : formSchema,
        ref as any,
        defaultValue && defaultValue,
        { useImperative: false }
    );
    const { control, getValues, watch, setValue } = form;
    const products = useSelector(state => selectAllProduct(state));
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'orderDetails'
    })
    const watchProductPrice = (index: number) => {
        const productId = watch(`orderDetails.${index}.productId`);
        const selected = products.find(product => product.id === productId);
        const unitPrice = parseCurrency(parseInt(selected?.unitPrice as string));
        setValue(`orderDetails.${index}.unitPrice`, isNaN(parseInt(unitPrice)) ? '0' : unitPrice)
        getSubtotal(index)
    };
    const getSubtotal = (index: number) => {
        const unitPrice = getValues(`orderDetails.${index}.unitPrice`) ? getValues(`orderDetails.${index}.unitPrice`) : '0';
        const quantity = getValues(`orderDetails.${index}.quantity`) ? getValues(`orderDetails.${index}.quantity`) : 0;
        const calc = parseNumber(unitPrice) * parseInt(quantity);
        const subTotal = isNaN(calc) ? 0 : calc;
        setValue(`orderDetails.${index}.subTotal`, parseCurrency(subTotal))
        getTotal();
    }
    const getTotal = () => {
        const subTotals = getValues('orderDetails') as orderDetailsType[];
        const getAllSubtotal = subTotals.map(subTotal => subTotal.subTotal).filter(num => typeof num !== 'undefined');
        const getTotal = getAllSubtotal.length ? getAllSubtotal.reduce((total, num) => parseNumber(total.toString()) + parseNumber(num.toString())) : 0;
        const nanValidation = typeof getTotal === 'string' ? parseNumber(getTotal) : getTotal;
        setValue('totalAmount', parseCurrency(nanValidation))
    }
    const [loading, setloading] = useState(false);
    const { toast } = useToast();
    const workString = edit ? 'update' : 'add';
    const { permissions } = getPermissions();

    const checkProductQuantity = (orderDetails: orderDetailsType[]) => {
        return new Promise((resolve, reject) => {
            orderDetails.forEach(orderDetail => {
                const selProduct = products.find(product => product.id === orderDetail.productId);
                if ((parseInt(selProduct?.quantityInStock as string) - (orderDetail.quantity as number)) < 0) {
                    return reject('The product quantity below can be ordered')
                }
            })

            return resolve(true)
        })
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        let order, remapOrderDetails, remapOrder;
        setloading(true);

        remapOrder = {
            ...values,
            totalAmount: parseNumber(values.totalAmount)
        }

        try {
            if (!edit) {
                await checkProductQuantity(values.orderDetails as any);
                remapOrderDetails = values.orderDetails.map(detail => {
                    return {
                        ...detail,
                        quantity: parseInt(detail.quantity.toString()),
                        unitPrice: parseNumber(detail.unitPrice),
                        subTotal: parseNumber(detail.subTotal)
                    }
                })

                remapOrder = {
                    ...values,
                    totalAmount: parseNumber(values.totalAmount),
                    orderDetails: remapOrderDetails
                }

                order = await fetcher('/api/order/create', { ...remapOrder }) as orderType<orderDetailsType[]>;

                dispatch(addOrder(order));
                dispatch(resetProduct());
                dispatch(fetchProduct());

            } else {
                if (!permissions.editOrder) {
                    toast({
                        variant: 'destructive',
                        description: `You have no authority to update this entity`
                    })

                    return
                }
                order = await fetcher('/api/order/update', { id: defaultValue?.id, ...remapOrder }) as orderType<orderDetailsType[]>;

                dispatch(updateOrder({ id: defaultValue?.id as string, changes: order }));
            }

            toast({
                description: `Successfully ${workString} order`
            })

        } catch (error) {
            toast({
                variant: "destructive",
                description: <div className="flex flex-col justify-start gap-2">
                    <span>{`Failed to ${workString} order`}</span>
                    <span>{`${error}`}</span>
                </div>
            })
        }

        dispatch(fetchDashboards())
        setloading(false);
        resetForm();
    }

    const resetForm = () => {
        setloading(false);
        reset();
        remove();
    }

    useImperativeHandle(ref, () => ({ resetForm }))

    return (
        <Di.DialogContent>
            <Di.DialogHeader>
                <Di.DialogTitle>
                    Order
                </Di.DialogTitle>
                <Di.DialogDescription>
                    All field need to be filled, otherwise nothing work
                </Di.DialogDescription>
            </Di.DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="w-full h-[65vh] flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{`Customer Name (optional)`}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Customer Name" {...field} {...form.register("customerName")} />
                                    </FormControl>
                                    <FormDescription>
                                        Example : john doe
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="customerAddress"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{`Customer Address (optional)`}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter customer address"
                                            className="resize-none"
                                            {...field}
                                            {...form.register("customerAddress")}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Example : John Doe street no.4
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="orderDate"
                            render={({ field }) => (
                                <FormItem className="w-full flex flex-col gap-2">
                                    <FormLabel>Order Date</FormLabel>
                                    <DatePicker value={field.value} onChange={field.onChange} />
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalAmount"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Total Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            {...form.register("totalAmount")}
                                            placeholder="Total Amount"
                                            disabled={true}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Example : john doe
                                    </FormDescription>
                                    <FormMessage className="text-[0.65rem]" />
                                </FormItem>
                            )}
                        />
                        {
                            !edit && (
                                <>
                                    <Separator />
                                    <div className="w-full flex-start flex-col gap-4">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="">Order Detail</span>
                                            <span className="text-xs text-slate-400 dark:text-slate-200 h-full flex items-end">
                                                {
                                                    getValues()?.orderDetails ? getValues()?.orderDetails.length : 0
                                                } field added
                                            </span>
                                        </div>
                                        <div className="w-full flex-center flex-col gap-2">
                                            <Button
                                                type="button"
                                                className="w-full gap-2"
                                                variant={"secondary"}
                                                onClick={() => { append({ quantity: 1 }, { shouldFocus: false }) }}
                                            >
                                                <Plus size={18} />
                                                Add
                                            </Button>
                                            <Button
                                                type="button"
                                                className="w-full gap-2"
                                                variant={"outline"}
                                                onClick={() => { remove() }}
                                            >
                                                <LucideTrash2 size={16} />
                                                Remove All
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-5">
                                        {
                                            fields.map((field, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex-start flex-col gap-4 border border-slate-200 dark:border-slate-800 
                                        rounded-lg px-6 py-4 relative`}
                                                >
                                                    <div className="w-6 h-6 absolute rounded-full border border-slate-300 dark:border-slate-700 
                                        -right-2 -top-2 flex-center text-[0.65rem] bg-gray-100 dark:bg-gray-900 font-bold text-black dark:text-white ">
                                                        {index + 1}
                                                    </div>
                                                    <FormField
                                                        key={field.id + '-producttId'}
                                                        control={form.control}
                                                        name={`orderDetails.${index}.productId`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Product</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={(e) => {
                                                                            field.onChange(e);
                                                                            watchProductPrice(index)
                                                                        }}
                                                                        value={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            {field.value ? <SelectValue placeholder="Select a product" /> : "Select a product"}
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>Products</SelectLabel>
                                                                                {
                                                                                    products.map(product => (
                                                                                        <SelectItem
                                                                                            key={product.id}
                                                                                            value={product.id}
                                                                                        >
                                                                                            {product.productName}
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
                                                        key={field.id + '-quantity'}
                                                        control={form.control}
                                                        name={`orderDetails.${index}.quantity`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Quantity</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                            getSubtotal(index);
                                                                        }}
                                                                        number
                                                                        placeholder="Enter quantity ..."
                                                                    />
                                                                </FormControl>
                                                                <FormMessage className="text-[0.65rem]" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        key={field.id + '-unitPrice'}
                                                        control={form.control}
                                                        name={`orderDetails.${index}.unitPrice`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Unit Price</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Unit Price"
                                                                        disabled
                                                                    />
                                                                </FormControl>
                                                                <FormMessage className="text-[0.65rem]" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        key={field.id + '-subTotal'}
                                                        control={form.control}
                                                        name={`orderDetails.${index}.subTotal`}
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <FormLabel>Sub total</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Sub total will spawn here"
                                                                        disabled
                                                                    />
                                                                </FormControl>
                                                                <FormMessage className="text-[0.65rem]" />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant={"destructive"}
                                                        className="w-full gap-2"
                                                        onClick={() => {
                                                            remove(index);
                                                            getTotal();
                                                        }}
                                                    >
                                                        <Trash size={16} />
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <Di.DialogFooter>
                        <Button type='submit' loading={loading} className="capitalize">
                            {workString} Order
                        </Button>
                    </Di.DialogFooter>
                </form>
            </Form>
        </Di.DialogContent>
    )
})

Order.displayName = 'Order';
export default Order