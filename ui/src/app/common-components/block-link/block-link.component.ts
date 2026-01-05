import { NgTemplateOutlet } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-block-link',
  standalone: true,
  imports: [
    RouterLink,
    NgTemplateOutlet,
    RouterLinkActive
  ],
  templateUrl: './block-link.component.html',
})
export class BlockLinkComponent {
  link = input<string[]>([]);
  exactRoute = input<boolean>(false);
  @Input() iconName: string;
  @Input() level = 1;
  @Input() cursorPointer = false;
}