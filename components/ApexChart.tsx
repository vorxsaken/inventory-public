import dynamic from 'next/dynamic'
import { useEffect, useState, ComponentProps } from 'react'
import apex from 'react-apexcharts'

function ApexChart(props: ComponentProps<typeof apex>) {

    const [Chart, setChart] = useState<any>()

    useEffect(() => {
        const getCharts = async () => {
            const chart = dynamic(() => import("react-apexcharts"))
            setChart(chart)
        }
        getCharts()
    }, [])

    return (
        <>
            {
                Chart && (
                    <Chart
                        {...props}
                    />
                )
            }
        </>
    )
}

export default ApexChart