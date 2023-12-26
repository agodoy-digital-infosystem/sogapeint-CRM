import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
    { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
    { path: 'manageUsers', component: ManageUsersComponent },
    { path: 'createUser', component: CreateUserComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
