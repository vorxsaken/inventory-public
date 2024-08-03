import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const stockIn = await database.stockIn.findMany({
            include: {
                product: true
            }
        }).catch(error => { throw new Error(error) })
        
        return res.status(200).send(stockIn);
        
    } catch (error) {
        return res.status(500).send(error)
    }
})