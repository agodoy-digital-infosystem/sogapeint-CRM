import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CompanyService } from '../../core/services/company.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss']
})
export class CompanyCreateComponent implements OnInit {
  companyForm: FormGroup;
  existingCompanyNames: string[] = [];
  filteredCompanyNames: Observable<string[]>;
  errorMessage: string = '';
  successMessage: string = '';
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  pageTitle: string = 'Ajouter une entreprise';
  
  constructor(
    private fb: FormBuilder, 
    private companyService: CompanyService,
    private router: Router
    ) { }
  
  ngOnInit(): void {
    this.companyForm = this.fb.group({
      normalized_name: ['', Validators.required],
      names: ['', Validators.required],
      industry: [''],
      email: ['', Validators.email],
      address: [''],
      websites: this.fb.array([this.fb.control('')]), // Commence avec un champ vide
      phone: this.fb.array([this.fb.control('')]), // Commence avec un champ vide
      additionalFields: this.fb.array([])
    });
    
    this.getCompaniesNames();
  }
  
  getCompaniesNames(): void {
    this.companyService.getCompaniesNames().subscribe({
      next: (names) => {
        this.existingCompanyNames = names;
        this.setupNameAutocomplete();
      },
      error: (error) => {
        console.error('Error fetching company names', error);
      }
    });
  }
  
  setupNameAutocomplete() {
    this.filteredCompanyNames = this.companyForm.controls['names'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
      );
    }
    
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.existingCompanyNames.filter(option => option.toLowerCase().includes(filterValue));
    }
    
    checkCompanyName() {
      const name = this.companyForm.get('names').value;
      const normalized = this.normalizeCompanyName(name);
      if (this.existingCompanyNames.includes(normalized)) {
        this.errorMessage = 'Une entreprise avec ce nom existe déjà.';
      } else {
        this.errorMessage = '';
      }
    }

    normalizeCompanyName(name: string): string {
      return name
          .toUpperCase() // Convertir en majuscules
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
          .replace(/\d{4}/g, "") // Supprimer les années
          .trim() // Supprimer les espaces avant et après
          .replace(/\s+/g, ' '); // Remplacer les espaces multiples par un seul espace
  }
    
    onSubmit() {
      this.companyForm.addControl('normalized_name', this.fb.control(''));
      this.companyForm.get('normalized_name').setValue(this.normalizeCompanyName(this.companyForm.get('names').value));
      if (this.companyForm.valid && this.errorMessage === '') {
        this.companyService.createCompany(this.companyForm.value).subscribe({
          next: (response) => {
            this.successMessage = 'Entreprise créée avec succès.';
            this.companyForm.reset();
            // Retourne à manage-companies après 2 secondes
            setTimeout(() => {
              // navique vers la page de gestion des entreprises
              this.router.navigate(['/manage-companies']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error creating company', error);
            this.errorMessage = 'Erreur lors de la création de l’entreprise.';
          }
        });
      }
    }
    
    
    // Méthode pour récupérer un FormArray
    getFormArray(arrayName: string): FormArray {
      return this.companyForm.get(arrayName) as FormArray;
    }
    
    // Méthodes pour ajouter un élément à un FormArray
    addWebsite(): void {
      const websites = this.getFormArray('websites');
      websites.push(this.fb.control('', Validators.required));
    }
    
    addPhone(): void {
      const phoneNumbers = this.getFormArray('phone');
      phoneNumbers.push(this.fb.control('', Validators.required));
    }
    
    // addAdditionalField(): void {
    //   const additionalFields = this.companyForm.get('additionalFields') as FormArray;
    //   additionalFields.push(this.fb.group({
    //     key: ['', Validators.required],
    //     value: ['']
    //   }));
    // }
    addAdditionalField(): void {
      const additionalFields = this.companyForm.get('additionalFields') as FormArray;
      const group = this.fb.group({
        key: ['', Validators.required], // Peut-être voulez-vous ajouter des validateurs ici
        value: [''] // Peut-être voulez-vous ajouter des validateurs ici
      });
      additionalFields.push(group);
    }
    
    removeAdditionalField(index: number): void {
      const additionalFields = this.companyForm.get('additionalFields') as FormArray;
      additionalFields.removeAt(index);
    }
    
    // Getter pour les additionalFields en tant que FormArray
    get additionalFields(): FormArray {
      return this.companyForm.get('additionalFields') as FormArray;
    }
    
    // Méthodes pour supprimer un élément d'un FormArray
    removeWebsite(index: number): void {
      const websites = this.getFormArray('websites');
      websites.removeAt(index);
    }
    
    removePhone(index: number): void {
      const phoneNumbers = this.getFormArray('phone');
      phoneNumbers.removeAt(index);
    }
    
    // removeAdditionalField(index: number): void {
    //   const additionalFields = this.getFormArray('additionalFields');
    //   additionalFields.removeAt(index);
    // }
    
    // Cette méthode retourne les clés des champs supplémentaires
    additionalFieldsKeys(): string[] {
      const additionalFields = this.companyForm.get('additionalFields') as FormGroup;
      return Object.keys(additionalFields.controls);
    }
    
    // Cette méthode retourne les contrôles d'un champ supplémentaire
    removeFormArrayItem(fieldName: string, index: number): void {
      const formArray = this.getFormArray(fieldName);
      formArray.removeAt(index);
    }

    addFormArrayItem(fieldName: string): void {
      const formArray = this.getFormArray(fieldName);
      formArray.push(this.fb.control(''));
    }
  }
