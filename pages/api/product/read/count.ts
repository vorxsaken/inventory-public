import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const product = await database.product.count().catch(error => { throw new Error(error) })
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send(error)
    }
})