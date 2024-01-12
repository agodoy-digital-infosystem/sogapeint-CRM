import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translate: TranslateService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: jasmine.createSpyObj('TranslateService', ['addLangs', 'getBrowserLang', 'use']) },
        { provide: CookieService, useValue: jasmine.createSpyObj('CookieService', ['check', 'get', 'set']) }
      ]
    });

    service = TestBed.inject(LanguageService);
    translate = TestBed.inject(TranslateService);
    cookieService = TestBed.inject(CookieService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should initialize with the browser language if no language cookie is set', () => {
  //   spyOn(cookieService, 'check').and.returnValue(false);
  //   spyOn(translate, 'getBrowserLang').and.returnValue('en');
  //   service = new LanguageService(translate, cookieService);
  //   expect(translate.use).toHaveBeenCalledWith('en');
  // });
    
  // it('should initialize with the language from the cookie if it is set', () => {
  //   spyOn(cookieService, 'check').and.returnValue(true);
  //   spyOn(cookieService, 'get').and.returnValue('es');
  //   service = new LanguageService(translate, cookieService);
  //   expect(translate.use).toHaveBeenCalledWith('es');
  // });
});