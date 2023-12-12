const express = require('express');
const crypto = require('crypto');
const exec = require('child_process').exec;
require('dotenv').config();
const app = express();

app.use(express.json()); // pour analyser les requêtes JSON

const PORT = process.env.WEBHOOK_PORT; // Le port sur lequel le serveur webhook sera à l'écoute
const SECRET = process.env.WEBHOOK_SECRET;

const verifyGitHubSignature = (req) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return false;
    }
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(digest));
};

app.post('/webhook', (req, res) => {
    // Vérification pour s'assurer que la requête provient de la source attendue
    if (!verifyGitHubSignature(req)) {
        return res.status(401).send('Signature invalide');
    }

    // Exécuter le script de mise à jour
    exec(process.env.WEBHOOK_SCRIPT_PATH, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur d'exécution: ${error}`);
            return res.status(500).send(`Erreur d'exécution: ${error}`);
        }
        console.log(`Résultat: ${stdout}`);
        res.status(200).send('Webhook reçu et script exécuté');
    });
});

app.listen(PORT, () => {
    console.log(`Serveur webhook en écoute sur le port ${PORT}`);
});
