import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HorizontalnavbarComponent } from './horizontal-navbar/horizontal-navbar.component';
import { HorizontaltopbarComponent } from './horizontaltopbar/horizontaltopbar.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { FormsModule } from '@angular/forms';
// import { UserInfoBarComponent } from './user-info-bar/user-info-bar.component';

@NgModule({
  declarations: [
    FooterComponent,
    HorizontalnavbarComponent,
    HorizontaltopbarComponent,
    RightsidebarComponent,
    SidebarComponent,
    TopbarComponent,
    // UserInfoBarComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    NgClickOutsideDirective,
    RouterModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    FooterComponent,
    HorizontalnavbarComponent,
    HorizontaltopbarComponent,
    RightsidebarComponent,
    SidebarComponent,
    TopbarComponent,
    NgClickOutsideDirective,
    // UserInfoBarComponent
  ]
})
export class SharedModule { }
