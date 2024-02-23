import { Component, OnInit } from '@angular/core';
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
}
