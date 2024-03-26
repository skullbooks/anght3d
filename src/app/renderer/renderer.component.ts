import { Component, Input } from '@angular/core';
import { ScreenRenderData } from '../interface/engine.interface';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'ht3d-renderer',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.less'
})
export class RendererComponent {
  @Input() width?: number = 400;
  @Input() height?: number = 300;
  @Input() vlines?: ScreenRenderData = [];

  ceilingColorFar = 'rgba(0,212,255,1)';
  ceilingColorNear = 'rgba(9,9,121,1)';
  floorColorFar = 'rgba(8,66,7,1)';
  floorColorNear = 'rgba(73,121,9,1)';
}
