import { Injectable } from '@angular/core';
import { ToastService } from '../common-components/toast/toast.service';
import { environment } from '../../environments/environment';
import { ApiRoutes } from './api-routes.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  endpoint: string = environment.apiUrl;
  accessToken: string | null = null;

  constructor(
    private toastService: ToastService,
  ) {
  }

  checkLocalStorage() {
    let lsAccess = localStorage.getItem('accessToken');
    if( !lsAccess || lsAccess === 'undefined' || lsAccess === 'null' ) {
      lsAccess = null;
    }
    this.accessToken = lsAccess;
  }

  updateAccess(accessToken: string | null) {
    this.accessToken = accessToken;
    //localStorage.setItem('accessToken', JSON.stringify(accessToken));
    //console.log(accessToken, 'local', localStorage.getItem('accessToken'))
  }

  async getRequest(api: string, route: any, body?: any) {
    //Apppend headers
    const headers = new Headers;
    if(route['contentType'] === 'multipart/form-data') {
      //headers.append('Content-Type', 'multipart/form-data');//don't set it - works only without
    } else {
      headers.append('Content-Type', 'application/json');
    }
    if(route['auth'] !== false) {
      headers.append('Authorization', 'Bearer ' + this.accessToken);
    }

    const req = new Request(api, {
      method: route['method'],
      headers: headers,
      credentials: 'include',
      body: body
    });
    return req;
  }

  async fetchByEndpoint(routeName: string, data?: any) {
    //Because server receives some requests twice
    // if(this.platformId == 'server') {
    //   return
    // }
    let api;
    //console.log(routeName)
    const route = ApiRoutes[routeName as keyof {}];
    //console.log(route, data);
    if(!route) {console.log('Incorrect route', routeName)}

    let query: string = '';
    let bodyFields: any = {};
    const formData = new FormData;
    //console.log(routeName, data)

    //Add route parameters to the request
    for(const p of (route['params'] as any[])) {
      if(!data) {
        continue;
      }
      const value = data[p.name];
      if(p['source'] === 'query') {
        const and = (query === '') ? '' : '&';
        query = query.concat(`${and}${p.name}=${value}`);
        //console.log(query, p, value);
      } else if(p['source'] === 'body') {
        bodyFields = data;
      } else if(p['source'] === 'bodyField') {
        //console.log(p, value)
        bodyFields[p['name']] = value;
      } else if(p['source'] === 'formData') {
        formData.append(p['name'], value);
        //body = data[p['name']];
      }
    }

    let body;
    if(route['method'] === 'POST') {
      if(formData && route['contentType'] === 'multipart/form-data') {
        body = formData;
      } else if(bodyFields) {
        body = JSON.stringify(bodyFields);
      }
    }

    //Create api endpopint from query
    if(query !== ''){
      query = `?${query}`
    };
    api = `${this.endpoint}${routeName}${query}`;

    if(!api) {return}

    //console.log(api, body, route['method'])
    const req = await this.getRequest(api, route, body);
    if(!req) {
      console.log('User is logged out')
      return
    }
    let response;
    try {
      response = await fetch(req);
    } catch (err: any) {
      this.toastService.showError(`Server is not available. Your changes might not be saved.`);
      return;
    }

    if (response?.ok === false && response.status === 401) {
      const refreshed = await this.refresh();
      if(refreshed?.accessToken) {
        const newReq = await this.getRequest(api, route, body);
        response = await fetch(newReq);
      }
    }

    if (response?.ok === false) {
      const {message, errors} = await response.json();
      this.toastService.showError(
        `${message}. ${errors}`,
        `${response.status} ${response.statusText}`
      );
      return
    } else {//response?.ok
      let result = await response.json();
      const objectClass: any = route['model'];
      if(objectClass && route['isArray']) {
        for (let i = 0; i < result.length; i++) {
          result[i] = new objectClass(result[i]);
        }
      } else if(objectClass) {
        result = new objectClass(result);
      }
      //console.log(result)
      return result;
    }
    //console.log(await response.json());
  }

    //Refresh token
    async refresh() {
      //let response = await this.fetchByEndpoint('/refresh');
      const headers = new Headers;
      headers.append('Content-Type', 'application/json');
      const resp = await fetch(this.endpoint + '/refresh', {
        method: "GET",
        //headers: headers
        credentials: "include"
      });
      if(!resp.ok) {
        this.updateAccess(null);
        return false;
      }
      const response = await resp.json();
      if(response?.accessToken) {
        this.updateAccess(response.accessToken);
        return response;
      } else {
        this.updateAccess(null);
        return false;
      }
    }
  
}