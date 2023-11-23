import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importation du module de routage spécifique au module de compte
import { AccountRoutingModule } from './account-routing.module';
// Importation du module d'authentification
import { AuthModule } from './auth/auth.module';

/**
 * Module Account.
 *
 * Gère les fonctionnalités liées aux comptes utilisateurs, y compris l'authentification
 * et la navigation associée.
 */
@NgModule({
  declarations: [
    // Les composants spécifiques au module Account peuvent être déclarés ici
  ],
  imports: [
    CommonModule,  // Module commun pour les fonctionnalités de base d'Angular
    AccountRoutingModule,  // Module de routage pour les routes de compte
    AuthModule  // Module pour les fonctionnalités d'authentification
  ]
  // Les services spécifiques au module Account peuvent être fournis ici
})
export class AccountModule { }
