import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// Importation du composant LoginComponent à tester
import { LoginComponent } from './login.component';

/**
 * Suite de tests pour LoginComponent.
 *
 * Vise à tester les fonctionnalités de base et le rendu du composant LoginComponent.
 */
describe('LoginComponent', () => {
  // Déclaration des variables pour le composant et son environnement de test
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  /**
   * Configuration initiale pour chaque test.
   *
   * Configure l'environnement de test et compile les composants avant chaque test.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ]  // Déclare le composant LoginComponent pour le test
    })
    .compileComponents();  // Compile les composants de manière asynchrone
  }));

  /**
   * Initialisation avant chaque test.
   *
   * Crée une instance du composant LoginComponent et détecte les changements initiaux.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);  // Crée l'environnement de test pour LoginComponent
    component = fixture.componentInstance;  // Obtient l'instance du composant
    fixture.detectChanges();  // Déclenche la détection des changements initiaux
  });

  /**
   * Test pour vérifier si le composant LoginComponent est créé correctement.
   */
  it('should create', () => {
    expect(component).toBeTruthy();  // Vérifie si l'instance du composant est créée et valide
  });
});
