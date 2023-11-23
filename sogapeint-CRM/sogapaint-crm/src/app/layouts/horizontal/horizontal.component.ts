import { Component, OnInit } from '@angular/core';

/**
 * Composant Horizontal.
 *
 * Gère la mise en page horizontale de l'application. Ce composant s'occupe de la configuration
 * spécifique nécessaire pour afficher l'interface utilisateur dans une disposition horizontale.
 */
@Component({
  selector: 'app-horizontal',  // Sélecteur CSS pour l'utilisation du composant dans le HTML
  templateUrl: './horizontal.component.html',  // Chemin vers le template HTML du composant
  styleUrls: ['./horizontal.component.scss']   // Chemin vers les styles SCSS du composant
})
export class HorizontalComponent implements OnInit {

  constructor() { }

  /**
   * Actions à effectuer à l'initialisation du composant.
   *
   * Configure les attributs du corps du document pour la mise en page horizontale,
   * définissant le style de la barre supérieure et la disposition globale.
   */
  ngOnInit(): void {
    document.body.setAttribute('data-topbar', 'dark');  // Configurer le style de la barre supérieure
    document.body.setAttribute('data-layout', 'horizontal');  // Définir la disposition horizontale
    document.body.removeAttribute('data-sidebar');  // Supprimer l'attribut relatif à la barre latérale
  }
}
