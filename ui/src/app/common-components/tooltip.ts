import { ChangeDetectionStrategy, Component, Inject, InjectionToken, input, TemplateRef } from '@angular/core';

export type TooltipData = string | TemplateRef<void>;
export const TOOLTIP_DATA = new InjectionToken<TooltipData>('Data to display in tooltip');

@Component({
  selector: 'app-tooltip',
  imports: [],
  template: `
  {{ text() }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  text = input<string>('');
}
