import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Services pour l'authentification et la gestion des profils utilisateurs
import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';

import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';

/**
 * Composant Signup.
 *
 * Gère la logique d'inscription des utilisateurs, permettant de créer de nouveaux comptes.
 * Utilise un formulaire réactif pour la saisie des données utilisateur et gère l'enregistrement
 * via différents services d'authentification en fonction de l'environnement.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

  // Déclaration des variables pour le formulaire, la soumission, les erreurs et les messages de succès
  signupForm: UntypedFormGroup;
  submitted = false;
  error = '';
  successmsg = false;

  // Variable pour stocker l'année actuelle, utile pour l'affichage dans le template
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private authenticationService: AuthenticationService,
    private userService: UserProfileService
  ) { }

  ngOnInit() {
    // Configuration initiale du formulaire d'inscription
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    // Logique à exécuter après l'initialisation de la vue (si nécessaire)
  }

  // Accesseur pour les contrôles du formulaire
  get f() { return this.signupForm.controls; }

  /**
   * Gère la soumission du formulaire d'inscription.
   *
   * Valide le formulaire et utilise le service d'authentification approprié
   * pour enregistrer le nouvel utilisateur. Gère également les messages de succès
   * et les erreurs d'inscription.
   */
  onSubmit() {
    this.submitted = true;

    // Vérifie si le formulaire est invalide et arrête l'exécution si c'est le cas
    if (this.signupForm.invalid) {
      return;
    } else {
      // Traite l'inscription en fonction de l'environnement d'authentification
      if (environment.defaultauth === 'firebase') {
        // this.authenticationService.register(this.f.email.value, this.f.password.value).then((res: any) => {
        //   this.successmsg = true;
        //   if (this.successmsg) {
        //     this.router.navigate(['/']);
        //   }
        // })
        //   .catch(error => {
        //     this.error = error ? error : '';
        //   });
      } else {
        // this.userService.register(this.signupForm.value)
        //   .pipe(first())
        //   .subscribe(
        //     data => {
        //       this.successmsg = true;
        //       if (this.successmsg) {
        //         this.router.navigate(['/account/login']);
        //       }
        //     },
        //     error => {
        //       this.error = error ? error : '';
        //     });
      }
    }
  }
}
