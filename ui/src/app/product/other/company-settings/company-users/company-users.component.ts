import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CenterLoaderComponent } from '../../../../common-components/loaders/center-loader/center-loader.component';
import { ToastService } from '../../../../common-components/toast/toast.service';
import { UserModel } from '../../../../services/models/user.model';
import { CheckboxComponent } from '../../../../common-components/inputs/checkbox.component';
import { CompanyUserService } from './company-user.service';

@Component({
  selector: 'app-company-users',
  imports: [
    CenterLoaderComponent,
    FormsModule,
    DatePipe,
    CheckboxComponent
  ],
  templateUrl: './company-users.component.html',
  styleUrl: './company-users.component.scss',
})
export class CompanyUsersComponent {
  toastService = inject(ToastService);
  companyUserService = inject(CompanyUserService);
  companyUsers = this.companyUserService.companyUsers;
  displayedColumns: string[] = ['Name', 'Email', 'isAdmin', 'isBlocked', 'Joined', 'Updated'];

  ngOnInit() {
    this.companyUserService.loadUsers()
  }

  async updateIsBlocked(user: UserModel, isBlocked: boolean) {
    user.isBlocked = isBlocked;//event.target.checked;
    const updated = await this.companyUserService.updateUser(user);
    if(updated) {
      this.toastService.showSuccess('Changes saved');
    }
  }

  async updateIsAdmin(user: UserModel, isAdmin: boolean) {
    user.isAdmin = isAdmin;
    const updated = await this.companyUserService.updateUser(user);
    if(updated) {
      this.toastService.showSuccess('Changes saved');
    }
  }

}
