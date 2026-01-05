import { Component } from '@angular/core';

@Component({
  selector: 'app-wrapper',
  imports: [],
  template: `
    <div class="py-4 px-6 gap-2"><ng-content/></div>
  `
})
export class Wrapper {

}
