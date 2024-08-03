import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth} from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        id,
        productId,
        quantity,
        totalPrice,
    } = JSON.parse(req.body);

    if(!id || !productId || !quantity || !totalPrice) return res.status(417).send({message: 'some field missings !!'});
    
    try {
            const stockIn = await database.stockIn.update({
                where: {
                    id: id
                },
                data: {
                    productId,
                    quantity,
                    totalPrice,
                    updatedBy: session?.user.name
                }
            }).catch(error => { throw new Error(error) })
    
            return res.status(200).send(stockIn)

    } catch (error) {
        return res.status(500).send(error);
    }
})