import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from '../../core/services/contract.service';
import { CompanyService } from '../../core/services/company.service';
import { UserProfileService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  orderForm: FormGroup;
  contractData: any = {
    internalNumberAbbrPart: '', // Nouveau champ ajouté
    internalNumberNumericPart: '',
    customer: '',
    contact: '',
    internalContributor: '',
    externalContributor: '',
    subcontractor: '', // Nouveau champ ajouté
    address: '',
    appartmentNumber: '',
    quoteNumber: '',
    mailSended: false,
    invoiceNumber: '',
    amountHt: null,
    benefitHt: null,
    previsionDataHour: 0, // Nouveau champ ajouté
    previsionDataDay: 0,  // Nouveau champ ajouté
    executionDataDay: 0,
    executionDataHour: 0,
    difference: 0,
    benefit: null,
    status: null,
    occupied: false,
    startDateWorks: null,
    endDateWorks: null,
    endDateCustomer: null,
    trash: false,
    dateCde: null,
    // ged: '', // Nouveau champ ajouté
  };
  
  users: any[] = [];
  userInput$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();
  
  statuses = [
    { name: 'À réaliser', value: null }, // ou une chaîne vide si nécessaire
    { name: 'Réalisé', value: 'achieve' },
    { name: 'Annulé', value: 'canceled' },
    { name: 'Facturé', value: 'invoiced' },
    { name: 'En cours', value: 'in_progress' },
    { name: 'Anomalie', value: 'anomaly' }
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

  internalNumberList: any[] = [];
  abbreviationList: string[] = [];
  fullAbbreviationList: string[] = []; // Liste complète des abréviations chargée initialement
  filteredAbbreviationList: string[] = []; // Liste pour le filtrage et l'affichage

  
  invalidKeyStrokes = 0;
  isEmojiVisible = false;
  abbreviationInput$ = new Subject<string>();

  files: File[] = [];
  
  constructor(
    private contractService: ContractService, 
    private userProfileService: UserProfileService,
    private companyService: CompanyService,
    private router: Router
    ) {}
    
    ngOnInit(): void {
      // Initialize the form group with controls corresponding to contractData structure
      this.orderForm = new FormGroup({
        internalNumberAbbrPart: new FormControl(this.contractData.internalNumberAbbrPart, [Validators.pattern(/^[BCDFGHJKLMNPQRSTVWXYZ]{1,5}$/)]), // Only 3-4 uppercase letters, consonnants only
        internalNumberNumericPart: new FormControl(this.contractData.internalNumberNumericPart, [Validators.pattern(/^\d{3}$/)]), // Only 3 digits
        customer: new FormControl(this.contractData.customer, Validators.required), // Assuming it's required
        internalContributor: new FormControl(this.contractData.internalContributor),
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
        difference: new FormControl(this.contractData.difference),
        benefit: new FormControl(this.contractData.benefit),
        status: new FormControl(this.contractData.status),
        occupied: new FormControl(this.contractData.occupied),
        startDateWorks: new FormControl(this.contractData.startDateWorks),
        endDateWorks: new FormControl(this.contractData.endDateWorks),
        endDateCustomer: new FormControl(this.contractData.endDateCustomer),
        trash: new FormControl(this.contractData.trash),
        dateCde: new FormControl(this.contractData.dateCde),
        // ged: new FormControl(this.contractData.ged),
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

        // Récupérer les numéros internes depuis le service
        this.getInternalNumbers();


        // Récupérer les abréviations depuis le service
        this.getAbbreviationList();

        // Filtrer les abréviations en temps réel
        this.abbreviationInput$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => {
            if (term) {
              const lowerCaseTerm = term.toLowerCase();
              return of(this.fullAbbreviationList.filter(abbr => abbr.toLowerCase().includes(lowerCaseTerm)));
            } else {
              // Si la saisie de l'utilisateur est vide, retournez la liste complète
              return of(this.fullAbbreviationList);
            }
          }),
          takeUntil(this.unsubscribe$)
        ).subscribe(filteredAbbreviations => {
          this.filteredAbbreviationList = filteredAbbreviations;
        });
        
        
        // Calculer la différence entre les heures de prévision et d'exécution en temps réel
        this.orderForm.valueChanges.subscribe(val => {
          // Utiliser `.value` pour obtenir la valeur actuelle des FormControl
          const totalPrevisionHours = (Number(this.orderForm.get("previsionDataDay").value) * 8) + Number(this.orderForm.get("previsionDataHour").value);
          const totalExecutionHours = (Number(this.orderForm.get("executionDataDay").value) * 8) + Number(this.orderForm.get("executionDataHour").value);
          const difference = totalExecutionHours - totalPrevisionHours;
        
          // Mise à jour du formulaire sans déclencher un nouvel événement valueChanges
          this.orderForm.patchValue({difference: difference}, {emitEvent: false});
        });
      }

      // récupère et process la liste des numéros internes
      getInternalNumbers() {
        this.contractService.getInternalNumbers().subscribe({
          next: (internalNumbers) => {
            this.internalNumberList = internalNumbers;
            this.initializeInternalNumber();
          },
          // quand tous les numéros internes sont récupérés, affichez-les dans la console
          complete: () => {
            // console.log('Numéros internes récupérés:', this.internalNumberList);
            this.initializeInternalNumber();
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des numéros internes', error);
          }
        });
      }

      getNextInternalNumber(): string {
        // Utilisé à des fins de test uniquement
        // this.internalNumberList = this.internalNumberTest;

        const validNumbers: number[] = this.internalNumberList
          .map(item => {
            // const match = item.match(/^([A-Z]{3,4}-)(\d{3})$/i);
            const match = item.match(/([A-Z]+)-(\d+)/);
            return match ? parseInt(match[2], 10) : null;
          })
          .filter(number => number !== null);
    
        if (validNumbers.length === 0) {
          // console.log('Aucun numéro interne valide trouvé');
          return '001';
        }
    
        const maxNumber = Math.max(...validNumbers);
        const nextNumber = maxNumber + 1;
        const nextNumberString = nextNumber.toString().padStart(3, '0');
        // console.log('Prochain numéro interne:', nextNumberString);
        return String(nextNumberString);
      }

      initializeInternalNumber(): void {
        console.log('Initialisation du numéro interne');
        const nextNumber = this.getNextInternalNumber();
        this.orderForm.patchValue({
          internalNumberNumericPart: nextNumber
        });
      }

      // Vérifie si la partie numérique numéro interne existe déjà dans la liste
      isInternalNumberNumericPartValid(): boolean {
        return this.internalNumberList.some(item => {
          const match = item.match(/^([A-Z]{3,4}-)(\d{3})$/i); // Modifier selon le format exact de vos numéros
          return match && match[2] === this.contractData.internalNumberNumericPart;
        });
      }

      getAbbreviationList(): void {
        this.companyService.getCompaniesAbbreviations().subscribe({
          next: (abbreviations) => {
            this.fullAbbreviationList = abbreviations.filter(abbr => abbr !== null);
            // classe les abréviations par ordre alphabétique
            this.fullAbbreviationList.sort();
            this.filteredAbbreviationList = this.fullAbbreviationList;
            console.log('Abbreviations récupérées:', this.fullAbbreviationList);
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des abréviations', error);
          }
        });
      }

      assembleInternalNumber(): string {
        return `${this.contractData.internalNumberAbbrPart.toUpperCase()}-${this.contractData.internalNumberNumericPart}`;
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
            // upload des fichiers
            if (this.files.length > 0) {
              console.log("il y a des fichiers à uploader");
              this.onFileUpload(this.files, response.contractId);
            }
            // this.router.navigate(['/oder-detail', response.contractId]);
          },
          error: (error) => {
            console.error('Erreur lors de la création du contrat', error);
          }
        });
      }
      
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

        // assemble internal number
        dataForSubmission['internal_number'] = this.assembleInternalNumber();

        // adds dateUppd and dateAdd (ISO 8601)
        dataForSubmission['dateAdd'] = new Date().toISOString();
        dataForSubmission['dateUppd'] = new Date().toISOString();
      
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
        // console.log("onUserInputBlur");

      }

      // GED
      onFileUpload(files: File[], contractId: string) {
        // const fileArray: File[] = Array.from(files);
        console.log("Fichiers à uploader:", files);
        
        this.contractService.uploadFiles(contractId, files).subscribe(
          event => {
            // Traite les événements de la réponse
            if (event.type === HttpEventType.UploadProgress) {
              // suivi de la progression
              const percentDone = Math.round(100 * event.loaded / event.total);
              console.log(`Progression de l'upload: ${percentDone}%`);
            } else if (event instanceof HttpResponse) {
              console.log('Fichiers complètement uploadés!', event.body);
            }
          },
          error => {
            console.error("Erreur lors de l'upload des fichiers", error);
          }
        );
      }

      onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
      }
    
      removeFile(index: number) {
        this.files.splice(index, 1);
      }
    }
