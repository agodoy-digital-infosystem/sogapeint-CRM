import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUserComponent ],
      imports: [ HttpClientTestingModule, ReactiveFormsModule ],
      providers: [ FormBuilder ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should check password strength', () => {
    const password = 'password123';
    component.checkPasswordStrength(password);
    expect(component.passwordStrength).toBeDefined();
    expect(component.passwordFeedback).toBeDefined();
  });

  xit('should suggest a new password', () => {
    component.suggestPassword();
    const password = component.userForm.get('password').value;
    expect(password).toBeDefined();
    expect(password.length).toEqual(10);
  });
});