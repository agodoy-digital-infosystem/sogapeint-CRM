import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from '../../core/services/contract.service';
import { UserProfileService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  orderForm: FormGroup;
  contractData: any = {
    internalNumber: '',
    customer: '',
    contact: '',
    externalContributor: '',
    subcontractor: '', // Nouveau champ ajouté
    address: '',
    appartmentNumber: '',
    quoteNumber: '',
    mailSended: false,
    invoiceNumber: '',
    amountHt: null,
    benefitHt: null,
    previsionDataHour: null, // Nouveau champ ajouté
    previsionDataDay: null,  // Nouveau champ ajouté
    executionDataDay: null,
    executionDataHour: null,
    benefit: null,
    status: null,
    occupied: false,
    startDateWorks: null,
    endDateWorks: null,
    endDateCustomer: null,
    trash: false,
    dateCde: null,
    ged: '', // Nouveau champ ajouté
  };
  
  users: any[] = [];
  userInput$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();
  
  statuses = [
    { name: 'À réaliser', value: null }, // ou une chaîne vide si nécessaire
    { name: 'Réalisé', value: 'achieve' },
    { name: 'Annulé', value: 'canceled' },
    { name: 'Facturé', value: 'invoiced' },
    { name: 'En cours', value: 'in_progress' }
  ];
  
  benefits = [
    { name: 'Peinture', value: '5e4ba27006d62fd4a4e49916' },
    { name: 'Sol', value: '5e4ba27606d62fd4a4e49917' },
    { name: 'Électricité', value: '5e52cb8148f8b27b3d077a84' },
    { name: 'Plomberie', value: '5e52cb8148f8b27b3d077a85' },
    { name: 'Maçonnerie', value: '5e52cb8148f8b27b3d077a86' },
    { name: 'Menuiserie', value: '5e52cb8148f8b27b3d077a87' },
    { name: 'Vitrification', value: '5e52cb8148f8b27b3d077a88' },
    { name: 'Nettoyage', value: '5e52cb8148f8b27b3d077a89' },
    { name: 'Faïence', value: '5f58fef3bfdad857fcfbba50' },
    { name: 'Placo', value: '5f58fefdbfdad857fcfbba51' },
    { name: 'Carrelage', value: '5f58ff06bfdad857fcfbba52' }
  ];
  
  invalidKeyStrokes = 0;
  isEmojiVisible = false;
  
  constructor(
    private contractService: ContractService, 
    private userProfileService: UserProfileService,
    private router: Router
    ) {}
    
    ngOnInit(): void {
      // Initialize the form group with controls corresponding to contractData structure
      this.orderForm = new FormGroup({
        internalNumber: new FormControl(this.contractData.internalNumber),
        customer: new FormControl(this.contractData.customer, Validators.required), // Assuming it's required
        contact: new FormControl(this.contractData.contact),
        externalContributor: new FormControl(this.contractData.externalContributor),
        subcontractor: new FormControl(this.contractData.subcontractor),
        address: new FormControl(this.contractData.address),
        appartmentNumber: new FormControl(this.contractData.appartmentNumber),
        quoteNumber: new FormControl(this.contractData.quoteNumber),
        mailSended: new FormControl(this.contractData.mailSended),
        invoiceNumber: new FormControl(this.contractData.invoiceNumber),
        amountHt: new FormControl(this.contractData.amountHt, [Validators.pattern(/^\d+\.?\d*$/)]), // Only numbers with optional decimal
        benefitHt: new FormControl(this.contractData.benefitHt, [Validators.pattern(/^\d+\.?\d*$/)]), // Only numbers with optional decimal
        previsionDataHour: new FormControl(this.contractData.previsionDataHour, [Validators.pattern(/^\d+$/)]), // Only whole numbers
        previsionDataDay: new FormControl(this.contractData.previsionDataDay, [Validators.pattern(/^\d+$/)]), // Only whole numbers
        executionDataDay: new FormControl(this.contractData.executionDataDay, [Validators.pattern(/^\d+$/)]), // Only whole numbers
        executionDataHour: new FormControl(this.contractData.executionDataHour, [Validators.pattern(/^\d+$/)]), // Only whole numbers
        benefit: new FormControl(this.contractData.benefit),
        status: new FormControl(this.contractData.status),
        occupied: new FormControl(this.contractData.occupied),
        startDateWorks: new FormControl(this.contractData.startDateWorks),
        endDateWorks: new FormControl(this.contractData.endDateWorks),
        endDateCustomer: new FormControl(this.contractData.endDateCustomer),
        trash: new FormControl(this.contractData.trash),
        dateCde: new FormControl(this.contractData.dateCde),
        ged: new FormControl(this.contractData.ged),
      });

      this.orderForm.valueChanges.subscribe(val => {
        console.log(val);
      });

      // Mettre à jour `contractData` en temps réel avec les changements de formulaire.
      this.orderForm.valueChanges.subscribe(val => {
        this.contractData = { ...this.contractData, ...val };
        console.log(this.contractData);
      });
      
      this.breadCrumbItems = [
        { label: 'Accueil', path: '/' },
        { label: 'Saisie d’une commande', active: true }
      ];
      
      // Setup for user search and typeahead functionality
      this.userInput$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => term ? this.userProfileService.searchUsers(term.toLowerCase()) : of([])),
        takeUntil(this.unsubscribe$)
        ).subscribe(users => {
          this.users = users;
        });
      }
      
      onAlphaInput(event: KeyboardEvent): void {
        
        if (!/[0-9]/.test(event.key) &&
        !['Backspace','ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Enter'].includes(event.key) &&
        !(event.key === 'e' || event.key === '.' || event.key === '-' || event.key === '+')) {
          event.preventDefault(); 
          const inputElement = event.target as HTMLInputElement;
          
          this.invalidKeyStrokes++;
          inputElement.classList.add('input-error');
          
          
          setTimeout(() => {
            inputElement.classList.remove('input-error');
          }, 820); 
          
          // If three invalid characters have been entered, show the emoji
          if (this.invalidKeyStrokes >= 3) {
            this.showEmoji();
          }
        }
      }
      
      showEmoji(): void {
        console.log('showEmoji');
        this.isEmojiVisible = true;
        this.invalidKeyStrokes = 0; // Reset the counter
        
        setTimeout(() => {
          this.isEmojiVisible = false; // Cache l'emoji après un certain temps
        }, 3000); // Durée d'affichage de l'emoji
      }
      
      
      
      
      /**
      * Nettoie les souscriptions lors de la destruction du composant.
      */
      ngOnDestroy() {
        // Signale que toutes les souscriptions doivent être arrêtées
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      }
      
      onUserInputFocus(): void {
        this.userInput$.next('');
      }
      
      // onSubmit(): void {
      //   console.log('Form errors', this.orderForm.errors);
      //   console.log('Form value', this.orderForm.value);
      //   Object.keys(this.orderForm.controls).forEach(key => {
      //     console.log(key, 'errors:', this.orderForm.get(key).errors);
      //   });
        
      //   if (this.orderForm.valid) {
      //     // Combine the form data with the model
      //     this.contractData = { ...this.contractData, ...this.orderForm.value };
          
      //     // Log the contract data for debugging
      //     console.log('Submitting contract data', this.contractData);
          
      //     // Call your preparation function here if necessary
      //     this.prepareDataForSubmission();
          
      //     // Now, submit the data to the server
      //     this.contractService.addContract(this.contractData).subscribe({
      //       next: (response) => {
      //         console.log('Contrat créé avec succès', response);
      //         this.router.navigate(['/contracts']); // Navigate after success
      //       },
      //       error: (error) => {
      //         console.error('Erreur lors de la création du contrat', error);
      //       }
      //     });
      //   } else {
      //     console.error('Form is not valid', this.orderForm.errors);
      //   }
      // }
      onSubmit(): void {
        if (this.orderForm.valid) {
          this.prepareDataForSubmission(); // Prépare les données juste avant la soumission.
          this.submitContractData();
        } else {
          // Afficher des erreurs pour chaque contrôle de formulaire.
          this.displayFormErrors();
        }
      }
    
      private displayFormErrors(): void {
        Object.keys(this.orderForm.controls).forEach(key => {
          const controlErrors = this.orderForm.get(key).errors;
          if (controlErrors) {
            console.error(`${key} errors:`, controlErrors);
          }
        });
      }
    
      private submitContractData(): void {
        this.contractService.addContract(this.contractData).subscribe({
          next: (response) => {
            console.log('Contrat créé avec succès', response);
            this.router.navigate(['/contracts']);
          },
          error: (error) => {
            console.error('Erreur lors de la création du contrat', error);
          }
        });
      }
      
      // private prepareDataForSubmission(): void {
      //   // Log pour débogage
      //   console.log('Preparing data for submission', this.contractData);
        
      //   // Conversion des champs booléens et numériques
      //   this.contractData.mailSended = this.convertToBoolean(this.contractData.mailSended);
      //   this.contractData.occupied = this.convertToBoolean(this.contractData.occupied);
      //   this.contractData.trash = this.convertToBoolean(this.contractData.trash);
        
      //   this.contractData.amountHt = this.convertToNumber(this.contractData.amountHt);
      //   this.contractData.benefitHt = this.convertToNumber(this.contractData.benefitHt);
      //   this.contractData.executionDataDay = this.convertToNumber(this.contractData.executionDataDay);
      //   this.contractData.executionDataHour = this.convertToNumber(this.contractData.executionDataHour);
      //   this.contractData.previsionDataHour = this.convertToNumber(this.contractData.previsionDataHour);
      //   this.contractData.previsionDataDay = this.convertToNumber(this.contractData.previsionDataDay);
        
      //   // Log final pour vérifier les données préparées
      //   console.log('Data prepared for submission', this.contractData);
      // }
      private prepareDataForSubmission(): void {
        // Convert each key in the contractData object to snake_case.
        const dataForSubmission = {};
        Object.keys(this.contractData).forEach((key) => {
          const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          dataForSubmission[snakeCaseKey] = this.contractData[key];
        });
      
        // Convert boolean and number values if necessary.
        dataForSubmission['mail_sended'] = this.convertToBoolean(dataForSubmission['mail_sended']);
        dataForSubmission['occupied'] = this.convertToBoolean(dataForSubmission['occupied']);
        dataForSubmission['trash'] = this.convertToBoolean(dataForSubmission['trash']);
        dataForSubmission['amount_ht'] = this.convertToNumber(dataForSubmission['amount_ht']);
        dataForSubmission['benefit_ht'] = this.convertToNumber(dataForSubmission['benefit_ht']);
        dataForSubmission['execution_data_day'] = this.convertToNumber(dataForSubmission['execution_data_day']);
        dataForSubmission['execution_data_hour'] = this.convertToNumber(dataForSubmission['execution_data_hour']);
        dataForSubmission['prevision_data_hour'] = this.convertToNumber(dataForSubmission['prevision_data_hour']);
        dataForSubmission['prevision_data_day'] = this.convertToNumber(dataForSubmission['prevision_data_day']);
      
        // Log the data to check if it's correctly formatted for submission.
        console.log('Data prepared for submission', dataForSubmission);
        
        // Store the converted data back to `contractData` for submission.
        this.contractData = dataForSubmission;
      }
      
      
      private convertToBoolean(value: any): boolean {
        return value === true || value === 'true'; // Gère les chaînes de caractères "true" comme booléen vrai
      }
      
      private convertToNumber(value: any): number | null {
        const number = parseFloat(value);
        return isNaN(number) ? null : number; // Convertit en nombre si possible, sinon retourne null
      }
      
      onUserInputBlur(event: any): void {
        console.log("onUserInputBlur");
        // const inputValue = event.target.value;
        // if (inputValue && !this.users.includes(inputValue)) {
        // Ajoute inputValue à la liste des entreprises
        // this.users = [...this.users, inputValue];
        // S'assure que la valeur est sélectionnée
        // this.Form.get('company').setValue(inputValue); // Voir create-user.component.ts
        // }
      }
    }
