import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-item-single',
  imports: [RouterModule, CommonModule],
  templateUrl: './item-single.component.html',
  styleUrl: './item-single.component.scss'
})
export class ItemSingleComponent {
  @Input() name: string;
  @Input() link: (string | undefined)[];
}
