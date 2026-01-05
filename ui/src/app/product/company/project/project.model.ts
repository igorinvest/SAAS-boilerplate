import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectModel {
  projectId: string;
  parentId: string | null;
  projectName: string;
  isPublic: boolean;
  lastEdited: Date;
  isArchived: boolean;
  draggedOn = 0;
  draggable = false;

  constructor(@Inject(Object)model?: any) {
    this.projectId = model.projectId;
    this.parentId = model.parentId;
    this.projectName = model.projectName || '';
    this.isPublic = model.isPublic || false;
    this.lastEdited = model.lastEdited;
    this.isArchived = model.isArchived;
  }

}