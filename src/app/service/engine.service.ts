import { Injectable } from '@angular/core';
import { Color, Intersection, Line, Point, ScreenRenderData, Vector } from '../interface/engine.interface';
import { calculateIntersectionAndDistance, clamp, rgbToHex } from './engine.utils';
import { EventService } from './event.service';
import { KeyboardService } from './keyboard.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  protected map: Line[] = [
    [{ x: 0, y: 0 }, { x: 10, y: 0 }, { r: 150, g: 150, b: 150 }],
    [{ x: 10, y: 0 }, { x: 10, y: 10 }, { r: 160, g: 160, b: 160 }],
    [{ x: 10, y: 10 }, { x: 0, y: 10 }, { r: 150, g: 150, b: 150 }],
    [{ x: 0, y: 10 }, { x: 0, y: 0 }, { r: 160, g: 160, b: 160 }],
    [{ x: 2, y: 1 }, { x: 4, y: 1 }, { r: 200, g: 0, b: 0 }],
    [{ x: 4, y: 1 }, { x: 4, y: 3 }, { r: 190, g: 0, b: 0 }],
    [{ x: 4, y: 3 }, { x: 2, y: 3 }, { r: 200, g: 0, b: 0 }],
    [{ x: 2, y: 3 }, { x: 2, y: 1 }, { r: 190, g: 0, b: 0 }],
  ];

  protected viewPoint: Point = { x: 5, y: 5 };
  protected viewDirection = -90;

  protected viewAngle = 70;

  protected widthScreen = 400;
  protected widthResolution = 200;
  protected lastRenderData: ScreenRenderData = [];

  protected intervalSubscription;


  protected calculateAngle(vector: Vector): number {
    // Verwende arctan2, um den Winkel zu berechnen (ergebnis in Bogenmaß)
    const angleRad = Math.atan2(vector.y, vector.x);

    // Konvertiere den Winkel von Bogenmaß in Grad und stelle sicher, dass er im Bereich von 0 bis 360 liegt
    let angleDeg = angleRad * (180 / Math.PI);
    angleDeg = (angleDeg < 0) ? angleDeg + 360 : angleDeg;

    return angleDeg;
  }

  protected calculateNewPoint(point: Point, step: number, angleInDegrees: number): Point {
    // Winkel von Grad in Bogenmaß umwandeln
    const radians = angleInDegrees * (Math.PI / 180);

    // Neue Koordinaten berechnen
    const newX = point.x + step * Math.cos(radians);
    const newY = point.y + step * Math.sin(radians);

    return { x: newX, y: newY };
  }

  protected calculateYCoordinate(width: number, angle: number): number {
    const b = width / 2;
    const beta = clamp(Math.abs(180 - angle), 1, 179) / 2;
    const betaRad = (Math.PI / 180) * beta;
    const a = b * Math.tan(betaRad);
    return Math.abs(a);
  }

  protected calculateRenderData(point: Point, direction: number): ScreenRenderData {
    const data = [];
    const y = this.calculateYCoordinate(this.widthResolution, this.viewAngle);
    for (let i = 0; i < this.widthResolution; i++) {
      const angle = ((direction - 90 + this.calculateAngle({ x: ((this.widthResolution / 2) - i), y: (y) })));

      const intersectionAndDistance = calculateIntersectionAndDistance(point, angle, this.map);

      const height = (115 - (intersectionAndDistance[0].distance * 10)); // @TODO: improve here

      data.push((intersectionAndDistance.length > 0)
        ? { id: i, height: (height > 0) ? height : 0, color: rgbToHex(intersectionAndDistance[0].color, intersectionAndDistance[0].distance * 10), width: (this.widthScreen / this.widthResolution), distance: intersectionAndDistance[0].distance ?? 100 }
        : { id: i, height: 0, color: '#000000', distance: 100 });
    }

    // console.log("DEBUG DATA", data);
    return data;
  }



  getRenderData(): ScreenRenderData {
    this.lastRenderData = this.calculateRenderData(this.viewPoint, this.viewDirection);
    return this.lastRenderData;
  }

  changeView(angle: number | null, step: number | null) {
    if (angle) this.viewDirection += angle;
    if (step) {
      const distanceForward = calculateIntersectionAndDistance(this.viewPoint, this.viewDirection, this.map)[0].distance ?? 100;;
      const distanceBackwards = calculateIntersectionAndDistance(this.viewPoint, this.viewDirection - 180, this.map)[0].distance ?? 100;
      if (!((step > 0 && step + 0.3 > distanceForward) || (step < 0 && Math.abs(step) + 0.3 > distanceBackwards))) this.viewPoint = this.calculateNewPoint(this.viewPoint, step, this.viewDirection);
    }
  }

  init(widthScreen: number = 400, widthResolution: number = 200) {
    this.widthScreen = widthScreen;
    this.widthResolution = widthResolution;
  }

  constructor(private eventService: EventService, private keyboardService: KeyboardService) {

    this.intervalSubscription = this.eventService.subscribe("interval", () => {
      const pressedKeys = this.keyboardService.getPressed();
      const oldViewPoint = { ...this.viewPoint };
      const oldViewDirection = this.viewDirection;

      if (pressedKeys.has('w')) this.changeView(null, .2);
      if (pressedKeys.has('s')) this.changeView(null, -.2);
      if (pressedKeys.has('a')) this.changeView(-5, null);
      if (pressedKeys.has('d')) this.changeView(5, null);

      if (oldViewPoint.x !== this.viewPoint.x || oldViewPoint.y !== this.viewPoint.y || oldViewDirection !== this.viewDirection) this.eventService.fireEvent({ event: 'viewChange', payload: { viewPoint: this.viewPoint, viewDirection: this.viewDirection } });
    });

  }
}
