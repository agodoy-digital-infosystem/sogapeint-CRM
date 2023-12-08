# Guide PM2 pour Sogapeint Backend 🚀

## Introduction
Ce guide est dédié à la mise en place et à la gestion du serveur backend de Sogapeint avec PM2. 

## Installation de PM2 🛠️

1. **Installer PM2** :
   Utilisez npm pour installer PM2 globalement sur le serveur :
   ```bash
   npm install pm2@latest -g
   ```

## Démarrer le Serveur Backend 🌐

1. **Démarrer le serveur** :
    Dans le répertoire backend de Sogapeint, démarrez l'application backend avec PM2 :
    ```bash
    pm2 start server.js --name "sogapeint-backend"
    ```

## Configuration de PM2 🎛️

1. **Configurer PM2 pour le redémarrage automatique** :
    Assurez-vous que PM2 redémarre l'application backend après un reboot du serveur :
    ```bash
    pm2 startup
    pm2 save
    ```

## Gestion du Serveur avec PM2 🔧

1. **Vérifier l'état de l'application backend** :
    Pour voir l'état de l'application backend :
    ```bash
    pm2 status
    ```

2. **Logs** :
    Pour consulter les logs de l'application backend :
    ```bash
    pm2 logs sogapeint-backend
    ```

3. **Redémarrer/Arrêter l'application backend** :
    Pour redémarrer ou arrêter l'application backend :
    ```backend
    pm2 restart sogapeint-backend
    pm2 stop sogapeint-backend
    ```

## Conclusion 🎉
    Votre serveur backend Sogapeint est maintenant géré par PM2, assurant une performance stable et une gestion simplifiée.

---

Documentation créée avec 💡 et ❤️ par l'équipe Digital Info System