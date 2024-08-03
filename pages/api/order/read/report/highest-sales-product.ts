import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { start, end } = JSON.parse(req.body);

    try {
        const orders = await database.orderDetail.groupBy({
            by: ['productId'],
            where: {
                order: {
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
            },
            _sum: {
                quantity: true
            }
        })

        const products = await database.product.findMany({
            where: {
                id: {
                    in: orders.map(order => order.productId)
                }
            },
            select: {
                id: true,
                productName: true
            }
        })

        const highestSalesProducts = orders.map(order => {
            for(let i = 0; i < products.length; i++) {
                if(products[i].id === order.productId) {
                    return {
                        product: products[i].productName,
                        totalSales: order._sum.quantity
                    }
                }
            }
        })

        return res.status(200).send(highestSalesProducts);

    } catch (error) {
        return res.status(500).send(error)
    }
})