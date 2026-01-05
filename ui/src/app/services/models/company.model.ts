import { Component, Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompanyModel {
  companyId: string;
  companyName: string;

  constructor(@Inject(Object)model?: any) {
    this.companyId = model.companyId;
    this.companyName = model.companyName || '';
  }
}