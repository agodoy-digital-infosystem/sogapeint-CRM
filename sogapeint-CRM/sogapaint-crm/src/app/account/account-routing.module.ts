import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Configuration des routes pour le module de compte.
 *
 * Définit les sous-routes pour les fonctionnalités liées aux comptes utilisateurs, 
 * telles que l'authentification.
 */
const routes: Routes = [
  // Route pour les fonctionnalités d'authentification avec chargement paresseux du AuthModule
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

/**
 * Module de routage pour le module de compte.
 *
 * Importe et exporte RouterModule avec les routes spécifiques au module de compte.
 * Utilise 'forChild' pour les routes enfants par rapport au routage principal de l'application.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],  // Configuration des routes enfants pour le module de compte
  exports: [RouterModule]  // Exporte RouterModule pour utilisation dans d'autres parties de l'application
})
export class AccountRoutingModule { }
