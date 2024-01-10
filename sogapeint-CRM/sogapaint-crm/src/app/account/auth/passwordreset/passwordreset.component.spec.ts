import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordresetComponent } from './passwordreset.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { of } from 'rxjs';

describe('PasswordresetComponent', () => {
  let component: PasswordresetComponent;
  let fixture: ComponentFixture<PasswordresetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordresetComponent ],
      imports: [ 
        RouterTestingModule, 
        ReactiveFormsModule 
      ],
      providers: [
        { 
          provide: AuthenticationService, 
          useValue: jasmine.createSpyObj('AuthenticationService', ['password-reset']) 
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/' }
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('form should be invalid when empty', () => {
    expect(component.resetForm.valid).toBeFalsy();
  });

  xit('email field validity', () => {
    let email = component.resetForm.controls['email'];
    expect(email.valid).toBeFalsy();

    // Test email field with invalid email
    email.setValue("test");
    expect(email.hasError('email')).toBeTruthy();

    // Test email field with valid email
    email.setValue("test@test.com");
    expect(email.hasError('email')).toBeFalsy();
  });
});

