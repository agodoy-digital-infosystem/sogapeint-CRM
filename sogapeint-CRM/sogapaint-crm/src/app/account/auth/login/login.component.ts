import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// Services d'authentification
import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

/**
 * Composant Login.
 *
 * Gère la logique de la page de connexion, permettant aux utilisateurs de se connecter
 * avec leurs identifiants. Il utilise un formulaire réactif pour la saisie des données
 * et peut gérer l'authentification à l'aide de différents services selon l'environnement.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Déclaration des variables pour le formulaire, la soumission et les erreurs
  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // Variable pour stocker l'année actuelle, utile pour l'affichage dans le template
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    public authenticationService: AuthenticationService, 
    public authFackservice: AuthfakeauthenticationService
  ) { }

  ngOnInit() {
    // Configuration initiale du formulaire de connexion
    this.loginForm = this.formBuilder.group({
      email: ['admin@sogapeint.corp', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });

    // Récupération du retour d'URL depuis les paramètres de la route, si disponible
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Accesseur pour les contrôles du formulaire
  get f() { return this.loginForm.controls; }

  /**
   * Gère la soumission du formulaire de connexion.
   *
   * Valide le formulaire et utilise le service d'authentification approprié
   * pour connecter l'utilisateur. Gère également les erreurs d'authentification.
   */
  onSubmit() {
    this.submitted = true;

    // Vérifie si le formulaire est invalide et arrête l'exécution si c'est le cas
    if (this.loginForm.invalid) {
      return;
    } else {
      // Traite la connexion en fonction de l'environnement d'authentification
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.email.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.authFackservice.login(this.f.email.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }

}
