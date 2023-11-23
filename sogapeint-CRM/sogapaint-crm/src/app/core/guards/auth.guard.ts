import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Importation des services d'authentification
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

// Importation des configurations d'environnement
import { environment } from '../../../environments/environment';

/**
 * Garde d'authentification (AuthGuard).
 *
 * Détermine si un utilisateur peut naviguer vers une route donnée en fonction de son état d'authentification.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    /**
     * Méthode pour déterminer si une route peut être activée.
     *
     * @param route Informations sur la route activée.
     * @param state État du routeur.
     * @returns Vrai si l'utilisateur est authentifié, faux sinon.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Vérifie l'état d'authentification selon le mode d'authentification configuré
        if (environment.defaultauth === 'firebase') {
            const currentUser = this.authenticationService.currentUser();
            if (currentUser) {
                // Utilisateur authentifié, autorisation accordée pour accéder à la route
                return true;
            }
        } else {
            const currentUser = this.authFackservice.currentUserValue;
            if (currentUser) {
                // Utilisateur authentifié avec le service d'authentification fictive
                return true;
            }
        }
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        // et conserver l'URL de retour pour une redirection après l'authentification
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
