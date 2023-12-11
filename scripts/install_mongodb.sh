#!/bin/bash

# MongoDB installation variables
MONGODB_VERSION="7.0"
MONGODB_GPG_KEY_URL="https://pgp.mongodb.com/server-7.0.asc"
OS_VERSION="$(lsb_release -cs)"
MONGODB_SOURCES_LIST="/etc/apt/sources.list.d/mongodb-org-7.0.list"

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

# Function to install MongoDB
install_mongodb() {
    # Install gnupg and curl
    sudo apt-get install gnupg curl

    # Import MongoDB public GPG Key
    curl -fsSL $MONGODB_GPG_KEY_URL | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

    # Create the list file for MongoDB
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $OS_VERSION/mongodb-org/7.0 multiverse" | sudo tee $MONGODB_SOURCES_LIST

    # Reload local package database
    sudo apt-get update

    # Install MongoDB packages
    sudo apt-get install -y mongodb-org

    # Check if MongoDB is installed correctly
    if command -v mongod &> /dev/null; then
        log_message "SUCCESS" "MongoDB installed successfully."
    else
        log_message "ERROR" "Failed to install MongoDB."
        exit 1
    fi
}

# Start of the script execution
log_message "INFO" "Starting MongoDB installation process."

# Install MongoDB
install_mongodb

# Optional: Pin the MongoDB version
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-database hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-mongosh hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

# Finish script execution
log_message "INFO" "MongoDB installation process completed."