import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType, sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const product = await database.product.findMany({
            include: {
                category: true,
                supplier: true
            }
        }).catch(error => { throw new Error(error) })
        return res.status(200).send(product);

    } catch (error) {
        return res.status(500).send(error)
    }
})