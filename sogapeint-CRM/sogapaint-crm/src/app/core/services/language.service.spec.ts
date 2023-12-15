import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

// Use xdescribe to skip the entire suite of tests
xdescribe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  // Use xit to skip specific tests
  xit('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Implement additional tests later...
});
