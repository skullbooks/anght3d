import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RendererComponent } from './renderer/renderer.component';
import { EngineService } from './service/engine.service';
import { ScreenRenderData } from './interface/engine.interface';
import { KeyboardService } from './service/keyboard.service';
import { EventService } from './service/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RendererComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'anght3d';
  screenRenderData: ScreenRenderData;
  displayWidth: number = 600;
  displayHeight: number = 300;

  engine: EngineService = inject(EngineService);
  keyboard: KeyboardService = inject(KeyboardService);
  eventService: EventService = inject(EventService);

  turnLeft() {
    this.engine.changeView(-10, null);
    this.screenRenderData = this.engine.getRenderData();
  }

  turnRight() {
    this.engine.changeView(10, null);
    this.screenRenderData = this.engine.getRenderData();
  }

  moveForward() {
    this.engine.changeView(null, .5);
    this.screenRenderData = this.engine.getRenderData();
  }

  moveBackwards() {
    this.engine.changeView(null, -.5);
    this.screenRenderData = this.engine.getRenderData();
  }

  constructor() {
    this.engine.init(this.displayWidth, this.displayWidth / 2);
    this.screenRenderData = this.engine.getRenderData(); // Initial Render
    this.eventService.subscribe('viewChange', () => { this.screenRenderData = this.engine.getRenderData(); });
  }
}
