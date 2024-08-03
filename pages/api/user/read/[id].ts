import type { NextApiRequest, NextApiResponse } from "next";
import { handlerWithAuth, database } from "../../_base";

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;

    try {
        const user = await database.user.findUnique({
            where: {
                id: id as string
            },
            include: {
                role: {
                    include: {
                        rolePermissions: true
                    }
                }
            }
        }).catch(error => { throw new Error(error) });

        return res.status(200).send(user);

    } catch (error) {
        return res.status(500).send(error);
    }
})