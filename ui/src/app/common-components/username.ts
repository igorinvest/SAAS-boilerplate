import { Component, computed, inject, input } from '@angular/core';
import { UserService } from '../services/user.service';
import { CompanyUserService } from '../product/other/company-settings/company-users/company-user.service';

@Component({
  selector: 'app-username',
  imports: [],
  template: `<span>{{username()}}</span>`
})
export class Username {
  userId = input('')
  companyUserService = inject(CompanyUserService);
  username = computed(() => {
    return this.companyUserService.companyUsers().find(u => u.userId === this.userId())?.userName;
  })
}
