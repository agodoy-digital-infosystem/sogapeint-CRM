import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CompanyService } from "../../core/services/company.service";
import { Location } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Company } from "../../core/models/company.models";
import { Observable } from "rxjs";
import { NaturesJuridiques } from "../../core/data/natures-juridiques";

@Component({
  selector: "app-company-update",
  templateUrl: "./company-update.component.html",
  styleUrls: ["./company-update.component.scss"],
})
export class CompanyUpdateComponent implements OnInit {
  companyForm: FormGroup;
  companyId: string;
  company: Company;
  existingCompanyNames: string[] = [];
  filteredCompanyNames: Observable<string[]>;
  successMessage: string = "";
  errorMessage: string = "";
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> =
    [];
  pageTitle: string = "Modifier les détails de l'entreprise";
  isLoading = false;
  scrapedCompanies: any[] = [];
  subscriptions: any[] = [];
  scrape_button_visible = false;

  @ViewChild("confirmationModal", { static: false }) confirmationModal;

  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {
    this.companyForm = this.formBuilder.group({
      names: ["", [Validators.required, Validators.pattern("^[A-Za-z0-9 ]+$")]],
      normalized_name: [""],
      abbreviation: [""],
      address: [""],
      industry: [""],
      websites: this.formBuilder.array([]),
      phone: this.formBuilder.array([]),
      email: ["", this.validEmail],
      additionalFields: this.formBuilder.array([]),
    });

    this.companyId = "";
    this.breadCrumbItems = [
      { label: "Sogapeint" },
      { label: this.pageTitle, active: true },
    ];
  }

  ngOnInit(): void {
    this.subscriptions.push( this.route.params.subscribe((params) => {
      this.companyId = params["companyId"];
      if (this.companyId) {
        this.loadCompanyDetails(this.companyId);
      }
    }));

    // Écoute pour les événements blur sur le champ 'names'
    const namesField = this.companyForm.get('names');
    const addressField = this.companyForm.get('address');

    this.subscriptions.push(this.companyForm.valueChanges.subscribe(() => {
      this.areNameAndAddressFilled();
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    
  }

  loadCompanyDetails(id: string): void {
    console.log("Loading company details for id:", id);
    this.companyService.getCompanyById(id).subscribe(
      (company) => {
        console.log("Company details:", company);
        this.companyForm.patchValue({
          names: company.normalized_name,
          normalized_name: company.normalized_name,
          abbreviation: company.abbreviation,
          address: company.address,
          industry: company.industry,
          email: company.email,
        });
        if (!company.hasOwnProperty("abbreviation")) {
          this.companyForm.get("abbreviation").setValue(this.generateAbbreviation(company.normalized_name));
          this.companyForm.get("abbreviation").markAsDirty();
        }
        this.company = company;
        this.setupValueChangeSubscriptions(company);
        this.setFormArrays("websites", company.websites);
        this.setFormArrays("phone", company.phone);
        this.setAdditionalFields(company.additionalFields);
        // this.areNameAndAddressFilled();
      },
      (error) => {
        this.errorMessage =
          "Erreur lors du chargement des détails de l'entreprise.";
        console.error("Error loading the company details", error);
      }
    );
  }

  setupValueChangeSubscriptions(company: Company): void {
    this.subscriptions.push(this.companyForm.get("names").valueChanges.subscribe(() => {
      // this.areNameAndAddressFilled();
      this.resetControlIfUnchanged("names", company.normalized_name);
    }));

    if (company.hasOwnProperty("address")) {
      this.subscriptions.push(this.companyForm.get("address").valueChanges.subscribe(() => {
        // this.areNameAndAddressFilled();
        this.resetControlIfUnchanged("address", company.address);
      }));
    }

    if (company.hasOwnProperty("industry")) {
      this.subscriptions.push(this.companyForm.get("industry").valueChanges.subscribe(() => {
        this.resetControlIfUnchanged("industry", company.industry);
      }));
    }

    if (company.hasOwnProperty("email")) {
      this.subscriptions.push(this.companyForm.get("email").valueChanges.subscribe(() => {
        this.resetControlIfUnchanged("email", company.email);
      }));
    }
  }

  resetControlIfUnchanged(controlName: string, originalValue: any): void {
    console.log("resetControlIfUnchanged", controlName, originalValue);
    const control = this.companyForm.get(controlName);

    const isOriginallyUndefined =
      originalValue === undefined ||
      originalValue === null ||
      originalValue === "" ||
      originalValue.length === 0;
    const isControlValueUnchanged = isOriginallyUndefined
      ? control.value === "" || control.value === null
      : control.value === originalValue;

    if (isControlValueUnchanged) {
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  checkCompanyName() {
    const name = this.companyForm.get('names').value;
    const normalized = this.normalizeCompanyName(name);
    this.companyForm.get('normalized_name').setValue(normalized, {emitEvent: false});
    // Génération et mise à jour de l'abbréviation lors de la vérification du nom de l'entreprise
    const abbreviation = this.generateAbbreviation(normalized);
    this.companyForm.get('abbreviation').setValue(abbreviation);
    if (this.existingCompanyNames.includes(normalized)) {
      this.errorMessage = 'Une entreprise avec ce nom existe déjà.';
    } else {
      this.errorMessage = '';
    }
  }

  // Méthode pour générer l'abbréviation à partir du nom de l'entreprise
  generateAbbreviation(name: string): string {
    // Normaliser le nom et retirer les accents
    const normalized = this.normalizeCompanyName(name);
    // Filtrer uniquement les consonnes et les convertir en majuscules
    let consonants = normalized
    .toUpperCase()
    .replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/g, ''); // Ne garder que les consonnes en majuscule
    // Retourner les 5 premières consonnes
    return consonants.substr(0, 5);
  }

  validEmail(control: FormControl): ValidationErrors | null {
    console.log("validEmail called");
    console.log("control.value:", control.value);
    if (
      !control.value ||
      control.value === "" ||
      (Array.isArray(control.value) &&
        control.value.length === 1 &&
        control.value[0] === "")
    ) {
      return null;
    }

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(control.value) ? null : { invalidEmail: true };
  }

  validUrl(control: FormControl): ValidationErrors | null {
    if (!control.value || control.value === "") {
      return null;
    }

    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }

  validPhoneNumber(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    return phonePattern.test(control.value)
      ? null
      : { invalidPhoneNumber: true };
  }

  validFrenchPhoneNumber(control: FormControl): ValidationErrors | null {
    const phonePattern = /^(0[1-9]|0[6-7])(?:\s?\d{2}){4}$/;
    return phonePattern.test(control.value)
      ? null
      : { invalidPhoneNumber: true };
  }

  setFormArrays(fieldName: string, items: string[]): void {
    const formArray = this.companyForm.get(fieldName) as FormArray;

    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }

    items.forEach((item) => formArray.push(new FormControl(item)));
  }

  getFormArray(fieldName: string): FormArray {
    return this.companyForm.get(fieldName) as FormArray;
  }

  addWebsite(): void {
    const control = this.formBuilder.control("", this.validUrl);
    (this.companyForm.get("websites") as FormArray).push(control);
  }

  addPhone(): void {
    const control = this.formBuilder.control(
      "",
      Validators.compose([Validators.required, this.validFrenchPhoneNumber])
    );
    (this.companyForm.get("phone") as FormArray).push(control);
  }

  setAdditionalFields(fields: any[]): void {
    const additionalFieldsArray = this.companyForm.get(
      "additionalFields"
    ) as FormArray;

    while (additionalFieldsArray.length) {
      additionalFieldsArray.removeAt(0);
    }

    fields.forEach((field) => {
      const group = this.formBuilder.group({
        key: [field.key || ""],
        value: [field.value || ""],
      });
      additionalFieldsArray.push(group);
    });
  }

  addAdditionalField(): void {
    const additionalFieldsFormArray = this.companyForm.get(
      "additionalFields"
    ) as FormArray;
    const fieldGroup = this.formBuilder.group({
      key: [""],
      value: [""],
    });
    additionalFieldsFormArray.push(fieldGroup);
  }

  removeAdditionalField(index: number): void {
    const additionalFieldsFormArray = this.companyForm.get(
      "additionalFields"
    ) as FormArray;
    additionalFieldsFormArray.removeAt(index);
  }

  additionalFieldsKeys(): string[] {
    return Object.keys(
      (this.companyForm.get("additionalFields") as FormGroup).controls
    );
  }

  onSubmit(): void {
    this.openConfirmationModal();
  }

  addFormArrayItem(fieldName: string): void {
    this.getFormArray(fieldName).push(new FormControl(""));
  }

  removeFormArrayItem(fieldName: string, index: number): void {
    this.getFormArray(fieldName).removeAt(index);
  }

  openConfirmationModal() {
    if (this.companyForm.dirty) {
      this.modalService.open(this.confirmationModal).result.then(
        (result) => {
          if (result === "confirm") {
            this.confirmUpdate();
          }
        },
        (reason) => {}
      );
    } else {
    }
  }

  confirmUpdate() {
    console.log("confirmUpdate called");

    console.log("Form validity:", this.companyForm.valid);

    Object.keys(this.companyForm.controls).forEach((key) => {
      const control = this.companyForm.get(key);
      console.log(`${key} validity:`, control.valid);
    });

    const additionalFieldsArray = this.companyForm.get(
      "additionalFields"
    ) as FormArray;
    additionalFieldsArray.controls.forEach((group, index) => {
      console.log(`Additional Field ${index} validity:`, group.valid);
    });
    if (this.companyForm.valid) {
      console.log("Form is valid");
      try {
        const additionalFieldsControl =
          this.companyForm.get("additionalFields");
        if (!additionalFieldsControl) {
          console.error("additionalFields control is not found");
          return;
        }

        const additionalFields = (
          additionalFieldsControl as FormArray
        ).value.map((fieldGroup) => {
          console.log("Processing field:", fieldGroup);
          return { key: fieldGroup.key, value: fieldGroup.value };
        });

        const updatePayload = {
          ...this.companyForm.value,
          additionalFields: additionalFields,
        };

        console.log("updatePayload prepared:", updatePayload);

        this.companyService
          .updateCompany(this.companyId, updatePayload)
          .subscribe({
            next: (res) => {
              console.log("Company updated successfully:", res);
              this.successMessage = "Entreprise mise à jour avec succès.";
              this.errorMessage = "";
              setTimeout(() => this.location.back(), 3000);
            },
            error: (err) => {
              console.error("Error updating the company", err);
              this.errorMessage =
                "Erreur lors de la mise à jour de l'entreprise.";
              this.successMessage = "";
            },
          });
      } catch (error) {
        console.error("An error occurred during the update process:", error);
      }
    } else {
      console.error("Form is not valid");
    }
  }

  cancelUpdate(): void {
    this.router.navigate(["/company-detail", this.companyId]);
  }

  resetDirty(controlName: string) {
    let control = this.companyForm.get(controlName);
    if (control.value === this.company[controlName]) {
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  resetField(controlName: string) {
    let originalValue;
    switch (controlName) {
      case "name":
        originalValue = this.company.normalized_name;
        break;
      case "address":
        originalValue = this.company.address;
        break;
      case "industry":
        originalValue = this.company.industry;
        break;
      case "email":
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

  areNameAndAddressFilled(): boolean {
    const name = this.companyForm.get("names").value;
    const address = this.companyForm.get("address").value;
    const filled = name && address && this.extractZipCode(address) !== "";
    // console.log("areNameAndAddressFilled:", filled);
    this.scrape_button_visible = filled;
    return filled;
  }

  extractZipCode(address: string): string {
    const zipCode = address.match(/\b\d{5}\b/g);
    return zipCode ? zipCode[0] : "";
  }

  normalizeCompanyName(name: string): string {
    return name
      .toUpperCase() // Convertir en majuscules
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Retirer les accents
      .replace(/\d+/g, "") // Retirer tous les chiffres
      .trim() // Retirer les espaces au début et à la fin
      .replace(/\s{2,}/g, " "); // Remplacer les espaces multiples par un seul espace
  }

  scrapeCompanyList(): void {
    if (this.areNameAndAddressFilled()) {
      this.isLoading = true;
      const zipCode = this.extractZipCode(
        this.companyForm.get("address").value
      );
      this.companyService
        .scrapeCompanyList(this.companyForm.get("names").value)
        .subscribe({
          next: (data) => {
            this.scrapedCompanies = data;
            // si on a une entreprise correspondant exactement aux données du formulaire, on ne garde que celle-ci
            const matchingCompany = this.checkIfACompanyFromTheListCorrespondsExactly(data);
            if (matchingCompany !== undefined) {
              this.scrapedCompanies = [matchingCompany];
              console.log('Entreprise correspondant exactement trouvée:', matchingCompany);
            }
            this.isLoading = false;
          },
          error: () => (this.isLoading = false),
        });
    }
  }

  // vérifie si une entreprise de la liste correspond exactement aux données du formulaire (normalized_name et code postal dans l'adresse)
      // Si on en trouve une et une seule, on ne retourne que cette entreprise
      checkIfACompanyFromTheListCorrespondsExactly(data: any[]): any {
        const name = this.normalizeCompanyName(this.companyForm.get('names').value);
        const zipCode = this.extractZipCode(this.companyForm.get('address').value);
        return data.find((company: any) => 
          this.normalizeCompanyName(company.title) === name && 
          company.addresses.some((address: string) => address.includes(zipCode))
        );
      }

  scrapeCompanyData(name: string, zipCode: string): void {
      this.companyService.scrapeCompanyData(name, zipCode).subscribe({
        next: (data) => {
          this.scrapedCompanies = data;
          console.log('Scraped data:', data);
        },
        error: (error) => console.error('Error scraping company data:', error)
      });
    }

    fillFormWithScrapedData(company: any): void {
      this.isLoading = true; // Commencer l'animation de chargement
      const postalCode = this.extractZipCode(company.addresses[0]);
    
      this.companyForm.patchValue({
        industry: company.activity
      });
    
      // Appel au service pour récupérer des données supplémentaires
      this.companyService.scrapeCompanyData(company.title, postalCode)
        .subscribe({
          next: (data) => {
            console.log('Données enrichies de l’entreprise :', data);
            this.isLoading = false; // Arrêter l'animation de chargement
    
            // Ajouter ou mettre à jour chaque champ
            this.updateOrAddPredefinedAdditionalField('siren', data.siren);
            this.updateOrAddPredefinedAdditionalField('siret', data.siege?.siret);
            this.updateOrAddPredefinedAdditionalField('nom_raison_sociale', data.nom_raison_sociale);
            this.updateOrAddPredefinedAdditionalField('CA', data.ca);
            this.updateOrAddPredefinedAdditionalField('nombre_etablissements', data.nombre_etablissements?.toString());
            this.updateOrAddPredefinedAdditionalField('nombre_etablissements_ouverts', data.nombre_etablissements_ouverts?.toString());
            this.updateOrAddPredefinedAdditionalField('categorie_entreprise', data.categorie_entreprise);
            this.updateOrAddPredefinedAdditionalField('date_creation', data.date_creation);
            this.updateOrAddPredefinedAdditionalField('etat_administratif', data.etat_administratif);
            this.updateOrAddPredefinedAdditionalField('nature_juridique', this.getNatureJuridiqueDescription(data.nature_juridique));
            this.updateOrAddPredefinedAdditionalField('tranche_effectif_salarie_siege', data.siege?.tranche_effectif_salarie);
            this.updateOrAddPredefinedAdditionalField('date_creation_siege', data.siege?.date_creation);
            this.updateOrAddPredefinedAdditionalField('date_debut_activite_siege', data.siege?.date_debut_activite);
    
            if (data.siege?.adresse) {
              this.companyForm.patchValue({ address: data.siege.adresse });
            }
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des données enrichies de l’entreprise:', error);
            this.isLoading = false; // Arrêter l'animation de chargement
          }
        });
    }
    
    updateOrAddPredefinedAdditionalField(key: string, value: string): void {
      const additionalFields = this.companyForm.get('additionalFields') as FormArray;
      let fieldExists = false;
    
      // Vérifier si le champ existe déjà
      additionalFields.controls.forEach((group) => {
        if (group.get('key').value === key) {
          group.get('value').setValue(value);
          fieldExists = true;
        }
      });
    
      // Ajouter le champ s'il n'existe pas
      if (!fieldExists && value !== undefined) {
        additionalFields.push(this.formBuilder.group({
          key: [key, Validators.required],
          value: [value]
        }));
      }
    }
    

    addPredefinedAdditionalField(key: string, value: string): void {
      const additionalFields = this.companyForm.get('additionalFields') as FormArray;
      additionalFields.push(this.formBuilder.group({
        key: [key, Validators.required],
        value: [value]
      }));
    }
    
    
    getNatureJuridiqueDescription(code: string): string {
      return NaturesJuridiques[code] || 'Non spécifié';
    }
  
}
