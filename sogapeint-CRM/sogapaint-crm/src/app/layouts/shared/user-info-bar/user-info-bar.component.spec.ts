import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoBarComponent } from './user-info-bar.component';
import { UserProfileService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

describe('UserInfoBarComponent', () => {
  let component: UserInfoBarComponent;
  let fixture: ComponentFixture<UserInfoBarComponent>;
  let mockUserProfileService = jasmine.createSpyObj('UserProfileService', ['getCurrentUser']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfoBarComponent ],
      providers: [
        { provide: UserProfileService, useValue: mockUserProfileService },
        { provide: Router, useValue: mockRouter },
        ChangeDetectorRef
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user on init', () => {
    expect(mockUserProfileService.getCurrentUser).toHaveBeenCalled();
  });

  it('should generate a random tooltip on init', () => {
    expect(component.randomTooltip).toBeDefined();
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/login']);
  });
});