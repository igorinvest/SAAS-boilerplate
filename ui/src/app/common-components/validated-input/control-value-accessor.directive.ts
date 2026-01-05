import { Directive, ElementRef, HostListener, Inject, Injector, OnInit, Renderer2 } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  Validators,
  NgControl,
  FormControlName,
  FormGroupDirective,
  FormControlDirective,
} from '@angular/forms';
import { Subject, takeUntil, startWith, distinctUntilChanged, tap, skip, debounceTime } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit {
  control: FormControl | undefined;
  isRequired = false;
  debounceTime: number = 0;

  private _isDisabled = false;
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  constructor(
    @Inject(Injector) private injector: Injector, 
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setFormControl();
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
    this.debounceTime = Number(this.elRef.nativeElement.getAttribute('debounceTime')) ?? 0;
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);
      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
          break;
        
      }
    } catch (err) {
      
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    this.control
      ? this.control.setValue(value, {emitEvent: false})
      : (this.control = new FormControl(value));
  }

  registerOnChange(fn: (val: T | null) => T): void {
    this.control?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this._destroy$),
        //skip(1),
        debounceTime(this.debounceTime),
        tap((val) => fn(val))
      )
      .subscribe(() => {
        this.control?.markAsUntouched()
      });
  }

  @HostListener('change', ['$event']) public onChange(event: any): void {
    //console.log(event.target);
  }

  registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }
}
