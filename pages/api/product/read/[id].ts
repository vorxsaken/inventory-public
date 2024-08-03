import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    try {
        const product = await database.product.findUnique({
            where: {
                id: id as string
            },
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