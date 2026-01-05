import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserCompanyModel {
  companyName: string;
  companyId: string;
  userCompanyId: string;
  userId: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isAccepted: boolean;
  isDefault: boolean;

  constructor(@Inject(Object)model?: any) {
    this.companyName = model.companyName || '';
    this.companyId = model.companyId;
    this.userCompanyId = model.userCompanyId;
    this.userId = model.userId;
    this.isAdmin = model.isAdmin;
    this.isBlocked = model.isBlocked;
    this.isAccepted = model.isAccepted;
    this.isDefault = model.isDefault;
  }
}