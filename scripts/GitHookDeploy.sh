#!/bin/bash

# Récupérer la branche en argument, utiliser 'dev' par défaut
BRANCH=${1:-dev}

# URL du dépôt Git
GIT_REPO_URL="https://github.com/agodoy-digital-infosystem/sogapeint-CRM.git"
REPO_PATH="../"

# Chemins
BACKEND_PATH="./backend"
ANGULAR_PATH="./sogapeint-CRM/sogapeint-crm"
SCRIPTS_PATH="./scripts"
LOG_FILE="../../../logs/codebase_update_log_$(date '+%Y-%m-%d %H:%M:%S').log"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Fonction pour logger avec horodatage et couleur dans le terminal
log() {
    # Écrire dans le fichier de log (sans couleur)
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $2" >> $LOG_FILE

    # Afficher dans le terminal avec couleur
    echo -e "${1}$2${NC}"
}

log $GREEN "Début de la mise à jour"

# Vérifier si fuser est installé
if ! command -v fuser &> /dev/null
then
    log $RED "fuser n'est pas installé. Installation en cours..."
    sudo apt-get update
    sudo apt-get install -y psmisc
    log $GREEN "fuser a été installé avec succès."
fi

# Arrêt des serveurs Node.js et Angular
log $YELLOW "Arrêt des serveurs"

# Tuer les processus écoutant sur le port 3000 (Node.js)
log $YELLOW "Arrêt du serveur Node.js sur le port 3000"
fuser -k 3000/tcp

# Tuer les processus écoutant sur le port 4200 (Angular)
log $YELLOW "Arrêt du serveur Angular sur le port 4200"
fuser -k 4200/tcp

# Backup du projet actuel en excluant les dossiers node_modules
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
cp /chemin/vers/.env $REPO_PATH

# Redémarrage des serveurs dans des sessions tmux distinctes
log $GREEN "Redémarrage du serveur Node.js"
tmux new-session -d -s session-node.js 'npm start'
log $GREEN "Redémarrage du serveur Angular"
tmux new-session -d -s session-angular 'ng serve'

# Retour au répertoire des scripts
cd $SCRIPTS_PATH

# Tests des serveurs
log $YELLOW "Test des serveurs"
# Ajouter ici les commandes pour tester les serveurs

log $GREEN "Mise à jour terminée"

# Ajouter ici des commandes pour notifier en cas d'échec ou de succès
