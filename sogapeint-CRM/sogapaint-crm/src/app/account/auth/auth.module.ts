import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Importation de NgbAlertModule pour l'utilisation des alertes Bootstrap
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

// Importation de UiModule pour les éléments d'interface utilisateur partagés
import { UiModule } from '../../shared/ui/ui.module';

// Importation du module de routage spécifique à l'authentification
import { AuthRoutingModule } from './auth-routing';

// Importation des composants liés à l'authentification
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';

/**
 * Module d'authentification.
 *
 * Responsable de fournir toutes les fonctionnalités liées à l'authentification
 * de l'utilisateur, y compris la connexion, l'inscription et la réinitialisation
 * du mot de passe. Ce module regroupe les composants, les services et les routes
 * nécessaires pour l'authentification.
 */
@NgModule({
  // Déclaration des composants utilisés dans ce module
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent],
  imports: [
    // CommonModule est nécessaire pour les fonctionnalités de base d'Angular
    CommonModule,

    // ReactiveFormsModule pour la gestion des formulaires réactifs
    ReactiveFormsModule,

    // NgbAlertModule pour utiliser les alertes Bootstrap
    NgbAlertModule,

    // UiModule pour les éléments d'interface utilisateur réutilisables
    UiModule,

    // AuthRoutingModule pour la gestion des routes liées à l'authentification
    AuthRoutingModule
  ],

  // CUSTOM_ELEMENTS_SCHEMA permet l'utilisation de balises personnalisées
  // et est nécessaire si vous utilisez des composants personnalisés ou de tierces parties
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
