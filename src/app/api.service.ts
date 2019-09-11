// RESTful API service
// connecting MySQL

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt'; //JWT Helper
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { Policy } from './policy';
import { Login } from './api.login';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  PHP_API_SERVER = "http://127.0.0.1:80/angular-php-app/backend";

  constructor(private httpClient: HttpClient, private jwtService: JwtService, private jwtHelperService:JwtHelperService) { }

  readPolicies(): Observable<Policy[]>{
      return this.httpClient.get<Policy[]>(`${this.PHP_API_SERVER}/api/read.php`);
  }

  createPolicy(policy: Policy): Observable<Policy>{
      return this.httpClient.post<Policy>(`${this.PHP_API_SERVER}/api/create.php`, policy);
  }

  updatePolicy(policy: Policy){
      return this.httpClient.put<Policy>(`${this.PHP_API_SERVER}/api/update.php`, policy);
  }

  deletePolicy(id: number){
      return this.httpClient.delete<Policy>(`${this.PHP_API_SERVER}/api/delete.php/?id=${id}`);
  }

  matchLogin(login: Login): Observable<string>{
      return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/login.php`, login).pipe(tap(res=> this.setToken(res['token'])))
  }

  setToken(token: string){
    this.jwtService.setToken(token);
  }
}
