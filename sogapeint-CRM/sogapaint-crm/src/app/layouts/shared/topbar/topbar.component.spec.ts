import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar.component';

// Use xdescribe to skip the entire suite of tests
xdescribe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Use xit to skip specific tests
  xit('should create', () => {
    expect(true).toBeTruthy();
  });

  // TODO: Implement additional tests later...
});
