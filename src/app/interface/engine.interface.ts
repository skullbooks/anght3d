interface LineData {
  id: number;
  height: number;
  width?: number;
  color: string;
  distance: number;
}

export type ScreenRenderData = LineData[];

export type wallData = LineData[];

// Schnittpunkt-Interface
export interface Intersection {
  point: { x: number, y: number };
  color: Color;
  distance: number;
}

// Gerade-Definition (Linie)
export type Line = [Point, Point, Color];

export interface Color {
  r: number;
  g: number;
  b: number;
}

// Punkt-Interface
export interface Point {
  x: number;
  y: number;
}

// Vektor-Interface
export interface Vector {
  x: number;
  y: number;
}
