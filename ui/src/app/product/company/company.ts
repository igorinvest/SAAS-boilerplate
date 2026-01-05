import { computed, effect, inject, Injectable } from '@angular/core';
import { UserCompany } from '../../services/user-company';
import { UserService } from '../../services/user.service';
import { ProjectService } from './project/project.service';
import { CompanyUserService } from '../other/company-settings/company-users/company-user.service';

@Injectable({
  providedIn: 'root'
})
export class Company {
  userCompanyService = inject(UserCompany);
  userService = inject(UserService);
  projectService = inject(ProjectService);
  companyUserService = inject(CompanyUserService)

  activeCompany = computed(() => {
    const ac = this.userCompanyService.myCompanies().find(uc => uc.companyId === this.userService.user()?.companyId);
    return ac;
  })

  constructor(){
    effect(async () => {
      if(this.userService.user()?.companyId) {
        await this.projectService.getProjects();
        await this.companyUserService.loadUsers();
      }
    })
    effect(async () => {
      if(this.userService.user()) {
        await this.userCompanyService.getUserCompanies();
      }
    })
    effect(() => {
      if(!this.userService.user()) {
        this.projectService.clearList();
      }
    })
  }
}
