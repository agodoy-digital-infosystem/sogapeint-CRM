import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../core/services/company.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-company-update',
  templateUrl: './company-update.component.html',
  styleUrls: ['./company-update.component.scss']
})
export class CompanyUpdateComponent implements OnInit {
  companyForm: FormGroup;
  companyId: string;
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
        name: ['', Validators.required],
        address: [''],
        industry: [''],
        websites: this.formBuilder.array([]),
        phone: this.formBuilder.array([]),
        email: [''],
        additionalFields: this.formBuilder.group({}) // additionalFields comme un FormGroup vide
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
        
      }
