#!/bin/bash

# Remplacez ceci par le payload que vous envoyez
payload='{"test": "payload"}'
# Remplacez ceci par votre clé secrète
secret='dc654scdLKJ!46$OUZCBk978SSNOxSs'
# Création de la signature
signature=$(echo -n "$payload" | openssl dgst -sha256 -hmac "$secret" | sed 's/^.* //')

# Envoi de la requête avec la signature
curl -X POST http://46.105.52.105/webhook \
     -H "Content-Type: application/json" \
     -H "X-Hub-Signature-256: sha256=$signature" \
     -d "$payload"
