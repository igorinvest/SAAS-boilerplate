import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../services/user.service';
import { ActionButtonComponent } from '../../../../../common-components/buttons/action-button/action-button.component';
import { ModalComponent } from '../../../../../common-components/modal/modal.component';
import { InputComponent } from '../../../../../common-components/inputs/input.component';
import { ToastService } from '../../../../../common-components/toast/toast.service';
import { CompanyUserService } from '../company-user.service';

@Component({
  selector: 'app-company-users-invite',
  imports: [
    ReactiveFormsModule,
    ActionButtonComponent,
    ModalComponent,
    InputComponent
  ],
  templateUrl: './company-users-invite.component.html',
  styleUrl: './company-users-invite.component.scss'
})
export class CompanyUsersInviteComponent {
  toastService = inject(ToastService);
  companyUserService = inject(CompanyUserService);
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  @ViewChild('modal') modal: ModalComponent;
  isSubmitted = signal(false);
  invitationForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async invite() {
    if(!this.invitationForm.valid) {
      this.invitationForm.markAllAsTouched();
      return;
    }
    this.isSubmitted.set(true);
    const user = await this.companyUserService.invite(this.invitationForm.value['email']!);
    if(user) {
      this.toastService.showSuccess(`Invitation created successfully!`);
      this.modal.close();
    }
    this.isSubmitted.set(false);
  }
}
