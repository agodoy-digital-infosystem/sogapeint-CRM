import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../core/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  users: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filter: string = ''; // La chaîne de recherche
  filteredUsers: any[] = []; // Les utilisateurs filtrés affichés dans la vue
  columns = [
    { name: 'firstname', displayName: 'Prénom' },
    { name: 'lastname', displayName: 'Nom' },
    { name: 'email', displayName: 'Email' },
    { name: 'role', displayName: 'Rôle' },
    { name: 'company', displayName: 'Entreprise' },
    { name: 'phone', displayName: 'Téléphone' },
    // Ajoutez d'autres colonnes au besoin
  ];


  constructor(private userProfileService: UserProfileService){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: 'Gestion des contacts', active: true }];
    this._fetchData();

  }

  private _fetchData(): void {
    // Use UserProfileService to fetch user data
    this.userProfileService.getAll().subscribe({
      next: (data: any) => {
        this.users = data; // Store users for display
        this.filteredUsers = data; // Initialiser les utilisateurs filtrés
        console.log('Utilisateurs reçus:', this.users);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      },
      // Usually, for HTTP calls you don't need to use the complete callback, as they complete immediately after emitting a response
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
    this.sortUsers();
  }

  private sortUsers(): void {
    this.users.sort((a, b) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];
      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : comparison * -1;
    });
  }

  // onSearch(): void {
  //   if (!this.filter) {
  //     this.filteredUsers = this.users; // Pas de filtre, affichez tous les utilisateurs
  //   } else {
  //     this.filteredUsers = this.users.filter(user => {
  //       const searchTerm = this.filter.toLowerCase();
  //       return (user.firstname && user.firstname.toLowerCase().includes(searchTerm)) ||
  //            (user.lastname && user.lastname.toLowerCase().includes(searchTerm)) ||
  //            (user.email && user.email.toLowerCase().includes(searchTerm)) ||
  //            (user.role && user.role.toLowerCase().includes(searchTerm));
  //       // Ajoutez autant de conditions que vous avez de champs à filtrer
  //     });
  //   }
  // }
  onSearch(): void {
    if (!this.filter) {
      this.filteredUsers = this.users; // Pas de filtre, affiche tous les utilisateurs
    } else {
      this.filteredUsers = this.users.filter(user => {
        const searchTerm = this.filter.toLowerCase();
        return this.columns.some(column => {
          const userData = user[column.name];
          return userData && userData.toLowerCase().includes(searchTerm);
        });
      });
    }
  }
  
}
