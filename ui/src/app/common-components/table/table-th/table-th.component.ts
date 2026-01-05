import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-th',
  imports: [],
  templateUrl: './table-th.component.html',
  styleUrl: './table-th.component.scss'
})
export class TableThComponent {
  @Input() classes = '';
}
