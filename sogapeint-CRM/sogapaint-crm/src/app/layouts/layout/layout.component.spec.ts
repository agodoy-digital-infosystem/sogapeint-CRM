import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './layouts.model';
import { EventService } from '../../core/services/event.service';
import { Component } from '@angular/core';

// Mocks pour les composants enfants
@Component({ selector: 'app-vertical', template: '' })
class MockVerticalComponent {}

@Component({ selector: 'app-horizontal', template: '' })
class MockHorizontalComponent {}

describe('LayoutComponent', () => {
    let component: LayoutComponent;
    let fixture: ComponentFixture<LayoutComponent>;
    let eventService: EventService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LayoutComponent, MockVerticalComponent, MockHorizontalComponent],
            providers: [
                {
                    provide: EventService,
                    useValue: {
                        subscribe: jasmine.createSpy().and.callFake((eventType, callback) => {
                            if (eventType === 'changeLayout') {
                                callback(LAYOUT_HORIZONTAL);
                            }
                        })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LayoutComponent);
        component = fixture.componentInstance;
        eventService = TestBed.inject(EventService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with horizontal layout', () => {
        expect(component.layoutType).toBe(LAYOUT_HORIZONTAL);
    });

    it('should change layout type when event is received', () => {
        expect(component.layoutType).toBe(LAYOUT_HORIZONTAL);
    });

    it('should correctly determine if vertical layout is requested', () => {
        component.layoutType = LAYOUT_VERTICAL;
        expect(component.isVerticalLayoutRequested()).toBeTrue();
    });

    it('should correctly determine if horizontal layout is requested', () => {
        component.layoutType = LAYOUT_HORIZONTAL;
        expect(component.isHorizontalLayoutRequested()).toBeTrue();
    });
});
