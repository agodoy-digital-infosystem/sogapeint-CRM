import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importation du modèle User pour la gestion des données utilisateur
import { User } from '../models/auth.models';

/**
 * Service pour la gestion des profils utilisateurs.
 *
 * Ce service fournit des fonctionnalités pour interagir avec les données utilisateur,
 * telles que l'obtention de la liste des utilisateurs et l'enregistrement de nouveaux utilisateurs.
 */
@Injectable({ providedIn: 'root' })
export class UserProfileService {
    /**
     * Constructeur du service UserProfileService.
     * @param http HttpClient pour les requêtes HTTP.
     */
    constructor(private http: HttpClient) { }

    /**
     * Récupère tous les utilisateurs.
     *
     * Envoie une requête GET pour obtenir une liste de tous les utilisateurs.
     * @returns Un Observable contenant un tableau d'utilisateurs.
     */
    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }

    /**
     * Enregistre un nouvel utilisateur.
     *
     * Envoie une requête POST pour créer un nouvel utilisateur avec les données fournies.
     * @param user Les données de l'utilisateur à enregistrer.
     * @returns Un Observable pour la réponse de la requête.
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
}
