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

@Component({
  selector: "app-company-update",
  templateUrl: "./company-update.component.html",
  styleUrls: ["./company-update.component.scss"],
})
export class CompanyUpdateComponent implements OnInit {
  companyForm: FormGroup;
  companyId: string;
  company: Company;
  successMessage: string = "";
  errorMessage: string = "";
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> =
    [];
  pageTitle: string = "Modifier les détails de l'entreprise";

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
      name: ["", [Validators.required, Validators.pattern("^[A-Za-z0-9 ]+$")]],
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
    this.route.params.subscribe((params) => {
      this.companyId = params["companyId"];
      if (this.companyId) {
        this.loadCompanyDetails(this.companyId);
      }
    });
  }

  loadCompanyDetails(id: string): void {
    console.log("Loading company details for id:", id);
    this.companyService.getCompanyById(id).subscribe(
      (company) => {
        console.log("Company details:", company);
        this.companyForm.patchValue({
          name: company.normalized_name,
          address: company.address,
          industry: company.industry,
          email: company.email,
        });
        this.company = company;
        this.setupValueChangeSubscriptions(company);
        this.setFormArrays("websites", company.websites);
        this.setFormArrays("phone", company.phone);
        this.setAdditionalFields(company.additionalFields);
      },
      (error) => {
        this.errorMessage =
          "Erreur lors du chargement des détails de l'entreprise.";
        console.error("Error loading the company details", error);
      }
    );
  }

  setupValueChangeSubscriptions(company: Company): void {
    this.companyForm.get("name").valueChanges.subscribe(() => {
      this.resetControlIfUnchanged("name", company.normalized_name);
    });

    if (company.hasOwnProperty("address")) {
      this.companyForm.get("address").valueChanges.subscribe(() => {
        this.resetControlIfUnchanged("address", company.address);
      });
    }

    if (company.hasOwnProperty("industry")) {
      this.companyForm.get("industry").valueChanges.subscribe(() => {
        this.resetControlIfUnchanged("industry", company.industry);
      });
    }

    if (company.hasOwnProperty("email")) {
      this.companyForm.get("email").valueChanges.subscribe(() => {
        this.resetControlIfUnchanged("email", company.email);
      });
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
}
