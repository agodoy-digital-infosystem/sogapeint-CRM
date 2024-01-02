import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserProfileService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnFrPackage from '@zxcvbn-ts/language-fr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CompanyService } from '../../core/services/company.service';
import { User } from 'src/app/core/models/auth.models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Composant pour la création d'un utilisateur.
 * Utilise le FormBuilder pour la validation de formulaire et UserProfileService pour la gestion des utilisateurs.
 */
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  pageTitle: string = 'Créer un utilisateur';
  userForm: FormGroup;
  roles = [
    { name: 'Super administrateur', value: 'superAdmin' },
    { name: 'Cocontractant', value: 'cocontractor' },
    { name: 'Sous-traitant', value: 'subcontractor' },
    { name: 'Client', value: 'customer' },
    { name: 'Cogestionnaire', value: 'comanager' },
    { name: 'Supermanager', value: 'supermanager' }
  ];
  passwordStrength: any;
  passwordFeedback: string;
  hidePassword = true;
  companies: any[];
  companyInput$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();
  public successMessage: string;
  public errorMessage: string;
  confirmationModal: any;

  constructor(
      private userProfileService: UserProfileService,
      private companyService: CompanyService,
      private formBuilder: FormBuilder, 
      private modalService: NgbModal,
      private router: Router
    ) {
    this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
    // initialization du formulaire
    // const phoneRegex = /^((\+|00)33\s?|0)[1-9](\s?\d{2}){4}$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', Validators.required], // la valeur par défaut est 'user'
      status: true, // la valeur par défaut est 'active'
      authorized: true, // la valeur par défaut est 'authorized',
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      address: [''], // facultatif
      company: ['', Validators.required]
    });

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

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
    // Entreprises
    this.loadInitialCompanies();
    this.companyInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.companyService.searchCompanies(term)),
      takeUntil(this.unsubscribe$)
    ).subscribe(companies => {
      this.companies = companies;
    });
  }

  /**
   * Nettoie les souscriptions lors de la destruction du composant.
   */
  ngOnDestroy() {
    // Signale que toutes les souscriptions doivent être arrêtées
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Soumet le formulaire et crée un utilisateur si les données sont valides.
   * Affiche des erreurs de validation sinon.
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      // Crée un user à partir des données du formulaire
      const user: User = {
        firstName: this.userForm.get('firstName').value,
        lastName: this.userForm.get('lastName').value,
        email: this.userForm.get('email').value,
        password: this.userForm.get('password').value,
        role: this.userForm.get('role').value,
        active: this.userForm.get('status').value,
        authorized_connection: this.userForm.get('authorized').value,
        phone: this.userForm.get('phone').value,
        address: this.userForm.get('address').value,
        company: this.userForm.get('company').value
      };
      console.log(user); 
      // On peut ici appeler un service pour envoyer les données du formulaire à l'API
      this.userProfileService.create(user).subscribe({

        next: (data: any) => {
          console.log('Utilisateur créé avec succès:', data);
          this.successMessage = 'Utilisateur créé avec succès';
          // Rediriger l'utilisateur vers la page de gestion des utilisateurs
          this.router.navigate(['/manage-users'])
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur:', error);
          this.errorMessage = 'Erreur lors de la création de l\'utilisateur : '+error;
        },
        complete: () => {
          console.log('Création de l\'utilisateur terminée');
        }
      });
    } else {
      // Traiter les erreurs de validation du formulaire
      console.log('Le formulaire n\'est pas valide');
      // Afficher les erreurs de validation
      this.userForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre.';

    }
  }

   /**
   * Vérifie la force du mot de passe en utilisant zxcvbn.
   * @param password Le mot de passe à évaluer.
   */
  checkPasswordStrength(password: string) {
    const results = zxcvbn(password);
    console.log('zxcvbn results:', results);
    this.passwordStrength = results;
    console.log('Password score:', this.passwordStrength.score);
    console.log('Password feedback:', this.passwordStrength.feedback);
    this.passwordFeedback = results.feedback?.suggestions?.join(', ') ?? 'No suggestions available';
  } 
  
  /**
   * Génère un mot de passe aléatoire et le définit comme valeur du champ mot de passe du formulaire.
   */
  suggestPassword(): void {
    const newPassword = this.generatePassword(10);
    this.userForm.get('password').setValue(newPassword);
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

  /**
   * Bascule la visibilité du mot de passe.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Charge la liste des entreprises.
   */
  loadInitialCompanies() {
    this.companyService.getCompanies() 
        .subscribe(companies => this.companies = companies);
  }

  /**
   * Filtre la liste des entreprises en fonction de la valeur saisie dans le champ de recherche.
   * @param val La valeur saisie dans le champ de recherche.
   * @returns Un Observable contenant un tableau d'entreprises filtrées.
   */
  filterCompanies(val: string): Observable<any[]> {
      return this.companyService.searchCompanies(val);
  }

  /**
   * Ajoute une nouvelle entreprise à la liste des entreprises si elle n'existe pas déjà.
   * Cette fonction est appelée lorsque le champ de recherche perd le focus. et permet
   * à l'utilisateur d'ajouter une nouvelle entreprise à la liste, et donc de conserver
   * le nom d'une nouvelle entreprise dans le formulaire.
   * @param event L'événement de saisie dans le champ de recherche.
   */
  onCompanyInputBlur(event: any): void {
    console.log("onCompanyInputBlur");
    const inputValue = event.target.value;
    if (inputValue && !this.companies.includes(inputValue)) {
      // Ajoute inputValue à la liste des entreprises
      this.companies = [...this.companies, inputValue];
      // S'assure que la valeur est sélectionnée
      this.userForm.get('company').setValue(inputValue);
    }
  }

  /**
   * Ouvre la fenêtre modale de confirmation de création d'un utilisateur.
   * @param content  Le contenu de la fenêtre modale.
   */
  openConfirmationModal(content: any) {
    if (this.userForm.valid) {
      this.confirmationModal = this.modalService.open(content);
    }
    else {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre. Sinon... Exactement!';
      // Si le formulaire n'est pas valide, touche tous les champs pour afficher les messages d'erreur
      this.touchAllFields(this.userForm);
    }
  }

  /**
   * Marque tous les champs d'un groupe de formulaires comme touchés par le saigneur.
   * @param formGroup Le groupe de formulaires à valider.
   */
  private touchAllFields(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        formGroup.controls[key].markAsTouched();
      }
    }
  }
}
