import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Importation du composant SignupComponent à tester
import { SignupComponent } from './signup.component';

/**
 * Suite de tests pour SignupComponent.
 *
 * Vise à tester les fonctionnalités et le rendu de base du composant SignupComponent.
 */
describe('SignupComponent', () => {
  // Déclaration des variables pour le composant et son environnement de test
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  /**
   * Configuration initiale pour chaque test.
   *
   * Configure l'environnement de test, compile les composants et prépare les instances.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ]  // Déclare le composant à tester
    })
    .compileComponents();  // Compile les composants asynchrones
  }));

  /**
   * Initialisation avant chaque test.
   *
   * Crée une instance du composant et détecte les changements initiaux.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);  // Crée l'environnement de test pour SignupComponent
    component = fixture.componentInstance;  // Obtient l'instance du composant
    fixture.detectChanges();  // Déclenche la détection des changements initiaux
  });

  /**
   * Test pour vérifier si le composant est créé correctement.
   */
  it('should create', () => {
    expect(component).toBeTruthy();  // Vérifie si l'instance du composant existe
  });
});
