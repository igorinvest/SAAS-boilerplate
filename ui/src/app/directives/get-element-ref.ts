import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGetElementRef]',
  exportAs: 'ElementRefDirective'
})
export class GetElementRef {

  constructor(public elementRef: ElementRef){}

}
