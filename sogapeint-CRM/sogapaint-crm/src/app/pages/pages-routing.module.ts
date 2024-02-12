import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FAQComponent } from './faq/faq.component';

const routes: Routes = [
    { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
    { path: 'manageUsers', component: ManageUsersComponent },
    { path: 'createUser', component: CreateUserComponent },
    { path: 'user-detail/:userId', component: UserDetailComponent },
    { path: 'manageCompanies', component: ManageCompaniesComponent},
    { path: 'company-detail/:companyId', component: CompanyDetailComponent},
    { path: 'company-update/:companyId', component: CompanyUpdateComponent},
    { path: 'FAQ', component: FAQComponent },
    // route pour la landing page
    { path: '', component: LandingPageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
