import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../common-components/inputs/input.component';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ActionButtonComponent } from "../../../common-components/buttons/action-button/action-button.component";

@Component({
  selector: 'app-manage-user',
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ActionButtonComponent
],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent {
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  userForm: FormGroup = this.formBuilder.group({
    userName: ['', [Validators.required]],
  });

  ngOnInit() {
    this.setForm();
    // this.userForm.setValue({
    //   name: this.userService.user()?.userName,
    // })
  };

  async setForm() {
    const user = await this.userService.getUser();
    if (user) {
      this.userForm.setValue({
        userName: this.userService.user()?.userName,
      })
    }
  }

  updateName() {
    if(!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const userName = this.userForm.value['userName'];
    this.userService.renameUser(userName!);
  }
}
