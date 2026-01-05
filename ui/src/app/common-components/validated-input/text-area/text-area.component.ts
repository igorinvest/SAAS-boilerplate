import { Component, forwardRef, Input } from '@angular/core';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../control-value-accessor.directive';

@Component({
  selector: 'app-text-area',
  imports: [ValidationErrorsComponent, ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
})
export class TextAreaComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() rows = 8;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() customErrorMessages: Record<string, string> = {};
}
