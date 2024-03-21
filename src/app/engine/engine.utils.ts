import { Color, Intersection, Line, Point, Vector } from "../renderer/interfaces";

export function rgbToHex(color: Color, distance: number): string {
  // RGB-Werte sicherstellen, dass sie im gültigen Bereich liegen (0-255)
  let r = clamp(color.r, 0, 255);
  let g = clamp(color.g, 0, 255);
  let b = clamp(color.b, 0, 255);

  // Entfernung sicherstellen, dass sie im Bereich von 0 bis 100 liegt
  const clampedDistance = clamp(distance, 0, 100);

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
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}


// Funktion zur Berechnung des Schnittpunkts zwischen einer Geraden und einer Linie
function calculateLineIntersection(point: Point, vector: Vector, line: Line): Point | null {
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
function calculateDistance(point1: Point, point2: Point): number {
  let dx = point2.x - point1.x;
  let dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Funktion zur Berechnung des Schnittpunkts und der Entfernung
export function calculateIntersectionAndDistance(point: Point, angle: number, lines: Line[]): Intersection[] {
  const vector = vectorFromAngle(angle);
  let intersections: Intersection[] = [];
  lines.forEach(line => {
    // Berechne den Schnittpunkt
    let intersection = calculateLineIntersection(point, vector, line);
    if (intersection) {
      // Berechne die Entfernung zwischen dem Schnittpunkt und dem Punkt
      let distance = calculateDistance(point, intersection);
      intersections.push({ point: intersection, distance: distance, color: line[2] });
    }
  });
  return intersections.sort((a, b) => a.distance - b.distance);
}

function vectorFromAngle(degrees: number): Vector {
  // Winkel von Grad in Bogenmaß umwandeln (da Math.sin und Math.cos Bogenmaß verwenden)
  let radians = degrees * (Math.PI / 180);

  // Die Komponenten des Vektors berechnen
  let x = Math.cos(radians) * 100;
  let y = Math.sin(radians) * 100;

  return { x, y };
}
