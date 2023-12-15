import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RightsidebarComponent } from './rightsidebar.component';

// Use xdescribe to skip the entire suite of tests
xdescribe('RightsidebarComponent', () => {
  let component: RightsidebarComponent;
  let fixture: ComponentFixture<RightsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Use xit to skip specific tests
  xit('should create', () => {
    expect(true).toBeTruthy();
  });

  // TODO: Implement additional tests later...
});
