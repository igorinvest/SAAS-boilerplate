import { Component, inject, signal } from '@angular/core';
import { ToastComponent } from "./common-components/toast/toast.component";
import { Layout } from "./product/layout/layout";
import { CenterLoaderComponent } from "./common-components/loaders/center-loader/center-loader.component";
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [ToastComponent, Layout, CenterLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  userService = inject(UserService);
  protected readonly title = signal('Docion');

  ngOnInit() {
    this.userService.setupUser();
  }
}
