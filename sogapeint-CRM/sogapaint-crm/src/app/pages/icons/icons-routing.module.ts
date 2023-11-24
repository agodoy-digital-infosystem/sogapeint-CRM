import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importation des composants pour les différentes catégories d'icônes
import { RemixComponent } from './remix/remix.component';
import { MaterialdesignComponent } from './materialdesign/materialdesign.component';
import { DripiconsComponent } from './dripicons/dripicons.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';

// Définition des routes pour chaque type d'icône
const routes: Routes = [
    {
        // Route pour les icônes Remix
        path: 'remix',
        component: RemixComponent
    },
    {
        // Route pour les icônes Material Design
        path: 'materialdesign',
        component: MaterialdesignComponent
    },
    {
        // Route pour les icônes Dripicons
        path: 'dripicons',
        component: DripiconsComponent
    },
    {
        // Route pour les icônes Font Awesome
        path: 'fontawesome',
        component: FontawesomeComponent
    }
];

/**
 * Module de routage pour le module Icons.
 * 
 * Ce module définit les routes spécifiques aux composants d'icônes dans l'application,
 * permettant la navigation entre les différentes catégories d'icônes comme Remix,
 * Material Design, Dripicons et Font Awesome. Chaque route est associée à un composant
 * qui présente un ensemble d'icônes correspondant.
 */
@NgModule({
    // Importation de RouterModule avec les routes enfants pour ce module
    imports: [RouterModule.forChild(routes)],

    // Exportation de RouterModule pour rendre ses directives disponibles dans les composants du module Icons
    exports: [RouterModule]
})
export class IconsRoutingModule { }
