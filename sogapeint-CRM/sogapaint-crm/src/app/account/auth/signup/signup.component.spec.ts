import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [ 
        RouterTestingModule, 
        ReactiveFormsModule,
        HttpClientTestingModule 
      ],
      providers: [
        { 
          provide: AuthenticationService, 
          useValue: jasmine.createSpyObj('AuthenticationService', ['signup']) 
        },
        { 
          provide: AuthfakeauthenticationService, 
          useValue: jasmine.createSpyObj('AuthfakeauthenticationService', ['signup']) 
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('form fields validity', () => {
    let username = component.signupForm.controls['username'];
    let email = component.signupForm.controls['email'];
    let password = component.signupForm.controls['password'];

    expect(username.valid).toBeFalsy();
    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();

    // Test fields with valid input
    username.setValue("testuser");
    email.setValue("test@test.com");
    password.setValue("password");

    expect(username.valid).toBeTruthy();
    expect(email.valid).toBeTruthy();
    expect(password.valid).toBeTruthy();
  });
});
