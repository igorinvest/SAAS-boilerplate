import { inject, Injectable, signal } from '@angular/core';
import { APIService } from './api.service';
import { UserCompanyModel } from './models/user-company.model';
import { UserService } from './user.service';
import { CompanyModel } from './models/company.model';

@Injectable({
  providedIn: 'root'
})
export class UserCompany {
  apiService = inject(APIService);
  userService = inject(UserService);
  myCompanies = signal<UserCompanyModel[]>([]);

  async createCompany(companyName: string) {
    const companies = await this.apiService.fetchByEndpoint('/createCompany', {companyName});
    if(companies) {
      this.myCompanies.set(companies);
    }
    return companies;
  }

  async getUserCompanies() {
    const myCompanies = await this.apiService.fetchByEndpoint('/getUserCompanies') || [];
    if(myCompanies) {
      this.myCompanies.set(myCompanies);
    }
  }

  async acceptInvitation(userCompanyId: string) {
    const companies = await this.apiService.fetchByEndpoint('/acceptCompanyInvitation', {userCompanyId});
    if(companies) {
      this.myCompanies.set(companies);
      this.userService.setupUser();
    }
    return companies;
  }

  async activateCompany(userCompanyId: string) {
    const companies = await this.apiService.fetchByEndpoint('/activateCompany', {userCompanyId});
    if(companies) {
      this.myCompanies.set(companies);
      await this.userService.setupUser();
    }
    return companies;
  }

  async updateCompany(company: CompanyModel) {
    const updated = await this.apiService.fetchByEndpoint('/updateCompany', company);
    if (updated) {
      this.myCompanies.set(updated);
    }
  }
}
