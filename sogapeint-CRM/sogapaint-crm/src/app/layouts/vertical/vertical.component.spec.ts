import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VerticalComponent } from './vertical.component';
// import { UserInfoBarComponent } from '../../user-info-bar/user-info-bar.component';
import { UserProfileService } from '../../core/services/user.service';

// Use xdescribe to skip the entire suite of tests
xdescribe('VerticalComponent', () => {
  let component: VerticalComponent;
  let fixture: ComponentFixture<VerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerticalComponent], // Declare used components
      providers: [UserProfileService], // Provide required services
      imports: [HttpClientTestingModule] // Import necessary modules
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Use xit to skip specific tests
  xit('should set document body attributes for vertical layout', () => {
    component.ngOnInit();
    expect(document.body.getAttribute('data-sidebar')).toEqual('dark');
    expect(document.body.hasAttribute('data-layout-size')).toBeFalse();
    expect(document.body.hasAttribute('data-layout')).toBeFalse();
    expect(document.body.hasAttribute('data-topbar')).toBeFalse();
    expect(document.body.classList.contains('auth-body-bg')).toBeFalse();
  });

  // Use xit to skip specific tests
  xit('should toggle sidebar-enable class on document body', () => {
    component.onToggleMobileMenu();
    expect(document.body.classList.contains('sidebar-enable')).toBeTruthy();
  });

  // Use xit to skip specific tests
  xit('should toggle right-bar-enabled class on document body', () => {
    component.onSettingsButtonClicked();
    expect(document.body.classList.contains('right-bar-enabled')).toBeTruthy();
  });

  // TODO: Add more tests as needed...
});
