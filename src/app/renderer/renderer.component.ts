import { Component, Input } from '@angular/core';
import { ScreenRenderData } from './interfaces';

@Component({
  selector: 'ht3d-renderer',
  standalone: true,
  imports: [],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.less'
})
export class RendererComponent {
  @Input() width?: number = 400;
  @Input() height?: number = 300;
  @Input() vlines?: ScreenRenderData = [];


}
