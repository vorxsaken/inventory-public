import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, sessionType } from '../../_base';
import { orderDetailsType } from '@/lib/types';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const { id, productId, quantity, unitPrice, subTotal }: orderDetailsType = JSON.parse(req.body);

    if (!id || !productId || !quantity || !subTotal || !unitPrice) return res.status(417).send({ message: 'some field missings !!' });

    try {
            const orderDetail = await database.orderDetail.update({
                where: {
                    id: id
                },
                data: {
                    productId,
                    quantity: quantity as number,
                    subTotal: subTotal as number,
                    unitPrice: unitPrice as number,
                }
            }).catch(error => { throw new Error(error) })
    
            return res.status(200).send(orderDetail)

    } catch (error) {
        return res.status(500).send(error);
    }
})