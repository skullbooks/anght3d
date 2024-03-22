import { Injectable, EventEmitter } from '@angular/core';
import { Event } from '../interface/system.interface';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  eventEmitter = new EventEmitter<Event<any>>();

  fireEvent(eventData: Event<any>) {
    this.eventEmitter.emit(eventData);
  }

  subscribe(event: string, handler: (payload: any) => void): Subscription {
    return this.eventEmitter.subscribe((eventData: Event<any>) => {
      if (eventData.event === event) {
        handler(eventData.payload);
      }
    });
  }

  unsubscribe(subscription: Subscription) {
    subscription.unsubscribe();
  }

  constructor() {
    let interval = 0;
    setInterval(() => {
      this.fireEvent({ event: 'interval', payload: interval++ });
    }, 40);
  }
}
