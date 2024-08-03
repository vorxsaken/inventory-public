import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth} from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        productImage,
        description,
        productName,
        reorderLevel,
        unitPrice,
        categoryId,
        supplierId,
    } = JSON.parse(req.body);

    const CHK_FLD = !description || !productName || !reorderLevel || !unitPrice || !categoryId || !supplierId || !productImage;

    if(CHK_FLD) return res.status(417).send({message: 'some field missings !!'});

    try {
            const product = await database.product.create({
                data: {
                    productImage,
                    description,
                    productName,
                    reorderLevel: parseInt(reorderLevel),
                    unitPrice: parseFloat(unitPrice),
                    categoryId,
                    supplierId,
                    createdBy: session?.user.name as string,
                    updatedBy: session?.user.name as string,
                },
                include: {
                    category: true,
                    supplier: true
                }
            }).catch(err => { throw new Error(err) });
    
            return res.status(200).send(product);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})