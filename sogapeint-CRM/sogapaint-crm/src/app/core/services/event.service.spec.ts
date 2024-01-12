import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { take } from 'rxjs/operators';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow subscribing to and broadcasting events', (done) => {
    const eventType = 'test-event';
    const testPayload = { data: 'test' };

    // Subscribe to the event
    const subscription = service.subscribe(eventType, payload => {
        expect(payload).toEqual(testPayload);
        subscription.unsubscribe();
        done();
    });

    // Broadcast the event
    service.broadcast(eventType, testPayload);
});

it('should not fail when broadcasting without subscribers', () => {
    const eventType = 'test-event';
    const testPayload = { data: 'test' };

    // Broadcast the event
    service.broadcast(eventType, testPayload);
});

});
