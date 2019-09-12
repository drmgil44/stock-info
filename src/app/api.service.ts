// RESTful API service
// connecting MySQL

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt'; //JWT Helper
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { Policy } from './policy';
import { Login } from './api.userinfo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  PHP_API_SERVER = "http://127.0.0.1:80/angular-php-app/backend";

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private jwtHelperService:JwtHelperService
  ) { }

  readPolicies(): Observable<Policy[]>{ // test
      return this.httpClient.get<Policy[]>(`${this.PHP_API_SERVER}/api/read.php`);
  }

  createPolicy(policy: Policy): Observable<Policy>{ // test
      return this.httpClient.post<Policy>(`${this.PHP_API_SERVER}/api/create.php`, policy);
  }

  updatePolicy(policy: Policy){ // test
      return this.httpClient.put<Policy>(`${this.PHP_API_SERVER}/api/update.php`, policy);
  }

  deletePolicy(id: number){ // test
      return this.httpClient.delete<Policy>(`${this.PHP_API_SERVER}/api/delete.php/?id=${id}`);
  }

  matchLogin(login: Login): Observable<string>{ // Login -  check if the id and password is valid to login
      return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/login.php`, login).pipe(tap(res=> this.setToken(res['token'])))
  }

  createAccount(join: Join): Observable<string>{ // Sign up - create new account
      return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/join.php`, join);
  }

  setToken(token: string){  // set Jwt token
    this.jwtService.setToken(token);
  }
}
