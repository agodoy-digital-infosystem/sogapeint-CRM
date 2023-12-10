import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VerticalComponent } from './vertical.component';
import { UserInfoBarComponent } from '../../user-info-bar/user-info-bar.component';
import { UserProfileService } from '../../core/services/user.service';

describe('VerticalComponent', () => {
  let component: VerticalComponent;
  let fixture: ComponentFixture<VerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerticalComponent, UserInfoBarComponent], // Déclarer les composants utilisés
      providers: [UserProfileService], // Fournir les services utilisés
      imports: [HttpClientTestingModule] // Importer les modules nécessaires
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

  describe('ngOnInit', () => {
    it('should set document body attributes for vertical layout', () => {
      component.ngOnInit();
      expect(document.body.getAttribute('data-sidebar')).toEqual('dark');
      expect(document.body.hasAttribute('data-layout-size')).toBeFalse();
      expect(document.body.hasAttribute('data-layout')).toBeFalse();
      expect(document.body.hasAttribute('data-topbar')).toBeFalse();
      expect(document.body.classList.contains('auth-body-bg')).toBeFalse();
    });
  });

  describe('onToggleMobileMenu', () => {
    it('should toggle sidebar-enable class on document body', () => {
      component.onToggleMobileMenu();
      expect(document.body.classList.contains('sidebar-enable')).toBeTruthy();
    });
  });

  describe('onSettingsButtonClicked', () => {
    it('should toggle right-bar-enabled class on document body', () => {
      component.onSettingsButtonClicked();
      expect(document.body.classList.contains('right-bar-enabled')).toBeTruthy();
    });
  });

  // Ajoutez ici d'autres tests selon vos besoins
});
