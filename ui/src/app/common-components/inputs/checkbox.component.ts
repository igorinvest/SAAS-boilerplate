import { Component, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  ControlEvent,
  TouchedChangeEvent
} from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
  template: `
    <label class="flex gap-1 items-centeer content-center" [class.error]="withErrors()">
      <input class="w-4.5 h-4.5 border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block p-1.5 dark:border-gray-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="checkbox"
        [placeholder]="placeholder()"
        [checked]="checked()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </label>

    @if(withErrors()) {
      <div class="error-text text-sm text-red-600 dark:text-red-500">
        @if(control?.errors?.['required']) {
          <span>This field is required</span>
        }
        @if(control?.errors?.['email']) {
          <span>Invalid email format</span>
        }
      </div>
    }
  `,
})
export class CheckboxComponent implements ControlValueAccessor, Validator {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');

  public readonly checked = signal(false);
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

  private onChange: (checked: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(checked: boolean): void {
    this.checked.set(checked ?? false);
  }

  public registerOnChange(fn: (checked: boolean) => void): void {
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
    this.checked.set(input.checked);
    this.onChange(input.checked);
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