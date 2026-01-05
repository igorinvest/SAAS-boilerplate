import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[makeButton]',
  standalone: true
})
export class MakeButtonDirective {

  constructor(
    private el: ElementRef,
    public renderer : Renderer2
  ) {
    this.renderer.setAttribute(this.el.nativeElement, "class", "w-full");
    this.renderer.setAttribute(this.el.nativeElement, "type", "button");
    this.renderer.setAttribute(this.el.nativeElement, "tabindex", "0");
  }

  @HostListener('keyup.enter') onKeyUp() {
    this.el.nativeElement.click()
  }

}
