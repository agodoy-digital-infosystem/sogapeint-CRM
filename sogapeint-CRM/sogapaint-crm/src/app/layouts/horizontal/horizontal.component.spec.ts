import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Importation du composant HorizontalComponent pour les tests
import { HorizontalComponent } from './horizontal.component';

/**
 * Suite de tests pour HorizontalComponent.
 *
 * Vérifie les fonctionnalités et le rendu de base du composant HorizontalComponent.
 */
describe('HorizontalComponent', () => {
  let component: HorizontalComponent;
  let fixture: ComponentFixture<HorizontalComponent>;

  /**
   * Configuration initiale pour les tests de HorizontalComponent.
   *
   * Configure l'environnement de test en déclarant le composant et en compilant les composants.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalComponent ]  // Déclaration de HorizontalComponent pour les tests
    })
    .compileComponents();  // Compilation asynchrone des composants
  }));

  /**
   * Initialisation avant chaque test.
   *
   * Crée une instance de HorizontalComponent et applique les changements initiaux.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalComponent);  // Création de l'environnement de test pour le composant
    component = fixture.componentInstance;  // Obtention de l'instance du composant
    fixture.detectChanges();  // Détection des changements initiaux
  });

  /**
   * Test pour vérifier si le composant HorizontalComponent est créé correctement.
   */
  it('should create', () => {
    expect(component).toBeTruthy();  // Vérification de la création correcte de l'instance du composant
  });
});
