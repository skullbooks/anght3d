import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RendererComponent } from './renderer/renderer.component';
import { EngineService } from './engine/engine.service';
import { ScreenRenderData } from './renderer/interfaces';

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

    this.screenRenderData = this.engine.getRenderData();
    console.log("APP DEBUG", this);

    addEventListener("keypress", (event) => {
      switch (event.key) {
        case 'w':  // go forward
          this.moveForward();
          break;
        case 's':  // go back?
          this.moveBackwards();
          break;
        case 'a':  // turn left
          this.turnLeft();
          break;
        case 'd': // turn right
          this.turnRight();
          break;
        default:
          break;
      }
    });
  }
}
