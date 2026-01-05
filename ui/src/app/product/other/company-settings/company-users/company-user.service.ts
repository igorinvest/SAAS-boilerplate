import { inject, Injectable, signal } from '@angular/core';
import { UserModel } from '../../../../services/models/user.model';
import { APIService } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyUserService {
  companyUsers = signal<UserModel[]>([])
  apiService = inject(APIService);

  async loadUsers() {
    const users = await this.apiService.fetchByEndpoint('/getAllUsers');
    this.companyUsers.set(users);
  }
  
  async updateUser(user: UserModel) {
    const updated = await this.apiService.fetchByEndpoint('/updateUserCompany', user);
    return updated;
    //if (users) {
      //this.companyUsers.set(users)
    //}
  }

  async invite(email: string) {
    const users = await this.apiService.fetchByEndpoint('/inviteToCompany', { email });
    if(users) {
      this.companyUsers.set(users);
      return true;
    } else {
      return false;
    }
  }

}
