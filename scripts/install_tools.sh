#!/bin/bash

# Script d'installation et de configuration d'un serveur web
# Ce script automatise l'installation et la configuration d'un ensemble de logiciels essentiels pour un serveur web, y compris Node.js, npm, PM2, MongoDB, Angular CLI, Tmux et Nginx. Il est conçu pour garantir que toutes les installations sont à jour et configurées correctement pour un environnement de production ou de développement.
# Le script comprend également des vérifications et des journaux détaillés pour faciliter le suivi des installations et des configurations.
# Réalisé par Adrien Godoy de Digital Info System.

# Validation de l'environnement d'exécution
if [ "$(id -u)" != "0" ]; then
    echo "Ce script doit être exécuté en tant que root."
    exit 1
fi

# Vérification des outils nécessaires
command -v curl &> /dev/null || { apt-get update; apt-get install -y curl; }
command -v wget &> /dev/null || { apt-get update; apt-get install -y wget; }

# Définition des versions des logiciels et URLs
NODE_VERSION="20.10.0"
NPM_VERSION="10.2.3"
PM2_VERSION="5.3.0"
MONGODB_VERSION="3.6.8"
ANGULAR_CLI_VERSION="17.0.5"
TMUX_VERSION="2.9a"
NGINX_VERSION="1.18.0"
NVM_INSTALL_URL="https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh"
MONGODB_REPO_URL="http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/3.6 multiverse"
MONGODB_GPG_KEY_URL="https://www.mongodb.org/static/pgp/server-3.6.asc"
MONGODB_SOURCES_LIST="/etc/apt/sources.list.d/mongodb-org-3.6.list"
NGINX_CONFIG_FILE="/etc/nginx/sites-available/sogapeint.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/"
BACKEND_PORT="3000"
FRONTEND_PORT="4200"

# Définir le fichier de log
LOG_FILE="installation_log_$(date +'%Y%m%d_%H%M%S').log"
exec > >(tee -a $LOG_FILE) 2>&1


#########################
# Fonctions utilitaires #
#########################

# Fonction log_message
# Cette fonction est utilisée pour écrire des messages de log formatés.
# Arguments :
#   - $1 : Message à logger.
# Fonctionnement :
#   - Utilise `echo` pour afficher le message, précédé d'un horodatage.
#   - Les messages sont formatés avec un horodatage pour faciliter le suivi temporel dans les logs.
#   - Chaque appel à cette fonction écrit un message dans le fichier de log et l'affiche également dans le terminal.
log_message() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# check_installation
# Vérifie si un logiciel spécifique est installé et si sa version est à jour.
# Arguments :
#   - software : nom du logiciel à vérifier.
#   - required_version : la version requise du logiciel.
# Comportement :
#   - Extrait la version actuellement installée du logiciel.
#   - Compare la version installée avec la version requise.
#   - Affiche un message indiquant si le logiciel est installé et si sa version est à jour.
# Valeurs de retour :
#   - 0 : si le logiciel est installé et à jour.
#   - 1 : si le logiciel est installé mais pas à la version requise.
#   - 2 : si le logiciel n'est pas installé.
check_installation() {
    local software=$1
    local required_version=$2
    local installed_version

    installed_version=$($software --version 2>&1 | head -n1 | grep -oE '[0-9]+(\.[0-9]+)+')
    if [ $? -eq 0 ]; then
        log_message "$software installé, version actuelle: $installed_version"
        if [ "$installed_version" = "$required_version" ]; then
            log_message "$software est à jour."
            return 0
        else
            log_message "$software n'est pas à la version requise, mise à jour nécessaire."
            return 1
        fi
    else
        log_message "$software n'est pas installé."
        return 2
    fi
}

# install_software
# Installe ou met à jour un logiciel en fonction de la nécessité.
# Arguments :
#   - software_name : nom lisible du logiciel (utilisé pour les messages de log).
#   - install_command : commande pour installer le logiciel.
#   - update_command : commande pour mettre à jour le logiciel.
#   - install_needed : indicateur numérique de l'action requise (0: rien, 1: installer, 2: mettre à jour).
# Comportement :
#   - Exécute la commande appropriée (installation ou mise à jour) en fonction de l'indicateur.
#   - Affiche des messages de log pour indiquer l'état de l'installation/mise à jour.
#   - Arrête le script en cas d'échec de l'installation/mise à jour.
install_software() {
    local software_name=$1
    local install_command=$2
    local update_command=$3
    local install_needed=$4

    log_message "Vérification de $software_name..."
    if [ "$install_needed" -eq 1 ]; then
        if eval "$install_command"; then
            log_message "$software_name installé avec succès."
        else
            log_message "Échec de l'installation de $software_name. Vérifiez votre connexion Internet ou la configuration de votre système."
            exit 1
        fi
    elif [ "$install_needed" -eq 2 ]; then
        if eval "$update_command"; then
            log_message "$software_name mis à jour avec succès."
        else
            log_message "Échec de la mise à jour de $software_name. Vérifiez votre connexion Internet ou la configuration de votre système."
            exit 1
        fi
    fi
}

#######################################################

log_message "Début du script d'installation"

########################################################
# Installation des logiciels                           #
# Node.js, npm, PM2, MongoDB, Angular CLI, Tmux, Nginx #
########################################################

# Installation de Node.js
check_installation "node" $NODE_VERSION
node_status=$?
install_software "Node.js" "curl -o- $NVM_INSTALL_URL | bash && (source ~/.bashrc || source ~/.nvm/nvm.sh) && nvm install $NODE_VERSION && nvm use $NODE_VERSION" "nvm install $NODE_VERSION && nvm use $NODE_VERSION" $node_status

# Installation de npm
check_installation "npm" $NPM_VERSION
npm_status=$?
install_software "npm" "npm install -g npm@$NPM_VERSION" "npm install -g npm@$NPM_VERSION" $npm_status

# Installation de PM2
check_installation "pm2" $PM2_VERSION
pm2_status=$?
install_software "PM2" "npm install pm2@$PM2_VERSION -g" "npm install pm2@$PM2_VERSION -g" $pm2_status

# Installation de MongoDB
check_installation "mongod" $MONGODB_VERSION
mongodb_status=$?
if [ $mongodb_status -ne 0 ]; then
    if [ $MONGODB_VERSION = "3.6.8" ]; then
        install_command="wget -qO - $MONGODB_GPG_KEY_URL | sudo apt-key add - && echo 'deb [ arch=amd64,arm64 ] $MONGODB_REPO_URL' | sudo tee $MONGODB_SOURCES_LIST && sudo apt-get update && sudo apt-get install -y mongodb-org=$MONGODB_VERSION mongodb-org-server=$MONGODB_VERSION mongodb-org-shell=$MONGODB_VERSION mongodb-org-mongos=$MONGODB_VERSION mongodb-org-tools=$MONGODB_VERSION"
        install_software "MongoDB" "$install_command" "$install_command" 1
    else
        log_message "Version non prise en charge de MongoDB. Installation annulée."
        exit 1
    fi
fi

# Installation de Angular CLI
check_installation "ng" $ANGULAR_CLI_VERSION
angular_cli_status=$?
install_software "Angular CLI" "npm install -g @angular/cli@$ANGULAR_CLI_VERSION" "npm install -g @angular/cli@$ANGULAR_CLI_VERSION" $angular_cli_status

# Installation de Tmux
check_installation "tmux" $TMUX_VERSION
tmux_status=$?
install_software "Tmux" "sudo apt install tmux" "sudo apt install tmux" $tmux_status

# Installation de Nginx
check_installation "nginx" $NGINX_VERSION
nginx_status=$?
install_software "Nginx" "sudo apt install nginx" "sudo apt install nginx" $nginx_status


# Configuration de nginx
PUBLIC_IP=$(curl -s ifconfig.me) # Obtention de l'IP publique
sudo touch $NGINX_CONFIG_FILE
echo "server {
    listen 80;
    server_name $PUBLIC_IP;

    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}" | sudo tee $CONFIG_FILE

# Activer la configuration nginx
sudo ln -s $NGINX_CONFIG_FILE $NGINX_ENABLED
sudo nginx -t
sudo systemctl restart nginx

# Vérification et ouverture du port 3000 avec UFW
sudo ufw status | grep "$BACKEND_PORT" || sudo ufw allow "$BACKEND_PORT/tcp"
sudo ufw reload

log_message "Fin du script d'installation"
