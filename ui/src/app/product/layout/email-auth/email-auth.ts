import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActionButtonComponent } from "../../../common-components/buttons/action-button/action-button.component";
import { ModalComponent } from "../../../common-components/modal/modal.component";
import { ToastService } from '../../../common-components/toast/toast.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { InputComponent } from "../../../common-components/inputs/input.component";
import { APIService } from '../../../services/api.service';
import { LibPinBoxComponent } from "../pin-box/lib-pin-box.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-auth',
  imports: [
    ReactiveFormsModule,
    ActionButtonComponent,
    ModalComponent,
    InputComponent,
    LibPinBoxComponent
],
  templateUrl: './email-auth.html',
  styleUrl: './email-auth.scss',
})
export class EmailAuth {
  router = inject(Router);
  apiService = inject(APIService);
  toastService = inject(ToastService);
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  @ViewChild('modal') modal: ModalComponent;
  isSubmitted = signal(false);
  isSuccessful = signal(true);
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  token = signal<string | null>(null);
  pinLength = 4;
  invitationCodeCtrl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.pinLength),
    //Validators.maxLength(4)
  ]);
  errors = {
    required: 'Enter Verification Code',
    minlength: 'Fill all fields'
  }

  async sendLoginLink() {
    if (this.loginForm.invalid) {
      this.toastService.showError('Please enter a valid email address.');
      return;
    }
    this.isSubmitted.set(true);
    const email = this.loginForm.get('email')?.value;
    const token = await this.apiService.fetchByEndpoint('/sendLoginLink', { email });
    if (token) {
      this.token.set(token);
      this.toastService.showSuccess('Login link sent! Please check your email.');
    } else {
      this.toastService.showError('Failed to send login link. Please try again later.');
    }
    this.isSubmitted.set(false);
  }

  onValueChanged(value: string[]) {
    const pin = value.join("");
    if(pin.length === this.pinLength) {
      this.invitationCodeCtrl.disable();
      this.validateCode(pin);
    }
  }

  async validateCode(pin: string) {
    const token = this.token();
    if(!token) {
      console.error('No token found for email authentication.');
      return
    }
    const validated = await this.userService.loginWithEmail(token, pin);
    if(validated) {
      this.isSuccessful.set(true);
      this.modal.close();
      this.toastService.showSuccess('Login successful!');
    } else {
      this.isSuccessful.set(false);
    }
  }
}
