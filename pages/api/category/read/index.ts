import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType, sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
            const category = await database.category.findMany().catch(error => { throw new Error(error) })
            return res.status(200).send(category);
        
    } catch (error) {
        return res.status(500).send(error)
    }
})