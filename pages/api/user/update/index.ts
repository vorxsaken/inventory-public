import type { NextApiRequest, NextApiResponse } from "next";
import { database, handlerWithAuth} from "../../_base";
import { userType } from "@/lib/types";
import CryptoJS from "crypto-js";

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const userBody = JSON.parse(req.body) as userType;

    if (!userBody.id || !userBody.email || !userBody.roleId || !userBody.username) {
        return res.status(417).send({ message: 'some field missings' })
    };

    try {
            const encryptedPassword = userBody.password && CryptoJS.AES.encrypt(userBody.password, process.env.SECRET as any).toString();
            const validUserField = {
                email: userBody.email,
                image: userBody.image,
                isAdmin: userBody.isAdmin,
                roleId: userBody.roleId,
                username: userBody.username,
            }

            const formattedUser = userBody.password ? {
                ...validUserField,
                password: encryptedPassword
            } : {
                ...validUserField
            }

            const user = await database.user.update({
                where: {
                    id: userBody.id
                },
                data: {
                    ...formattedUser as any
                },
                include: {
                    role: true
                }
            }).catch(error => { throw new Error(error) });

            return res.status(200).send(user);

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})