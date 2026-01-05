import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserModel {
  email: string;
  userName: string;
  userId: string;
  password?: string | null;
  isActivated: boolean;
  companyId?: string;
  isAdmin: boolean;
  isBlocked: boolean;
  userCompanyId: boolean;
  state: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(@Inject(Object)model?: any) {
    this.email = model.email;
    this.userName = (model.userName) ? model.userName : model.email;
    this.userId = model.userId;
    this.password = model.password;
    this.isActivated = model.isActivated;
    this.companyId = model.companyId;
    this.isAdmin = model.isAdmin;
    this.isBlocked = model.isBlocked;
    this.userCompanyId = model.userCompanyId;
    this.state = model.state;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}