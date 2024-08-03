import { NextApiRequest, NextApiResponse } from 'next';
import { handlerWithAuth, database} from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
            const supplier = await database.supplier.findMany().catch(error => { throw new Error(error) })
            return res.status(200).send(supplier);

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
})