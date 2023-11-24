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

// it('should only respond to matching event types', (done) => {
//     const eventType = 'test-event';
//     const otherEventType = 'other-event';
//     const testPayload = { data: 'test' };

//     // Subscribe to the event
//     const subscription = service.subscribe(eventType, payload => {
//         expect(payload).toEqual(testPayload);
//         subscription.unsubscribe();
//         done();
//     });

//     // Broadcast an event with a different type, which should not trigger the callback
//     service.broadcast(otherEventType, testPayload);

//     // Wait a brief period to ensure the callback is not called for the other event type
//     setTimeout(() => {
//         subscription.unsubscribe();
//         done();
//     }, 100);

//     // Broadcast the correct event
//     service.broadcast(eventType, testPayload);
// });
});
