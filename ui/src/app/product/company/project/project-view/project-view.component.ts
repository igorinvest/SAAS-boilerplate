import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectTopbar } from "../project-topbar/project-topbar";

@Component({
  selector: 'app-project-view',
  imports: [RouterOutlet, ProjectTopbar],
  template: `
    <app-project-topbar/>
    <router-outlet />
    <div> <!-- class="w-fit" -->
      
    </div>
  `,
  providers: []
})
export class ProjectViewComponent {

}
