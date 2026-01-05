import { Directive, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  //selector: '[appShowInlineError]',
  selector: 'input[appShowInlineError], textarea[appShowInlineError], select[appShowInlineError]',
  standalone: true
})
export class ShowInlineErrorDirective {
  @Input() controlName?: string; 

  constructor(@Optional() @Self() public ngControl: NgControl) {}
}
