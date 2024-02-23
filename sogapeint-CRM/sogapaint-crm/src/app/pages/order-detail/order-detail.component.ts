import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../core/services/contract.service';

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

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const contractId = params['orderId']; // Assurez-vous que 'id' correspond au nom de paramètre défini dans votre route
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
      },
      error: (error) => console.error('Erreur lors du chargement des détails de la commande', error)
    });
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
}
