import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfileService } from '../core/services/user.service';
import { User } from '../core/models/auth.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info-bar',
  templateUrl: './user-info-bar.component.html',
  styleUrls: ['./user-info-bar.component.scss']
})
export class UserInfoBarComponent implements OnInit {
  currentUser: User;

  constructor(
    private userProfileService: UserProfileService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.userProfileService.getCurrentUser();
    this.changeDetectorRef.detectChanges(); // Forcer la détection de changement
    console.log(JSON.stringify(this.currentUser)) // TODO: important!!! remove
  }

  getRoleClass(role: string): string {
    const roleClassMap = {
      'superAdmin': 'badge-superadmin',
      'cocontractor': 'badge-cocontractor',
      'subcontractor': 'badge-subcontractor',
      'customer': 'badge-customer',
      'comanager': 'badge-comanager',
      'supermanager': 'badge-supermanager'
    };
    return roleClassMap[role] || 'badge-default';
  }

  logout() {
    // Effacer le token du stockage local ou de la session
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/account/login']);
    // Peut-être faire un appel API pour informer le backend de la déconnexion ?
  }
}
