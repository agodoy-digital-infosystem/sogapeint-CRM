import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../../core/services/user.service';
import { User } from 'src/app/core/models/auth.models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  // Items pour le fil d'Ariane
  breadCrumbItems: Array<{ label: string; url?: string; active?: boolean }> = [];
  // Titre de la page
  pageTitle: string = 'Détail utilisateur';
  user: User;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService
    ) {
    this.route.params.subscribe(params => {
      this.id = params['userId'];
      console.log("UserId : "+this.id);
      // NMaintenant, nous avons l'identifiant de l'utilisateur, 
      // nous pouvons le charger depuis le backend

    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sogapeint' }, { label: this.pageTitle, active: true }];
    this._fetchData(this.id);
  }

  private _fetchData(id) {
    // Charge les données de l'utilisateur depuis le backend
    this.userProfileService.getOne(id).subscribe(
      (data: any) => {
        this.user = new User();
        this.user.active = data.active;
        this.user.authorized_connection = data.authorized_connection;
        this.user.company = data.company;
        this.user.email = data.email;
        this.user.firstName = data.firstname;
        this.user.lastName = data.lastname;
        this.user.phone = data.phone;
        this.user.role = data.role;
        this.user.id = data.id;
        console.log("User : "+this.user);
      },
      (error: any) => {
        console.log(error);
      }
    ); 
  }

  validateChanges(){}
  resetPassword(){}
}
