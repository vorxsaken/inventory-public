import type { NextApiRequest, NextApiResponse } from "next";
import { handlerWithAuth, database} from "../../_base";

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {

    try {
            const users = await database.user.findMany({
                include: {
                    role: true
                }
            }).catch(error => { throw error })

            return res.status(200).send(users);

    } catch (error) {
        return res.status(500).send(error);
    }
})