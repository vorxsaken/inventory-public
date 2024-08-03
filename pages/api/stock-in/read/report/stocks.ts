import { stockInType } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../../_base';

const groupByCreatedDate = (stockIn: stockInType[]) => {
    let datesGroup: Date[] = [];
    let stockBuyDate: number[];

    stockIn.forEach(stock => {
        const createdAt = stock.createdAt as Date
        if (!datesGroup.some(dateGroup => {
            return dateGroup.toLocaleDateString() === createdAt.toLocaleDateString();
        })) {
            datesGroup.push(createdAt);
        }
    })

    datesGroup = datesGroup.sort((a: any, b: any) => a - b);
    stockBuyDate = Array(datesGroup.length).fill(0);

    for (let i = 0; i < datesGroup.length; i++) {
        stockIn.forEach(stock => {
            const orderDate = stock.createdAt as Date;
            if (orderDate.toLocaleDateString() === datesGroup[i].toLocaleDateString()) {
                stockBuyDate[i] += 1
            }
        })
    }

    return {
        datesGroup,
        stockBuyDate
    }
}

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { start, end } = JSON.parse(req.body);
    
    try {
        const stocks = await database.stockIn.findMany({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: start
                        }
                    },
                    {
                        createdAt: {
                            lte: end
                        }
                    }
                ]
            }
        }).catch(error => { throw new Error(error) })

        return res.status(200).send(groupByCreatedDate(stocks as any));

    } catch (error) {
        return res.status(500).send(error)
    }
})