#!/bin/bash

# ------------------------
# Fonction de logging
# ------------------------

# Récupérer la branche en argument, utiliser 'dev' par défaut
BRANCH=${1:-dev}

# URL et chemin du dépôt Git
GIT_REPO_URL="https://github.com/agodoy-digital-infosystem/sogapeint-CRM.git"
REPO_PATH="../"

# Chemins des différents composants du projet
BACKEND_PATH="./backend"
ANGULAR_PATH="./sogapeint-CRM/sogapeint-crm"
SCRIPTS_PATH="./scripts"
LOG_FILE="../../../logs/codebase_update_log_$(date '+%Y-%m-%d %H:%M:%S').log"
CONFIG_FILE_PATH='../../.env'
MONGO_URI="mongodb://localhost:27017/mongodb_sogapeint"

# Configuration des couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Configuration des ports
BACKEND_PORT='3000'
FRONTEND_PORT='4200'

# Récupération de l'adresse IP publique
PUBLIC_IP=$(curl -s ifconfig.me)

# Tableau pour stocker les messages d'erreur
declare -a ERROR_LOGS

# ------------------------
# Fonction de logging
# ------------------------

# Fonction pour logger avec horodatage et couleur dans le terminal
log() {
    # Écrire dans le fichier de log (sans couleur)
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $2" >> $LOG_FILE

    # Afficher dans le terminal avec couleur
    echo -e "${1}$2${NC}"
}

# Fonction pour ajouter des erreurs au journal d'erreurs
add_error() {
    ERROR_LOGS+=("$1")
}

log $GREEN "Début de la mise à jour"

# ------------------------
# Vérification des dépendances
# ------------------------

# Vérifier si fuser est installé
if ! command -v fuser &> /dev/null
then
    log $RED "fuser n'est pas installé. Installation en cours..."
    sudo apt-get update
    sudo apt-get install -y psmisc
    log $GREEN "fuser a été installé avec succès."
fi

# ------------------------
# Arrêt des serveurs
# ------------------------

log $YELLOW "Arrêt des serveurs"

# Tuer les processus écoutant sur le port 3000 (Node.js)
log $YELLOW "Arrêt du serveur Node.js sur le port 3000"
fuser -k 3000/tcp

# Tuer les processus écoutant sur le port 4200 (Angular)
log $YELLOW "Arrêt du serveur Angular sur le port 4200"
fuser -k 4200/tcp

# ------------------------
# Backup du projet
# ------------------------

log $YELLOW "Création du backup"
tar --exclude='*/node_modules/*' \
    --exclude='*.log' \
    --exclude='*/.git/*' \
    --exclude='*/dist/*' \
    --exclude='*/.cache/*' \
    --exclude='*/tmp/*' \
    --exclude='*.tmp' \
    --exclude='*.bak' \
    -czvf "backup_$(date '+%Y%m%d_%H%M%S').tar.gz" $BACKEND_PATH $ANGULAR_PATH

# ------------------------
# Mise à jour du projet
# ------------------------

# Mise à jour du projet depuis le dépôt Git
log $YELLOW "Mise à jour du projet depuis la branche $BRANCH"
if [ ! -d "$REPO_PATH" ]; then
    log $YELLOW "Clonage du dépôt"
    git clone $GIT_REPO_URL $REPO_PATH
fi
cd $REPO_PATH
git checkout $BRANCH
git pull origin $BRANCH

# Copie du fichier .env
log $YELLOW "Copie du fichier .env pour le projet"
cp $CONFIG_FILE_PATH $REPO_PATH


# ------------------------
# Redémarrage des serveurs
# ------------------------

# Démarrage du serveur Node.js dans une session tmux
tmux new-session -d -s session-node.js
tmux send-keys -t session-node.js "cd $BACKEND_PATH" C-m
tmux send-keys -t session-node.js "pm2 start server.js" C-m

# Démarrage du serveur Angular dans une autre session tmux
tmux new-session -d -s session-angular
tmux send-keys -t session-angular "cd $ANGULAR_PATH" C-m
tmux send-keys -t session-angular "ng serve" C-m

# Petite pause pour laisser le temps aux serveurs de démarrer et au développeur d'aller se faire un café
sleep 30

# Retour au répertoire des scripts
cd $SCRIPTS_PATH

# ------------------------
# Tests des serveurs
# ------------------------

# Tests des serveurs
log $YELLOW "Test des serveurs"

# Test du serveur backend en local
log $YELLOW "Test du serveur backend en local sur le port $BACKEND_PORT"
LOCAL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:$BACKEND_PORT/api/auth/login -d '{"email":"test@email.com", "password":"password"}' -H "Content-Type: application/json")

if [ "$LOCAL_RESPONSE" == "401" ]; then
    log $GREEN "Réponse attendue du serveur backend en local: HTTP $LOCAL_RESPONSE (Non autorisé)"
else
    log $RED "Réponse inattendue du serveur backend en local: HTTP $LOCAL_RESPONSE"
    add_error "Échec du test du serveur backend en local: HTTP $LOCAL_RESPONSE"
fi

# Test du serveur backend sur l'IP publique
log $YELLOW "Test du serveur backend sur l'IP publique $PUBLIC_IP sur le port $BACKEND_PORT"
PUBLIC_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://$PUBLIC_IP:$BACKEND_PORT/api/auth/login -d '{"email":"test@email.com", "password":"password"}' -H "Content-Type: application/json")

if [ "$PUBLIC_RESPONSE" == "401" ]; then
    log $GREEN "Réponse attendue du serveur backend sur IP publique: HTTP $PUBLIC_RESPONSE (Non autorisé)"
else
    log $RED "Réponse inattendue du serveur backend sur IP publique: HTTP $PUBLIC_RESPONSE"
    add_error "Échec du test du serveur backend sur IP publique: HTTP $PUBLIC_RESPONSE"
fi

# Test du serveur frontend en local
log $YELLOW "Test du serveur frontend en local sur le port $FRONTEND_PORT"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$FRONTEND_PORT | grep -q "200"; then
    log $GREEN "Réponse réussie du serveur frontend en local."
else
    log $RED "Échec de la connexion au serveur frontend en local."
    add_error "Échec de la connexion au serveur frontend en local."
fi

# Test du serveur frontend sur l'IP publique
log $YELLOW "Test du serveur frontend sur l'IP publique $PUBLIC_IP"
if curl -s -o /dev/null -w "%{http_code}" http://$PUBLIC_IP | grep -q "200"; then
    log $GREEN "Réponse réussie du serveur frontend sur IP publique."
else
    log $RED "Échec de la connexion au serveur frontend sur IP publique."
    add_error "Échec de la connexion au serveur frontend sur IP publique."
fi

# Test de la connexion à MongoDB
log $YELLOW "Test de la connexion à MongoDB"

if mongosh "$MONGO_URI" --eval "db.stats()" > /dev/null 2>&1; then
    log $GREEN "Connexion réussie à MongoDB."
else
    log $RED "Échec de la connexion à MongoDB."
    add_error "Échec de la connexion à MongoDB."
fi

# ------------------------
# Affichage des erreurs accumulées
# ------------------------

if [ ${#ERROR_LOGS[@]} -ne 0 ]; then
    log $RED "Des erreurs ont été rencontrées :"
    for error in "${ERROR_LOGS[@]}"; do
        log $RED "$error"
    done
else
    log $GREEN "Aucune erreur rencontrée."
fi

log $GREEN "Mise à jour terminée"