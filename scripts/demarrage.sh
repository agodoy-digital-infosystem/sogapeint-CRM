#!/bin/bash

LOG_FILE="/home/dis/v0/logs/install_logs"
mkdir -p /home/dis/v0/logs # Assure que le dossier de logs existe

# Fonction pour logger avec horodatage
log() {
    echo "$(date +"%Y-%m-%d %H:%M:%S") - $1"
    echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" >> $LOG_FILE
}

log "Début du script d'installation"

log "Arrêt des serveurs..."
/usr/bin/tmux kill-server

log "Installation et démarrage du backend..."
cd /home/dis/v0/sogapeint-CRM/backend/ && /root/.nvm/versions/node/v20.10.0/bin/npm i
/usr/bin/tmux new-session -d -s session-node
/usr/bin/tmux send-keys -t session-node "node server.js" C-m

log "Démarrage de la webhook..."
/usr/bin/tmux new-session -d -s webhook
/usr/bin/tmux send-keys -t webhook "node webhookServer.js" C-m

log "Installation et démarrage du frontend..."
cd /home/dis/v0/sogapeint-CRM/sogapeint-crm/
/usr/bin/tmux new-session -d -s session-angular
/usr/bin/tmux send-keys -t session-angular "yes N|/root/.nvm/versions/node/v20.10.0/bin/ng serve" C-m

log "Script terminé."