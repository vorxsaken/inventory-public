import { database } from "../../_base";
import type { NextApiRequest, NextApiResponse } from "next";
const CryptoJS = require('crypto-js');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body;

    const user = await database.user.findUnique({
        where: {
            username: username
        },
        include: {
            role: {
                include: {
                    rolePermissions: true
                }
            }
        }
    });

    if (!user) {
        return res.status(401).send({ ok: false });
    }

    const decrypt = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
    const originaltext = decrypt.toString(CryptoJS.enc.Utf8);
    const comparePassword = password === originaltext;

    if(comparePassword) {
        return res.status(200).send({...user, ok: true});
    };

    return res.status(401).send({ ok: false });
}