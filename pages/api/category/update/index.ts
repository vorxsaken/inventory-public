import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType } from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const { id, categoryName } = JSON.parse(req.body);

    if(!id || !categoryName) return res.status(417).send({message: 'some field missings !!'});
    
    try {
            const category = await database.category.update({
                where: {
                    id: id
                },
                data: {
                    categoryName: categoryName,
                    updatedBy: session?.user.name
                }
            }).catch(error => { throw new Error(error) })
    
            return res.status(200).send(category)

    } catch (error) {
        return res.status(500).send(error);
    }
})