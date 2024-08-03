import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const role = await database.role.findMany({
            include: {
                rolePermissions: true
            }
        }).catch(error => { throw new Error(error) })
        return res.status(200).send(role);
    } catch (error) {
        return res.status(500).send(error)
    }
})