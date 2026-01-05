import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyUsersComponent } from './company-users/company-users.component';
import { CompanyUsersInviteComponent } from "./company-users/company-users-invite/company-users-invite.component";
import { ToastService } from '../../../common-components/toast/toast.service';
import { InputComponent } from '../../../common-components/inputs/input.component';
import { APIService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ActionButtonComponent } from "../../../common-components/buttons/action-button/action-button.component";
import { CompanyModel } from '../../../services/models/company.model';
import { UserCompany } from '../../../services/user-company';
import { ExpandableHeaderComponent } from "../../../common-components/expandable-header/expandable-header.component";

@Component({
  selector: 'app-company-settings',
  imports: [
    ReactiveFormsModule,
    CompanyUsersComponent,
    CompanyUsersInviteComponent,
    InputComponent,
    ActionButtonComponent,
    ExpandableHeaderComponent
],
  templateUrl: './company-settings.component.html',
  styleUrl: './company-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySettingsComponent {
  apiService = inject(APIService);
  route = inject(ActivatedRoute);
  toastService = inject(ToastService);
  formBuilder = inject(FormBuilder);
  userCompanyService = inject(UserCompany);
  companyForm: FormGroup = this.formBuilder.group({
    companyName: ['', [Validators.required]],
  });
  company: CompanyModel;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userCompanyId = params['userCompanyId'];
      if (userCompanyId) {
        this.setForm(userCompanyId);
      }
    });
  }

  async setForm(userCompanyId: string) {
    const company = await this.apiService.fetchByEndpoint('/getCompany', { userCompanyId });
    if (company) {
      this.company = company;
      this.companyForm.setValue({
        companyName: company.companyName
      })
    }
  }

  updateName() {
    if(!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const name = this.companyForm.value['companyName'];
    this.company.companyName = name;
    this.userCompanyService.updateCompany(this.company);
  }
}
