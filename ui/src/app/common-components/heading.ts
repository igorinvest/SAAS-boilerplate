import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-heading',
  imports: [],
  template: `
    <div
    [class]="classes()"
    >
      <ng-content/>
</div>
  `
})
export class Heading {
  level = input(0);
  classes = computed(() => {
    if(this.level() == 1) {
      return 'text-2xl'
    }if(this.level() == 2) {
      return 'text-xl'
    }if(this.level() == 3) {
      return 'text-lg font-semibold'
    }if(this.level() == 4) {
      return 'text-lg'
    }if(this.level() == 5) {
      return 'text-lg'
    } else {
      return ''
    }
  })
}
