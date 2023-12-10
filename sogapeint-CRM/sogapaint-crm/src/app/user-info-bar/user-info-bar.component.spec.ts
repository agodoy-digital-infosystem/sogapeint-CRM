import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoBarComponent } from './user-info-bar.component';
import { UserProfileService } from '../core/services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../core/models/auth.models';

describe('UserInfoBarComponent', () => {
  let component: UserInfoBarComponent;
  let fixture: ComponentFixture<UserInfoBarComponent>;
  let mockUserProfileService: jasmine.SpyObj<UserProfileService>;

  beforeEach(async () => {
    mockUserProfileService = jasmine.createSpyObj('UserProfileService', ['getCurrentUser']);

    await TestBed.configureTestingModule({
      declarations: [ UserInfoBarComponent ],
      providers: [
        { provide: UserProfileService, useValue: mockUserProfileService },
        ChangeDetectorRef
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoBarComponent);
    component = fixture.componentInstance;

    const mockUser: User = {
      id: 1,
      username: 'testuser',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'customer',
      token: 'fake-token'
    };

    mockUserProfileService.getCurrentUser.and.returnValue(mockUser);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch current user on init', () => {
    expect(mockUserProfileService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(jasmine.objectContaining({ username: 'testuser' }));
  });

  // Tests pour getRoleClass et autres fonctionnalités...
});
