import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modèle utilisateur pour la gestion de l'authentification
import { User } from '../models/auth.models';

/**
 * Service d'authentification fictive.
 *
 * Fournit des fonctionnalités d'authentification de base à des fins de test ou de développement,
 * simulant des interactions avec un backend d'authentification.
 */
@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    // Observable pour suivre l'utilisateur actuellement connecté
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        // Initialisation de currentUserSubject avec les données de l'utilisateur stockées localement
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * Récupère la valeur actuelle de l'utilisateur connecté.
     *
     * @returns L'utilisateur actuellement authentifié.
     */
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    /**
     * Effectue une connexion simulée avec un email et un mot de passe.
     *
     * @param email L'email de l'utilisateur.
     * @param password Le mot de passe de l'utilisateur.
     * @returns Une Observable qui émet les détails de l'utilisateur après une connexion réussie.
     */
    login(email: string, password: string) {
        return this.http.post<any>(`/users/authenticate`, { email, password })
            .pipe(map(user => {

                // Stocke les détails de l'utilisateur dans le stockage local si le token est présent
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    /**
     * Déconnecte l'utilisateur actuellement connecté.
     */
    logout() {
        // Supprime les données de l'utilisateur du stockage local et met à jour l'Observable
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
