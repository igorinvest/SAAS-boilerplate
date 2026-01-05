import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProjectService } from '../project.service';
import { ExpandableHeaderComponent } from '../../../../common-components/expandable-header/expandable-header.component';
import { IconButtonComponent } from "../../../../common-components/buttons/icon-button/icon-button.component";

@Component({
  selector: 'app-project-topbar',
  imports: [
    ExpandableHeaderComponent,
    IconButtonComponent,
    RouterLink,
    RouterLinkActive,
],
  templateUrl: './project-topbar.html',
  styleUrl: './project-topbar.scss'
})
export class ProjectTopbar {
  projectService = inject(ProjectService);
  projectId = signal('');
  route = inject(ActivatedRoute);
  project = computed(() => {
    return this.projectService.projectList().find(p => p.projectId === this.projectId())
  })

  ngOnInit() {
    this.route.params.subscribe((params) => { 
      //console.log(params['projectId'])
      this.projectId.set(params['projectId']);
    });
  }
}
