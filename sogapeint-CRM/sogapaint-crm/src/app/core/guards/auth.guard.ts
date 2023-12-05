import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Importation du service d'authentification
import { AuthenticationService } from '../services/auth.service';

/**
 * Garde d'authentification (AuthGuard).
 *
 * Détermine si un utilisateur peut naviguer vers une route donnée en fonction de son état d'authentification.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    /**
     * Méthode pour déterminer si une route peut être activée.
     *
     * @param route Informations sur la route activée.
     * @param state État du routeur.
     * @returns Vrai si l'utilisateur est authentifié, faux sinon.
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // Utilisateur authentifié, autorisation accordée pour accéder à la route
            return true;
        }

        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        // et conserver l'URL de retour pour une redirection après l'authentification
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
