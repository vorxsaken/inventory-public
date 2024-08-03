import { NextApiRequest, NextApiResponse } from 'next';
import { handlerWithAuth, database, sessionType} from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse, session: sessionType) => {
    const {
        supplierName,
        contactName,
        contactEmail,
        contactPhone,
        address
    } = JSON.parse(req.body);

    if(!supplierName || !contactEmail || !contactName || !contactPhone || !address) return res.status(417).send({message: 'some field missings !!'});
    
    try {
            const supplier = await database.supplier.create({
                data: {
                    supplierName,
                    contactName,
                    contactEmail,
                    contactPhone,
                    address,
                    createdBy: session.user.name,
                    updatedBy: session.user.name
                }
            }).catch(error => {throw new Error(error)});
    
            return res.status(200).send(supplier);
        
    } catch (error) {
        return res.status(500).send(error);
    }
})