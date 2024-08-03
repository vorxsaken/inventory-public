import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, percentageDifference, subtractDateByOneMonth } from '../../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { start, end } = JSON.parse(req.body);
    const startBeforeOneMonth = subtractDateByOneMonth(start);
    try {
        const orderBefore = await database.order.aggregate({
            where: {
                AND: [
                    {
                        orderDate: {
                            gte: startBeforeOneMonth
                        }
                    },
                    {
                        orderDate: {
                            lt: start
                        }
                    }
                ]
            },
            _sum: {
                totalAmount: true
            }
        }).catch(error => {throw new Error(error)})

        const order = await database.order.aggregate({
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
            },
            _sum: {
                totalAmount: true
            }
        }).catch(error => { throw new Error(error) })

        return res.status(200).send({
            orderBefore,
            order,
            one_month_before_percent_diff: percentageDifference(
                orderBefore._sum.totalAmount as number, 
                order._sum.totalAmount as number
            )
        });

    } catch (error) {
        return res.status(500).send(error)
    }
})