import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from './ui/ui.module';
import { UiModule } from '../shared/ui/ui.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgScrollbar } from 'ngx-scrollbar';

import { WidgetModule } from '../shared/widget/widget.module';

import { PagesRoutingModule } from './pages-routing.module';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { IconsModule } from './icons/icons.module';

import { NgApexchartsModule } from 'ng-apexcharts';


import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ManageCompaniesComponent } from './manage-companies/manage-companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyUpdateComponent } from './company-update/company-update.component';
import { CompanyCreateComponent } from './company-create/company-create.component';
// import { LandingPageComponent } from './landing-page/landing-page.component';

// import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardFakeComponent } from './dashboard-fake/dashboard-fake.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderFormComponent } from './order-form/order-form.component';

import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './dashboard-fake/filter.pipe'; // TODO pipe à modifier


@NgModule({
  declarations: [
    FilterPipe,
    ManageUsersComponent, 
    CreateUserComponent, 
    UserDetailComponent, 
    ManageCompaniesComponent, 
    CompanyDetailComponent,
    CompanyUpdateComponent,
    CompanyCreateComponent,
    DashboardFakeComponent,
    OrderFormComponent,
    // DashboardComponent
    // LandingPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    UIModule,
    UiSwitchModule,
    NgbModule,
    NgSelectModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgScrollbarModule, 
    IconsModule,
    HttpClientModule,
    NgApexchartsModule,
    DashboardModule,
    WidgetModule,
    NgScrollbarModule,
    LeafletModule
  ],
  providers: [
    
  ]
})
export class PagesModule { }
