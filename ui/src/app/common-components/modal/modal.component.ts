import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  dialog = inject(Dialog);
  @Input() mainFragment: TemplateRef<any>;
  @ViewChild('modal') modal: TemplateRef<any>;
  @Input() title: string;

  openDialog() {
    this.dialog.open(this.modal, {
      minWidth: '300px',
      data: {
      },
    })
  }

  close() {
    this.dialog.closeAll()
  }
}
