import React, { useEffect, useState } from 'react'
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { DatePicker } from './ui/datePicker'
import { Button } from './ui/button'
import useCommonForm from '@/lib/useCommonForm';
import { pickDateForm } from '@/lib/formSchemaValidation';
import { fetcher } from '@/lib/utils';
import { z } from 'zod';
import { BsCalendar, BsCalendar2EventFill } from 'react-icons/bs';
import { BiCalendarEdit } from 'react-icons/bi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

function PickDateNoDialog({ reportsData }: { reportsData: (dat: any) => void }) {
    const defaultValue = { start: new Date(), end: new Date() };
    const [domLoaded, setdomLoaded] = useState<any>(false);
    const { form } = useCommonForm(pickDateForm, null, defaultValue, { useImperative: false, autoResetForm: false });
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: z.infer<typeof pickDateForm>) => {
        try {
            setLoading(true)
            const start = new Date(values.start.toLocaleDateString());
            const end = new Date(values.end.toLocaleDateString());
            const currentEndDate = end.getDate();
            end.setDate(currentEndDate + 1);

            const highestSaleProduct = await fetcher('/api/order/read/report/highest-sales-product', { start, end });
            const salesTrends = await fetcher('/api/order/read/report/sales-trends', { start, end }); // sales trends also have sales per date included
            const salesRevenue = await fetcher('/api/order/read/report/sales-revenue', { start, end });
            const salesCount = await fetcher('/api/order/read/report/sales-count', { start, end });

            const stockCount = await fetcher('/api/stock-in/read/report/stock-count', { start, end });
            const stockExpenses = await fetcher('/api/stock-in/read/report/stock-expenses', { start, end });
            const stockBuy = await fetcher('/api/stock-in/read/report/stocks', { start, end });

            const lowStockProducts = await fetcher('/api/product/read/low-stock-product', { start, end });

            reportsData({
                highestSaleProduct,
                salesRevenue,
                salesTrends,
                salesCount,
                stockCount,
                stockExpenses,
                stockBuy,
                lowStockProducts

            })

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    useEffect(() => {
        setdomLoaded(true);
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full lg:w-auto">
                <div className="w-full flex justify-center flex-col lg:flex-row items-end gap-6 overflow-auto custom-scrollbar px-0 lg:px-4 py-4">
                    <FormField
                        control={form.control}
                        name="start"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Start Date</FormLabel>
                                <DatePicker value={field.value} onChange={field.onChange} />
                                <FormMessage className="text-[0.65rem]" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>End Date</FormLabel>
                                <DatePicker value={field.value} onChange={field.onChange} />
                                <FormMessage className="text-[0.65rem]" />
                            </FormItem>
                        )}
                    />
                    {
                        domLoaded && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className='w-full lg:w-auto'>
                                        <Button type='submit' loading={loading} className='w-full h-11 lg:h-auto lg:w-auto'>
                                            <BiCalendarEdit className='text-2xl' />
                                            <span className='ml-4 flex lg:hidden'>Pick Date</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>Pick Date</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    }
                </div>
            </form>
        </Form>
    )
}

export default PickDateNoDialog