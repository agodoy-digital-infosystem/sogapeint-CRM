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
  tags: string[] = ['En cours', 'Non attribué', 'Réalisé', 'Facturé', 'Annulé', 'Incident'];
  availableTags: string[] = [];
  activeTags: string[] = [];
  orders: Contract[] = [];
  
  constructor(
    private contractService: ContractService,
    private userService: UserProfileService,
    private renderer: Renderer2,
    private router: Router
    ) { }
    
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: 'Gestion des commandes', active: true }];
      this.availableTags = this.tags;
      
      // Activer le tag 'En cours' par défaut
      this.activeTags.push('En cours');
      // Retirer 'En cours' des tags disponibles
      this.availableTags = this.availableTags.filter(tag => tag !== 'En cours');

      this.loadContracts();
    }
    
    loadContracts() {
      console.log('Chargement des commandes');
      this.isLoading = true;
      this.contractService.getContracts().subscribe({
        next: (data) => {
          this.orders = data; // Stocker tous les contrats
          this.filteredOrders = [...this.orders]; // Copier pour l'affichage initial
          // this.availableTags = this.tags;
          this.availableTags = this.tags.filter(tag => tag !== 'En cours');
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
    
    // onSearch(): void {
    //   const searchTerms = this.filter.toLowerCase().split(' '); // Séparer les termes de recherche
    
    //   if (!this.filter) {
    //     this.filteredOrders = [...this.orders]; // Afficher tous les contrats si le filtre est vide
    //   } else {
    //     this.filteredOrders = this.orders.filter(order =>
    //       searchTerms.every(term => this.searchInOrder(order, term))
    //     );
    //   }
    // }
    onSearch(): void {
      const searchTerms = this.filter.toLowerCase().split(' ');
      
      // Filtrer d'abord par le texte de recherche
      let filteredBySearchText = !this.filter ? [...this.orders] : this.orders.filter(order =>
        searchTerms.every(term => this.searchInOrder(order, term))
        );
        
        // Ensuite, filtrer par les tags actifs
        this.filteredOrders = filteredBySearchText.filter(order => 
          this.activeTags.length === 0 || this.activeTags.every(tag => this.orderHasTag(order, tag))
          );
    }
        
        orderHasTag(order: any, tag: string): boolean {
          // Implémentez cette méthode en fonction de la logique de correspondance entre les commandes et les tags
          // Exemple de logique de correspondance basique :
          switch(tag) {
            case 'En cours':
            return order.status === 'in_progress';
            case 'Réalisé':
            return order.status === 'achieve';
            case 'Facturé':
            return order.status === 'invoiced';
            // case 'Anomalie':
            //   return order.status === 'anomaly';
            case 'Annulé':
            return order.status === 'canceled';
            // case 'Incident':
            //   return order.status === 'incident';
            case 'Incident':
            // Vérifie si le tableau 'incident' n'est pas vide
            return Array.isArray(order.incident) && order.incident.length > 0;
            case 'Non attribué':
            return order.status === null;
            default:
            return false;
          }
        }
        
        searchInOrder(order: any, searchTerm: string): boolean {
          // Méthode pour rechercher récursivement dans les objets et tableaux imbriqués
          const searchInObject = (obj: any): boolean => {
            return Object.values(obj).some(value => {
              if (typeof value === 'object' && value !== null) {
                return Array.isArray(value) ? value.some(subValue => searchInObject(subValue)) : searchInObject(value);
              }
              return String(value).toLowerCase().includes(searchTerm);
            });
          };
          
          return searchInObject(order);
        }
        
        sortOrders() {
          if (!this.sortColumn) return;
        
          this.filteredOrders.sort((a, b) => {
            // Obtenir les valeurs selon la colonne sélectionnée.
            let valueA = this.getColumnValue(a, this.sortColumn);
            let valueB = this.getColumnValue(b, this.sortColumn);
        
            // Gérer les valeurs nulles ou indéfinies.
            if (valueA == null) valueA = '';
            if (valueB == null) valueB = '';
        
            // Comparaison insensible à la casse si ce sont des chaînes.
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
        
            // Comparaison pour un tri ascendant.
            let comparison = valueA > valueB ? 1 : (valueA < valueB ? -1 : 0);
        
            // Inverser la comparaison pour un tri descendant.
            return this.sortDirection === 'asc' ? comparison : -comparison;
          });
        }
        
        getColumnValue(order: any, column: string) {
          switch(column) {
            case 'client':
              return `${order?.customer?.firstname} ${order?.customer?.lastname}`;
            case 'contact':
              return `${order?.contact?.firstname} ${order?.contact?.lastname}`;
            case 'external_contributor':
              return `${order?.external_contributor?.firstname} ${order?.external_contributor?.lastname}`;
            default:
              return order[column]; // Pour les autres colonnes non composées.
          }
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
        
        mapTagToStatus(tag: string): string | null {
          const tagStatusMapping: { [key: string]: string } = {
            'in_progress': 'En cours',
            null: 'Non attribué',
            'achieve': 'Réalisé',
            'invoiced': 'Facturé',
            // 'anomaly': 'Anomalie',
            'canceled': 'Annulé',
            // 'incident': 'Incident'
          };
          
          return tagStatusMapping[tag] || null; // Returns null if the tag is not found in the mapping
        }
      }
