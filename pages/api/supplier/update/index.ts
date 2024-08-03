import { NextApiRequest, NextApiResponse } from 'next';
import { handlerWithAuth, database, sessionType, roleType } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        id,
        contactEmail,
        contactName,
        contactPhone,
        supplierName,
    } = JSON.parse(req.body);

    if(!id || !contactEmail || !contactName || !contactPhone || !supplierName) return res.status(417).send({message: 'some field missings !!'});
    
    try {
            const supplier = await database.supplier.update({
                where: {
                    id
                },
                data: {
                    contactEmail,
                    contactName,
                    contactPhone,
                    supplierName,
                    updatedBy: session.user.name
                }
            }).catch(error => {throw new Error(error)});
    
            return res.status(200).send(supplier);

    } catch (error) {
        return res.status(500).send(error);
    }
})