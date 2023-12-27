import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Importation du modèle User pour la gestion des données utilisateur
import { User } from '../models/auth.models';
import { environment } from '../../../environments/environment';

import { AuthenticationService } from './auth.service';

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
    constructor(private http: HttpClient, private authService: AuthenticationService) { }

    getCurrentUser(): User {
        return this.authService.currentUserValue;
    }

    /**
     * Récupère tous les utilisateurs.
     *
     * Envoie une requête GET pour obtenir une liste de tous les utilisateurs.
     * @returns Un Observable contenant un tableau d'utilisateurs.
     */
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/auth/allUsers`);
    }

    /**
     * Enregistre un nouvel utilisateur.
     *
     * Envoie une requête POST pour créer un nouvel utilisateur avec les données fournies.
     * @param user Les données de l'utilisateur à créer.
     * @returns Un Observable pour la réponse de la requête.
     */
    create(user: User) {
        return this.http.post(`${environment.apiUrl}/api/auth/addUser`, {
            email: user.email, 
            password: user.password, 
            firstname: user.firstName, 
            lastname: user.lastName, 
            role: user.role,
            company: user.company,
            phone: user.phone,
            active: user.active,
            authorized_connection: user.authorized_connection
        });
    }

    /**
    * Récupère un utilisateur par son identifiant.
    * @param userId L'identifiant de l'utilisateur à récupérer.
    * @returns Un Observable contenant l'utilisateur.
    */
    getOne(userId: string) {
        return this.http.get<User>(`${environment.apiUrl}/api/auth/user/${userId}`);
    }
}
