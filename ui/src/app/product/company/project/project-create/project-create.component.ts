import { Component, inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectModel } from '../project.model';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { ActionButtonComponent } from '../../../../common-components/buttons/action-button/action-button.component';
import { ExpandableHeaderComponent } from "../../../../common-components/expandable-header/expandable-header.component";
import { InputComponent } from '../../../../common-components/inputs/input.component';

@Component({
  selector: 'app-project-create',
  imports: [
    ReactiveFormsModule,
    ActionButtonComponent,
    InputComponent,
    ExpandableHeaderComponent
],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss',
  providers: []
})
export class ProjectCreateComponent {
  projectService = inject(ProjectService);
  router = inject(Router)
  project: ProjectModel = new ProjectModel({});
  formBuilder = inject(FormBuilder);
  createProjectForm: FormGroup = this.formBuilder.group({
    projectName: [null, [Validators.required]],
  });

  ngOnInit() {}

  async onSubmit() {
    this.createProjectForm.markAllAsTouched();
    if (this.createProjectForm.invalid) {
      return;
    }
    this.project.projectName = this.createProjectForm.get('projectName')?.value;
    const created = await this.projectService.createProject(this.project);
    if(created) {
      this.router.navigate(['project', created.projectId]);
    }
  }
}
