import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // import FormsModule
import { RightsidebarComponent } from './rightsidebar.component';

describe('RightsidebarComponent', () => {
  let component: RightsidebarComponent;
  let fixture: ComponentFixture<RightsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightsidebarComponent ],
      imports: [ FormsModule ] // add FormsModule to the imports array
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with light mode on', () => {
    expect(component.isLightModeOn).toBeTrue();
  });

  it('should start with dark mode off', () => {
    expect(component.isDarkModeOn).toBeFalse();
  });

  // Add more tests as needed
});