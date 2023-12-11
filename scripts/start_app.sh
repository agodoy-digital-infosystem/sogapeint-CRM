#!/bin/bash

# Variables
BACKEND_DIR="../backend/"
FRONTEND_DIR="../sogapeint-CRM/sogapaint-crm/"
PUBLIC_IP=$(curl -s ifconfig.me)
BACKEND_PORT=3000
FRONTEND_PORT=4200

# Fonction pour tuer les processus sur un port spécifié
kill_port_process() {
    lsof -i tcp:$1 | awk 'NR>1 {print $2}' | xargs -r kill
}

# Vérification de npm et node
command -v npm >/dev/null 2>&1 || { echo "npm n'est pas installé"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "node n'est pas installé"; exit 1; }

# Vérifier l'état d'UFW et ouvrir les ports si nécessaire
echo "Vérification de l'état d'UFW..."
if sudo ufw status | grep -q "Status: active"; then
    echo "UFW est actif. Vérification des ports..."
    sudo ufw allow $BACKEND_PORT
    sudo ufw allow $FRONTEND_PORT
fi

# Tuer les processus existants sur les ports
kill_port_process $BACKEND_PORT
kill_port_process $FRONTEND_PORT

# Installation des dépendances
cd $BACKEND_DIR && npm install
cd $FRONTEND_DIR && npm install --force

# Démarrage des serveurs
tmux new-session -d -s backend 'cd $BACKEND_DIR && pm2 start server.js'
tmux new-session -d -s frontend 'cd $FRONTEND_DIR && ng serve'

# Attente de démarrage des serveurs
sleep 10

# Test des serveurs
echo "Test du backend en local..."
curl -I http://localhost:$BACKEND_PORT

echo "Test du frontend en local..."
curl -I http://localhost:$FRONTEND_PORT

echo "Test du backend sur l'IP publique $PUBLIC_IP ..."
curl -I http://$PUBLIC_IP/api

echo "Test du frontend sur l'IP publique $PUBLIC_IP ..."
curl -I http://$PUBLIC_IP
