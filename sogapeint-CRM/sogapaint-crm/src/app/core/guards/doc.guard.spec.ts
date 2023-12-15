import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DocGuard } from './doc.guard';
import { UserProfileService } from '../services/user.service';

describe('DocGuard', () => {
  let guard: DocGuard;
  let userProfileService: jasmine.SpyObj<UserProfileService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        DocGuard,
        { provide: UserProfileService, useValue: userProfileServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(DocGuard);
    userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // it('should allow the super admin user to activate the route', () => {
  //   userProfileService.getCurrentUser.and.returnValue({ role: 'superAdmin' });
  //   expect(guard.canActivate()).toBeTrue();
  //   expect(router.navigate).not.toHaveBeenCalled();
  // });

  // it('should not allow a non-super admin user to activate the route', () => {
  //   userProfileService.getCurrentUser.and.returnValue({ role: 'user' });
  //   expect(guard.canActivate()).toBeFalse();
  //   expect(router.navigate).toHaveBeenCalledWith(['/login']);
  // });

  // it('should not allow activation when there is no user', () => {
  //   userProfileService.getCurrentUser.and.returnValue(null);
  //   expect(guard.canActivate()).toBeFalse();
  //   expect(router.navigate).toHaveBeenCalledWith(['/login']);
  // });
});
