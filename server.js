const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const port = 80;

const WEBHOOK_SECRET = 'my-secret-webhook';

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    console.log('Webhook received'); 
    const sig = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex'), 'utf8');
    const checksum = Buffer.from(sig, 'utf8');

    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        console.log('Request body digest did not match x-hub-signature-256');
        res.status(403).send('Request body digest did not match x-hub-signature-256');
        return;
    }

    // Process the webhook payload
    const branch = req.body.ref.split('/').pop();
    console.log(`Received push event for branch: ${branch}`); 
    if (branch === 'main') {  
        console.log(`Processing push event for branch: ${branch}`);

        // Pull the latest code and build
        exec('git pull && npm install && npm run build', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
    }

    res.status(200).send('Webhook received');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
   
});
