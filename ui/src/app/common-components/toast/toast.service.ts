import { Injectable, signal } from '@angular/core';

export const toastState = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500'
};

type ToastType = {
  message: string,
  type: 'success' | 'warning' | 'danger',
  header?: string
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastType[]>([]);
  
  constructor(
  ) {}

  async showSuccess(message: string, header?: string) {
    this.add(message, 'success')
  }

  async showError(message: string, header?: string) {
    this.add(message, 'danger')
  }

  async showWarning(message: string, header?: string) {
    this.add(message, 'warning')
  }

  private add(message: string, type: 'success' | 'warning' | 'danger' = 'success') {
    this.toasts.update(list => {
      list.unshift({
        message: message,
        type: type
      })
      return [...list];
    })
    setTimeout(() => this.remove(), 3000);
  }

  private remove() {
    this.toasts.update(list => {
      list.pop();
      return [...list];
    })
  }

  removeByIndex(index: number) {
    this.toasts.update(list => {
      list.splice(index, 1);
      return [...list];
    })
  }

}
