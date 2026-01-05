import { Component, inject } from '@angular/core';
import { ProjectListComponent } from "../project-list/project-list.component";
import { IconButtonComponent } from '../../../../common-components/buttons/icon-button/icon-button.component';
import { ExpandableHeaderComponent } from '../../../../common-components/expandable-header/expandable-header.component';
import { RouterLink } from '@angular/router';
import { Company } from '../../company';

@Component({
  selector: 'app-project-sidebar',
  imports: [ProjectListComponent, IconButtonComponent, ExpandableHeaderComponent, RouterLink],
  templateUrl: './project-sidebar.html',
  styleUrl: './project-sidebar.scss'
})
export class ProjectSidebar {
  companyService = inject(Company);
  company = this.companyService.activeCompany;
}
