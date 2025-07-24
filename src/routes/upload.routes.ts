import express, { Request, Response } from 'express';
import { S3Client, PutObjectCommand,ObjectCannedACL  } from '@aws-sdk/client-s3';
import multer from 'multer';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

const app = express();

// Set up AWS credentials
const s3Client = new S3Client({
    region: 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY! ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define a route to handle file uploads
app.post('/', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file' });
        return
    }
    const fileStream = Readable.from(req.file.buffer);
    const key = randomUUID() + "-" + req.file.originalname

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: fileStream,
        ContentType: req.file.mimetype,
        ContentLength: req.file.size,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));

        res.status(200).send({filename: key});
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to upload file');
    }
});

export default app;