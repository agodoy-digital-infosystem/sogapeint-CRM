import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '../shared/ui/ui.module';

import { PagesRoutingModule } from './pages-routing.module';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { IconsModule } from './icons/icons.module';

import { ManageUsersComponent } from './manage-users/manage-users.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  // declarations: [DashboardComponent, CalendarComponent, ChatComponent, KanbanComponent],
  declarations: [ManageUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgScrollbarModule, 
    IconsModule,
    HttpClientModule
  ],
  providers: [
    
  ]
})
export class PagesModule { }
