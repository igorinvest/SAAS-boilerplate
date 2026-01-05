import { Directive, HostListener, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appDebounceInput]',
})
export class DebounceInput implements OnDestroy {
  @Input() debounceTime = 1000;
  @Output() debouncedInput = new EventEmitter<Event>();

  private timer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.debouncedInput.emit(event);
      this.timer = null;
    }, this.debounceTime);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}