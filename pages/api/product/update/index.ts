import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth, roleType } from '../../_base';
import type { sessionType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        id,
        description,
        productName,
        productImage,
        reorderLevel,
        unitPrice,
        categoryId,
        supplierId,
    } = JSON.parse(req.body);

    const CHK_FLD = !id || !description || !productName || !reorderLevel || !unitPrice || !categoryId || !supplierId;

    if (CHK_FLD) return res.status(417).send({ message: 'some field missings !!' });

    try {
            const product = await database.product.update({
                where: {
                    id: id
                },
                data: {
                    description,
                    productName,
                    productImage,
                    reorderLevel: parseInt(reorderLevel),
                    unitPrice: parseInt(unitPrice),
                    categoryId,
                    supplierId,
                    updatedBy: session?.user.name
                },
                include: {
                    category: true,
                    supplier: true
                }
            }).catch(error => { throw new Error(error) })
    
            return res.status(200).send(product)

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})