import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { PasswordresetComponent } from './passwordreset.component';

describe('PasswordresetComponent', () => {
  let component: PasswordresetComponent;
  let fixture: ComponentFixture<PasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [PasswordresetComponent],
      providers: [
        { provide: AuthenticationService, useValue: {} },
        { provide: UserProfileService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnSubmit
  it('should call onSubmit', () => {
    spyOn(component, 'onSubmit');
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  // togglePasswordVisibility
  it('should call togglePasswordVisibility', () => {
    spyOn(component, 'togglePasswordVisibility');
    component.togglePasswordVisibility();
    expect(component.togglePasswordVisibility).toHaveBeenCalled();
  });

  // toggleConfirmPasswordVisibility
  it('should call toggleConfirmPasswordVisibility', () => {
    spyOn(component, 'toggleConfirmPasswordVisibility');
    component.toggleConfirmPasswordVisibility();
    expect(component.toggleConfirmPasswordVisibility).toHaveBeenCalled();
  });

  // mustMatch
  it('should call mustMatch', () => {
    spyOn(component, 'mustMatch');
    component.mustMatch('password', 'confirmPassword');
    expect(component.mustMatch).toHaveBeenCalled();
  }); 

  // checkPasswordStrength
  it('should call checkPasswordStrength', () => {
    spyOn(component, 'checkPasswordStrength');
    component.checkPasswordStrength('password');
    expect(component.checkPasswordStrength).toHaveBeenCalled();
  });

  // suggestPassword
  it('should call suggestPassword', () => {
    spyOn(component, 'suggestPassword');
    component.suggestPassword();
    expect(component.suggestPassword).toHaveBeenCalled();
  });

  // generatePassword
  it('should call generatePassword', () => {
    spyOn(component, 'generatePassword');
    component.generatePassword(10);
    expect(component.generatePassword).toHaveBeenCalled();
  });
  
});