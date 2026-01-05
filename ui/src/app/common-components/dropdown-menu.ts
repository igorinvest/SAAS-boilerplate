import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  imports: [],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <div class="flex flex-col shadow-lg m-2 p-2 w-fit bg-white dark:bg-zinc-900 dark:text-zinc-200 text-sm">
      <ng-content/>
    </div>
  `
})
export class DropdownMenu {

}
