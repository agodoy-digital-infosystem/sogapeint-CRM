import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let router: Router;
    let authenticationService: AuthenticationService;
    let authFackservice: AuthfakeauthenticationService;
    let route: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;
    const mockUser = {id:1, username: 'admin', email: 'admin@sogapeint.corp', password: '123456' }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AuthGuard,
                {
                    provide: AuthenticationService,
                    useValue: jasmine.createSpyObj('AuthenticationService', ['currentUser'])
                },
                {
                    provide: AuthfakeauthenticationService,
                    useValue: jasmine.createSpyObj('AuthfakeauthenticationService', ['signup']) 
                }
            ]
        });

        authGuard = TestBed.inject(AuthGuard);
        router = TestBed.inject(Router);
        authenticationService = TestBed.inject(AuthenticationService);
        authFackservice = TestBed.inject(AuthfakeauthenticationService);

        // Mock objects for ActivatedRouteSnapshot and RouterStateSnapshot
        route = new ActivatedRouteSnapshot();
        state = { url: '/test-url' } as RouterStateSnapshot;
    });

    it('should create', () => {
        expect(authGuard).toBeTruthy();
    });

    //     it('should return true if the user is authenticated with fake service', () => {
    //   // Mock fake authentication scenario
    //   spyOnProperty(authFackservice, "currentUser", 'get').and.returnValue(mockUser); // Mock user data
    //   const result = authGuard.canActivate(null, null);
    //   expect(result).toBeTrue();
    // });

    it('should redirect an unauthenticated user to the login page', () => {
        spyOn(router, 'navigate');

        const result = authGuard.canActivate(route, state);

        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/account/login'], { queryParams: { returnUrl: '/test-url' } });
    });

  //   it('should allow the authenticated user to access app', () => { // TODO : corriger ce test
  //     // Simuler un utilisateur authentifié selon la configuration de l'environnement
  //     const mockUser = {
  //       id: 0,
  //       username: "test_user",
  //       password: "123456",
  //       firstName: "testFName",
  //       lastName: "testLName",
  //       token: "fakeToekn",
  //       email: "test@test.com"
  //   }
  //     if (environment.defaultauth === 'firebase') {
  //         spyOn(authenticationService, 'currentUser').and.returnValue(mockUser);
  //     } else {
  //         // authFackservice.currentUserValue = { someUserDetails: {} };
  //         // spyOn(authFackservice).and.returnValue(mockUser);
  //         // spyOn(authFackservice).and.returnValue(mockUser);
  //     }

  //     const result = authGuard.canActivate(route, state);

  //     expect(result).toBeTrue();
  // });
});
