import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth} from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const { categoryName } = JSON.parse(req.body);
    
    if(!categoryName) return res.status(417).send({message: 'some field missings !!'});

    try {
            const category = await database.category.create({
                data: {
                    categoryName: categoryName,
                    createdBy: session?.user.name as string,
                    updatedBy: session?.user.name as string,
                }
            }).catch(err => { throw new Error(err) });
    
            return res.status(200).send(category);

    } catch (error) {
        return res.status(500).send(error);
    }
})
