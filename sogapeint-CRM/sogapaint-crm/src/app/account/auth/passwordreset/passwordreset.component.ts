import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnFrPackage from '@zxcvbn-ts/language-fr';

/**
 * Composant pour la réinitialisation du mot de passe.
 * Utilise le FormBuilder pour la validation de formulaire et UserProfileService pour la gestion des utilisateurs.
 */
@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit {
  resetForm: UntypedFormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;
  phase = 'request';
  verificationCode = '';
  email = '';
  hidePassword = true;
  hideConfirmPassword = true;
  passwordStrength: any;
  passwordFeedback: string;

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private router: Router, 
    private authService: AuthenticationService,
    private userProfileService: UserProfileService
  ) { 
    // Configuration de zxcvbn pour utiliser le package de langue française
    const options = {
      translations: zxcvbnFrPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnFrPackage.dictionary,
      },
    };

    zxcvbnOptions.setOptions(options);
  }

  /**
   * Méthode d'initialisation du composant.
  */
  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      verificationCode: [''],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: this.mustMatch('newPassword', 'confirmPassword')
    });
  }

  // récupère les contrôles du formulaire
  get f() { return this.resetForm.controls; }

  // vérifie si les mots de passe correspondent
  get passwordsMatch(): boolean {
    return this.resetForm.get('newPassword').value === this.resetForm.get('confirmPassword').value;
  }
  
  /**
   * Méthode appelée lors de la soumission du formulaire.
   */
  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';
  
    if (this.phase === 'request') {
      // À l'étape de demande, seule la validité de l'email est vérifiée.
      if (this.resetForm.get('email').invalid) {
        this.loading = false;
        return;
      }
      this.requestReset();
    } else if (this.phase === 'verify') {
      // À l'étape de vérification, seule la validité du code de vérification est vérifiée.
      if (this.resetForm.get('verificationCode').invalid) {
        this.loading = false;
        return;
      }
      this.verifyCode();
    } else if (this.phase === 'reset') {
      // À l'étape de réinitialisation, la validité des champs de mot de passe est vérifiée.
      if (this.resetForm.get('newPassword').invalid ||
          this.resetForm.get('confirmPassword').invalid ||
          this.resetForm.get('newPassword').value !== this.resetForm.get('confirmPassword').value) {
        this.loading = false;
        return;
      }
      this.resetPassword();
    } else {
      // Si la phase ne correspond à aucune des étapes connues.
      this.loading = false;
    }
  }

  /**
   * Envoie une demande de réinitialisation du mot de passe.
   * 
   * Envoie une requête POST au backend pour demander la réinitialisation du mot de passe.
   * La requête est envoyée avec l'email de l'utilisateur.
   */
  private requestReset() {
    this.userProfileService.requestPasswordReset(this.f.email.value)
      .subscribe({
        next: () => {
          this.success = 'Un email avec un code de réinitialisation a été envoyé à ' + this.f.email.value;
          this.phase = 'verify';
          this.email = this.f.email.value;
          this.loading = false;
        },
        error: error => {
          this.error = 'Erreur lors de la demande de réinitialisation du mot de passe.';
          this.loading = false;
        }
      });
  }

  /**
   * Vérifie le code de réinitialisation.
   */
  private verifyCode() {
    this.userProfileService.verifyResetCode(this.email, this.f.verificationCode.value)
      .subscribe({
        next: () => {
          this.success = 'Code de réinitialisation vérifié. Vous pouvez maintenant réinitialiser votre mot de passe.';
          this.phase = 'reset';
          this.loading = false;
        },
        error: error => {
          this.error = 'Erreur lors de la vérification du code.';
          this.loading = false;
        }
      });
  }

  /**
   * Réinitialise le mot de passe de l'utilisateur.
   * 
   * Envoie une requête POST au backend pour réinitialiser le mot de passe de l'utilisateur.
   * La requête est envoyée avec l'email de l'utilisateur, le code de vérification et le nouveau mot de passe.
   */
  private resetPassword() {
    this.userProfileService.resetPassword(this.email, this.f.verificationCode.value, this.f.newPassword.value)
      .subscribe({
        next: () => {
          this.success = 'Votre mot de passe a été réinitialisé avec succès.';
          this.router.navigate(['/account/login']);
        },
        error: error => {
          this.error = 'Erreur lors de la réinitialisation du mot de passe.';
          this.loading = false;
        }
      });
  }

  /**
   * Affiche ou masque le mot de passe.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.hidePassword ? 'text' : 'password';
    }
  }
  
  /**
   * Affiche ou masque le mot de passe de confirmation.
   */
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    if (confirmPasswordInput) {
      confirmPasswordInput.type = this.hideConfirmPassword ? 'text' : 'password';
    }
  }  

  /**
   * Vérifie si les valeurs des champs spécifiés correspondent.
   * @param password Le nom du champ mot de passe.
   * @param confirmPassword Le nom du champ de confirmation du mot de passe.
   * @returns Un validateur de groupe qui retourne une erreur si les valeurs des champs spécifiés ne correspondent pas.
   */
  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: UntypedFormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
  
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.mustMatch) {
        // retourner si un autre validateur a déjà trouvé une erreur sur le confirmPasswordControl
        return;
      }
  
      // définir l'erreur sur confirmPasswordControl si la validation échoue
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  /**
   * Vérifie la force du mot de passe en utilisant zxcvbn.
   * @param password Le mot de passe à évaluer.
   */
  checkPasswordStrength(password: string) {
    const results = zxcvbn(password);
    this.passwordStrength = results;
    this.passwordFeedback = results.feedback?.suggestions?.join(', ') ?? 'No suggestions available';
  }

  /**
   * Génère un mot de passe aléatoire et le définit comme valeur du champ mot de passe du formulaire.
   */
  suggestPassword(): void {
    const newPassword = this.generatePassword(10);
    this.resetForm.get('newPassword').setValue(newPassword);
    // Vérifie la force du mot de passe généré
    this.checkPasswordStrength(newPassword);
  }

  /**
   * Génère un mot de passe aléatoire de longueur spécifiée.
   * @param length La longueur du mot de passe à générer.
   * @returns Le mot de passe généré.
   */
  generatePassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
}
