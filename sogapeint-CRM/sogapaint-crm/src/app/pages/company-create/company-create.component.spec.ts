import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCreateComponent } from './company-create.component';

describe('CompanyCreateComponent', () => {
  let component: CompanyCreateComponent;
  let fixture: ComponentFixture<CompanyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
