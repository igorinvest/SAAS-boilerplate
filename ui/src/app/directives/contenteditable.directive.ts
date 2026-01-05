import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Observable,
  Subject,
  Subscriber,
  filter,
  fromEvent,
  map,
  take,
  takeUntil,
} from 'rxjs';

@Directive({
  selector: '[contentEditable]',
  standalone: true,
  host: {
    '[contentEditable]': 'contentEditable()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableDirective),
      multi: true,
    },
  ],
})
export class ContenteditableDirective
  implements ControlValueAccessor, OnInit, OnDestroy
{
  // IO
  ///////////////
  contentEditable = input.required<boolean | string>();

  // Private attrs
  protected disabled = false;
  protected onChangesFn: (value: string) => void = () => {};
  protected onTouchedFn: () => void = () => {};

  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private platformId = inject(PLATFORM_ID);
  private readonly onDestroy$ = new Subject<void>();

  constructor() {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observeTextData(this.el.nativeElement)
        .pipe(
          takeUntil(this.onDestroy$),
          filter(() => !this.disabled)
        )
        .subscribe((text) => {
          this.onChangesFn(text ?? '');
          this.onTouchedFn();
        });
    }
  }

  writeValue(text: any): void {
    this.el.nativeElement.innerText = text;
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChangesFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    fromEvent(this.el.nativeElement, 'focus')
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private observeTextData(el: HTMLElement) {
    return new Observable((observer: Subscriber<MutationRecord>) => {
      // Create an observer instance linked to the callback function
      const mutationObserver = new MutationObserver((mutationList, _obsever) =>
        mutationList.forEach((m) => observer.next(m))
      );

      // Start observing the target node for configured mutations
      mutationObserver.observe(this.el.nativeElement, {
        subtree: true,
        characterData: true,
      });
      return mutationObserver.disconnect.bind(mutationObserver);
    }).pipe(
      filter((m) => m.type === 'characterData'),
      map((m) => el.innerText)
    );
  }
}