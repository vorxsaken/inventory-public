import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { roleName, rolePermission } = JSON.parse(req.body);

    if (!roleName || !rolePermission) {
        return res.status(417).send({ message: 'some field missing !!' });
    }

    try {
        const role = await database.role.create({
            data: {
                roleName,
                rolePermissions: {
                    create: rolePermission
                }
            },
            include: {
                rolePermissions: true
            }
        }).catch(err => { throw new Error(err) });

        return res.status(200).send(role);

    } catch (error) {
        return res.status(500).send(error);
    }
})