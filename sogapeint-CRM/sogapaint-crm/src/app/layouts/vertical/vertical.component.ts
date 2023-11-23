import { Component, OnInit } from '@angular/core';

/**
 * Composant Vertical.
 *
 * Gère la mise en page verticale de l'application, y compris les interactions
 * et les ajustements spécifiques à cette disposition.
 */
@Component({
  selector: 'app-vertical',  // Sélecteur CSS pour l'utilisation du composant
  templateUrl: './vertical.component.html',  // Chemin vers le template HTML du composant
  styleUrls: ['./vertical.component.scss']   // Chemin vers les styles SCSS du composant
})
export class VerticalComponent implements OnInit {

  constructor() { }

  /**
   * Actions à effectuer à l'initialisation du composant.
   *
   * Configure les attributs du corps du document pour la mise en page verticale.
   */
  ngOnInit(): void {
    document.body.setAttribute('data-sidebar', 'dark');
    document.body.removeAttribute('data-layout-size');
    document.body.removeAttribute('data-layout');
    document.body.removeAttribute('data-topbar');
    document.body.classList.remove('auth-body-bg');
  }

  /**
   * Gère le clic sur le bouton de basculement du menu mobile.
   *
   * Active ou désactive la barre latérale et gère son affichage en fonction
   * de la largeur de l'écran.
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }

  /**
   * Gère le clic sur le bouton des paramètres dans la barre supérieure.
   *
   * Active ou désactive le panneau des paramètres (barre latérale droite).
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }
}
