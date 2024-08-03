import * as ca from '../ui/card'
import { salesType, stockBuyType } from '@/lib/types'
import { getMonthString, parseDate, standartDate, useChartThemes } from '@/lib/utils';
import ApexChart from '../ApexChart';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

function SAndSBuy({ sales, stockBuy }: { sales: salesType, stockBuy: stockBuyType }) {
    const [seriesSales, setSeriesSales] = useState<any>(null)
    const [optionsSales, setOptionsSales] = useState<any>(null);
    const [seriesStockBuy, setSeriesStockBuy] = useState<any>(null)
    const [optionsStockBuy, setOptionsStockBuy] = useState<any>(null);

    useChartThemes((chartTheme, chartBackgroud) => {
        // const salesLength = sales?.datesGroup?.length || 0;
        // const stockBuyLength = stockBuy?.datesGroup?.length || 0;
        const salesDates = sales?.datesGroup?.map(dates => parseDate(dates.toString())) || []
        const stockBuyDates = stockBuy?.datesGroup?.map(dates => parseDate(dates.toString())) || [];
        // const range = (salesLength > 25 || stockBuyLength > 25) ? 18 : null

        setSeriesSales([{
            name: 'Sales',
            data: sales?.salesCountDate || []
        }])

        setOptionsSales({
            chart: {
                zoom: {
                    enabled: true
                },
                background: chartBackgroud
            },
            theme: {
                mode: chartTheme
            },
            colors: ['#adfa1d'],
            dataLabels: {
                enabled: true
            },
            stroke: {
                curve: 'smooth',
                colors: ["transparent"],
                width: 10
            },
            title: {
                text: 'Sales'
            },
            plotOptions: {
                bar: {
                    columnWidth: 70
                },
            },
            xaxis: {
                categories: salesDates,
                tickPlacement: 'on',
                min: 0,
                max: salesDates.length ? 18 : 0,
                // range: range,
                title: {
                    text: 'Dates'
                }
            },
        })

        setSeriesStockBuy([{
            name: 'Stock Buy',
            data: stockBuy?.stockBuyDate || []
        }])

        setOptionsStockBuy({
            chart: {
                zoom: {
                    enabled: true
                },
                background: chartBackgroud
            },
            theme: {
                mode: chartTheme
            },
            colors: ['#adfa1d'],
            dataLabels: {
                enabled: true
            },
            stroke: {
                curve: 'smooth',
                colors: ["transparent"],
                width: 10
            },
            plotOptions: {
                bar: {
                    columnWidth: 70
                },
            },
            title: {
                text: 'Stock Buy'
            },
            xaxis: {
                categories: stockBuyDates,
                tickPlacement: 'on',
                min: 1,
                max: stockBuyDates.length ? 20 : 0,
                // range: range,
                title: {
                    text: 'Dates'
                }
            },
        })

    }, [sales, stockBuy])

    return (
        <ca.Card className='w-full'>
            <ca.CardHeader>
                <ca.CardTitle>
                    Sales And Stock Buy
                </ca.CardTitle>
                <ca.CardDescription>
                    Sales and stock created per date
                </ca.CardDescription>
            </ca.CardHeader>
            <ca.CardContent>
                <ApexChart series={seriesSales} options={optionsSales} type="bar" height={400} />
                <ApexChart series={seriesStockBuy} options={optionsStockBuy} type="bar" height={400} />
            </ca.CardContent>
        </ca.Card>
    )
}

export default SAndSBuy