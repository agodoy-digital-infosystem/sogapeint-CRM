import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalnavbarComponent } from './horizontal-navbar.component';

// Use xdescribe to skip the entire suite of tests
xdescribe('HorizontalnavbarComponent', () => {
  let component: HorizontalnavbarComponent;
  let fixture: ComponentFixture<HorizontalnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Use xit to skip specific tests
  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Implement additional tests later...
});
