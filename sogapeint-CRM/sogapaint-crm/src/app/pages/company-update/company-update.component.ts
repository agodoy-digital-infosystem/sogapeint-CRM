import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from '../../core/models/company.models';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.scss']
})
export class CompanyUpdateComponent implements OnInit {
  companyForm: FormGroup;
  companyId: string;
  company: Company;
  successMessage: string = '';
  errorMessage: string = '';
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  pageTitle: string = 'Modifier les détails de l\'entreprise';
  
  @ViewChild('confirmationModal', { static: false }) confirmationModal; // Référence au modal dans le template
  
  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
    ) {
      this.companyForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
        address: [''],
        industry: ['', Validators.pattern('^[A-Za-z0-9 ]+$')],
        websites: this.formBuilder.array([], this.validUrl),
        phone: this.formBuilder.array([], this.validFrenchPhoneNumber),
        email: ['', Validators.email],
        additionalFields: this.formBuilder.group({}) 
      });
      
      this.companyId = '';
      this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
    }
    
    ngOnInit(): void {
      // Récupération de l'ID depuis l'URL
      this.route.params.subscribe(params => {
        this.companyId = params['companyId'];
        if (this.companyId) {
          this.loadCompanyDetails(this.companyId);
        }
      });
      
    }
    
    loadCompanyDetails(id: string): void {
      console.log('Loading company details for id:', id);
      this.companyService.getCompanyById(id).subscribe(
        company => {
          console.log('Company details:', company);
          this.companyForm.patchValue({
            name: company.normalized_name,
            address: company.address,
            industry: company.industry,
            email: company.email
          });
          this.company = company;
          this.setupValueChangeSubscriptions(company);
          this.setFormArrays('websites', company.websites);
          this.setFormArrays('phone', company.phone);
          this.setAdditionalFields(company.additionalFields);
        },
        error => {
          this.errorMessage = 'Erreur lors du chargement des détails de l\'entreprise.';
          console.error('Error loading the company details', error);
        }
        );
      }
      
      setupValueChangeSubscriptions(company: Company): void {
        // Assuming company has properties like 'normalized_name', 'address', etc.
        this.companyForm.get('name').valueChanges.subscribe(() => {
          this.resetControlIfUnchanged('name', company.normalized_name);
        });
        
        if (company.hasOwnProperty('address')) {
          this.companyForm.get('address').valueChanges.subscribe(() => {
            this.resetControlIfUnchanged('address', company.address);
          });
        }
        
        if (company.hasOwnProperty('industry')) {
          this.companyForm.get('industry').valueChanges.subscribe(() => {
            this.resetControlIfUnchanged('industry', company.industry);
          });
        }
        
        if (company.hasOwnProperty('email')) {
          this.companyForm.get('email').valueChanges.subscribe(() => {
            this.resetControlIfUnchanged('email', company.email);
          });
        }
        
      }
      
      resetControlIfUnchanged(controlName: string, originalValue: any): void {
        console.log('resetControlIfUnchanged', controlName, originalValue);
        const control = this.companyForm.get(controlName);
        
        const isOriginallyUndefined = originalValue === undefined || originalValue === null || originalValue === '' || originalValue.length === 0;
        const isControlValueUnchanged = isOriginallyUndefined ? control.value === '' || control.value === null : control.value === originalValue;
        
        if (isControlValueUnchanged) {
          control.markAsPristine();
          control.markAsUntouched();
        }
      }
      
      
      validUrl(control: FormControl): ValidationErrors | null {
        const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return urlPattern.test(control.value) ? null : { invalidUrl: true };
      }
      
      // validation des numéros internationaux, si besoin plus tard
      validPhoneNumber(control: FormControl): ValidationErrors | null {
        const phonePattern = /^\+?[1-9]\d{1,14}$/; 
        return phonePattern.test(control.value) ? null : { invalidPhoneNumber: true };
      }
      
      validFrenchPhoneNumber(control: FormControl): ValidationErrors | null {
        // Ce modèle correspond aux numéros de téléphone français en permettant au chiffre de départ d'être 0,
        // suivi d'un chiffre compris entre 1 et 9 (pour les fixes) ou 6 ou 7 (pour les mobiles),
        // puis n'importe quelle combinaison de 8 chiffres.
        // Il autorise également des espaces entre les groupes de deux chiffres pour plus de lisibilité.
        const phonePattern = /^(0[1-9]|0[6-7])(?:\s?\d{2}){4}$/;
        return phonePattern.test(control.value) ? null : { invalidPhoneNumber: true };
      }
      
      
      setFormArrays(fieldName: string, items: string[]): void {
        const formArray = this.companyForm.get(fieldName) as FormArray;
        // Clear the existing FormArray
        while (formArray.length !== 0) {
          formArray.removeAt(0);
        }
        // Add new FormControls to the FormArray
        items.forEach(item => formArray.push(new FormControl(item)));
      }
      
      
      getFormArray(fieldName: string): FormArray {
        return this.companyForm.get(fieldName) as FormArray;
      }
      
      addWebsite(): void {
        const control = this.formBuilder.control('', Validators.compose([Validators.required, this.validUrl]));
        (this.companyForm.get('websites') as FormArray).push(control);
      }
      
      addPhone(): void {
        const control = this.formBuilder.control('', Validators.compose([Validators.required, this.validFrenchPhoneNumber]));
        (this.companyForm.get('phone') as FormArray).push(control);
      }
      
      setAdditionalFields(fields: {[key: string]: any} | null | undefined): void {
        const additionalFieldsGroup = this.companyForm.get('additionalFields') as FormGroup;
        // Clear the existing FormGroup controls
        Object.keys(additionalFieldsGroup.controls).forEach(key => {
          additionalFieldsGroup.removeControl(key);
        });
        // If fields is not null or undefined, add new FormControls to the FormGroup
        if (fields) {
          Object.keys(fields).forEach(key => {
            additionalFieldsGroup.addControl(key, new FormControl(fields[key]));
          });
        }
      }
      
      
      addAdditionalField(): void {
        const additionalFieldsGroup = this.companyForm.get('additionalFields') as FormGroup;
        // Utilisez un identifiant unique ou un prompt pour le nom du champ
        const fieldName = `field_${Object.keys(additionalFieldsGroup.controls).length}`;
        additionalFieldsGroup.addControl(fieldName, new FormControl(''));
      }
      
      removeAdditionalField(key: string): void {
        const additionalFieldsGroup = this.companyForm.get('additionalFields') as FormGroup;
        additionalFieldsGroup.removeControl(key);
      }
      
      additionalFieldsKeys(): string[] {
        return Object.keys((this.companyForm.get('additionalFields') as FormGroup).controls);
      }
      
      
      onSubmit(): void {
        // if (this.companyForm.valid) {
        //   this.companyService.updateCompany(this.companyId, this.companyForm.value).subscribe({
        //     next: (res) => {
        //       this.successMessage = 'Entreprise mise à jour avec succès.';
        //       this.errorMessage = '';
        //       setTimeout(() => this.location.back(), 3000);
        //     },
        //     error: (err) => {
        //       this.errorMessage = 'Erreur lors de la mise à jour de l\'entreprise.';
        //       this.successMessage = '';
        //       console.error('Error updating the company', err);
        //     }
        //   });
        // }
        this.openConfirmationModal();
      }
      
      // Utilitaires pour ajouter ou supprimer des éléments des FormArray
      addFormArrayItem(fieldName: string): void {
        this.getFormArray(fieldName).push(new FormControl(''));
      }
      
      removeFormArrayItem(fieldName: string, index: number): void {
        this.getFormArray(fieldName).removeAt(index);
      }
      
      openConfirmationModal() {
        if (this.companyForm.dirty) { // Vérifie si des modifications ont été apportées
          this.modalService.open(this.confirmationModal).result.then(
            (result) => {
              if (result === 'confirm') {
                this.confirmUpdate();
              }
            },
            (reason) => {
              // Gestion de la fermeture du modal sans confirmation
            }
            );
          } else {
            // Pas de modifications détectées, pas besoin d'ouvrir le modal
          }
        }
        
        // Méthode appelée pour confirmer la mise à jour
        confirmUpdate() {
          if (this.companyForm.valid) {
            this.companyService.updateCompany(this.companyId, this.companyForm.value).subscribe({
              next: (res) => {
                this.successMessage = 'Entreprise mise à jour avec succès.';
                this.errorMessage = '';
                setTimeout(() => this.location.back(), 3000);
              },
              error: (err) => {
                this.errorMessage = 'Erreur lors de la mise à jour de l\'entreprise.';
                this.successMessage = '';
                console.error('Error updating the company', err);
              }
            });
          }
        }
        
        cancelUpdate(): void {
          // Redirige vers la page de détail de l'entreprise en utilisant l'ID de l'entreprise
          this.router.navigate(['/company-detail', this.companyId]);
        }
        
        // Ces méthodes sont utiles pour gérer la couleur des champs de formulaire
        resetDirty(controlName: string) {
          let control = this.companyForm.get(controlName);
          if (control.value === this.company[controlName]) {
            control.markAsPristine();
            control.markAsUntouched();
          }
        }
        
        resetField(controlName: string) {
          // map the original value to the form control
          // this.company.normalized_name => this.companyForm.get('name').setValue(this.company.normalized_name);
          // this.company.address => this.companyForm.get('address').setValue(this.company.address);
          // this.company.industry => this.companyForm.get('industry').setValue(this.company.industry);
          // this.company.email => this.companyForm.get('email').setValue(this.company.email);
          // bref, il me fait faire un mapping : controlName => this.company[controlName]
          
          // const originalValue = this.company[controlName];
          let originalValue;
          switch(controlName) {
            case 'name':
            originalValue = this.company.normalized_name;
            break;
            case 'address':
            originalValue = this.company.address;
            break;
            case 'industry':
            originalValue = this.company.industry;
            break;
            case 'email':
            originalValue = this.company.email;
            break;
            default:
            console.error(`Invalid controlName: ${controlName}`);
            return;
          }
          this.companyForm.get(controlName).setValue(originalValue);
          this.companyForm.get(controlName).markAsPristine();
          this.companyForm.get(controlName).markAsUntouched();
        }
        
      }
