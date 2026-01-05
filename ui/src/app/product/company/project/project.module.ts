import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectViewComponent } from './project-view/project-view.component';

const routes: Routes = [
  { 
    path: '',
    title: "Projects",
    component: ProjectViewComponent,
    children: [
      {
        path: 'edit',
        title: 'Edit project settings',
        loadComponent: () => import('./project-update/project-update.component').then(m => m.ProjectUpdateComponent)
      },
    ]
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ProjectModule { }
