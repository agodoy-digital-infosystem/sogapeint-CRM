import { Component, OnInit, Renderer2 } from '@angular/core';
import { ContractService } from '../../core/services/contract.service';
import { Router } from '@angular/router';
import { Contract } from '../../core/models/contract.models';
import { UserProfileService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  pageTitle: string = 'Gestion des commandes';
  isLoading = true;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filter: string = ''; 
  filteredOrders: any[] = [];
  tags: string[] = ['En cours', 'Non attribué', 'Réalisé', 'Facturé', 'Anomalie', 'Annulé', 'Incident'];
  availableTags: string[] = [];
  activeTags: string[] = [];
  // contracts: Contract[] = [];
  
  constructor(
    private contractService: ContractService,
    private userService: UserProfileService,
    private renderer: Renderer2,
    private router: Router
    ) { }
    
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: 'Gestion des commandes', active: true }];
      this.availableTags = this.tags;
      this.loadContracts();
    }
    
    loadContracts() {
      console.log('Chargement des commandes');
      this.isLoading = true;
      this.contractService.getContracts().subscribe({
        next: (data) => {
          this.filteredOrders = data;
          this.availableTags = this.tags;
          this.isLoading = false;
          // console.log('Commandes chargées:', this.filteredOrders);
        },
        error: (error) => console.error('Erreur lors du chargement des commandes', error)
      });
    }
    
    onSort(column: string): void {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
        console.log(`Sorting by ${this.sortColumn} ${this.sortDirection}`);
      }
      this.sortOrders();
    }
    
    onSearch() {
      // TODO: Implement search
    }
    
    sortOrders() {
      // TODO: Implement sorting
    }
    
    /**
    * Ajoute un tag à la recherche et met à jour la liste des entreprises filtrées
    * @param tag Le tag à ajouter
    */
    activateTag(tag: string) {
      if (!this.activeTags.includes(tag)) {
        this.activeTags.push(tag); // Ajouter le tag à la liste des tags actifs
        this.availableTags = this.availableTags.filter(t => t !== tag); // Enlever le tag de la liste des tags disponibles
        this.onSearch(); // Mettre à jour la recherche avec le nouveau tag
      }
    }
    
    /**
    * Supprime un tag de la recherche et met à jour la liste des entreprises filtrées
    * @param tag Le tag à supprimer
    * @param event L'événement de clic
    */
    deactivateTag(tag: string, event: MouseEvent) {
      event.stopPropagation(); // Empêche le clic de se propager à l'élément parent
      const index = this.activeTags.indexOf(tag);
      this.availableTags.push(tag); // Ajouter le tag à la liste des tags disponibles
      // trie les tags disponibles selon l'ordre de la liste des tags
      this.availableTags.sort((a, b) => this.tags.indexOf(a) - this.tags.indexOf(b));
      if (index > -1) {
        this.activeTags.splice(index, 1);
        this.onSearch(); // Mettre à jour la recherche sans le tag
      }
    }
    
    selectOrder(order: any) {
      console.log('Commande sélectionnée:', order);
      this.router.navigate(['/order-detail', order._id]);
    }
    
    
    // remplace les id des utilisateurs par leurs noms et prénoms
    getUserName(userId: string) {
      return this.userService.getOne(userId).subscribe({
        next: (user) => {
          return `${user.firstName} ${user.lastName}`;
        },
        error: (error) => console.error('Erreur lors de la récupération de l\'utilisateur', error)
      });
    }
  }
