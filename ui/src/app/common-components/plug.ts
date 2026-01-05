import { Component, input } from '@angular/core';

@Component({
  selector: 'app-plug',
  imports: [],
  template: `
    <p class="text-zinc-400 dark:text-zinc-400 select-none">
      <ng-content/>
    </p>
  `
})
export class Plug {
}
