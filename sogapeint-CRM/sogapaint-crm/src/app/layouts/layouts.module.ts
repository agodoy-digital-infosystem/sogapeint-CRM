import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserInfoBarComponent } from './shared/user-info-bar/user-info-bar.component';

// Importation du module partagé pour les composants réutilisables
import { SharedModule } from './shared/shared.module';

// Importation des composants de mise en page
import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { LayoutComponent } from './layout/layout.component';

// import { UserInfoBarComponent } from '../user-info-bar/user-info-bar.component';


import { TranslateModule } from '@ngx-translate/core';

/**
 * Module pour la gestion des layouts dans l'application.
 *
 * Déclare et fournit les composants utilisés pour les différentes dispositions
 * de l'application (verticale, horizontale, etc.).
 */
@NgModule({
  declarations: [
    UserInfoBarComponent,  // Composant pour la barre d'informations utilisateur
    VerticalComponent,  // Composant pour la disposition verticale
    HorizontalComponent,  // Composant pour la disposition horizontale
    LayoutComponent  // Composant principal de mise en page
  ],
  imports: [
    TranslateModule.forChild(),
    CommonModule,  // Module commun pour les directives Angular de base
    SharedModule,  // Module partagé pour les composants réutilisables
    RouterModule  // Module pour la gestion des routes dans l'application
  ],
  exports: [
    VerticalComponent,  // Exporte le composant vertical pour une utilisation en dehors de ce module
    HorizontalComponent  // Exporte le composant horizontal pour une utilisation en dehors de ce module
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutsModule { }
