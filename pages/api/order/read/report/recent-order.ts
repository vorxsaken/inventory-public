import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth} from '../../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const {start, end} = JSON.parse(req.body);

    try {
        const order = await database.order.findMany({
            where: {
                AND: [
                    {
                        orderDate: {
                            gte: start
                        }
                    },
                    {
                        orderDate: {
                            lte: end
                        }
                    }
                ]
            },
            take: 8
        }).catch(error => { throw new Error(error) })
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send(error)
    }
})