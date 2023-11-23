// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LayoutComponent } from './layout.component';

// describe('LayoutComponent', () => {
//   let component: LayoutComponent;
//   let fixture: ComponentFixture<LayoutComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [LayoutComponent]
//     })
//     .compileComponents();
    
//     fixture = TestBed.createComponent(LayoutComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
// Importez d'autres modules nécessaires ici

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      // Ajoutez d'autres modules nécessaires ici
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
