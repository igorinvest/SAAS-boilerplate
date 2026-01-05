import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GoogleComponent } from './google/google.component';
import { UserService } from '../../services/user.service';
import {
  CdkMenu,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { ExpandableItemComponent } from '../../common-components/expandable-item/expandable-item.component';
import { ProjectSidebar } from '../company/project/project-sidebar/project-sidebar';
import { DropdownMenu } from "../../common-components/dropdown-menu";
import { IconButtonComponent } from "../../common-components/buttons/icon-button/icon-button.component";
import { ExpandableHeaderComponent } from '../../common-components/expandable-header/expandable-header.component';
import { BlockLinkComponent } from "../../common-components/block-link/block-link.component";
import { EmailAuth } from "./email-auth/email-auth";

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    GoogleComponent,
    CdkMenu,
    CdkMenuTrigger,
    ExpandableItemComponent,
    ExpandableHeaderComponent,
    ProjectSidebar,
    DropdownMenu,
    IconButtonComponent,
    BlockLinkComponent,
    EmailAuth,
],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  router = inject(Router);
  isNavigating = signal(false);
  userService = inject(UserService);
  user = this.userService.user;
  userLoaded = this.userService.isLoaded;
  showSidebar = false;

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isNavigating.set(true);
      } else if (event instanceof NavigationEnd) {
        this.isNavigating.set(false);
      }
    });
  }

}
