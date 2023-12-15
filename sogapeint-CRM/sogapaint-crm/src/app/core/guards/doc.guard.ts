import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserProfileService } from '../services/user.service'; // Assurez-vous d'importer le service d'authentification

@Injectable({
  providedIn: 'root'
})
export class DocGuard implements CanActivate {
  constructor(
    private userProfileService: UserProfileService, // Notez que la convention est de commencer les noms d'instance avec une minuscule
    private router: Router
  ) {} // Injectez le service Router pour la redirection

  canActivate(): boolean {
    const user = this.userProfileService.getCurrentUser(); // Obtenez les informations de l'utilisateur actuel
    if (user && user.role === 'superAdmin') {
      return true; // Laissez l'accès si l'utilisateur est un superAdmin
    } else {
      // Redirigez vers la page de connexion ou toute autre page appropriée
      this.router.navigate(['/login']); // Modifiez '/login' par la route de votre choix
      return false; // Refusez l'accès si l'utilisateur n'est pas un superAdmin
    }
  }
}
