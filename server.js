import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

// Destructure the needed classes from the imported package
const { Client, MessageMedia } = pkg;

// Create a new client
const client = new Client();

// Generate QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// Listen for incoming messages
client.on('message', async msg => {
    console.log('Received a message:', msg.body);

    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        if (media) {
            // Save the image to the local file system
            const filePath = path.join('images', `${msg.id.id}.${media.mimetype.split('/')[1]}`);
            fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
            console.log(`Media saved to ${filePath}`);
        }
    }
});

// Initialize the client
client.initialize();
