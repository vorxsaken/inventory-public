import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType, sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = JSON.parse(req.body);

    if (!id) return res.status(417).send({ message: 'some field missings !!' })

    try {
            const category = await database.category.delete({
                where: {
                    id
                }
            }).catch(error => { throw new Error(error) });
    
            return res.status(200).send(category)

    } catch (error) {
        return res.status(500).send(error);
    }
})