import { NextApiRequest, NextApiResponse } from 'next';
import { database, handlerWithAuth } from '../../_base';

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, roleName, rolePermission } = JSON.parse(req.body);

    if(!id || !roleName || !rolePermission) return res.status(417).send({message: 'some field missings !!'});
    
    try {
        const { id: restId, roleId, ...restPermission} = rolePermission;

        const role = await database.role.update({
            where: {
                id: id
            },
            data: {
                roleName,
                rolePermissions: {
                    update: {
                        data: {
                            ...restPermission
                        }
                    }
                }
            },
            include: {
                rolePermissions: true
            }
        }).catch(error => { throw new Error(error) })

        // await database.rolePermission.create({
        //     data: {
        //         ...rolePermission,
        //         roleid: role.id
        //     }
        // }).catch(error => { throw new Error(error) })

        // const compleateRole = await database.role.findUnique({
        //     where: {
        //         id
        //     },
        //     include: {
        //         rolePermissions: true
        //     }
        // }).catch(error => { throw new Error(error) })

        return res.status(200).send(role)

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})