import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, percentageDifference, subtractDateByOneMonth } from '../../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { start, end } = JSON.parse(req.body);
    const startBeforeOneMonth = subtractDateByOneMonth(start);
    try {
        const salesBefore = await database.stockIn.aggregate({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: startBeforeOneMonth
                        }
                    },
                    {
                        createdAt: {
                            lt: start
                        }
                    }
                ]
            },
            _sum: {
                totalPrice: true
            }
        }).catch(error => {throw new Error(error)})

        const sales = await database.stockIn.aggregate({
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
            },
            _sum: {
                totalPrice: true
            }
        }).catch(error => { throw new Error(error) })

        return res.status(200).send({
            salesBefore,
            sales,
            one_month_before_percent_diff: percentageDifference(
                salesBefore._sum.totalPrice as number, 
                sales._sum.totalPrice as number
            )
        });

    } catch (error) {
        return res.status(500).send(error)
    }
})