import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importation du module de routage pour les icônes
import { IconsRoutingModule } from './icons-routing.module';

// Importation du module UI partagé, utilisé pour les éléments d'interface utilisateur réutilisables
import { UiModule } from '../../shared/ui/ui.module';

// Importation des composants spécifiques à chaque type d'icône
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { DripiconsComponent } from './dripicons/dripicons.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';
import { RemixComponent } from './remix/remix.component';

/**
 * Module pour la gestion des icônes dans l'application.
 * 
 * Ce module inclut des composants pour différents types d'icônes, tels que Material Design,
 * Dripicons, Font Awesome et Remix. Il regroupe tous les composants liés aux icônes
 * et gère leur routage ainsi que leur intégration dans l'interface utilisateur.
 */
@NgModule({
  // Déclaration des composants d'icônes
  declarations: [MaterialdesignComponent, DripiconsComponent, FontawesomeComponent, RemixComponent],
  
  // Importation des modules nécessaires pour le fonctionnement de ce module
  imports: [
    // CommonModule est nécessaire pour les fonctionnalités de base d'Angular
    CommonModule,
    
    // IconsRoutingModule pour la gestion des routes spécifiques aux icônes
    IconsRoutingModule,

    // UiModule pour les éléments d'interface utilisateur réutilisables
    UiModule
  ]
})
export class IconsModule { }
