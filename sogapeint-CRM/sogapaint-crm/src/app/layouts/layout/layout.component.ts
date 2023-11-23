import { Component, OnInit } from '@angular/core';

// Importation du service EventService pour la gestion des événements
import { EventService } from '../../core/services/event.service';

// Importation des constantes pour les types de layout
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './layouts.model';

/**
 * Composant Layout.
 *
 * Gère la disposition globale de l'application (verticale ou horizontale)
 * et réagit aux changements de disposition demandés.
 */
@Component({
  selector: 'app-layout',  // Sélecteur CSS pour l'utilisation du composant
  templateUrl: './layout.component.html',  // Chemin vers le template HTML du composant
  styleUrls: ['./layout.component.scss']   // Chemin vers les styles SCSS du composant
})
export class LayoutComponent implements OnInit {

  layoutType: string;  // Variable pour stocker le type de layout actuel

  constructor(private eventService: EventService) { }

  ngOnInit() {
    // Configuration initiale de l'attribut de thème et du type de layout
    document.body.setAttribute('data-bs-theme', 'light');
    this.layoutType = LAYOUT_VERTICAL;

    // Souscription à l'événement de changement de layout
    this.eventService.subscribe('changeLayout', (layout) => {
      this.layoutType = layout;  // Mise à jour du type de layout sur réception de l'événement
    });
  }

  /**
   * Détermine si une disposition verticale est demandée.
   * @returns Vrai si le layout vertical est actif.
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Détermine si une disposition horizontale est demandée.
   * @returns Vrai si le layout horizontal est actif.
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
}
