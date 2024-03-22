import { Injectable } from '@angular/core';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  pressedKeys = new Map<string, boolean>();

  getPressed() {
    return new Map<string, boolean>([...this.pressedKeys].filter(([key, value]) => value));
  }

  constructor(private eventService: EventService) {
    addEventListener("keydown", (event) => {
      this.pressedKeys.set(event.key, true);
    });

    addEventListener("keyup", (event) => {
      this.pressedKeys.set(event.key, false);
    });
  }
}
