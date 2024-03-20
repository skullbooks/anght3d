import { Injectable } from '@angular/core';
import { Color, Intersection, Line, Point, ScreenRenderData, Vector } from './renderer/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  protected map: Line[] = [
    [{ x: 0, y: 0 }, { x: 5, y: 0 }, { r: 150, g: 150, b: 150 }],
    [{ x: 0, y: 0 }, { x: 0, y: 5 }, { r: 150, g: 150, b: 150 }],
    [{ x: 5, y: 0 }, { x: 5, y: 5 }, { r: 150, g: 150, b: 150 }],
    [{ x: 0, y: 5 }, { x: 5, y: 5 }, { r: 150, g: 150, b: 150 }],
    [{ x: 2, y: 2 }, { x: 3, y: 2 }, { r: 255, g: 255, b: 0 }],
    [{ x: 2, y: 2 }, { x: 2, y: 1 }, { r: 255, g: 0, b: 255 }],
  ];

  protected viewPoint: Point = { x: 1, y: 2.5 };
  protected viewAngle = 70;
  protected viewDirection = -90;

  protected lastRenderData: ScreenRenderData = [];


  protected rgbToHexOld(color: Color, distance: number): string {
    // Farbwerte sicherstellen, dass sie im gültigen Bereich liegen (0-255)
    let r = this.clamp(color.r, 0, 255);
    let g = this.clamp(color.g, 0, 255);
    let b = this.clamp(color.b, 0, 255);

    // RGB-Farbwerte in Hexadezimalformat umwandeln und zusammensetzen
    let hexR = r.toString(16).padStart(2, '0');
    let hexG = g.toString(16).padStart(2, '0');
    let hexB = b.toString(16).padStart(2, '0');

    return `#${hexR}${hexG}${hexB}`;
  }

  protected rgbToHex(color: Color, distance: number): string {
    // RGB-Werte sicherstellen, dass sie im gültigen Bereich liegen (0-255)
    let r = this.clamp(color.r, 0, 255);
    let g = this.clamp(color.g, 0, 255);
    let b = this.clamp(color.b, 0, 255);

    // Entfernung sicherstellen, dass sie im Bereich von 0 bis 100 liegt
    const clampedDistance = this.clamp(distance, 0, 100);

    // Farbton entsprechend der Entfernung abdunkeln
    const darkenedR = Math.round(r * (100 - clampedDistance) / 100);
    const darkenedG = Math.round(g * (100 - clampedDistance) / 100);
    const darkenedB = Math.round(b * (100 - clampedDistance) / 100);

    // Dunklere RGB-Komponenten in Hexadezimalformat umwandeln und zusammensetzen
    const darkenedHexR = darkenedR.toString(16).padStart(2, '0');
    const darkenedHexG = darkenedG.toString(16).padStart(2, '0');
    const darkenedHexB = darkenedB.toString(16).padStart(2, '0');

    return `#${darkenedHexR}${darkenedHexG}${darkenedHexB}`;
  }

  // Hilfsfunktion zur Begrenzung eines Werts innerhalb eines bestimmten Bereichs
  protected clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  // Funktion zur Berechnung des Schnittpunkts und der Entfernung
  protected calculateIntersectionAndDistance(point: Point, vector: Vector, lines: Line[]): Intersection[] {
    let intersections: Intersection[] = [];
    lines.forEach(line => {
      // Berechne den Schnittpunkt
      let intersection = this.calculateLineIntersection(point, vector, line);
      if (intersection) {
        // Berechne die Entfernung zwischen dem Schnittpunkt und dem Punkt
        let distance = this.calculateDistance(point, intersection);
        intersections.push({ point: intersection, distance: distance, color: line[2] });
      }
    });
    return intersections.sort((a, b) => a.distance - b.distance);
  }

  // Funktion zur Berechnung des Schnittpunkts zwischen einer Geraden und einer Linie
  protected calculateLineIntersection(point: Point, vector: Vector, line: Line): Point | null {
    let [p1, p2] = line;
    let x1 = p1.x;
    let y1 = p1.y;
    let x2 = p2.x;
    let y2 = p2.y;

    let x3 = point.x;
    let y3 = point.y;
    let x4 = point.x + vector.x;
    let y4 = point.y + vector.y;

    let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denominator == 0) {
      // Die Linien sind parallel oder identisch
      return null;
    }

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Der Schnittpunkt liegt auf beiden Linien
      let intersectionX = x1 + t * (x2 - x1);
      let intersectionY = y1 + t * (y2 - y1);
      return { x: intersectionX, y: intersectionY };
    } else {
      // Die Linien schneiden sich nicht
      return null;
    }
  }

  // Funktion zur Berechnung der Entfernung zwischen zwei Punkten
  protected calculateDistance(point1: Point, point2: Point): number {
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  protected vectorFromAngle(degrees: number): Vector {
    // Winkel von Grad in Bogenmaß umwandeln (da Math.sin und Math.cos Bogenmaß verwenden)
    let radians = degrees * (Math.PI / 180);

    // Die Komponenten des Vektors berechnen
    let x = Math.cos(radians) * 100;
    let y = Math.sin(radians) * 100;

    return { x, y };
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
    const halfWidth = width / 2; // Halbe Breite
    const halfAngle = angle / 2; // Halber Winkel

    const yCoordinate = halfWidth * Math.sin((Math.PI / 180) * halfAngle);
    return yCoordinate;
  }

  protected calculateWidthAlongAB(width: number, steps: number, angle: number): number[] {
    const segmentAngle = angle / steps; // Berechne den Winkel für jedes Segment
    const halfWidth = width / 2; // Halbe Breite
    const yCoordinate = halfWidth * Math.sin((Math.PI / 180) * angle / 2);

    const widths: number[] = [];

    // Berechne die Breite für jedes Segment
    for (let i = 0; i < steps; i++) {
      // Berechne den aktuellen Winkel
      const currentAngle = 90 + (-1 * angle / 2) + (segmentAngle * (i + 0.5)); // Verschiebung um den halben Winkel

      // console.log("D", currentAngle);

      // Berechne die Breite entlang der Geraden AB mithilfe des Tangens des Winkels
      const widthAlongAB = Math.abs((yCoordinate / Math.tan(((Math.PI / 180) * currentAngle))));

      // Füge die Breite zum Array hinzu
      widths.push(widthAlongAB);
    }

    return widths;
  }


  protected calculateRenderData(point: Point, direction: number, lines: number = 200, width: number = 400): ScreenRenderData {
    const data = [];
    const angleStep = this.viewAngle / lines;
    const startAngle = direction - (this.viewAngle / 2);

    const widths = this.calculateWidthAlongAB(width, lines, this.viewAngle);


    for (let i = 0; i < lines; i++) {
      const vector = this.vectorFromAngle(startAngle + (i * angleStep));
      const intersectionAndDistance = this.calculateIntersectionAndDistance(point, vector, this.map);

      data.push((intersectionAndDistance.length > 0)
        ? { id: i, height: (100 - (intersectionAndDistance[0].distance * 10)), color: this.rgbToHex(intersectionAndDistance[0].color, intersectionAndDistance[0].distance * 10), width: 2 /*widths[i]*/, distance: intersectionAndDistance[0].distance }
        : { id: i, height: 0, color: '#000000', distance: 100 });
    }

    console.log("DEBUG DATA", data, widths);
    return data;
  }



  getRenderData(): ScreenRenderData {
    this.lastRenderData = this.calculateRenderData(this.viewPoint, this.viewDirection);
    return this.lastRenderData;
  }

  turn(angle: number) {
    this.viewDirection = this.viewDirection + angle;
    console.log("SERVICE TURN", this.viewDirection);
  }

  move(step: number) {
    console.log("SERVICE MOVE", step, this.lastRenderData[Math.floor(this.lastRenderData.length / 2)]);
    const distanceForward = this.lastRenderData[Math.floor(this.lastRenderData.length / 2)].distance;

    if (step + 0.3 > distanceForward) return;
    this.viewPoint = this.calculateNewPoint(this.viewPoint, step, this.viewDirection);
  }

  constructor() { }
}
