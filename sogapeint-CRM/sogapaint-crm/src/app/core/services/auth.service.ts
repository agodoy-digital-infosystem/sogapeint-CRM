import { Injectable } from '@angular/core';

// Utilitaire pour l'intégration avec le backend Firebase
import { getFirebaseBackend } from '../../authUtils'; // TODO : Changer pour adapter à la bdd

// Modèle utilisateur pour la gestion de l'authentification
import { User } from '../models/auth.models';

/**
 * Service d'authentification.
 *
 * Fournit des fonctionnalités d'authentification, y compris la connexion,
 * l'inscription, la réinitialisation du mot de passe et la déconnexion.
 * Interagit avec le backend Firebase pour ces opérations.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    // L'utilisateur actuellement authentifié
    user: User;

    constructor() {
    }

    /**
     * Récupère l'utilisateur actuellement authentifié.
     *
     * @returns L'utilisateur authentifié ou null si aucun utilisateur n'est connecté.
     */
    public currentUser(): User {
        return getFirebaseBackend().getAuthenticatedUser(); // TODO : Changer pour adapter à la bdd
    }

    /**
     * Connecte un utilisateur avec un email et un mot de passe.
     *
     * @param email L'email de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @returns Une promesse résolue avec les détails de l'utilisateur après une connexion réussie.
     */
    login(email: string, password: string) {
        return getFirebaseBackend().loginUser(email, password).then((response: any) => { // TODO : Changer pour adapter à la bdd
            const user = response;
            return user;
        });
    }

    /**
     * Enregistre un nouvel utilisateur avec un email et un mot de passe.
     *
     * @param email L'email de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @returns Une promesse résolue avec les détails de l'utilisateur après un enregistrement réussi.
     */
    register(email: string, password: string) {
        return getFirebaseBackend().registerUser(email, password).then((response: any) => { // TODO : Changer pour adapter à la bdd
            const user = response;
            return user;
        });
    }

    /**
     * Envoie une demande de réinitialisation de mot de passe pour l'email donné.
     *
     * @param email L'email pour lequel réinitialiser le mot de passe.
     * @returns Une promesse résolue avec un message de succès.
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => { // TODO : Changer pour adapter à la bdd
            const message = response.data;
            return message;
        });
    }

    /**
     * Déconnecte l'utilisateur actuellement connecté.
     */
    logout() {
        getFirebaseBackend().logout(); // TODO : Changer pour adapter à la bdd
    }
}
