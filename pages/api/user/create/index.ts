import { database, handlerWithAuth, sessionType } from "../../_base";
import type { NextApiRequest, NextApiResponse } from "next";
var CryptoJS = require('crypto-js');

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        email,
        image,
        password,
        username,
        isAdmin,
        roleId
    } = JSON.parse(req.body)

    try {
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();

            const user = await database.user.create({
                data: {
                    email,
                    image,
                    password: encryptedPassword,
                    username,
                    isAdmin,
                    roleId
                },
                include: {
                    role: true
                }
            }).catch(error => { throw new Error(error)})
    
            return res.status(200).send(user);

    } catch (error) {
        return res.status(500).send(error);
    }
})