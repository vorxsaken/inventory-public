import { DatePicker } from "./ui/datePicker"
import { Button } from "./ui/button"
import * as Di from '../components/ui/dialog'
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import useCommonForm from "@/lib/useCommonForm"
import { pickDateForm } from "@/lib/formSchemaValidation"
import { z } from 'zod'
import { fetcher } from "@/lib/utils"

function PickDate({ reportsData }: { reportsData: (dat: any) => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const defaultValue = { start: new Date(), end: new Date() };
    const { form } = useCommonForm(pickDateForm, null, defaultValue, { useImperative: false });

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

    return (
        <Di.Dialog open={open} onOpenChange={setOpen}>
            <Di.DialogTrigger asChild>
                <Button className="w-28 lg:w-auto">Pick Date</Button>
            </Di.DialogTrigger>
            <Di.DialogContent>
                <Di.DialogHeader>
                    <Di.DialogTitle>
                        Pick Date
                    </Di.DialogTitle>
                    <Di.DialogDescription>
                        Fill the start and end field to get the reports
                    </Di.DialogDescription>
                </Di.DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="w-full flex-start flex-col gap-6 overflow-auto custom-scrollbar px-4 py-4">
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
                        </div>
                        <Di.DialogFooter>
                            <Button type='submit' className="capitalize" loading={loading}>
                                Pick Date
                            </Button>
                        </Di.DialogFooter>
                    </form>
                </Form>
            </Di.DialogContent>
        </Di.Dialog>
    )
}

export default PickDate