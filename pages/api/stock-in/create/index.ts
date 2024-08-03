import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth} from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        quantity,
        totalPrice,
        createdAt,
        productId,
    } = JSON.parse(req.body);

    if (!quantity || !totalPrice || !productId || !createdAt) return res.status(417).send({ message: 'some field missings !!' })

    try {
            const stockIn = await database.stockIn.create({
                data: {
                    quantity: quantity,
                    totalPrice,
                    productId,
                    createdAt,
                    createdBy: session?.user.name as string,
                    updatedBy: session?.user.name as string,
                },
                include: {
                    product: true
                }
            }).catch(err => { throw new Error(err) });
            
            await database.product.update({
                where: {
                    id: productId
                },
                data: {
                    quantityInStock: {
                        increment: quantity
                    }
                }
            })

            return res.status(200).send(stockIn);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})