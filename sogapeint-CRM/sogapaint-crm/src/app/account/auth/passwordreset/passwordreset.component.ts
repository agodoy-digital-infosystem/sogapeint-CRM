import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Service pour la gestion de l'authentification
import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

/**
 * Composant Passwordreset.
 *
 * Permet aux utilisateurs de demander une réinitialisation de leur mot de passe.
 * Utilise un formulaire réactif pour la saisie de l'email et communique avec le
 * service d'authentification pour effectuer la réinitialisation.
 */
@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit, AfterViewInit {

  // Formulaire de réinitialisation du mot de passe et ses états
  resetForm: UntypedFormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  // Variable pour stocker l'année actuelle, utilisée dans le template
  year: number = new Date().getFullYear();

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // Configuration initiale du formulaire de réinitialisation
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
    // Logique à exécuter après l'initialisation de la vue (si nécessaire)
  }

  // Accesseur pour faciliter l'accès aux contrôles du formulaire
  get f() { return this.resetForm.controls; }

  /**
   * Gère la soumission du formulaire de réinitialisation du mot de passe.
   *
   * Valide le formulaire et, si valide, utilise le service d'authentification
   * pour envoyer une demande de réinitialisation du mot de passe.
   * Gère également les erreurs lors de la demande.
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // Arrête l'exécution si le formulaire est invalide
    if (this.resetForm.invalid) {
      return;
    }

    // Envoie la demande de réinitialisation du mot de passe
    if (environment.defaultauth === 'firebase') {
      this.authenticationService.resetPassword(this.f.email.value)
        .catch(error => {
          this.error = error ? error : '';
        });
    }
  }
}
