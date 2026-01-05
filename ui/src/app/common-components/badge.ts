import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  template: `
    <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">
        <ng-content/>
    </span>  
  `
})
export class Badge {
  color = input('green');
}
