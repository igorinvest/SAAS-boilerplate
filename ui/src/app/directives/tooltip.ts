import {
  Directive,
  HostListener,
  ComponentRef,
  input,
  Input,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from '../common-components/tooltip';

@Directive({
  selector: '[appTooltip]'
})
export class Tooltip {
  private overlayRef: OverlayRef;
  @Input('appTooltip') test: string
  text = input<string>('');

  constructor(private overlay: Overlay) { }

  ngOnInit(): void {
    this.overlayRef = this.overlay.create({});
  }

  @HostListener('mouseenter')
  show() {
    console.log(this.text())
    // Create tooltip portal
    const tooltipPortal = new ComponentPortal(TooltipComponent);

    // Attach tooltip portal to overlay
    const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(tooltipPortal);

    // Pass content to tooltip component instance
    tooltipRef.instance.text = this.text;
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }
}
