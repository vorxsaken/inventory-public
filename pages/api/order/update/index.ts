import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';
import { orderType, orderDetailsType } from '@/lib/types';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        id,
        customerName,
        customerAddress,
        totalAmount,
        orderDate,
    }: orderType<orderDetailsType> = JSON.parse(req.body);

    const CHECK_FIELD = !id || !totalAmount || !orderDate;

    if(CHECK_FIELD) return res.status(417).send({message: 'some field missings !!'})

    try {
            const order = await database.order.update({
                where: {
                    id
                },
                data: {
                    customerName,
                    customerAddress,
                    totalAmount: totalAmount as number,
                    orderDate: orderDate as Date,
                    updatedBy: session?.user.name as string,
                }
            }).catch(error => { throw new Error(error) })
    
            return res.status(200).send(order);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})