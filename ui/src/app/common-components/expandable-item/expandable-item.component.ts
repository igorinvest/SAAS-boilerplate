import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expandable-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expandable-item.component.html',
  styleUrl: './expandable-item.component.scss',
})
export class ExpandableItemComponent {
  @Input() name: string | null = '';
  @Input() iconName: string;
  @Input() isExpanded = false;
  @Input() hasChildren = false;
  @Input() isSelected = false;
  @Input() level = 1;
  @Input() cursorPointer = false;
}