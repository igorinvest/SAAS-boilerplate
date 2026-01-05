import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss'
})
export class ActionButtonComponent {
  @Input() src: string | null = null;
  @Input() type: string | null = null;
  @Input() name: string | null = null;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() activated: boolean = false;
  @Input() fullWidth = false;
  @Input() iconName: string | null = null;

  constructor(
  ){}
}
