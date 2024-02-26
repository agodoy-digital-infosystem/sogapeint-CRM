import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContractService } from '../../core/services/contract.service';
import { UserProfileService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: [
    './order-update.component.scss', 
    '../order-detail/order-detail.component.scss'
  ]
})
export class OrderUpdateComponent implements OnInit {
  breadCrumbItems: Array<{}> = [];
  orderUpdateForm: FormGroup;
  users: any[] = [];
  userInput$ = new Subject<string>();
  private unsubscribe$ = new Subject<void>();

  statuses = [
    { name: 'À réaliser', value: null }, 
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

  contractId: string;
  invalidKeyStrokes = 0;
  isEmojiVisible = false;

  constructor(
    private contractService: ContractService, 
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.contractId = this.route.snapshot.params['orderId'];
    this.initializeForm();
    this.loadContractData();
    this.setupUserSearch();
    this.breadCrumbItems = [
      { label: 'Accueil', path: '/' },
      { label: 'Mise à jour d’une commande', active: true }
    ];
  }

  private initializeForm() {
    this.orderUpdateForm = new FormGroup({
      internal_number: new FormControl('', Validators.required),
      customer: new FormControl('', Validators.required),
      contact: new FormControl(''),
      external_contributor: new FormControl(''),
      subcontractor: new FormControl(''),
      address: new FormControl(''),
      appartment_number: new FormControl(''),
      quote_number: new FormControl(''),
      mail_sended: new FormControl(''),
      invoice_number: new FormControl(''),
      amount_ht: new FormControl('', [Validators.pattern(/^\d+\.?\d*$/)]),
      benefit_ht: new FormControl('', [Validators.pattern(/^\d+\.?\d*$/)]),
      prevision_data_hour: new FormControl('', [Validators.pattern(/^\d+$/)]),
      prevision_data_day: new FormControl('', [Validators.pattern(/^\d+$/)]),
      execution_data_day: new FormControl('', [Validators.pattern(/^\d+$/)]),
      execution_data_hour: new FormControl('', [Validators.pattern(/^\d+$/)]),
      benefit: new FormControl(''),
      status: new FormControl(''),
      occupied: new FormControl(''),
      start_date_works: new FormControl(''),
      end_date_works: new FormControl(''),
      end_date_customer: new FormControl(''),
      trash: new FormControl(''),
      date_cde: new FormControl(''),
      ged: new FormControl(''),
    });
  }
  

  private loadContractData() {
    console.log('Loading contract data');
    if (this.contractId) {
      console.log('Loading contract with id:', this.contractId);
      this.contractService.getContractById(this.contractId).subscribe(contract => {
        this.orderUpdateForm.patchValue(contract);
        console.log('Contract data loaded:', JSON.stringify(contract));
      });
    }
    else {
      console.log('No contract id provided');
    }
  }

  private setupUserSearch() {
    this.userInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.userProfileService.searchUsers(term.toLowerCase()) : of([])),
      takeUntil(this.unsubscribe$)
    ).subscribe(users => {
      this.users = users;
    });
  }

  onSubmitUpdate(): void {
    if (this.orderUpdateForm.valid) {
      this.contractService.updateContract(this.contractId, this.orderUpdateForm.value).subscribe({
        next: () => {
          this.router.navigate(['/order-detail', this.contractId]);
        },
        error: (error) => {
          console.error('Error updating contract:', error);
        }
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onUserInputFocus(): void {
    this.userInput$.next('');
  }

  onUserInputBlur(event: any): void {
    // console.log("onUserInputBlur");
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
}
