import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from './ui/ui.module';
import { UiModule } from '../shared/ui/ui.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UiSwitchModule } from 'ngx-ui-switch';
import { NgSelectModule } from '@ng-select/ng-select';

import { PagesRoutingModule } from './pages-routing.module';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { IconsModule } from './icons/icons.module';

import { ManageUsersComponent } from './manage-users/manage-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  // declarations: [DashboardComponent, CalendarComponent, ChatComponent, KanbanComponent],
  declarations: [ManageUsersComponent, CreateUserComponent, UserDetailComponent],
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
  ],
  providers: [
    
  ]
})
export class PagesModule { }
