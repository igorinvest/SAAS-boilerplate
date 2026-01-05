import { Component, inject, Injectable, signal, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectModel } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../common-components/toast/toast.service';
import { ProjectService } from '../project.service';
import { ActionButtonComponent } from '../../../../common-components/buttons/action-button/action-button.component';
import { CenterLoaderComponent } from '../../../../common-components/loaders/center-loader/center-loader.component';
import { InputComponent } from '../../../../common-components/inputs/input.component';
import { ModalComponent } from '../../../../common-components/modal/modal.component';
import { CheckboxComponent } from '../../../../common-components/inputs/checkbox.component';

@Component({
  selector: 'app-project-update',
  imports: [
    ReactiveFormsModule,
    ActionButtonComponent,
    CenterLoaderComponent,
    InputComponent,
    CheckboxComponent,
    ModalComponent,
],
  templateUrl: './project-update.component.html',
  styleUrl: './project-update.component.scss',
  providers: []
})
export class ProjectUpdateComponent {
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  projectService = inject(ProjectService);
  router = inject(Router)
  project = signal<ProjectModel | null>(null);
  formBuilder = inject(FormBuilder);
  editProjectForm: FormGroup = this.formBuilder.group({
    projectName: ['', [Validators.required]],
    isPublic: [false],
  });
  @ViewChild('confirm') confirmModal: ModalComponent;
  saving = signal(false);

  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
        this.setEditForm(params['projectId']);
    });
  }

  async setEditForm(projectId: string) {
    const project = await this.projectService.getProject(projectId);
    if(project) {
      this.project.set(project);
      this.editProjectForm.setValue({
        projectName: project.projectName,
        isPublic: project.isPublic
      })
    }
  }

  async onSubmit() {
    this.editProjectForm.markAllAsTouched();
    if (this.editProjectForm.invalid) {
      return;
    }
    this.saving.set(true);
    const pr = this.project();
    if(pr) {
      pr.projectName = this.editProjectForm.value['projectName'];
      pr.isPublic = this.editProjectForm.value['isPublic'];
      const updated = await this.projectService.updateProject(pr);
      if(updated) {
        this.toastService.showSuccess('Project updated!')
      }
    }
    this.saving.set(false);
  }

  async deleteProject() {
    const deleted = await this.projectService.deleteProject(this.project()!.projectId);
    if(deleted) {
      this.toastService.showSuccess('Project deleted!')
      this.router.navigate(['/']);
    }
  }

}
