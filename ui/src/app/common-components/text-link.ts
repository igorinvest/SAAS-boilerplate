import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-text-link',
  imports: [RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <a
    class=" hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600 hover:cursor-pointer dark:text-blue-400 hover:dark:text-blue-200 visited:dark:text-purple-400"
    [routerLink]="link()"
    routerLinkActive="routerLinkActive"
    #rla1="routerLinkActive"
    [class.underline]="rla1.isActive"
    [class.dark:text-blue-500]="rla1.isActive">
      <ng-content/>
    </a>
  `,
})
export class TextLink {
  link = input<any[]>();
}
