import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RendererComponent } from './renderer/renderer.component';
import { EngineService } from './engine.service';
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

  engine: EngineService = inject(EngineService);

  turnLeft() {
    this.engine.turn(-10);
    this.screenRenderData = this.engine.getRenderData();
  }

  turnRight() {
    this.engine.turn(10);
    this.screenRenderData = this.engine.getRenderData();
  }

  moveForward() {
    this.engine.move(.5);
    this.screenRenderData = this.engine.getRenderData();
  }

  moveBackwards() {
    this.engine.move(-.5);
    this.screenRenderData = this.engine.getRenderData();
  }

  constructor() {
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
