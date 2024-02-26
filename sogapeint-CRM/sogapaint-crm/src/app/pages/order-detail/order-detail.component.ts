import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/auth.models';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [
    { label: 'Accueil', url: '/', active: false },
    { label: 'Liste des commandes', url: '/orders', active: false },
    { label: 'Détail Commande', active: true }
  ];
  contract: any; // Contiendra les détails de la commande
  showSecretDiv: boolean = false;
  private konamiCode: string[] = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private currentInput: string[] = [];
  customer: any;
  coContractor: any;
  sogapeintContact: any;
  subcontractor: any;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private userProfileService: UserProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userProfileService.getCurrentUser();
    this.route.params.subscribe(params => {
      const contractId = params['orderId']; // Vérifier que 'id' correspond au nom de paramètre défini dans votre route
      if (contractId) {
        this.loadContractDetails(contractId);
      }
      
    });
  }

  loadContractDetails(contractId: string) {
    this.contractService.getContractById(contractId).subscribe({
      next: (data) => {
        this.contract = data;
        console.log('Détails de la commande chargés', this.contract);
        // si on a réussi à charger le contrat, on va chercher les détails du client, du co-traitant, du contact sogapeint et du sous-traitant
        if (this.contract) {
          this.loadUserDetails();
        }
      },
      error: (error) => console.error('Erreur lors du chargement des détails de la commande', error)
    });
  }

  loadUserDetails(){
    console.log('Chargement des détails des utilisateurs');
        this.userProfileService.getOne(this.contract.customer).subscribe({
          next: (data) => {
            this.customer = data;
            console.log('Détails du client chargés', data);
          },
          error: (error) => console.error('Erreur lors du chargement des détails du client', error)
        });
        if (this.contract.external_contributor){
          this.userProfileService.getOne(this.contract.external_contributor).subscribe({
            next: (data) => {
              this.coContractor = data;
              console.log('Détails du co-traitant chargés', data);
            },
            error: (error) => console.error('Erreur lors du chargement des détails du co-traitant', error)
          });
        }
          
        if (this.contract.contact) {
          this.userProfileService.getOne(this.contract.contact).subscribe({
            next: (data) => {
              this.sogapeintContact = data;
              console.log('Détails du contact Sogapeint chargés', data);
            },
            error: (error) => console.error('Erreur lors du chargement des détails du contact Sogapeint', error)
          });
        }
        
        if (this.contract.subcontractor) {
          this.userProfileService.getOne(this.contract.subcontractor).subscribe({
            next: (data) => {
              this.subcontractor = data;
              console.log('Détails du sous-traitant chargés', data);
            },
            error: (error) => console.error('Erreur lors du chargement des détails du sous-traitant', error)
          });
        }
        
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.currentInput.push(event.key);
    if (this.currentInput.length > this.konamiCode.length) {
      this.currentInput.shift();
    }
    if (this.konamiCode.every((code, index) => code === this.currentInput[index])) {
      this.showSecret();
    }
  }

  showSecret() {
    // scrolle automatiquement vers le haut de la page
    window.scrollTo(0, 0);
    this.showSecretDiv = true;
    setTimeout(() => this.showSecretDiv = false, 5000);
  }

  isAdminOrSuperAdmin(): boolean {
    const result = this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'superAdmin');
    console.log('isAdminOrSuperAdmin:', result);
    return result;
  }

  goToEditOrder() {
    // Rediriger vers la page de mise à jour de la commande
    // 'order-update/:orderId'
    this.router.navigate([`/order-update/${this.contract._id}`]);
  }
}
