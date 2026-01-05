import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileModel {
  fileId: string;
  hash: string;
  fileName: string;
  size: number;
  fileType: string;
  companyId: string;

  constructor(@Inject(Object)model?: any) {
    this.fileId = model.fileId;
    this.hash = model.hash;
    this.fileName = model.fileName;
    this.size = model.size;
    this.fileType = model.fileType;
    this.companyId = model.companyId;
  }
}