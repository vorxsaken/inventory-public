import * as ca from '../ui/card'
import { salesTrendsType } from '@/lib/types'
import { getMonthString, useChartThemes } from '@/lib/utils';
import ApexChart from '../ApexChart';
import { useEffect, useState } from 'react';

function Trends({ trends }: { trends: salesTrendsType }) {
    const [series, setSeries] = useState<any>(null)
    const [options, setOptions] = useState<any>(null);

    useChartThemes((chartTheme, chartBackgroud) => {
        const months = trends?.months?.map(month => new Date(month)) || [];

        setSeries([
            {
                name: "Highest Sales",
                data: trends?.highestSales || []
            },
            {
                name: "Lowest Sales",
                data: trends?.lowestSales || []
            }
        ])

        setOptions({
            colors: ['#adfa1d', '#888888'],
            chart: {
                background: chartBackgroud
            },
            theme: {
                mode: chartTheme
            },
            dataLabels: {
                enabled: true,
            },
            xaxis: {
                categories: months.map(month => getMonthString(month.getMonth() + 1)) || [],
                title: {
                    text: 'Month'
                }
            },
            stroke: {
                curve: 'straight'
            },
            yaxis: {
                title: {
                    text: 'Sales (order) count'
                }
            },
        })
    }, [trends])

    return (
        <ca.Card className='w-full'>
            <ca.CardHeader>
                <ca.CardTitle>
                    Sales Trends
                </ca.CardTitle>
                <ca.CardDescription>
                    Orders counted per month
                </ca.CardDescription>
            </ca.CardHeader>
            <ca.CardContent>
                <ApexChart series={series} options={options} type="area" height={400} />
            </ca.CardContent>
        </ca.Card>
    )
}

export default Trends