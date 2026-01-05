import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    CommonModule
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  iconName = input('');
  name = input('');
  size = input<number>(6);
  isDisabled = input(false);
  activated = input(false);
  rotate = input('');

  classes = computed(() => {
    const size = `w-` + this.size() + ` h-` + this.size();
    const disabled = this.isDisabled() ? 'cursor-not-allowed opacity-50' : '';
    const activated = this.activated() ? 'border border-box border-zinc-300 dark:border-zinc-500' : '';
    return `${size} ${disabled} ${activated} ${this.rotate()}`;
  });

}
