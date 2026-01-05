import { Component, inject, ViewChild } from '@angular/core';
import { ToastService } from '../../../common-components/toast/toast.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../common-components/modal/modal.component';
import { UserCompany } from '../../../services/user-company';
import { ActionButtonComponent } from '../../../common-components/buttons/action-button/action-button.component';
import { UserCompanyModel } from '../../../services/models/user-company.model';
import { Badge } from '../../../common-components/badge';
import { InputComponent } from "../../../common-components/inputs/input.component";
import { ExpandableHeaderComponent } from '../../../common-components/expandable-header/expandable-header.component';
import { TextLink } from '../../../common-components/text-link';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-companies',
  imports: [
    ModalComponent,
    ActionButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    Badge,
    ExpandableHeaderComponent,
    TextLink,
    RouterLink
],
  templateUrl: './companies.html',
  styleUrl: './companies.scss'
})
//User can be part of multiple companies at the same time. However, only one can active at the same time. This class helps you switch between active ones.
export class Companies {
  toastService = inject(ToastService);
  router = inject(Router);
  userService = inject(UserService)
  userCompanyService = inject(UserCompany);
  userCompanies = this.userCompanyService.myCompanies;
  formBuilder = inject(FormBuilder);
  @ViewChild('newcompany') createNewModal: ModalComponent;
  selected: string;
  newCompanyForm = this.formBuilder.group({
    name: ['', [Validators.required]],
  });

  ngOnInit() {
    //this.userCompanyService.getUserCompanies()
  }

  async createCompany() {
    this.newCompanyForm.markAllAsTouched()
    if(this.newCompanyForm.invalid) {
      return;
    }
    const companyName = this.newCompanyForm.value['name']!;
    const userCompany = await this.userCompanyService.createCompany(companyName);
    if(userCompany) {
      this.createNewModal.close();
      this.toastService.showSuccess("You successfully created a organisation!");
      this.userService.setupUser();
    }
  }

  async acceptInvitation(userCompany: UserCompanyModel) {
    const result = await this.userCompanyService.acceptInvitation(userCompany.userCompanyId);
    if(result) {
      this.toastService.showSuccess("You successfully joined the organisation!");
    }
  }

  async activateCompany(userCompany: UserCompanyModel) {
    const result = await this.userCompanyService.activateCompany(userCompany.userCompanyId);
    if(result) {
      this.toastService.showSuccess("Default organisation changed!");
    }
  }

}
