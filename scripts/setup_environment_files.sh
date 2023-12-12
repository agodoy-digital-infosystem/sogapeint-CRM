#!/bin/bash

# Chemin de base où se trouvent les fichiers environment
BASE_PATH="../sogapeint-CRM/sogapaint-crm/src/environments"

# Définit le chemin des fichiers environment.ts et environment.prod.ts
ENV_FILE="$BASE_PATH/environment.ts"
ENV_PROD_FILE="$BASE_PATH/environment.prod.ts"

# Vérifie si les fichiers environment existent
if [ ! -f "$ENV_FILE" ]; then
    echo "Le fichier $ENV_FILE n'a pas été trouvé."
    exit 1
fi

if [ ! -f "$ENV_PROD_FILE" ]; then
    echo "Le fichier $ENV_PROD_FILE n'a pas été trouvé."
    exit 1
fi

# Récupère l'adresse IP publique
PUBLIC_IP=$(curl -s ifconfig.me)
echo "IP publique : $PUBLIC_IP"

# Fonction pour mettre à jour l'adresse IP dans les fichiers
update_ip() {
    local file=$1
    local url=$2
    local new_url=$3

    # Vérifie si la mise à jour est nécessaire
    if grep -q "$new_url" "$file"; then
        echo "L'adresse IP dans $file est déjà à jour."
    else
        sed -i "s|$url|$new_url|" "$file"
        # Vérifie si la mise à jour a été effectuée
        if grep -q "$new_url" "$file"; then
            echo "Mise à jour réussie dans $file"
        else
            echo "Échec de la mise à jour dans $file"
        fi
    fi
}

# Met à jour l'adresse IP publique dans les fichiers
update_ip "$ENV_FILE" "apiUrl: 'http://localhost:3000'" "apiUrl: 'http://${PUBLIC_IP}:3000'"
update_ip "$ENV_PROD_FILE" "apiUrl: 'https://the-production-api-url'" "apiUrl: 'https://${PUBLIC_IP}:3000'"

echo "Adresse IP publique mise à jour dans les fichiers environment.ts et environment.prod.ts : ${PUBLIC_IP}"
