const express = require('express');
const crypto = require('crypto');
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const app = express();

app.use(express.json()); // pour analyser les requêtes JSON

const PORT = process.env.WEBHOOK_PORT; // Le port sur lequel le serveur webhook sera à l'écoute
const SECRET = process.env.WEBHOOK_SECRET;
const LOG_DIR = './logs'; // Dossier de logs
const LOG_FILE = path.join(LOG_DIR, 'webhook_log'); // Chemin complet du fichier de log

// Assurer que le dossier de logs existe
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Fonction de log
function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    // Écrire de manière asynchrone pour ne pas bloquer l'exécution
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error("Erreur lors de l'écriture du fichier de log", err);
    });
}

const verifyGitHubSignature = (req) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        logMessage("Requête reçue sans signature");
        return false;
    }
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    const isValid = crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(digest));
    logMessage(`Vérification de la signature : ${isValid ? 'réussie' : 'échouée'}`);
    return isValid;
};

app.post('/webhook', (req, res) => {
    logMessage("Requête POST /webhook reçue");
    
    // Vérification pour s'assurer que la requête provient de la source attendue
    if (!verifyGitHubSignature(req)) {
        logMessage("Signature invalide, accès refusé");
        return res.status(401).send('Signature invalide');
    }

    // Exécuter le script de mise à jour
    exec(process.env.WEBHOOK_SCRIPT_PATH, (error, stdout, stderr) => {
        if (error) {
            logMessage(`Erreur d'exécution: ${error}`);
            return res.status(500).send(`Erreur d'exécution: ${error}`);
        }
        logMessage(`Script exécuté. Sortie : ${stdout}`);
        res.status(200).send('Webhook reçu et script exécuté');
    });
});

app.listen(PORT, () => {
    logMessage(`Serveur webhook en écoute sur le port ${PORT}`);
});
