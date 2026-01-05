import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { UserModel } from './models/user.model';
import { APIService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  router = inject(Router);
  apiService = inject(APIService);
  user = signal<UserModel | null>(null);
  isLoaded = signal(false);

  async setupUser() {
    const result = await this.apiService.refresh()
    let user = null;
    if(result) {
      user = this.updateAccessAndUser(new UserModel(result.user), result.accessToken)
    }
    this.isLoaded.set(true);
    return user;
  }

  async logout() {
    const response = await this.apiService.fetchByEndpoint('/logout');
    if(response) {
      this.user.set(null);
      this.apiService.updateAccess(null);
      this.router.navigate(['/'])
      return true;
    }
    return response;
  }

  private updateAccessAndUser(user: UserModel | null, accessToken: string | null) {
    this.apiService.updateAccess(accessToken);
    this.user.set(user);
    return user;
  }

  async googleAuth(googleData: {}) {
    const data = await this.apiService.fetchByEndpoint('/googleAuth', googleData);
    const user = new UserModel(data.user);
    if (data){
      const userModel = this.updateAccessAndUser(user, data.accessToken)
      return userModel;
    } else {
      return false;
    }
  }

  async loginWithEmail(token: string, pin: string) {
    const data = await this.apiService.fetchByEndpoint("/loginWithLink", {loginLinkRef: token, pinCode: pin});
    if (data){
      const user = new UserModel(data.user);
      const userModel = this.updateAccessAndUser(user, data.accessToken)
      return userModel;
    } else {
      return false;
    }
  }

  async getUser() {
    const user = await this.apiService.fetchByEndpoint('/getUser');
    return user;
  }

  async renameUser(userName: string) {
    const updated = await this.apiService.fetchByEndpoint('/renameUser', { userName });
    if (updated) {
      this.user.update(currentUser => ({
        ...currentUser!,
        userName: updated.userName,
      }));
      return updated;
    } else {
      return false;
    }
  }

  getUserId() {
    return this.user()?.userId;
  }

}