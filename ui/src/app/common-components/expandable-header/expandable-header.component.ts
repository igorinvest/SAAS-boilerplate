import { NgTemplateOutlet } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-expandable-header',
  imports: [NgTemplateOutlet],
  templateUrl: './expandable-header.component.html',
  styleUrl: './expandable-header.component.scss'
})
export class ExpandableHeaderComponent {
  @Input() iconName: string;
  isLink = input(false);
  @Input() hasMargin = true;
  level = input(1)
}
