import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedDocumentationComponent } from './protected-documentation.component';

describe('ProtectedDocumentationComponent', () => {
  let component: ProtectedDocumentationComponent;
  let fixture: ComponentFixture<ProtectedDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtectedDocumentationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProtectedDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
