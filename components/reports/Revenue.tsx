import * as ca from '../ui/card'
import { salesTrendsType } from '@/lib/types'
import { useChartThemes, formatLongNumberToString, getMonthString, parseCurrency } from '@/lib/utils';
import ApexChart from '../ApexChart';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function Revenue({ trends, loading }: { trends: salesTrendsType, loading?: boolean }) {
    const [series, setSeries] = useState<any>(null);
    const [options, setOptions] = useState<any>(null);

    useChartThemes((chartTheme, chartBackgroud) => {
        const months = trends?.months?.map(month => new Date(month)) || [];
        const monthString = months.map(month => getMonthString(month.getMonth() + 1)) || [];

        setSeries([
            {
                name: "Total Revenue",
                data: trends?.revenueSales || []
            }
        ])

        setOptions({
            colors: ['#adfa1d'],
            chart: {
                background: chartBackgroud,
            },
            theme: {
                mode: chartTheme,
            },
            dataLabels: {
                enabled: true,
                formatter: (val: number) => {
                    return formatLongNumberToString(val)
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            xaxis: {
                categories: monthString,
                title: {
                    text: 'Month'
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            stroke: {
                curve: 'straight'
            },
            yaxis: {
                title: {
                    text: 'Revenue'
                },
                labels: {
                    formatter: (val: number) => {
                        return parseCurrency(val)
                    }
                }
            },
            responsive: [{
                breakpoint: 500,
                options: {
                    chart: {
                        width: '100%'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    yaxis: {
                        labels: {
                            formatter: (val: number) => {
                                return formatLongNumberToString(val, 0)
                            }
                        }
                    },
                    xaxis: {
                        categories: months.map(month => month.getMonth() + 1),
                        title: {
                            text: 'Month'
                        }
                    },
                }
            }]
        })
    }, [trends])

    return (
        <ca.Card className='w-full'>
            <ca.CardHeader>
                <ca.CardTitle className='flex justify-between'>
                    <p>Revenue</p>
                    {
                        loading && (
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        )
                    }
                </ca.CardTitle>
                <ca.CardDescription>
                    This Year Revenue
                </ca.CardDescription>
            </ca.CardHeader>
            <ca.CardContent className='px-0'>
                <ApexChart series={series} options={options} type="bar" height={500}  />
            </ca.CardContent>
        </ca.Card>
    )
}

export default Revenue