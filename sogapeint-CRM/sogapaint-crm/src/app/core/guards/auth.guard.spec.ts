// // import { TestBed } from '@angular/core/testing';
// // import { CanActivateFn } from '@angular/router';

// // import { AuthGuard } from './auth.guard';

// // describe('authGuard', () => {
// //   const executeGuard: CanActivateFn = (...guardParameters) => 
// //       TestBed.runInInjectionContext(() =>  AuthGuard(...guardParameters));

// //   beforeEach(() => {
// //     TestBed.configureTestingModule({});
// //   });

// //   it('should be created', () => {
// //     expect(executeGuard).toBeTruthy();
// //   });
// // });


// // VERSION 2:

// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { AuthGuard } from './auth.guard';
// import { AuthenticationService } from '../services/auth.service';
// import { AuthfakeauthenticationService } from '../services/authfake.service';

// describe('AuthGuard', () => {
//   let authGuard: AuthGuard;
//   let authService: AuthenticationService;
//   let authFakeService: AuthfakeauthenticationService;
//   let router: Router;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       providers: [
//         AuthGuard,
//         { provide: AuthenticationService, useValue: { currentUser: () => {} } },
//         { provide: AuthfakeauthenticationService, useValue: { currentUserValue: {} } }
//       ]
//     });

//     authGuard = TestBed.inject(AuthGuard);
//     authService = TestBed.inject(AuthenticationService);
//     authFakeService = TestBed.inject(AuthfakeauthenticationService);
//     router = TestBed.inject(Router);
//   });

//   it('should be created', () => {
//     expect(authGuard).toBeTruthy();
//   });

//   describe('canActivate', () => {
//     it('should return true if the user is authenticated with firebase', () => {
//       // Mock firebase authentication scenario
//       spyOn(authService, 'currentUser').and.returnValue({id:1, username: 'admin', email: 'admin@sogapeint.corp', password: '123456' }); // Mock user data
//       const result = authGuard.canActivate(null, null);
//       expect(result).toBeTrue();
//     });

//     it('should return true if the user is authenticated with fake service', () => {
//       // Mock fake authentication scenario
//       spyOnProperty(authFakeService, 'currentUserValue', 'get').and.returnValue({id:1, username: 'admin', email: 'admin@sogapeint.corp', password: '123456' }); // Mock user data
//       const result = authGuard.canActivate(null, null);
//       expect(result).toBeTrue();
//     });

//     it('should navigate to login page if the user is not authenticated', () => {
//       spyOn(authService, 'currentUser').and.returnValue(null); // User not logged in
//       spyOn(router, 'navigate');
//       const result = authGuard.canActivate(null, null);
//       expect(router.navigate).toHaveBeenCalledWith(['/account/login'], { queryParams: { returnUrl: null } });
//       expect(result).toBeFalse();
//     });
//   });
// });
