import ChildLayout from '@/components/layouts/ChildLayout'
import Layout from '@/components/layouts/Layout'
import PickDate from '@/components/PickDate'
import { useEffect, useState } from 'react'
import Trends from '@/components/reports/Trends'
import SAndSBuy from '@/components/reports/SAndSBuy'
import { reportType } from '@/lib/types'
import { ReportCards } from '@/components/reports/ReportCards'
import { HighestSales } from '@/components/reports/HighestSales'
import { LowStocks } from '@/components/reports/LowStocks'
import { DatePicker } from '@/components/ui/datePicker'
import PickDateNoDialog from '@/components/PickDateNoDialog'

const Report = () => {
    const [reports, setReports] = useState<reportType>()
    const [cardReports, setCardReports] = useState<any[][]>();

    useEffect(() => {
        if (!reports) return;
        console.log(reports);
        const { stockCount, stockExpenses, salesCount, salesRevenue } = reports as reportType
        setCardReports([
            [stockCount.one_month_before_percent_diff, stockCount.sales, 'Stocks', false],
            [stockExpenses.one_month_before_percent_diff, stockExpenses.sales._sum.totalPrice, 'Expenses', true],
            [salesCount.one_month_before_percent_diff, salesCount.order, 'Sales', false],
            [salesRevenue.one_month_before_percent_diff, salesRevenue.order._sum.totalAmount, 'Revenue', true]
        ])
    }, [reports])

    return (
        <Layout title='Report'>
            <ChildLayout
                title='Report'
                description='View report of your inventory based on time input'
                sideButton={<PickDateNoDialog reportsData={(e) => setReports(e)} />}
            >
                <div className='w-full flex flex-col gap-4'>
                    <div className='flex-start gap-4 flex-wrap lg:flex-nowrap'>
                        {
                            [...Array(4)].map((i, index) => (
                                <ReportCards
                                    key={index}
                                    title={cardReports ? cardReports[index][2] : '...'}
                                    percent={cardReports ? cardReports[index][0] : 0}
                                    value={cardReports ? cardReports[index][1] : 0}
                                    isCurrency={cardReports ? cardReports[index][3] : false}
                                />
                            ))
                        }
                    </div>
                    <SAndSBuy
                        sales={reports?.salesTrends.sales as any}
                        stockBuy={reports?.stockBuy as any}
                    />
                    <div className="flex-start gap-2 flex-wrap lg:flex-nowrap">
                        <div className='w-full shrink'>
                            <Trends trends={reports?.salesTrends.salesTrends as any} />
                        </div>
                        <div className='w-full lg:w-[30%] shrink-0'>
                            <HighestSales products={reports?.highestSaleProduct as any || []} />
                        </div>
                    </div>
                    <LowStocks products={reports?.lowStockProducts as any || []} />
                </div>
            </ChildLayout>
        </Layout>
    )
}

export default Report