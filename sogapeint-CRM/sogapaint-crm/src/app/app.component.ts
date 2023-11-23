import { Component } from '@angular/core';

/**
 * Composant racine de l'application Angular.
 *
 * Sert de point d'ancrage pour l'ensemble de l'application et définit la vue racine.
 * Ce composant englobe toutes les autres vues et composants de l'application.
 */
@Component({
  selector: 'app-root',  // Sélecteur CSS utilisé pour insérer ce composant dans le HTML
  templateUrl: './app.component.html',  // Chemin vers le template HTML du composant
  styleUrls: ['./app.component.scss']   // Chemin vers les styles SCSS du composant
})
export class AppComponent {
  title = 'SOGAPEINT';  // Titre de l'application, utilisé dans le template
}
