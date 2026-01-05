declare var google: any;
import { AfterViewInit, Component, DOCUMENT, ElementRef, inject, Inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ActionButtonComponent } from '../../../common-components/buttons/action-button/action-button.component';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../common-components/toast/toast.service';

@Component({
  selector: 'app-google',
  imports: [ActionButtonComponent],
  templateUrl: './google.component.html',
  styleUrl: './google.component.scss'
})
export class GoogleComponent implements AfterViewInit {
  toastService = inject(ToastService);
  @ViewChild('google') googleBtnContainer: ElementRef;
  router = inject(Router);
  userService = inject(UserService)
  scriptLoaded = signal(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: Document
  ){}
  
  ngAfterViewInit() {
    if(this.platformId == 'server') {
      return;
    }
    const element = document.createElement("script");
    element.src = "https://accounts.google.com/gsi/client";
    element.onload = () => {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (data: any) => {this.handleToken(data)},
        //native_callback: () => {console.log('yaaaay')},
        use_fedcm_for_prompt: true
      });
      google.accounts.id.prompt();
      google.accounts.id.renderButton(document.getElementById('googlebutton'), {
        theme: 'outline',
        //shape: 'pill',
        size: 'small',
        width: 150
      });
    }
    element.async = true;
    element.defer = true;

    document.head.appendChild(element);
  }

  async handleToken(data: any) {
    const user = await this.userService.googleAuth(data);
  }

  loginWithGoogle() {
    const button = document.getElementById('googlebutton')?.querySelector('div[role=button]') as HTMLElement;
    if(!button) {
      this.toastService.showError("Failed to load Google auth resource. Please check ad blockers.")
    }
    button?.click();
  }

}
