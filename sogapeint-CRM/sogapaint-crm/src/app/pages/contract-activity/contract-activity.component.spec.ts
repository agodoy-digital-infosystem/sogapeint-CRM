import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractActivityComponent } from './contract-activity.component';

describe('ContractActivityComponent', () => {
  let component: ContractActivityComponent;
  let fixture: ComponentFixture<ContractActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
