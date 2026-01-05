import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../project.service';
import { ExpandableItemComponent } from '../../../../common-components/expandable-item/expandable-item.component';
import { Company } from '../../company';
import { Plug } from "../../../../common-components/plug";
import { ExpandableHeaderComponent } from "../../../../common-components/expandable-header/expandable-header.component";
import { BlockLinkComponent } from "../../../../common-components/block-link/block-link.component";

@Component({
  selector: 'app-project-list',
  imports: [
    Plug,
    ExpandableHeaderComponent,
    BlockLinkComponent
],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  companyService = inject(Company);
  projectService = inject(ProjectService)
  projectList = this.projectService.projectList;

}
