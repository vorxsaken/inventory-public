import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType } from '../../_base';
import type { sessionType } from '../../_base';
import { orderDetailsType, orderType } from '@/lib/types';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        customerName,
        customerAddress,
        totalAmount,
        orderDate,
        orderDetails
    } = JSON.parse(req.body) as orderType<orderDetailsType[]>;

    if( !totalAmount || !orderDate || !orderDetails) return res.status(417).send({message: 'some field missings !!'});
    
    try {
            const order = await database.order.create({
                data: {
                    customerName,
                    customerAddress,
                    totalAmount: totalAmount as number,
                    orderDate: orderDate as Date,
                    orderDetails: {
                        create: orderDetails as any[]
                    },
                    createdBy: session?.user.name as string,
                    updatedBy: session?.user.name as string,
                },
                include: {
                    orderDetails: {
                        include: {
                            product: true
                        }
                    }
                }
            }).catch(err => { throw new Error(err) });
            
            orderDetails.forEach(async (orderdetail) => {
                await database.product.update({
                    where: {
                        id: orderdetail.productId
                    },
                    data: {
                        quantityInStock: {
                            decrement: orderdetail.quantity as number
                        }
                    }
                })
            })

            return res.status(200).send(order);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})