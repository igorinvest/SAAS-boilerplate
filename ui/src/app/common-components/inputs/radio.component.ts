import { Component, Input, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  ControlEvent,
  TouchedChangeEvent,
} from '@angular/forms';

@Component({
  selector: 'ui-radio',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RadioComponent,
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col min-h-16 gap-1" [class.error]="withErrors()">
      {{ label() }}
      @for (option of options(); track $index) {
        <div class="flex items-center ps-2 border border-zinc-300 dark:border-zinc-500">
            <input [id]="option" type="radio" [checked]="value() === option" [value]="option" name="bordered-radio" (blur)="onBlur()" (input)="onInput($event)"
              class="w-4 h-4 text-blue-600 border-zinc-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 dark:border-zinc-600">
            <label [for]="option" class="py-2 ms-2">{{option}}</label>
        </div>
      }
    </div>

    @if(withErrors()) {
      <div class="error-text mt-2 text-sm text-red-600 dark:text-red-500">
        @if(control?.errors?.['required']) {
          <span>This field is required</span>
        }
      </div>
    }
  `,
})
export class RadioComponent implements ControlValueAccessor, Validator {
  options = input<string[]>([]);
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly type = input<'radio'>('radio');

  public readonly value = signal('');
  public readonly disabled = signal(false);
  public readonly withErrors = signal(false);

  public control: AbstractControl | null = null;

  ngAfterViewInit() {
    this.control?.events.subscribe((event: ControlEvent) => {
        if (event instanceof TouchedChangeEvent){
            if (event.touched){
                this.validate(this.control!)
            }
        }
    });
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(input.value);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    queueMicrotask(() => {
      this.withErrors.set(control.invalid && (control.dirty || control.touched));
    });
    this.control = control;
    return null;
  }
}