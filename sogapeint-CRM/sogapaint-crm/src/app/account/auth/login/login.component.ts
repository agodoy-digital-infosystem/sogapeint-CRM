import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

/**
 * Composant LoginComponent
 * 
 * Gère la page de connexion de l'application.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Déclaration et initialisation des propriétés
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  year: number = new Date().getFullYear();

  /**
   * Constructeur du composant
   * 
   * @param formBuilder Construit les formulaires réactifs
   * @param route Fournit l'accès aux informations de la route associée
   * @param router Permet la navigation entre les pages
   * @param authenticationService Service d'authentification
   */
  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    public authenticationService: AuthenticationService
  ) { }

  /**
   * Méthode d'initialisation du composant
   */
  ngOnInit() {
    // Initialisation du formulaire de connexion
    this.loginForm = this.formBuilder.group({
      email: ['admin@sogapeint.corp', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });

    // Récupération de l'URL de retour après la connexion
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Accesseur pour les contrôles du formulaire
  get f() { return this.loginForm.controls; }

  /**
   * Méthode appelée lors de la soumission du formulaire
   */
  onSubmit() {
    this.submitted = true;

    // Vérification de la validité du formulaire
    if (this.loginForm.invalid) {
      return;
    } else {
      // Appel au service d'authentification
      this.authenticationService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            // Navigation vers la page d'accueil en cas de succès
            this.router.navigate(['/']);
          },
          error => {
            // Affichage d'un message d'erreur en cas d'échec
            this.error = error ? error : '';
          });
    }
  }
}
