import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { CompanyCreateComponent } from './company-create/company-create.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FAQComponent } from './faq/faq.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardFakeComponent } from './dashboard-fake/dashboard-fake.component';
import { OrderFormComponent } from './order-form/order-form.component';


const routes: Routes = [
    { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
    { path: 'manageUsers', component: ManageUsersComponent },
    { path: 'createUser', component: CreateUserComponent },
    { path: 'user-detail/:userId', component: UserDetailComponent },
    { path: 'manageCompanies', component: ManageCompaniesComponent},
    { path: 'company-detail/:companyId', component: CompanyDetailComponent},
    { path: 'company-update/:companyId', component: CompanyUpdateComponent},
    { path: 'company-create', component: CompanyCreateComponent},
    { path: 'dashboard', component: DashboardFakeComponent},
    { path: 'FAQ', component: FAQComponent },
    { path: 'order-form', component: OrderFormComponent },
    // route pour la landing page
    { path: '', component: LandingPageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
