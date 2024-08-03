import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType, sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const order = await database.order.count().catch(error => { throw new Error(error) })
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send(error)
    }
})