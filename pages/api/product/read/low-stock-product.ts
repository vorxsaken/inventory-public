import { productType } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const products = await database.product.findMany({});
        const productBelowReorderLevel = products.filter(product => {
            return product.quantityInStock < product.reorderLevel;
        })

        return res.status(200).send(productBelowReorderLevel);

    } catch (error) {
        return res.status(500).send(error)
    }
})