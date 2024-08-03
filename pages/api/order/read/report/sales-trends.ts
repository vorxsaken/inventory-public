import { orderType } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../../_base';

const groupByOrderDate = (orders: orderType[]) => {
    let datesGroup: Date[] = [];
    let salesCountDate: number[];
    let totalAmountSum: number[];

    orders.forEach(order => {
        const orderDate = order.orderDate as Date
        if (!datesGroup.some(dateGroup => {
            return dateGroup.toLocaleDateString() === orderDate.toLocaleDateString();
        })) {
            datesGroup.push(orderDate);
        }
    })

    datesGroup = datesGroup.sort((a: any, b: any) => a - b);
    salesCountDate = Array(datesGroup.length).fill(0);
    totalAmountSum = Array(datesGroup.length).fill(0);

    for (let i = 0; i < datesGroup.length; i++) {
        orders.forEach(order => {
            const orderDate = order.orderDate as Date;
            if (orderDate.toLocaleDateString() === datesGroup[i].toLocaleDateString()) {
                salesCountDate[i] += 1;
                totalAmountSum[i] += order.totalAmount as number
            }
        })
    }

    return {
        datesGroup,
        salesCountDate,
        totalAmountSum
    }
}
const getSalesTrendsByMonth = (groupByOrderDate: { datesGroup: Date[], salesCountDate: number[], totalAmountSum: number[] }) => {
    const dateGroup = groupByOrderDate.datesGroup;
    const salesCountData = groupByOrderDate.salesCountDate;
    const totalAmountSumData = groupByOrderDate.totalAmountSum;

    let months: Date[] = [];
    let monthData: number[][];
    let monthRevenue : number[][];

    dateGroup.forEach(date => {
        if (!months.some(month =>
            `${month.getMonth()}-${month.getFullYear()}` ===
            `${date.getMonth()}-${date.getFullYear()}`
        )) {
            months.push(date)
        }
    })

    monthData = Array(months.length).fill([]);
    monthRevenue= Array(months.length).fill([]);
    
    for (let i = 0; i < dateGroup.length; i++) {
        for (let n = 0; n < months.length; n++) {
            if (
                `${months[n].getMonth()}-${months[n].getFullYear()}` ===
                `${dateGroup[i].getMonth()}-${dateGroup[i].getFullYear()}`
            ) {
                monthData[n] = monthData[n].concat(salesCountData[i]);
                monthRevenue[n] = monthRevenue[n].concat(totalAmountSumData[i])
            }
        }
    }

    return {
        months,
        monthData,
        highestSales: monthData.map(data => Math.max(...data)),
        lowestSales: monthData.map(data => data.length !== 1 ? Math.min(...data) : 0),
        revenueSales: monthRevenue.map(revenue => revenue.reduce((total, num) => total + num))
    }

}

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { start, end } = JSON.parse(req.body);
    
    try {
        const order = await database.order.findMany({
            where: {
                AND: [
                    {
                        orderDate: {
                            gte: start
                        }
                    },
                    {
                        orderDate: {
                            lte: end
                        }
                    }
                ]
            }
        }).catch(error => { throw new Error(error) })

        const sales = groupByOrderDate(order);
        const salesTrends = getSalesTrendsByMonth(sales);

        return res.status(200).send({sales, salesTrends});

    } catch (error) {
        return res.status(500).send(error)
    }
})