import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUsersComponent } from './manage-users.component';
import { UserProfileService } from '../../core/services/user.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Utilise xdescribe pour exclure tout le groupe de tests
xdescribe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let userProfileService: UserProfileService;

  // Mock data
  const usersMock = [
    { firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'admin' },
    { firstname: 'Jane', lastname: 'Doe', email: 'jane@example.com', role: 'user' }
  ];

  beforeEach(async () => {
    // Mock UserProfileService
    const userProfileServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(usersMock))
    };

    await TestBed.configureTestingModule({
      declarations: [ ManageUsersComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: UserProfileService, useValue: userProfileServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    userProfileService = TestBed.inject(UserProfileService);
    fixture.detectChanges();
  });

  // Utilisez xit pour exclure des tests spécifiques
  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should load users on init', () => {
    expect(userProfileService.getAll).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.filteredUsers.length).toBe(2);
  });

  xit('should sort users', () => {
    component.onSort('firstname');
    expect(component.sortColumn).toBe('firstname');
    expect(component.sortDirection).toBe('asc');
    expect(component.filteredUsers[0].firstname).toBe('Jane'); // Assuming ascending order

    component.onSort('firstname');
    expect(component.sortDirection).toBe('desc');
    expect(component.filteredUsers[0].firstname).toBe('John'); // Assuming descending order
  });

  xit('should filter users', () => {
    component.filter = 'jane';
    component.onSearch();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].firstname).toBe('Jane');
  });

  // TODO: Implement additional tests later...
});
