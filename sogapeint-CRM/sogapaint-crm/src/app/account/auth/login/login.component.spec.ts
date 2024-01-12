import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthenticationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthenticationService, useValue: { login: jasmine.createSpy('login') } },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthenticationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnSubmit
  it('should call onSubmit', () => {
    // Change the behavior of the spy
    (authService.login as jasmine.Spy).and.returnValue(of({}));
  
    component.onSubmit();
  
    // Check if authService.login has been called
    expect(authService.login).toHaveBeenCalled();
  });

  // onFirstClick
  it('should call onFirstClick', () => {
    spyOn(component, 'onFirstClick');
    component.onFirstClick();
    expect(component.onFirstClick).toHaveBeenCalled();
  });
});