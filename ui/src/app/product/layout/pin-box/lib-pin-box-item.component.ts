import {
  ACCEPTABLE_KEY,
  ARROW_LEFT,
  ARROW_RIGHT,
  BACK_SPACE,
  FOCUS_NEXT_KEY,
  FOCUS_PREVIOUS_KEY,
  DELETE,
  TAB,
  V_KEY
  } from './lib-pin-box.model';
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Inject
  } from '@angular/core';
import { LibPinBoxComponent } from './lib-pin-box.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[lib-pin-box-input]',
  host: {
    class: 'lib-pib-box__input',
    '(input)': '_onInput($event)',
    '(keydown)': '_onKeydown($event)',
    '(paste)': '_onPaste($event)',
    '(focus)': '_onFocus($event)',
  }
})
export class LibPinBoxItemDirective implements OnInit {


  set value(value: string) {
    // In Android:
    // If user try to change value at last box, then browser set no new value into input field
    // and oldValue and newValue in input are always same.
    // But if we don't set same value into inputFiled there in no problem any more.
    if (value === this.value) {
      return;
    }

    this.elemRef.nativeElement.value = value ? value.trim() : '';
  }
  get value() {
    return this.elemRef.nativeElement.value;
  }

  @Input() index: number;

  @Output() pasteValue = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<{value: string, index: number}>();
  @Output() focusNext = new EventEmitter<number>();
  @Output() focusPrev = new EventEmitter<number>();

  private valueOnKeydown: any;

  constructor(
    private elemRef: ElementRef<HTMLInputElement>,
  ) { }


  ngOnInit() {
  }

  public _onFocus(e: FocusEvent) {
  }

  public _onPaste(e: ClipboardEvent) {

    e.preventDefault();

    const pastedValue = e.clipboardData?.getData('text').trim();
    const isPastedValueValid = this.isPastedValueValid(pastedValue || '');

    if (isPastedValueValid) {
      this.pasteValue.emit(pastedValue);
    }
  }


  // Just for Pc and Ios. In android event value is a deferent.
  // (e.key, e.keyCode for sring is allways 229)
  // On keydown: save current value of input field.
  // On input: update value of input field if new value is valid, otherwise set empty string
  public _onKeydown(e: KeyboardEvent) {

    this.valueOnKeydown = this.value;


    // Focus next element
    if (
      e.key === ARROW_RIGHT
      // (!e.shiftKey && e.key === TAB)
    ) {
      e.preventDefault();
      this._focusNext();
      return;
    }

    // Focus prev element
    if (
      (e.key === BACK_SPACE && !this.hasValue) ||
      e.key === ARROW_LEFT
      // (e.shiftKey && e.key === TAB)
    ) {
      e.preventDefault();
      this._focusPrev();
      return;
    }

    // Remove value
    if (
      e.key === BACK_SPACE ||
      e.key === DELETE
    ) {

      e.preventDefault();
      this.setValueAndEmit(null);
      return;
    }

  }

  public _onInput(e: Event) {

    // Android: some time if user type s same char as input field,
    // then value of input field is just one char, but it should be 2 char.
    // To fix it: we remove valueOnKeydown from current value of input field,
    // then if there is no value, then set oldValur to newValue
    let newChar = this.value.replace(this.valueOnKeydown, '');
    newChar = newChar ? newChar : this.valueOnKeydown;

    // Set value
    if ( isValidKey(newChar) ) {
      this.setValueAndEmit(newChar);
      this._focusNext();

    } else {
      this.setValueAndEmit(null);
    }

  }

  private setValueAndEmit(value: any) {

    this.value = value;
    this.valueChange.emit({value, index: this.index});
  }

  private isPastedValueValid(value: string) {

    if (typeof value !== 'string') {
      return false;
    }

    return Array.from(value).every(key => isValidKey(key));
  }


  private _focusNext() {

    this.focusNext.emit(this.index);
  }

  private _focusPrev() {

    this.focusPrev.emit(this.index);
  }

  private get hasValue() {
    return this.value.length === 1;
  }

}


function isValidKey(key: string) {
  return (ACCEPTABLE_KEY as any).includes(key);
}
