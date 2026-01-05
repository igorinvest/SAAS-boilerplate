import { inject, Injectable, signal } from '@angular/core';
import { ProjectModel } from './project.model';
import { APIService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiService = inject(APIService)
  projectList = signal<ProjectModel[]>([])

  async createProject(project: ProjectModel) {
    const proj = await this.apiService.fetchByEndpoint('/createProject', project);
    if(proj) {
      this.projectList.update(list => {
        list.push(proj);
        return [...list]
      })
      return proj;
    } else {
      return false;
    }
  }

  async getProject(projectId: string){
    const proj = await this.apiService.fetchByEndpoint('/getProject', {projectId});
    return proj;
  }

  async getProjects() {
    const projects = await this.apiService.fetchByEndpoint('/getProjects');
    if(projects) {
      this.projectList.set(projects);
    }
    return projects;
  }

  async updateProject(unsavedProject: ProjectModel) {
    const projects = await this.apiService.fetchByEndpoint('/updateProject', unsavedProject);
    if(projects) {
      this.projectList.set(projects);
    }
    return projects;
  }

  async changeParent(projectId: string, parentId: string | null){
    const projects = await this.apiService.fetchByEndpoint('/changeParentProject', {projectId, parentId});
    if(projects) {
      this.projectList.set(projects);
    }
    return projects;
  }

  async deleteProject(projectId: string){
    const projects = await this.apiService.fetchByEndpoint('/deleteProject', {projectId});
    if(projects) {
      this.projectList.set(projects);
      return projects;
    } else {
      return false;
    }
  }

  clearList() {
    this.projectList.set([]);
  }

}
