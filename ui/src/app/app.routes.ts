import { Routes } from '@angular/router';

export const routes: Routes = [
  //{path: '', redirectTo: 'user', pathMatch: 'full'},
  {
    path: 'user',
    title: 'User settings',
    loadComponent: () => import('./product/other/manage-user/manage-user.component').then(m => m.ManageUserComponent)
  },
  {
    path: 'organisations',
    children: [
      {
        path: '',
        title: 'Organisations',
        loadComponent: () => import('./product/other/companies/companies').then(m => m.Companies)
      },
      {
        path: 'edit/:userCompanyId',
        title: 'Organisation settings',
        loadComponent: () => import('./product/other/company-settings/company-settings.component').then(m => m.CompanySettingsComponent)
      },
    ]
  },

  {
    path: 'new-project',
    title: 'New project',
    loadComponent: () => import('./product/company/project/project-create/project-create.component').then(m => m.ProjectCreateComponent)
  },
  {
    path: 'project/:projectId',
    loadChildren: () => import('./product/company/project/project.module').then(m => m.ProjectModule),
  },
];
