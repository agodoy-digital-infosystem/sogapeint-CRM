#!/bin/bash

# Script d'installation et de configuration des logiciels nécessaires à l'appli web sogapeint
# Ce script automatise l'installation et la configuration d'un ensemble de logiciels essentiels pour l'appli web sogapeint, y compris Node.js, npm, PM2, MongoDB, Angular CLI, Tmux et Nginx. Il est conçu pour garantir que toutes les installations sont à jour et configurées correctement pour un environnement de production ou de développement.
# Le script comprend également des vérifications et des journaux détaillés pour faciliter le suivi des installations et des configurations.
# Réalisé par Adrien Godoy de Digital Info System.

# Validation de l'environnement d'exécution
if [ "$(id -u)" != "0" ]; then
    echo "Ce script doit être exécuté en tant que root."
    exit 1
fi

# Configuration du comportement du script
# - par défaut, le script s'arrête s'il y a une erreur
# - si le script est lancé avec le flag --continue-on-error, alors le script continue meme en cas d'échecs lors des installations
CONTINUE_ON_ERROR=false

# Vérifie si le flag --continue-on-error est présent
for arg in "$@"
do
    if [ "$arg" == "--continue-on-error" ] || [ "$arg" == "-c" ]; then
        CONTINUE_ON_ERROR=true
        break
    fi
done

# Initialisation de la liste des erreurs
declare -a errors

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
# Cette fonction est utilisée pour écrire et afficher des messages de log formatés avec prise en charge des couleurs dans le terminal.
# Arguments :
#   - $1 : Type de message (SUCCESS, ERROR, WARNING, INFO ou autre pour un message normal).
#   - $2 : Message à logger.
# Fonctionnement :
#   - Utilise `echo -e` pour afficher le message avec prise en charge des séquences d'échappement (pour les couleurs).
#   - Les messages sont précédés d'un horodatage pour faciliter le suivi temporel dans les logs.
#   - Les messages de type ERROR sont affichés en rouge, ceux de type SUCCESS en vert, ceux de type WARNING en jaune, et ceux de type INFO en bleu. Les messages sans type spécifique sont affichés sans couleur.
#   - Les messages sont écrits dans le fichier de log sans les codes de couleur ANSI pour une meilleure lisibilité.
#   - Les messages d'erreur (ERROR) sont également redirigés vers la sortie d'erreur standard (stderr).

log_message() {
    local message_type=$1
    local message=$2

    # Définition des codes de couleur
    local RED='\033[0;31m'
    local GREEN='\033[0;32m'
    local YELLOW='\033[0;33m'
    local BLUE='\033[0;34m'
    local NC='\033[0m' # Pas de couleur

    # Horodatage
    local timestamp="[$(date +'%Y-%m-%d %H:%M:%S')]"

    # Sélection de la couleur en fonction du type de message
    case $message_type in
        ERROR)
            echo -e "${RED}${timestamp} ${message}${NC}" | tee -a $LOG_FILE >&2
            errors+=("$message")
            ;;
        SUCCESS)
            echo -e "${GREEN}${timestamp} ${message}${NC}" | tee -a $LOG_FILE
            ;;
        WARNING)
            echo -e "${YELLOW}${timestamp} ${message}${NC}" | tee -a $LOG_FILE
            ;;
        INFO)
            echo -e "${BLUE}${timestamp} ${message}${NC}" | tee -a $LOG_FILE
            ;;
        *)
            echo "${timestamp} ${message}" | tee -a $LOG_FILE
            ;;
    esac
}



# draw_line
# trace une ligne
draw_line() {
    local cols=$(tput cols)
    printf '%*s\n' "${cols}" '' | tr ' ' '-'
}



# check_installation
# Vérifie si un logiciel spécifique est installé et si sa version est à jour ou recommande une mise à jour si la version requise n'est pas spécifiée.
# Arguments :
#   - software : nom du logiciel à vérifier.
#   - required_version : la version requise du logiciel. Si "non spécifié", toute version installée sera acceptable, mais une mise à jour est recommandée.
# Comportement :
#   - Extrait la version actuellement installée du logiciel.
#   - Compare la version installée avec la version requise, ou vérifie simplement la présence du logiciel si "non spécifié".
#   - Affiche un message indiquant si le logiciel est installé et si sa version est à jour ou recommande une mise à jour si la version requise est "non spécifié".
# Valeurs de retour :
#   - 0 : si le logiciel est installé et à jour ou si "non spécifié" et le logiciel est installé.
#   - 1 : si le logiciel est installé mais pas à la version requise ou si "non spécifié" et une mise à jour est recommandée.
#   - 2 : si le logiciel n'est pas installé.
check_installation() {
    local software=$1
    local required_version=$2
    local version_command=${3:-"$software --version"}
    local installed_version

    installed_version=$($version_command 2>&1 | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -1)
    installed_version=${installed_version#v}  # Supprimer 'v' si présent
    installed_version=${installed_version%% *}  # Supprimer tout après un espace

    if [ -n "$installed_version" ]; then
        if [ "$required_version" = "non spécifié" ]; then
            log_message "SUCCESS" "$software est installé."
            return 0
        elif [ "$installed_version" = "$required_version" ]; then
            log_message "SUCCESS" "$software est à jour."
            return 0
        else
            log_message "WARNING" "$software n'est pas à la version requise ($required_version), version actuelle: $installed_version"
            return 1
        fi
    else
        log_message "ERROR" "$software n'est pas installé."
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

    log_message "INFO" "Vérification de $software_name..."
    if [ "$install_needed" -eq 1 ]; then
        if eval "$install_command"; then
            log_message SUCCESS "$software_name installé avec succès."
        else
            log_message ERROR "Échec de l'installation de $software_name. Vérifiez votre connexion Internet ou la configuration de votre système."
            if [ "$CONTINUE_ON_ERROR" = false ]; then
                exit 1
            fi
        fi
    elif [ "$install_needed" -eq 2 ]; then
        if eval "$update_command"; then
            log_message SUCCESS "$software_name mis à jour avec succès."
        else
            log_message ERROR "Échec de la mise à jour de $software_name. Vérifiez votre connexion Internet ou la configuration de votre système."
            if [ "$CONTINUE_ON_ERROR" = false ]; then
                exit 1
            fi
        fi
    fi
}

# Fonction pour vérifier et logger les versions
check_and_log_version() {
    local software=$1
    local expected_version=$2
    local installed_version=$3

    local YELLOW='\033[0;33m'
    local GREEN='\033[0;32m'
    local RED='\033[0;31m'
    local NC='\033[0m' # Pas de couleur

    # Normalise les versions en supprimant les 'v' au début et en ignorant les suffixes après la version
    local normalized_installed_version=$(echo $installed_version | sed -e 's/^v//' -e 's/ .*$//')
    local normalized_expected_version=$(echo $expected_version | sed 's/^v//')

    if [ "$normalized_installed_version" == "not_installed" ]; then
        echo -e "${RED}${software} n'est pas installé${NC}"
    elif [ "$normalized_expected_version" == "non spécifié" ]; then
        echo -e "${GREEN}${software} version ${installed_version} (version spécifique non requise)${NC}"
    elif [ "$normalized_installed_version" == "$normalized_expected_version" ]; then
        echo -e "${GREEN}${software} version ${installed_version} (comme attendu)${NC}"
    else
        echo -e "${YELLOW}${software} version ${installed_version} (attendu ${expected_version})${NC}"
    fi
}



# display_errors
# Affiche la liste des erreurs rencontrées
display_errors() {
    if [ ${#errors[@]} -ne 0 ]; then
        echo "Erreurs rencontrées durant l'installation :"
        for error in "${errors[@]}"; do
            echo "- $error"
        done
    fi
}



# print_logo
# affiche le logo Digital Info System
print_logo() {
    # Couleurs ANSI
    local RED='\033[0;31m'
    local YELLOW='\033[0;33m'
    local GREEN='\033[0;32m'
    local BLUE='\033[0;34m'
    local PURPLE='\033[0;35m'
    local NC='\033[0m' # Pas de couleur

    # ASCII Art "Digital Info System"
    echo -e "${RED}______ _       _ _        _   _____       __        _____           _                 ${NC}"
    echo -e "${YELLOW}|  _  (_)     (_) |      | | |_   _|     / _|      /  ___|         | |                ${NC}"
    echo -e "${GREEN}| | | |_  __ _ _| |_ __ _| |   | | _ __ | |_ ___   \\ \`--. _   _ ___| |_ ___ _ __ ___  ${NC}"
    echo -e "${BLUE}| | | | |/ _\` | | __/ _\` | |   | || '_ \\|  _/ _ \\   \`--. \\ | | / __| __/ _ \\ '_ \` _ \\ ${NC}"
    echo -e "${PURPLE}| |/ /| | (_| | | || (_| | |  _| || | | | || (_) | /\\__/ / |_| \\__ \\ ||  __/ | | | | |${NC}"
    echo -e "${RED}|___/ |_|\\__, |_|\\__\\__,_|_|  \\___/_| |_|_| \\___/  \\____/ \\__, |___/\\__\\___|_| |_| |_|${NC}"
    echo -e "${YELLOW}          __/ |                                            __/ |                      ${NC}"
    echo -e "${GREEN}         |___/                                            |___/                       ${NC}"
}

# Fonction pour afficher l'émoticône ASCII en cas de succès total
display_success_emoticon() {
    local GREEN='\033[0;32m'
    local NC='\033[0m' # Pas de couleur

    echo -e "${GREEN}"
    echo "░░░░░░░░░░░░░░░░░░░░░░█████████"
    echo "░░███████░░░░░░░░░░███▒▒▒▒▒▒▒▒███"
    echo "░░█▒▒▒▒▒▒█░░░░░░░███▒▒▒▒▒▒▒▒▒▒▒▒▒███"
    echo "░░░█▒▒▒▒▒▒█░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██"
    echo "░░░░█▒▒▒▒▒█░░░██▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒███"
    echo "░░░░░█▒▒▒█░░░█▒▒▒▒▒▒████▒▒▒▒████▒▒▒▒▒▒██"
    echo "░░░█████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██"
    echo "░░░█▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒██"
    echo "░██▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██"
    echo "██▒▒▒███████████▒▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒▒██"
    echo "█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒████████▒▒▒▒▒▒▒██"
    echo "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██"
    echo "░█▒▒▒███████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██"
    echo "░██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█"
    echo "░░████████████░░░█████████████████"
    echo -e "${NC}"
}

#######################################################

log_message "Début du script d'installation"

print_logo

########################################################
# Installation des logiciels                           #
# Node.js, npm, PM2, MongoDB, Angular CLI, Tmux, Nginx #
########################################################

# Vérifier si NVM est installé, et l'installer si besoin
draw_line
if ! command -v nvm &> /dev/null; then
    log_message "NVM n'est pas installé. Installation de NVM en cours."
    if curl -o- $NVM_INSTALL_URL | bash; then
        log_message SUCCESS "NVM installé avec succès."
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    else
        log_message ERROR "Échec de l'installation de NVM."
        if [ "$CONTINUE_ON_ERROR" = false ]; then
            exit 1
        fi
    fi
else
    log_message "NVM est déjà installé."
fi

# Installation de Node.js
draw_line
check_installation "node" $NODE_VERSION
node_status=$?
install_software "Node.js" "curl -o- $NVM_INSTALL_URL | bash && (source ~/.bashrc || source ~/.nvm/nvm.sh) && nvm install $NODE_VERSION && nvm use $NODE_VERSION" "nvm install $NODE_VERSION && nvm use $NODE_VERSION" $node_status

# Installation de npm
draw_line
check_installation "npm" $NPM_VERSION
npm_status=$?
install_software "npm" "npm install -g npm@$NPM_VERSION" "npm install -g npm@$NPM_VERSION" $npm_status

# Installation de PM2
draw_line
check_installation "pm2" $PM2_VERSION
pm2_status=$?
install_software "PM2" "npm install pm2@$PM2_VERSION -g" "npm install pm2@$PM2_VERSION -g" $pm2_status

# Vérification et installation de gnupg, gnupg2, et gnupg1
draw_line
packages=("gnupg" "gnupg2" "gnupg1")
for package in "${packages[@]}"; do
    if ! command -v $package &> /dev/null; then
        log_message "INFO" "Le paquet $package n'est pas installé. Installation en cours."
        if sudo apt-get install -y $package; then
            log_message SUCCESS "Le paquet $package a été installé avec succès."
        else
            log_message ERROR "Échec de l'installation du paquet $package."
            if [ "$CONTINUE_ON_ERROR" = false ]; then
                exit 1
            fi
        fi
    else
        log_message "INFO" "Le paquet $package est déjà installé."
    fi
done

# Installation de MongoDB
draw_line
check_installation "mongod" $MONGODB_VERSION
mongodb_status=$?
if [ $mongodb_status -ne 0 ]; then
    if [ $MONGODB_VERSION = "3.6.8" ]; then
        install_command="wget -qO - $MONGODB_GPG_KEY_URL | sudo apt-key add - && echo 'deb [ arch=amd64,arm64 ] $MONGODB_REPO_URL' | sudo tee $MONGODB_SOURCES_LIST && sudo apt-get update && sudo apt-get install -y mongodb-org=$MONGODB_VERSION mongodb-org-server=$MONGODB_VERSION mongodb-org-shell=$MONGODB_VERSION mongodb-org-mongos=$MONGODB_VERSION mongodb-org-tools=$MONGODB_VERSION"
        install_software "MongoDB" "$install_command" "$install_command" 1
    else
        log_message ERROR "Version non prise en charge de MongoDB. Installation annulée."
        if [ "$CONTINUE_ON_ERROR" = false ]; then
            exit 1
        fi
    fi
fi

# Installation de Angular CLI
draw_line
check_installation "Angular CLI" "$ANGULAR_CLI_VERSION" "$(ng version | grep 'Angular CLI:' | awk '{print $3}')"
angular_cli_status=$?
install_software "Angular CLI" "npm install -g @angular/cli@$ANGULAR_CLI_VERSION" "npm install -g @angular/cli@$ANGULAR_CLI_VERSION" $angular_cli_status

# Installation de Tmux
draw_line
check_installation "Tmux" "non spécifié" "tmux -V"
tmux_status=$?
install_software "Tmux" "sudo apt install tmux" "sudo apt install tmux" $tmux_status

# Installation de Git
draw_line
check_installation "git" "non spécifié"
git_status=$?
install_software "Git" "sudo apt-get install -y git" "sudo apt-get install -y git" $git_status

# Installation de Nginx
draw_line
check_installation "Nginx" "$NGINX_VERSION" "$(nginx -v 2>&1 | awk -F/ '{print $2}' | awk '{print $1}')"
nginx_status=$?
install_software "Nginx" "sudo apt install nginx" "sudo apt install nginx" $nginx_status


# Configuration de Nginx
draw_line
log_message "INFO" "Configuration de Nginx."

# Obtention de l'IP publique
PUBLIC_IP=$(curl -s ifconfig.me)

# Configuration attendue de Nginx
expected_nginx_config="server {
    listen 80;
    server_name $PUBLIC_IP;

    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}"

# Vérifiez et écrivez la configuration Nginx si nécessaire
if [ -f $NGINX_CONFIG_FILE ]; then
    existing_config=$(cat $NGINX_CONFIG_FILE)
    if [ "$existing_config" != "$expected_nginx_config" ]; then
        echo "$expected_nginx_config" | sudo tee $NGINX_CONFIG_FILE
        log_message "INFO" "La configuration Nginx a été mise à jour."
    else
        log_message "INFO" "La configuration Nginx est déjà correcte."
    fi
else
    echo "$expected_nginx_config" | sudo tee $NGINX_CONFIG_FILE
    log_message "SUCCESS" "Fichier de configuration Nginx $NGINX_CONFIG_FILE créé."
fi

# Activer la configuration nginx et vérifier sa validité
log_message "INFO" "Activation de la configuration Nginx."
if [ -L $NGINX_ENABLED/sogapeint.conf ] || [ -f $NGINX_ENABLED/sogapeint.conf ]; then
    log_message "INFO" "Le lien symbolique pour Nginx existe déjà."
else
    if sudo ln -s $NGINX_CONFIG_FILE $NGINX_ENABLED; then
        log_message "SUCCESS" "Lien symbolique pour Nginx créé avec succès."
    else
        log_message "ERROR" "Échec de la création du lien symbolique pour Nginx."
        if [ "$CONTINUE_ON_ERROR" = false ]; then
            exit 1
        fi
    fi
fi

log_message "INFO" "Vérification de la configuration Nginx."
if sudo nginx -t; then
    log_message "SUCCESS" "La configuration Nginx est valide."
    log_message "INFO" "Redémarrage du service Nginx."
    if sudo systemctl restart nginx; then
        log_message "SUCCESS" "Nginx redémarré avec succès."
    else
        log_message "ERROR" "Échec du redémarrage de Nginx."
        if [ "$CONTINUE_ON_ERROR" = false ]; then
            exit 1
        fi
    fi
else
    log_message "ERROR" "Erreur dans la configuration Nginx. Veuillez vérifier le fichier de configuration."
    if [ "$CONTINUE_ON_ERROR" = false ]; then
        exit 1
    fi
fi



# Vérification et ouverture du port 3000 avec UFW
sudo ufw status | grep "$BACKEND_PORT" || sudo ufw allow "$BACKEND_PORT/tcp"
sudo ufw reload

# Vérifications finales
draw_line
echo "Récapitulatif des versions des logiciels installés :"
all_ok=true

# Vérifier et normaliser Node.js
node_version=$(node --version 2>/dev/null || echo "not_installed")
check_and_log_version "Node.js" "$NODE_VERSION" "$node_version"
[ "$node_version" != "$NODE_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version de npm
npm_version=$(npm --version 2>/dev/null || echo "not_installed")
check_and_log_version "npm" "$NPM_VERSION" "$npm_version"
[ "$npm_version" != "$NPM_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version de PM2
pm2_version=$(pm2 --version 2>/dev/null || echo "not_installed")
check_and_log_version "PM2" "$PM2_VERSION" "$pm2_version"
[ "$pm2_version" != "$PM2_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version de MongoDB
mongodb_version=$(mongod --version | grep 'db version' | awk '{print $3}' 2>/dev/null || echo "not_installed")
check_and_log_version "MongoDB" "$MONGODB_VERSION" "$mongodb_version"
[ "$mongodb_version" != "$MONGODB_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version d'Angular CLI
angular_cli_version=$(ng version | grep 'Angular CLI:' | awk '{print $3}' 2>/dev/null || echo "not_installed")
check_and_log_version "Angular CLI" "$ANGULAR_CLI_VERSION" "$angular_cli_version"
[ "$angular_cli_version" != "$ANGULAR_CLI_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version de Tmux
tmux_version=$(tmux -V | awk '{print $2}' 2>/dev/null || echo "not_installed")
check_and_log_version "Tmux" "non spécifié" "$tmux_version"
[ "$tmux_version" != "$TMUX_VERSION" ] && all_ok=false
echo $all_ok

# Vérifier et journaliser la version de Git
git_version=$(git --version | awk '{print $3}' 2>/dev/null || echo "not_installed")
check_and_log_version "Git" "non spécifié" "$git_version"
echo $all_ok

# Vérifier et journaliser la version de Nginx
nginx_version=$(nginx -v 2>&1 | grep 'nginx version' | awk -F/ '{print $2}' 2>/dev/null || echo "not_installed")
check_and_log_version "Nginx" "$NGINX_VERSION" "$nginx_version"
[ "$nginx_version" != "$NGINX_VERSION" ] && all_ok=false
echo $all_ok


# Afficher l'émoticône si tout est OK
if [ "$all_ok" = true ]; then
    draw_line
    display_success_emoticon
fi

# Afficher les erreurs s'il y en a
if [ "$CONTINUE_ON_ERROR" = true ]; then
    draw_line
    display_errors
fi

draw_line
log_message "INFO" "Fin du script d'installation"
