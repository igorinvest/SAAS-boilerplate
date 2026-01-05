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
  selector: 'ui-input',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputComponent,
      multi: true,
    },
  ],
  template: `
    <label class="flex flex-col gap-1" [class.error]="withErrors()">
      @if (label()) {
        <span>{{ label() }}</span>
      }
      <input class="border border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:border-gray-500 placeholder-gray-400 dark:placeholder-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
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
export class InputComponent implements ControlValueAccessor, Validator {
  iconName = input('');
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly type = input<'text' | 'email' | 'password'>('text');

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