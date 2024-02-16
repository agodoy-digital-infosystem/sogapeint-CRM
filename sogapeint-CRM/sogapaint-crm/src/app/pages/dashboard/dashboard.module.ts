import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { KpiCardComponent } from './kpi-card/kpi-card.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { TableCardComponent } from './table-card/table-card.component';
import { MapCardComponent } from './map-card/map-card.component';
import { TimelineCardComponent } from './timeline-card/timeline-card.component';
import { StatSummaryCardComponent } from './stat-summary-card/stat-summary-card.component';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { PickerCardComponent } from './picker-card/picker-card.component';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    DashboardComponent, 
    KpiCardComponent,
    ChartCardComponent,
    TableCardComponent,
    MapCardComponent,
    TimelineCardComponent,
    StatSummaryCardComponent,
    ChatCardComponent,
    PickerCardComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    FormsModule
  ]
})
export class DashboardModule { }

