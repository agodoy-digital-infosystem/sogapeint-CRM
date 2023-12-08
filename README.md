# 📘 Guide d'installation et de démarrage du CRM Sogapeint
Ce document fournit les instructions détaillées pour installer et exécuter l'application CRM de Sogapeint si vous avez à le faire manuellement. L'application se compose d'un frontend Angular et d'un backend Node.js, avec une base de données MongoDB.

## Prérequis
- Ubuntu 20.04.6 LTS
- Nginx

## Installation
### 1. Installation des logiciels nécessaires
- **Node.js (v20.10.0)** 🌐
    Utilisez Node Version Manager (nvm) pour installer la version spécifique de Node.js :
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    nvm install 20.10.0
    nvm use 20.10.0
    ```
- **npm (v10.2.3)** 📦
  ```bash
  npm install -g npm@10.2.3
  ```
- **PM2 (v5.3.0)** 🔄
    ```bash
    npm install pm2@5.3.0 -g
    ```
- **MongoDB** 🗄️
   1. **Importer la Clé Publique GPG de MongoDB** :
    MongoDB requiert que vous importiez leur clé publique GPG pour vérifier l'authenticité des paquets téléchargés. Exécutez la commande suivante dans le terminal :
    ```bash
    wget -qO - https://www.mongodb.org/static/pgp/server-3.6.asc | sudo apt-key add -
    ```
    2. **Ajouter le Dépôt de MongoDB** :
    Vous devez ajouter le dépôt de MongoDB à votre liste de sources. Pour Ubuntu, vous devrez spécifier la version exacte de votre système d'exploitation (par exemple, bionic pour Ubuntu 18.04, xenial pour Ubuntu 16.04).

        Pour Ubuntu 20.04, utilisez :
    ```bash
    echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    ```

    3. **Mettre à Jour la Liste des Paquets** :
    Après avoir ajouté le dépôt, mettez à jour la liste des paquets :
    ```bash
    sudo apt-get update
    ```

    4. **Installer MongoDB** :
    Maintenant, installez la version spécifique de MongoDB (dans votre cas, 3.6.8) :
    ```bash
    sudo apt-get install -y mongodb-org=3.6.8 mongodb-org-server=3.6.8 mongodb-org-shell=3.6.8 mongodb-org-mongos=3.6.8 mongodb-org-tools=3.6.8
    ```
    Ceci installera MongoDB et les outils associés.

    5. **Empêcher la Mise à Jour Automatique** :
    Pour éviter que MongoDB ne soit automatiquement mis à jour vers une version plus récente, vous pouvez "figer" le paquet :
    ```bash
    echo "mongodb-org hold" | sudo dpkg --set-selections
    echo "mongodb-org-server hold" | sudo dpkg --set-selections
    echo "mongodb-org-shell hold" | sudo dpkg --set-selections
    echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
    echo "mongodb-org-tools hold" | sudo dpkg --set-selections
    ```

    6. **Démarrer MongoDB et Vérifier son Statut** :
    Après l'installation, vous pouvez démarrer MongoDB et vérifier son statut :
    ```bash
    sudo systemctl start mongod
    sudo systemctl status mongod
    ```

    7. **Activer MongoDB au Démarrage** :
    Si vous souhaitez que MongoDB démarre automatiquement à chaque démarrage du système :
    ```bash
    sudo systemctl enable mongod
    ```

- **Angular CLI (v17.0.5)** 🅰️
```bash
npm install -g @angular/cli@17.0.5
```

- **Tmux** 🖥️

Vérifiez si tmux est installé :
```bash
tmux -V
```

Si non installé :
```bash
sudo apt install tmux
```

- **Nginx** 🌍
```bash
sudo apt install nginx
```

### 2. Configuration de nginx
Placez la configuration suivante dans /etc/nginx/sites-available/sogapeint.conf (`vim /etc/nginx/sites-available/sogapeint.conf` ou `nano /etc/nginx/sites-available/sogapeint.conf` selon vos préférences):
```nginx
server {
    listen 80;
    server_name 46.105.52.105; # IP publique du serveur

    location / {
        proxy_pass http://localhost:4200; # Angular App
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location /api {
        proxy_pass http://localhost:3000; # Node.js Backend        
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- Sauvegardez le fichier de configuration.
- Activez la configuration :
```bash
sudo ln -s /etc/nginx/sites-available/sogapeint.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Vérification et ouverture du port 3000 avec UFW
- Vérifiez si UFW est activé :
```bash
sudo ufw status
```

- Si nécessaire, ouvrez le port 3000 :
```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

### 4. Installation des dépendances
- **Backend** 💼
```bash
cd backend/
npm install
```

- **Frontend** 📱
```bash
cd sogapeint-CRM/sogapeint-crm
npm install --force
```

## Démarrage des serveurs

- **Lancement de Tmux** 🖥️
```bash
tmux
```

- **Serveur Backend** 🔙

Dans une session tmux :
```bash
cd backend/
pm2 start server.js
```
puis appuyez sur `ctrl`+`b` simultanément, relâchez puis appuyez sur `d`

- **Serveur Frontend Angular** 🔝

Créez une nouvelle session tmux (`Ctrl`+`B`, puis appuyez sur `c`) :
```bash
cd sogapeint-CRM/sogapeint-crm
ng serve
```
appuyez sur `ctrl`+`b` simultanément, relâchez puis appuyez sur `d`

## 📄 Note
Le déploiement du code est géré par GitHub Actions. Aucune action manuelle n'est nécessaire pour récupérer le code de l'application.

---

Documentation créée avec 💡 et ❤️ par l'équipe Digital Info System