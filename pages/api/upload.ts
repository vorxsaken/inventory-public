import { NextApiResponse, NextApiRequest } from 'next';
import { IncomingForm } from 'formidable';
import { handlerWithAuth } from './_base';
var mv = require('mv')

export const config = {
    api: {
        bodyParser: false
    }
}

const uploadFiles = (req: NextApiRequest) => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            const filename = Date.now() + Math.sinh(Math.random() * 666) + `.${(files["file"] as any)[0].mimetype.split('/')[1]}`;
            const path = (files["file"] as any)[0].filepath;
            const destPath = `./public/uploads/${filename}`;
            mv(path, destPath, (err: any) => {
                return reject(err)
            })

            return resolve(filename)
        })
    })
}

export default handlerWithAuth(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        uploadFiles(req)
            .then(result => {
                return res.status(200).send({ filename: result });
            })
            .catch(err => {
                throw new Error(err)
            })
    } catch (error) {
        return res.status(500).send(error)
    }
}) 